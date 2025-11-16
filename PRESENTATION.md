Presentation / Demo Script
==========================

Slide 1 — Title
- Mbale Innovators Hub
- Your name, date

Slide 2 — Motivation
- Problem: Students need a streamlined way to submit projects and get supervisor feedback.
- Opportunity: Centralize submissions, approvals, and publish approved projects.

Slide 3 — Objectives
- Secure registration and role-based access
- Submission, review, approval workflows
- Search, pagination, and file uploads

Slide 4 — Architecture
- Diagram (speak): Frontend (Netlify) → Backend (Render) → MongoDB Atlas
- Auth: JWT; Role claims used for authorization

Slide 5 — Demo (Live)
- Show the Netlify frontend
- Login as Student (credentials provided)
- Create a project
- Login as Supervisor, review pending, approve

Slide 6 — Testing & QA
- Show `TEST_REPORT.md` and run a quick API call to `/projects/stats`

Slide 7 — Contributions
- Bullet list of your personal contributions (see `REPORT.md` section 6)

Slide 8 — Future Work
- Add cloud storage for uploads, automated tests, CI/CD, analytics

Slide 9 — Q&A

Notes
- For the live demo use the following accounts:
  - Admin: admin@mbalehub.com / Admin@12345
  - Supervisor: supervisor@mbalehub.com / Supervisor@12345
  - Student: seedstudent@mbalehub.com / Student@12345
