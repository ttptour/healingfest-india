import asyncio
from contextlib import suppress
import ipaddress
import logging
import os
import re
import uuid
from datetime import datetime, timezone
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from typing import List, Optional
from urllib.parse import urlparse

import httpx
import jwt
from datetime import timedelta
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Query, Request, HTTPException, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING, IndexModel
from pydantic import BaseModel, Field, ConfigDict

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

INDEXES: dict[str, list[IndexModel]] = {
    "status_checks": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("timestamp", DESCENDING)], name="timestamp_desc"),
    ],
    "enquiries": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("created_at", DESCENDING)], name="created_at_desc"),
    ],
    "admin_login_attempts": [
        IndexModel([("identifier", ASCENDING)], name="identifier"),
    ],
}


async def ensure_indexes() -> None:
    for collection, models in INDEXES.items():
        for model in models:
            try:
                await db[collection].create_indexes([model])
            except Exception as exc:
                logging.getLogger(__name__).error("ensure_indexes(%s.%s): %s", collection, model.document["name"], exc)

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------------------------------------------------------------------------
# Emergent managed email (Resend proxy)
# ---------------------------------------------------------------------------
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL")
ENQUIRY_CC_EMAIL = os.environ.get("ENQUIRY_CC_EMAIL")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} ≠ real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as client_http:
        resp = await client_http.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class EnquiryCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=160)
    country: str = Field(min_length=2, max_length=80)
    phone: Optional[str] = Field(default="", max_length=40)
    participants: str = Field(min_length=1, max_length=40)
    room_preference: str = Field(min_length=1, max_length=40)
    preferred_date: str = Field(default="", max_length=120)
    special_requests: str = Field(default="", max_length=2000)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks(limit: int = Query(20, ge=1, le=100)):
    status_checks = await db.status_checks.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


_RATE: dict[str, list[float]] = {}
RATE_LIMIT, RATE_WINDOW = 5, 3600


def _rate_ok(key: str) -> bool:
    import time
    now = time.time()
    hits = [t for t in _RATE.get(key, []) if now - t < RATE_WINDOW]
    if len(hits) >= RATE_LIMIT:
        _RATE[key] = hits
        return False
    hits.append(now)
    _RATE[key] = hits
    return True


def _enquiry_html(e: EnquiryCreate, enquiry_id: str) -> str:
    rows = [
        ("Name", e.full_name), ("Email", e.email), ("Country", e.country),
        ("Phone / WhatsApp", e.phone), ("Participants", e.participants),
        ("Room preference", e.room_preference), ("Preferred retreat date", e.preferred_date),
        ("Special requests", e.special_requests), ("Reference", enquiry_id),
    ]
    trs = "".join(
        f'<tr><td style="padding:10px 14px;border-bottom:1px solid #eee;font-weight:bold;'
        f'color:#131C18;vertical-align:top;white-space:nowrap">{escape(label)}</td>'
        f'<td style="padding:10px 14px;border-bottom:1px solid #eee;color:#333;white-space:pre-wrap">'
        f'{escape(value or "—")}</td></tr>'
        for label, value in rows
    )
    return (
        '<table role="presentation" width="100%" bgcolor="#F8F5F0"><tr><td style="padding:24px;font-family:Arial,sans-serif">'
        '<table role="presentation" width="620" bgcolor="#ffffff" style="border:1px solid #E2DDD5;border-radius:8px">'
        f'<tr><td style="padding:22px 24px;border-bottom:3px solid #C5A059;font-size:20px;color:#131C18">'
        f'<strong>{escape(EMAIL_FROM_NAME)}</strong><br/>'
        '<span style="font-size:13px;color:#7A877E">New enquiry from the retreat website</span></td></tr>'
        f'<tr><td style="padding:10px 24px"><table role="presentation" width="100%">{trs}</table></td></tr>'
        '<tr><td style="padding:16px 24px;border-top:1px solid #E2DDD5;font-size:12px;color:#888">'
        f'Sent by {escape(EMAIL_FROM_NAME)}. We never ask for your password or card details by email.'
        '</td></tr></table></td></tr></table>'
    )


