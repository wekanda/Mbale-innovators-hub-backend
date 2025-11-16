Testing Report — Mbale Innovators Hub
====================================

Overview
--------
This testing report lists 10 manual test cases covering key user flows and role-based actions. Execute tests against the deployed backend and frontend.

Environment
- Backend: https://mbale-innovators-hub-backend-1.onrender.com
- Frontend: https://legendary-starburst-b94dc0.netlify.app

Test cases
----------
1) Register (Student)
- Steps: POST `/api/auth/register` with a new student email.
- Expected: 201 Created; response contains `token`.

2) Login (Student)
- Steps: POST `/api/auth/login` with registered email/password.
- Expected: 200 OK; response contains `token`.

3) Create Project (Student)
- Steps: POST `/api/projects` with Authorization: Bearer <student_token> and valid project body.
- Expected: 201 Created; project saved with `status: pending`.

4) View Projects (Public)
- Steps: GET `/api/projects` without auth.
- Expected: 200 OK; returned list contains public fields (title, description, user.name).

5) Get My Projects (Student)
- Steps: GET `/api/projects/my-projects` with student token.
- Expected: 200 OK; list contains projects created by this student.

6) Supervisor View Pending (Supervisor)
- Steps: GET `/api/projects/pending` with supervisor token.
- Expected: 200 OK; returns pending projects.

7) Approve Project (Supervisor)
- Steps: PUT `/api/projects/:id/approve` with supervisor token.
- Expected: 200 OK; project's status becomes `approved`.

8) Admin Stats (Admin)
- Steps: GET `/api/projects/stats` with admin token.
- Expected: 200 OK; returns counts for total, approved, pending, rejected.

9) Unauthorized Access
- Steps: POST `/api/projects` with admin token.
- Expected: 401/403 (admin not allowed to create projects) or a clear error message.

10) Pagination and Search
- Steps: GET `/api/projects?page=1&limit=5&search=solar&status=pending`.
- Expected: 200 OK; returned `pages`, `currentPage`, and `data` matching filters.

For each test record: Date, Tester, Steps, Input, Expected, Actual, Status (Pass/Fail), Notes.
