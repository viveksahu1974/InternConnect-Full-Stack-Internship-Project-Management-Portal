# InternConnect API Documentation

Base URL: `http://localhost:5000/api`

All responses follow:
```json
{ "success": true, "message": "...", "data": {} }
```
or, on error:
```json
{ "success": false, "message": "...", "errors": [{ "field": "...", "message": "..." }] }
```

Authenticated routes require `Authorization: Bearer <token>`.

---

## Auth

### POST /auth/register
Body: `{ name, email, password, role? }` (role: `student` | `mentor`, defaults to `student`)
Returns: `{ user, token }`

### POST /auth/login
Body: `{ email, password }` → `{ user, token }`

### POST /auth/logout
Auth required.

### GET /auth/me
Auth required. Returns the current user.

---

## Users (admin only)

### GET /users
Query: `search, role, status, page, limit`

### POST /users
Body: `{ name, email, password, role }`

### PUT /users/:id
Body: any of `{ name, phone, role, status, avatar }`

### DELETE /users/:id

---

## Students (student only)

### GET /students/me/profile
### PUT /students/me/profile
Body: any of `{ college, degree, branch, semester, bio, github, linkedin, resumeUrl, name, phone }`

### POST /students/me/skills
Body: `{ name, category?, proficiency? }`

### DELETE /students/me/skills/:id

### GET /students/me/dashboard
Returns profile completion %, skills count, applications count, active internship, task breakdown.

---

## Mentors (mentor only)

### GET /mentors/me/profile
### PUT /mentors/me/profile
Body: any of `{ specialization, experience, bio, department }`

### GET /mentors/me/interns
### GET /mentors/me/dashboard

---

## Projects

### GET /projects
Public. Query: `search, category, difficulty, technology, mentor, status, sort, page, limit`
`sort`: `newest | popular | deadline | difficulty | duration`

### GET /projects/:id
Public.

### POST /projects
Auth: mentor or admin. Body: `{ title, description, objectives?, requirements?, category?, difficulty?, duration?, seats?, applicationDeadline?, startDate?, endDate?, skills?: string[] }`

### PUT /projects/:id
Auth: mentor (own projects only) or admin.

### DELETE /projects/:id
Auth: mentor (own projects only) or admin.

### POST /projects/:projectId/apply
Auth: student. Body: `{ fullName, email, phone?, college?, degree?, branch?, semester?, skillsText?, resumeUrl?, github?, linkedin?, motivation, previousProjects? }`

---

## Applications

### GET /applications/mine
Auth: student.

### PUT /applications/:id/withdraw
Auth: student (own application only).

### GET /applications
Auth: mentor (own projects' applications) or admin. Query: `status, projectId, page, limit`

### PUT /applications/:id/status
Auth: mentor or admin. Body: `{ status }` — one of `pending | under_review | shortlisted | accepted | rejected`.
**Accepting** an application auto-creates the internship, assigns mentor/project, generates the
4-module milestone roadmap with starter tasks, and sends notifications.

---

## Internships

### GET /internships/mine
Auth: student. Returns the student's active/most recent internship with milestones + tasks.

### GET /internships
Auth: mentor (own) or admin (all).

### GET /internships/:id
Auth: the student, the mentor, or an admin.

---

## Milestones

### GET /milestones/internship/:internshipId
### POST /milestones/internship/:internshipId
Auth: mentor or admin. Body: `{ title, description?, startDate?, deadline? }`

### PUT /milestones/:id
Auth: mentor or admin. Body: any milestone field.

---

## Tasks

### GET /tasks/milestone/:milestoneId
### POST /tasks/milestone/:milestoneId
Auth: mentor or admin. Body: `{ title, description?, dueDate? }`

### PUT /tasks/:id
Auth: any authenticated user with access. Body: any task field. Recalculates milestone/internship progress.

---

## Submissions

### POST /submissions/task/:taskId
Auth: student. Body: `{ content?, githubUrl?, liveUrl?, fileUrl? }` (at least one required).

### GET /submissions
Auth: mentor (own interns' submissions) or admin. Query: `status`

### PUT /submissions/:id/review
Auth: mentor or admin. Body: `{ decision: "approved"|"rejected"|"revision_required", comment?, score? }`
Recalculates milestone/internship progress and notifies the student.

---

## Notifications

### GET /notifications
Auth required. Returns `{ notifications, unreadCount }`.

### PUT /notifications/:id/read
### PUT /notifications/read-all

---

## Analytics

### GET /analytics/admin
Auth: admin. Platform-wide stats + applications-by-status + project popularity.

### GET /analytics/mentor
Auth: mentor. Own intern count, completion rate, average progress.

### GET /analytics/student
Auth: student. Own overall progress and application count.

---

## Health

### GET /health
Public. Returns API status and server time.
