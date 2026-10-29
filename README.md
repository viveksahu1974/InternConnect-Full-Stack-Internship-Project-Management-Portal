# InternConnect — Internship & Project Management Portal

A full-stack internship and project-management platform connecting students, mentors, and
administrators. Real authentication, a real database, and a real REST API — no mocked data,
no fake buttons.

## Overview

- **Students** browse and search a project catalogue, apply, track application status, work
  through an auto-generated milestone roadmap, submit tasks, and get mentor feedback.
- **Mentors** manage their own projects, review applications (accepting one automatically
  creates the internship, assigns the mentor, and generates the roadmap), and review student
  submissions with approve / reject / revision-required decisions plus scored feedback.
- **Admins** manage users, oversee every project and application, and see platform-wide
  analytics (applications by status, project popularity, completion rate).

## Tech stack

**Frontend:** React 19, Vite, React Router, Tailwind CSS, Axios, Recharts, Lucide icons.
**Backend:** Node.js, Express, Sequelize ORM, JWT auth, bcrypt password hashing, Helmet, CORS,
rate limiting.
**Database:** SQLite out of the box (zero setup, a single file), with the ORM layer written so
switching to MySQL is a one-line env change (`DB_DIALECT=mysql`) — no code changes.

## Project structure

```
internconnect/
  backend/
    src/
      config/db.js          # Sequelize connection (SQLite or MySQL via env)
      models/                # 15 Sequelize models + associations
      middleware/             # JWT auth, role guards, error handling
      controllers/             # Business logic per resource
      routes/                  # REST route definitions
      seeders/
        migrate.js             # Creates/updates tables from models
        seed.js                 # Realistic demo data (recreates tables)
      app.js                     # Express app assembly
      server.js                   # Boots DB connection + listener
    .env.example
  frontend/
    src/
      api/                    # Axios service layer, one file per resource
      context/AuthContext.jsx  # Auth state, token storage
      routes/ProtectedRoute.jsx # Role-based route guarding
      layouts/                  # Public layout, dashboard shell w/ sidebar
      components/                 # Shared UI (cards, badges, dialogs, states)
      pages/
        public/                    # Landing, catalogue, project detail, roadmap
        auth/                        # Login, register
        student/                      # Dashboard, profile, applications, internship, notifications
        mentor/                        # Dashboard, interns, reviews, applications, projects
        admin/                          # Overview, users, projects, applications, analytics
    .env.example
```

## Database schema

15 tables: `users`, `student_profiles`, `mentor_profiles`, `skills`, `student_skills`,
`projects`, `project_skills`, `applications`, `internships`, `milestones`, `tasks`,
`submissions`, `feedback`, `notifications`, `saved_projects` — with foreign keys and cascade
rules defined via Sequelize associations in `backend/src/models/index.js`.

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # defaults work out of the box (SQLite)
npm run migrate           # creates tables
npm run seed               # populates realistic demo data (recreates tables)
npm run dev                 # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev                # starts the app on http://localhost:5173
```

Open `http://localhost:5173`.

### 3. Demo accounts

| Role    | Email                          | Password    |
|---------|---------------------------------|-------------|
| Admin   | admin@internconnect.com         | Demo@1234   |
| Mentor  | mentor@internconnect.com        | Demo@1234   |
| Student | student@internconnect.com       | Demo@1234   |

The seed script also creates a second mentor and two more students so the catalogue,
applications list, and admin analytics all have real variety to look at immediately.

## Switching to MySQL / XAMPP

1. Create the database: `CREATE DATABASE internconnect;`
2. In `backend/.env`, set:
   ```
   DB_DIALECT=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=internconnect
   DB_USER=root
   DB_PASSWORD=
   ```
3. Install the MySQL driver: `npm install mysql2` (the sqlite3 driver already installed can
   stay — Sequelize only loads the driver for the dialect you configure).
4. Run `npm run migrate` then `npm run seed` again.

No application code changes are required — `src/config/db.js` picks the dialect from
`DB_DIALECT`.

## Core workflow (what actually happens end to end)

1. A student registers, completes their profile (skills, resume link, GitHub/LinkedIn) — the
   profile-completion percentage is computed from real fields, not hardcoded.
2. They browse/search/filter the project catalogue (server-side pagination, not client-side
   filtering of a large payload) and apply with a validated form.
3. A mentor or admin reviews the application. **Accepting it** automatically:
   - creates the `Internship` record,
   - assigns the mentor and project,
   - generates the four-module milestone roadmap with a starter task in each,
   - notifies both the student and the mentor.
4. The student works through tasks, submitting text/GitHub/live-URL evidence per task.
5. The mentor reviews each submission (approve / reject / revision required) with a comment
   and optional score. Approving a task:
   - marks the task completed,
   - recalculates the parent milestone's progress from its tasks,
   - recalculates the internship's overall progress from all milestones,
   - notifies the student.
6. Admin analytics (applications by status, project popularity, completion rate) reflect all
   of this in real time because they're computed from the same database on every request.

Everything above is backed by real database writes and survives logout/restart — verified by
running the flow against a live instance of this codebase before delivery.

## API documentation

See `API_DOCUMENTATION.md` for the full endpoint reference.

## What's implemented vs. simplified from the original spec

This build prioritizes a **smaller set of real, working features** over a large surface of
placeholder screens. Implemented for real: auth, role-based authorization, project catalogue
with search/filter/sort/pagination, the full application → internship → milestone → task →
submission → feedback workflow, notifications, and analytics for all three roles.

Not built in this pass (would need a follow-up): file upload storage (resume/submission
files currently take a URL, not a binary upload), a dedicated skill-match recommendation
score on the dashboard, bulk admin actions, and CSV/PDF report export. The database schema
and API structure both leave room for these without breaking changes.

## Scripts reference

Backend (`backend/`): `npm run dev`, `npm start`, `npm run migrate`, `npm run seed`.
Frontend (`frontend/`): `npm run dev`, `npm run build`, `npm run preview`.