@api_router.post("/enquiries")
async def create_enquiry(input: EnquiryCreate, request: Request):
    if not EMAIL_RE.match(input.email):
        raise HTTPException(status_code=422, detail="Invalid email address")
    client_ip = request.client.host if request.client else "unknown"
    if not _rate_ok(client_ip):
        raise HTTPException(status_code=429, detail="Too many enquiries. Please try again later.")

    enquiry_id = str(uuid.uuid4())
    doc = input.model_dump()
    doc.update({"id": enquiry_id, "created_at": datetime.now(timezone.utc).isoformat()})
    await db.enquiries.insert_one(doc)

    email_sent = False
    if OWNER_EMAIL:
        subject = f"New Retreat Enquiry — {input.full_name}"
        html = _enquiry_html(input, enquiry_id)
        try:
            await send_email(to=OWNER_EMAIL, subject=subject, html=html)
            email_sent = True
        except Exception as exc:
            logger.warning("Enquiry %s saved but owner email failed: %s", enquiry_id, exc)
        if ENQUIRY_CC_EMAIL:
            try:
                await send_email(to=ENQUIRY_CC_EMAIL, subject=subject, html=html)
            except Exception as exc:
                logger.warning("Enquiry %s saved but cc email failed: %s", enquiry_id, exc)
    return {"ok": True, "id": enquiry_id, "email_sent": email_sent}


logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Admin auth (single-owner passcode login, JWT session)
# ---------------------------------------------------------------------------
JWT_ALGORITHM = "HS256"
ADMIN_LOCKOUT_MIN = 15
ADMIN_MAX_FAILS = 5


def _admin_token() -> str:
    payload = {
        "sub": "admin",
        "email": os.environ.get("ADMIN_EMAIL", ""),
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def require_admin(request: Request) -> None:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("sub") != "admin" or payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class AdminLogin(BaseModel):
    email: str = Field(min_length=5, max_length=160)
    password: str = Field(min_length=1, max_length=120)


@api_router.post("/auth/admin-login")
async def admin_login(input: AdminLogin, request: Request, response: Response):
    identifier = f"{request.client.host if request.client else 'unknown'}:{input.email.lower()}"
    rec = await db.admin_login_attempts.find_one({"identifier": identifier}, {"_id": 0})
    if rec:
        locked_until = rec.get("locked_until")
        if locked_until and datetime.now(timezone.utc) < datetime.fromisoformat(locked_until):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")

    ok = (
        input.email.lower() == os.environ.get("ADMIN_EMAIL", "").lower()
        and input.password == os.environ.get("ADMIN_PASSWORD", "")
    )
    if not ok:
        fails = (rec.get("fails", 0) if rec else 0) + 1
        update = {"identifier": identifier, "fails": fails, "updated_at": datetime.now(timezone.utc).isoformat()}
        if fails >= ADMIN_MAX_FAILS:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=ADMIN_LOCKOUT_MIN)).isoformat()
            update["fails"] = 0
        await db.admin_login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    await db.admin_login_attempts.delete_one({"identifier": identifier})
    token = _admin_token()
    response.set_cookie(
        key="access_token", value=token, httponly=True, secure=True,
        samesite="none", max_age=604800, path="/",
    )
    return {"ok": True, "email": os.environ.get("ADMIN_EMAIL", "")}


@api_router.get("/auth/admin-me")
async def admin_me(request: Request):
    await require_admin(request)
    return {"email": os.environ.get("ADMIN_EMAIL", "")}


@api_router.post("/auth/admin-logout")
async def admin_logout(response: Response):
    response.delete_cookie(key="access_token", path="/", secure=True, samesite="none")
    return {"ok": True}


@api_router.get("/admin/enquiries")
async def list_enquiries(request: Request, limit: int = Query(200, ge=1, le=500)):
    await require_admin(request)
    docs = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return {"enquiries": docs}


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("startup")
async def start_index_build():
    app.state.index_task = asyncio.create_task(ensure_indexes())


@app.on_event("shutdown")
async def shutdown_db_client():
    app.state.index_task.cancel()
    with suppress(asyncio.CancelledError):
        await app.state.index_task
    client.close()
