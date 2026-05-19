# MedYatra — AI-Powered Medical Tourism Platform

> Connecting international patients with verified clinics across India for IVF, dental, cosmetic, and hair treatment domains.

**Live Demo:** https://medyatraa.vercel.app  
**Status:** Production (MVP Launched)

---

## 🚀 Demo Access - @https://medyatraa.vercel.app/login

| Role | Email | Password |
|------|-------|----------|
| Patient | patient.test@example.com | medyatrademo@2026 |
| Doctor | doctor.test@example.com | medyatrademo@2026 |

---

## 📌 Overview

MedYatra is a full-stack AI healthcare platform built for medical tourism. International patients can discover verified clinics, get AI-powered treatment recommendations, and book appointments — all in one place. Clinics and doctors get a dedicated dashboard to manage patient flow and appointments in real time.

The platform has served **180K+ edge requests** across **15+ global regions** since launch, with all Core Web Vitals in green (FCP 0.96s, LCP 1.98s, TTFB 0.25s, FID 2ms, CLS 0).

---

## ✨ Features

**For Patients**
- AI-powered clinic discovery and recommendation (Google Gemini AI)
- Treatment browsing across IVF, dental, cosmetic and hair domains
- Real-time appointment booking with instant confirmation
- Automated communication via email notifications
- Patient dashboard with booking history and status tracking

**For Doctors / Clinics**
- Dedicated doctor dashboard with real-time appointment management
- Patient record access and appointment scheduling
- Clinic profile management
- Automated notification pipelines

**Platform**
- JWT-based authentication with separate patient and doctor flows
- Firebase Cloud Functions for backend automation
- Real-time data synchronization across dashboards
- Global edge deployment via Vercel

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Tailwind CSS, Material UI |
| State Management | Zustand |
| Backend | Firebase Cloud Functions (Serverless) |
| Database | Firestore, Supabase |
| Authentication | Firebase Auth (JWT) |
| AI | Google Gemini AI |
| Email / Comms | Brevo API |
| Hosting | Vercel Edge Network |

---

## 📊 Production Metrics

| Metric | Value |
|--------|-------|
| Total Edge Requests | 180,000+ |
| Global Regions Served | 15+ |
| First Contentful Paint (FCP) | 0.96s ✅ |
| Largest Contentful Paint (LCP) | 1.98s ✅ |
| Time to First Byte (TTFB) | 0.25s ✅ |
| First Input Delay (FID) | 2ms ✅ |
| Cumulative Layout Shift (CLS) | 0 ✅ |
| CDN Cache Hit Rate (Static Assets) | 100% |

---

## 🏗 Architecture

```
medyatra/
├── public/              # Static assets, manifest, index.html
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route-level page components
│   ├── store/           # Zustand state management
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Firebase, Gemini AI, Brevo integrations
│   └── utils/           # Helper functions
├── functions/           # Firebase Cloud Functions (backend)
├── scripts/             # Build and utility scripts
└── assets/              # Images and static media
```

---

## ⚙️ Local Setup

```bash
# Clone the repo
git clone https://github.com/globalymed/medyatra.git
cd medyatra

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Firebase, Gemini AI, and Brevo API keys

# Start development server
npm start
```

**Required environment variables:**
```
REACT_APP_FIREBASE_API_KEY=your_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_key_here
REACT_APP_GEMINI_API_KEY=your_key_here
REACT_APP_BREVO_API_KEY=your_key_here
```

---

## 🌍 Deployment

Deployed on **Vercel Edge Network** with global CDN. Every push to `main` triggers an automatic production deployment.

```bash
# Production build
npm run build

# Deploy (auto-triggered via Vercel GitHub integration)
git push origin main
```

---

## 🏆 Recognition

- **Prarambh 2026 Finalist** — IIM Udaipur Placement Cell (Saksham)
- **Empresario 2026 Finalist** — IIT KGP Entrepreneurship Cell
- **Startup Accelerator Funding** — Secured in Gurugram
- **5+ verified clinics** validated and ready to onboard

---

## 👥 Team

Built by a cross-institutional team of 7 contributors, led by [@shadow-anderson](https://github.com/shadow-anderson).

---

## 📄 License

Private — All rights reserved. MedYatra © 2026
