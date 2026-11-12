# PRD — International Healing Retreat in India (Landing Page)

## Original Problem Statement
"Please see below web page and can u design similar style page with content from the PDF attached." (reference: https://healingfestival.eu/india/ ; content: International_Healing_Retreat_Brochure.pdf)

## User Decisions (ask_human)
- Structure & vibe: same as healingfestival.eu/india (hero, dates, venue, program, footer), layout optimized for retreat content, designer freedom
- Register button: enquiry form like indiahealingretreat.com; submissions emailed to dilip.kerala@gmail.com
- Images: mix of stock + AI-generated
- Sections: all (hero, intro, 5 pillars, day-wise healing, 6-day schedule, venue, contact)
- Single page; main title "International Healing Retreat in India"

## Architecture
- Frontend: React (CRA + craco), Tailwind, framer-motion (masked hero reveal, scroll reveals), Lenis smooth scroll, parallax hero, CSS editorial marquee, sonner toasts
- Backend: FastAPI — POST /api/enquiries (validate → rate-limit → MongoDB → Resend-managed email to OWNER_EMAIL)
- DB: MongoDB collection `enquiries`; Backend .env: EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME, EMAIL_REPLY_TO, OWNER_EMAIL
- Assets: AI-generated (hero dawn, venue dome, sound bowls) + Unsplash/Pexels stock; original lotus SVG favicon

## Personas
- International seekers/tourists looking for a healing retreat in India (Feb 19–25, 2027)
- Owner (Dilip) receiving enquiries by email

## Core Requirements (static content, brochure-sourced)
- Hero with dates 19–25 Feb 2027, venue The Pearl Hotels, Kanha Shanti Vanam, Hyderabad
- Intro "Come Home to Yourself"; 5 curated pillars; day-wise therapies (Day 2 Polarity, Day 3 Sound, Day 4 Quantum, Day 5 Mudra)
- Heartfulness ladder (Relaxation → Cleaning → Prayer → Group meditation → world's largest meditation hall)
- Interactive 6-day schedule tabs; venue features (1,400-acre campus, ECC World Peace Dome, 100% vegetarian)
- Enquiry form fields per indiahealingretreat.com (name, email, country, phone/WhatsApp, participants, room preference, preferred date, special requests, agreement)

## Implemented (2026-11-12)
- All sections above, enquiry form → DB + email (verified delivered), validation + rate limiting, responsive mobile layout, favicon/SEO/meta

## Backlog
- P1: Admin inbox view of enquiries; WhatsApp button
- P2: Testimonials once real ones exist; pricing packages if provided; multi-language
