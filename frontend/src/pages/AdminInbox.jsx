import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LotusMark } from "../components/shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

const AdminInbox = () => {
  const [state, setState] = useState("checking"); // checking | login | ready
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/admin/enquiries`, { withCredentials: true });
      setEnquiries(data.enquiries || []);
      setState("ready");
    } catch {
      setState("login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setError("");
    try {
      await axios.post(
        `${API}/auth/admin-login`,
        { email, password },
        { withCredentials: true }
      );
      await load();
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/admin-logout`, {}, { withCredentials: true });
    } catch {}
    setState("login");
    setEnquiries([]);
    toast.success("Signed out");
  };

  if (state === "checking") {
    return (
      <div className="min-h-screen bg-[#131C18] flex items-center justify-center" data-testid="admin-loading">
        <p className="text-[#B9C2BB] tracking-[0.2em] uppercase text-sm">Checking session…</p>
      </div>
    );
  }

  if (state === "login") {
    return (
      <div className="min-h-screen bg-[#131C18] flex items-center justify-center px-5">
        <form
          onSubmit={login}
          className="w-full max-w-md rounded-2xl bg-[#F8F5F0] p-8 sm:p-10 border border-[#C5A059]/30 shadow-2xl"
          data-testid="admin-login-form"
        >
          <div className="flex items-center gap-3 mb-8">
            <LotusMark size={30} />
            <div>
              <p className="font-display text-xl text-[#1A2421]">Admin Sign In</p>
              <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[#7A877E]">Enquiries Inbox</p>
            </div>
          </div>
          <label className="field-label" htmlFor="a-email">Email</label>
          <input
            id="a-email"
            type="email"
            className="field"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="admin-email-input"
          />
          <div className="mt-5">
            <label className="field-label" htmlFor="a-pass">Password</label>
            <input
              id="a-pass"
              type="password"
              className="field"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="admin-password-input"
            />
          </div>
          {error && <p className="mt-3 text-sm text-[#9E5A3C]" data-testid="admin-login-error">{error}</p>}
          <button
            type="submit"
            disabled={loggingIn}
            className="mt-7 w-full rounded-full bg-[#131C18] px-6 py-3.5 text-[0.88rem] font-semibold text-[#F8F5F0] transition-colors duration-300 hover:bg-[#C5A059] hover:text-[#131C18] disabled:opacity-60"
            data-testid="admin-login-btn"
          >
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
          <a href="/" className="mt-5 block text-center text-sm text-[#7A877E] hover:text-[#A8833E]" data-testid="admin-back-link">
            ← Back to the retreat page
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <header className="border-b border-[#E2DDD5] bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LotusMark size={28} />
            <div>
              <p className="font-display text-lg text-[#1A2421]">Enquiries Inbox</p>
              <p className="text-[0.65rem] tracking-[0.25em] uppercase text-[#A8833E]">{enquiries.length} received</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              disabled={loading}
              className="rounded-full border border-[#E2DDD5] px-4 py-2 text-[0.78rem] font-semibold text-[#4A554D] hover:border-[#C5A059] disabled:opacity-60"
              data-testid="admin-refresh-btn"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              onClick={logout}
              className="rounded-full bg-[#131C18] px-4 py-2 text-[0.78rem] font-semibold text-[#F8F5F0] hover:bg-[#C5A059] hover:text-[#131C18]"
              data-testid="admin-logout-btn"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        {enquiries.length === 0 ? (
          <p className="text-center text-[#7A877E] py-24" data-testid="admin-empty">No enquiries yet.</p>
        ) : (
          <div className="space-y-4" data-testid="admin-enquiries-list">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="rounded-2xl bg-white border border-[#E2DDD5] p-6 grid grid-cols-1 md:grid-cols-12 gap-4"
                data-testid={`admin-enquiry-${enq.id.slice(0, 8)}`}
              >
                <div className="md:col-span-4">
                  <p className="font-display text-xl text-[#1A2421]">{enq.full_name}</p>
                  <p className="text-sm text-[#4A554D]">{enq.email}</p>
                  {enq.phone && <p className="text-sm text-[#4A554D]">{enq.phone}</p>}
                  <p className="text-xs text-[#7A877E] mt-1">{enq.country}</p>
                </div>
                <div className="md:col-span-3 text-sm text-[#4A554D]">
                  <p><span className="text-[#A8833E] font-semibold">Guests:</span> {enq.participants}</p>
                  <p><span className="text-[#A8833E] font-semibold">Room:</span> {enq.room_preference}</p>
                  <p><span className="text-[#A8833E] font-semibold">Dates:</span> {enq.preferred_date || "—"}</p>
                </div>
                <div className="md:col-span-3 text-sm text-[#4A554D]">
                  {enq.special_requests ? enq.special_requests : <span className="text-[#B9B6AA]">No special requests</span>}
                </div>
                <div className="md:col-span-2 text-xs text-[#7A877E] md:text-right">
                  {enq.created_at ? new Date(enq.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminInbox;
