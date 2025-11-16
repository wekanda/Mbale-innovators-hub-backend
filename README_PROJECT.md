Mbale Innovators Hub — Source & Setup
====================================

Quick start (backend)
---------------------
1. Clone the repo
   git clone https://github.com/wekanda/Mbale-innovators-hub-backend.git
2. Install dependencies
   npm install
3. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
4. Run locally
   npm run dev

API endpoints
- `POST /api/auth/register` — register (name, email, password, role)
- `POST /api/auth/login` — login (email, password)
- `GET /api/projects` — list projects (public)
- `POST /api/projects` — create (student only)
- `PUT /api/projects/:id/status` — update status (supervisor|admin)

Live demos
- Frontend: https://legendary-starburst-b94dc0.netlify.app
- Backend:  https://mbale-innovators-hub-backend-1.onrender.com

Notes
- See `USER_MANUAL.md` for step-by-step UI usage and `TEST_REPORT.md` for test cases.
