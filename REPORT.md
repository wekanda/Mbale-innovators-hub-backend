Project Report: Mbale Innovators Hub
=================================

Abstract
--------
This project delivers an online platform for students to submit project proposals and final documents, and for supervisors and administrators to review, comment, and approve submissions. The system uses a Node.js + Express backend with MongoDB (Mongoose) and a Vite-built frontend deployed on Netlify. Key features include user authentication (JWT), role-based access control (student/supervisor/admin), project CRUD operations, file uploads for project documents, and approval workflows.

1. Introduction
---------------
The Mbale Innovators Hub enables university students to submit projects for evaluation by supervisors and administrators. The platform supports submission, review, and publication processes while enforcing role-based permissions.

2. Objectives
-------------
- Provide a secure registration and login mechanism.
- Allow students to create and manage project submissions.
- Allow supervisors and admins to review, approve, or reject submissions.
- Provide search, pagination, and filtering for projects.

3. System Architecture
----------------------
- Frontend: Vite + React (built and deployed to Netlify). Reads API base URL from `VITE_API_URL`.
- Backend: Node.js + Express, deployed on Render. Connects to MongoDB Atlas using `MONGO_URI`.
- Database: MongoDB Atlas (collections: `users`, `projects`, `comments`).
- Authentication: JSON Web Tokens (JWT) with role claim included.

4. Implementation Details
-------------------------
Backend
- Entry point: `src/server.js`.
- Main routes: `/api/auth`, `/api/projects`, `/api/users`, `/api/comments`.
- Key controllers: `src/controllers/projects.js`, `src/controllers/auth.js`, `src/controllers/userController.js`.
- Middleware: `src/middleware/auth.js` implements `protect`, `authorize`, and `optionalProtect`.

Frontend
- Built with Vite and configured to use `VITE_API_URL` at build time.
- Netlify proxy rule (`public/_redirects`) forwards `/api/*` to the Render backend.

5. Features
-----------
- Role-based access: students can create/update their own projects; supervisors/admins can view pending submissions and change status.
- Pagination, search, and status filtering on the projects listing.
- File upload support for project documents (stored as file paths; actual storage depends on deployment configuration).

6. Personal Contribution to Project Milestones
----------------------------------------------
List specific contributions you performed. Edit these bullet points to match your work on the project:

- Project setup and repo organization: moved entry point into `src/`, updated `package.json` start scripts.
- Implemented project controllers with pagination, search and status filtering (`src/controllers/projects.js`).
- Implemented JWT-based authentication and middleware (`src/middleware/auth.js`).
- Configured backend CORS and environment variables to support Netlify frontend deployment.
- Added Netlify `_redirects` proxy and production env var `VITE_API_URL` to frontend repo for API routing.
- Created seed scripts to add test users and sample projects to MongoDB.

7. Testing and Validation
-------------------------
Unit and integration tests should be added; for now, manual tests and seed scripts verify end-to-end functionality (see `TEST_REPORT.md`).

8. Deployment
-------------
- Backend deployed on Render: `https://mbale-innovators-hub-backend-1.onrender.com`
- Frontend deployed on Netlify: `https://legendary-starburst-b94dc0.netlify.app`

9. Limitations and Future Work
------------------------------
- File uploads are stored as file paths; integrate cloud storage (S3 or Render volumes) for production.
- Add automated tests (Jest + Supertest) and CI/CD pipelines.
- Add role management UI for admin to invite and manage users.

10. Conclusion
--------------
The platform meets the core requirements for submission and review workflows. With further improvements to storage, testing, and monitoring, it can support production use.

References (IEEE style)
----------------------
[1] M. Fowler, "Refactoring: Improving the Design of Existing Code", Addison-Wesley, 1999.
[2] N. Chatterjee and L. Dey, "Building RESTful APIs with Node.js and Express", 2018.
[3] MongoDB, "Mongoose — Elegant MongoDB object modeling for Node.js", https://mongoosejs.com/

Appendix — Formatting
---------------------
To satisfy the requested document formatting:
- Open this markdown in Microsoft Word or Google Docs and apply: Font `Trebuchet MS`, size `12pt`, line spacing `1.5`, alignment `Justified`.
- For final submission export to PDF.
