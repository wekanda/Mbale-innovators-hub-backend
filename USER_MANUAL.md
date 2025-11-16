User Manual — Mbale Innovators Hub
=================================

This manual explains how to use the web application from the end-user perspective.

Prerequisites
- Internet connection
- A modern browser (Chrome/Edge/Firefox)

Accessing the application
- Open the frontend demo: `https://legendary-starburst-b94dc0.netlify.app`

User roles
- Student: create and manage own projects
- Supervisor: view pending projects, comment, approve/reject
- Admin: view stats and manage user-level actions

Common tasks

1) Register (Student/Supervisor/Admin)
- Click 'Register'
- Fill in name, email, password, select role
- Submit — on success you get logged in automatically

2) Login
- Click 'Login'
- Enter email and password, submit

3) Create a project (Student)
- After login, go to 'Create Project'
- Provide title, description, category, technologies, optional GitHub link
- Submit — project saved with status `pending`

4) View projects
- Visit 'Projects' page to browse submissions. Use search, filters, and pagination.

5) Review pending projects (Supervisor/Admin)
- Go to 'Pending' view (supervisors/admins)
- Open a project to view details and download uploaded documents
- Add supervisor comment and click 'Approve' or 'Reject'

6) Approve / Reject (Supervisor/Admin)
- Use status buttons on project detail page; providing a comment is optional

Administrator tasks
- View `/stats` page for counts of total, approved, pending, rejected projects

Support
- If you encounter CORS or 401 errors: check that you are using the deployed frontend (Netlify) which proxies to the Render backend, or that your token is valid.
