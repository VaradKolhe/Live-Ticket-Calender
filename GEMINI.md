# GEMINI.md

# Event Calendar & Tracking Platform

You are the primary coding agent for this project.

Build a polished, functional MVP of a Google Calendar-style event discovery and tracking platform under a strict 90-minute implementation window.

The goal is NOT to build an over-engineered production system.

The goal is to deliver a clean, working, demonstrable full-stack application with:
1. A calendar-first UI
2. Ticketmaster event integration
3. Event details
4. RSVP / Interested functionality
5. RSVP dashboard
6. Friend Invite / Share Link functionality
7. Friend invite click tracking
8. Friends Attending count
9. MongoDB persistence
10. Clean frontend/backend separation
11. Server-side business logic
12. A public GitHub repository with meaningful incremental commits

---

# 1. ORIGINAL PROBLEM CONTEXT

The application is a platform for finding and tracking events.

Core requirements:

- Calendar grid highlighting dates with local events.
- Event information including:
  - title
  - venue
  - date
  - time
  - Interested button
- Dedicated RSVP dashboard showing confirmed event attendance.
- Event listings fetched from the Ticketmaster API.
- MongoDB stores:
  - RSVP data
  - user profile details
  - event reminder settings
- Friend Invite system:
  - If a user RSVPs to an event, they can generate a Share Link.
  - Backend tracks how many users clicked the share link.
  - Event card displays Friends Attending count.

The application should behave primarily like a Google Calendar-style event calendar.

The calendar is the PRIMARY PRODUCT EXPERIENCE.

---

# 2. CORE PRODUCT UX

The homepage should NOT primarily be an infinite event-card feed.

The main screen should be a calendar.

Example:

                    October 2026

      Mon     Tue     Wed     Thu     Fri     Sat     Sun

                 1       2       3       4
                         Concert

       5       6       7       8       9      10      11
               Meetup            Music Fest

      12      13      14      15      16      17      18
                       Tech Conference

Each date can contain compact event titles.

Clicking a date should reveal all events occurring on that date.

Example:

October 8, 2026

---------------------------------------
Events on this date

Tech Conference
10:00 AM
Pune Convention Centre
[View Event] [Interested]

Live Music Night
7:30 PM
Venue Name
[View Event] [Interested]
---------------------------------------

Clicking an event should show the full event details.

Example:

Tech Conference

October 8, 2026
10:00 AM
Pune Convention Centre

Description...

[Interested]

Friends Attending: 4

[Share With Friends]

---

# 3. PRIMARY USER JOURNEY

The main flow should be:

Calendar
    ↓
Select date
    ↓
View events on selected date
    ↓
Select event
    ↓
View event details
    ↓
Click Interested
    ↓
RSVP stored in MongoDB
    ↓
Generate Share Link
    ↓
Friend opens Share Link
    ↓
Backend records click
    ↓
Friends Attending count updates

This flow is more important than visual polish.

---

# 4. TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason not to.

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

## Backend

- Node.js
- Express
- Mongoose
- Axios
- dotenv
- cors

## Database

MongoDB Atlas

Use a free MongoDB Atlas cluster.

## External API

Ticketmaster Discovery API.

The Ticketmaster API key must remain server-side.

Never expose the Ticketmaster API key in frontend code.

## Version Control

Git + GitHub

---

# 5. ARCHITECTURE

Use a clean monorepo structure:

event-calendar/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
├── README.md
└── GEMINI.md

Do not create unnecessary microservices.

Do not create separate repositories.

Do not add Docker unless explicitly required.

---

# 6. DATABASE DESIGN

Keep the database intentionally small.

Use THREE primary collections.

## User

User fields:

- _id
- name
- email
- reminderSettings
- createdAt

Example:

{
  name: "Demo User",
  email: "demo@example.com",
  reminderSettings: {
    enabled: true,
    minutesBefore: 60
  }
}

Authentication is NOT a priority unless explicitly required by the actual assessment prompt.

A demo/current user can be used for the MVP.

Do not spend significant time implementing JWT authentication, password reset, OAuth, etc.

---

## RSVP

Fields:

- _id
- userId
- eventId
- eventName
- eventDate
- eventTime
- venue
- createdAt

Example:

{
  userId: "...",
  eventId: "ticketmaster-event-id",
  eventName: "Tech Conference",
  eventDate: "2026-10-08",
  eventTime: "10:00 AM",
  venue: "Pune Convention Centre",
  createdAt: Date
}

Prevent duplicate RSVP for the same user and event.

The backend must validate this.

---

## Invite

Fields:

- _id
- token
- eventId
- userId
- clicks
- friendsAttending
- createdAt

Example:

{
  token: "a8f72k",
  eventId: "ticketmaster-event-id",
  userId: "...",
  clicks: 4,
  friendsAttending: 4,
  createdAt: Date
}

The token must uniquely identify an invite.

---

# 7. EVENT DATA MODEL

Do NOT send the entire raw Ticketmaster response to the frontend.

Normalize Ticketmaster data in the backend.

Frontend event object should look approximately like:

{
  id,
  title,
  description,
  date,
  time,
  venue,
  city,
  image,
  category,
  ticketUrl
}

The backend owns the transformation.

The frontend should not contain Ticketmaster-specific parsing logic.

---

# 8. REQUIRED API ENDPOINTS

Implement these APIs.

## Health

GET /api/health

Response:

{
  "status": "ok"
}

---

## Events

GET /api/events

Purpose:
Fetch events from Ticketmaster and return normalized event data.

Support basic query parameters where practical:

- date
- city
- keyword

Do not over-engineer filtering.

---

GET /api/events/:id

Purpose:
Return one normalized event.

---

## RSVP

POST /api/rsvps

Body:

{
  "eventId": "...",
  "eventName": "...",
  "eventDate": "...",
  "eventTime": "...",
  "venue": "..."
}

The backend should associate the RSVP with the current/demo user.

Validate duplicate RSVP.

---

GET /api/rsvps

Return all RSVPs for the current/demo user.

---

DELETE /api/rsvps/:eventId

Remove RSVP for an event.

---

## Invites

POST /api/invites

Body:

{
  "eventId": "..."
}

Create or return an invite token for the user's RSVP.

An invite should only be generated if the user has RSVPed.

---

GET /api/invites/:token

Return invite/event information.

---

POST /api/invites/:token/click

Increment invite click tracking.

Return updated information including Friends Attending count.

---

# 9. SERVER-SIDE BUSINESS LOGIC

IMPORTANT:

Business logic must be on the backend.

Frontend should primarily handle:

- presentation
- interaction
- API calls
- local UI state

Backend should handle:

- RSVP validation
- duplicate RSVP prevention
- invite generation
- invite validation
- click counting
- Friends Attending calculation
- Ticketmaster API key
- Ticketmaster response normalization
- reminder settings persistence

Do NOT implement important business rules only in React.

---

# 10. CALENDAR REQUIREMENTS

The calendar is the application's primary UI.

Implement:

- Month view
- Previous month button
- Next month button
- Current month display
- Date cells
- Events inside date cells
- Selected date state
- Events for selected date

Event titles should appear directly inside their respective calendar dates.

Example:

┌─────────────┐
│ 8           │
│             │
│ Tech Conf.  │
│ Music Night │
└─────────────┘

If there are many events:

Show the first few events and a "+N more" indicator.

Clicking the date should show all events for that date.

Do not attempt to reproduce every Google Calendar feature.

Do NOT build:
- recurring events
- drag-and-drop
- calendar sharing
- multiple calendars
- time-zone management
- complex scheduling
- invitations by email
- Google Calendar integration

unless explicitly required later.

---

# 11. EVENT DETAILS

Event details should include:

- Event title
- Date
- Time
- Venue
- City
- Description
- Image where available
- Ticketmaster ticket link where available
- Interested / RSVP button
- Friends Attending count
- Share With Friends button

Use a modal, drawer, or dedicated route.

Choose whichever can be implemented fastest while maintaining a polished UX.

---

# 12. RSVP EXPERIENCE

Before RSVP:

[ Interested ]

After RSVP:

[ Interested ✓ ]

Then show:

Friends Attending: 0

[ Share With Friends ]

The RSVP state should persist after page refresh.

Do not rely only on React state.

---

# 13. FRIEND INVITE SYSTEM

This is an important differentiating feature.

Flow:

User RSVPs
    ↓
Backend creates invite
    ↓
Unique token generated
    ↓
Shareable URL created
    ↓
User copies/shares link
    ↓
Friend opens link
    ↓
Backend records click
    ↓
Friends Attending count updates

Example:

/invite/a8f72k

The frontend should provide a simple share UI.

At minimum:

- Show generated link
- Copy button
- Friends Attending count

If clipboard API is unreliable, provide the link as selectable text.

Do not spend excessive time implementing social-media-specific sharing.

---

# 14. FRIEND COUNT

The event card/details should show:

Friends Attending: 4

The count must originate from backend data.

Do not simply increment a React variable.

The backend should own the count.

---

# 15. RSVP DASHBOARD

Create a "My Events" page.

Display events the user has RSVPed to.

Example:

MY EVENTS

┌───────────────────────────────┐
│ Tech Conference               │
│ Oct 8 • 10:00 AM              │
│ Pune Convention Centre        │
│                               │
│ Friends Attending: 4          │
│ [View Event] [Invite Friends] │
└───────────────────────────────┘

Include useful empty state:

"You haven't RSVP'd to any events yet."

---

# 16. REMINDER SETTINGS

MongoDB must support reminder settings.

For the MVP, persistence is enough.

Example:

Reminder Settings

[✓] Enable reminders

Reminder time:
[ 60 minutes before ]

Do NOT implement email/SMS/push notification infrastructure unless explicitly required.

---

# 17. UI / DESIGN DIRECTION

Aim for a modern Google Calendar-inspired interface.

Characteristics:

- Clean
- Minimal
- Desktop-first but responsive
- Strong calendar hierarchy
- Compact event chips
- Clear selected-date state
- Good whitespace
- Subtle borders
- Rounded cards
- Professional typography
- No excessive gradients
- No unnecessary animations

Suggested layout:

┌──────────────────────────────────────────────────────────┐
│ Event Calendar                 Search      My Events     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   <   October 2026   >                                   │
│                                                          │
│   MON     TUE     WED     THU     FRI     SAT     SUN   │
│                                                          │
│   calendar grid                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘

When a date/event is selected, use either:

1. A right-side details panel
OR
2. A modal

Choose whichever produces the cleanest implementation fastest.

---

# 18. RESPONSIVENESS

Desktop is the priority because this is a timed coding assessment.

Still ensure:

- No broken layout on tablet
- Calendar remains usable on smaller screens
- Event details can stack vertically
- Buttons remain accessible

Do not spend 20 minutes perfecting mobile responsiveness.

---

# 19. ERROR HANDLING

Implement basic error states.

Examples:

Ticketmaster unavailable:

"Unable to load events. Please try again."

MongoDB unavailable:

"Unable to save your RSVP."

No events:

"No events found for this date."

Loading:

"Loading events..."

Do not allow uncaught API errors to break the entire UI.

---

# 20. ENVIRONMENT VARIABLES

Server:

TICKETMASTER_API_KEY=
MONGODB_URI=
PORT=5000

Client:

VITE_API_URL=http://localhost:5000

Never commit secrets.

Add .env to .gitignore.

Create .env.example containing variable names only.

---

# 21. SECURITY BASICS

Do the following:

- Keep API keys server-side
- Validate request bodies
- Validate event IDs
- Validate invite tokens
- Prevent duplicate RSVPs
- Do not trust frontend-provided Friends Attending counts
- Do not expose MongoDB credentials
- Do not hardcode secrets

Do NOT spend significant time implementing enterprise security.

---

# 22. DEVELOPMENT PRIORITY

The project has a STRICT 90-MINUTE DEVELOPMENT WINDOW.

Prioritize functionality over perfection.

Priority order:

P0 — MUST WORK

1. Project setup
2. Backend
3. MongoDB connection
4. Ticketmaster integration
5. Calendar
6. Date → events
7. Event details
8. RSVP
9. RSVP persistence
10. Friend invite
11. Invite click tracking
12. Friends Attending count
13. GitHub submission

P1 — SHOULD WORK

14. My Events dashboard
15. Search
16. Loading states
17. Error states
18. Reminder settings

P2 — ONLY IF TIME REMAINS

19. Animations
20. Advanced filtering
21. Better responsive design
22. UI refinements
23. Polling / near-real-time refresh

---

# 23. 90-MINUTE EXECUTION PLAN

## 0–5 minutes

Understand current repository.

Do NOT blindly overwrite existing work.

Check:

- files
- package managers
- Node version
- git status
- existing configuration

Initialize project if needed.

Commit:

chore: initialize project

---

## 5–15 minutes

Backend setup.

Create:

- Express server
- routes
- controllers
- MongoDB connection
- environment variables
- health endpoint

Commit:

feat: setup express backend

---

## 15–25 minutes

MongoDB models:

- User
- RSVP
- Invite

Connect and verify database.

Commit:

feat: add mongodb persistence

---

## 25–40 minutes

Ticketmaster API.

Implement:

GET /api/events
GET /api/events/:id

Normalize API response.

Commit:

feat: integrate ticketmaster events

---

## 40–55 minutes

Calendar-first frontend.

Implement:

- month navigation
- calendar grid
- event chips
- selected date
- date event list

Commit:

feat: build calendar event interface

---

## 55–68 minutes

Event details + RSVP.

Implement:

- event details
- Interested button
- RSVP API
- persisted RSVP state

Commit:

feat: add event details and rsvp

---

## 68–80 minutes

Friend invite.

Implement:

- invite creation
- unique token
- invite page
- click tracking
- Friends Attending

Commit:

feat: add friend invite tracking

---

## 80–86 minutes

My Events + reminder settings.

Only basic implementation.

Commit:

feat: add user event dashboard

---

## 86–90 minutes

Final verification.

Check:

- frontend starts
- backend starts
- MongoDB works
- Ticketmaster works
- RSVP works
- invite works
- no secrets committed
- Git status clean
- GitHub push successful

Final commit:

chore: finalize assessment submission

STOP DEVELOPMENT AFTER THE DEADLINE.

---

# 24. GIT REQUIREMENTS

Use meaningful incremental commits.

Recommended commits:

1. chore: initialize project
2. feat: setup express backend
3. feat: add mongodb persistence
4. feat: integrate ticketmaster events
5. feat: build calendar event interface
6. feat: add event details and rsvp
7. feat: add friend invite tracking
8. feat: add user event dashboard
9. chore: finalize assessment submission

Do not create hundreds of meaningless commits.

Do not rewrite Git history.

---

# 25. README

Create a concise README containing:

- Project name
- Problem statement
- Features
- Architecture
- Tech stack
- Environment variables
- Setup instructions
- API endpoints
- MongoDB collections
- How Friend Invite works
- Screenshots if available

Do not spend more than a few minutes on README.

---

# 26. VIBE-CODING RULES

You are an autonomous coding agent.

Before changing anything:

1. Inspect the existing repository.
2. Understand the current state.
3. Reuse working code.
4. Do not unnecessarily rewrite functioning components.
5. Prefer the simplest implementation that satisfies the requirement.

When implementing a feature:

1. Implement backend contract.
2. Test backend.
3. Implement frontend.
4. Connect frontend.
5. Test end-to-end.
6. Commit.

Do not build multiple unfinished features simultaneously.

---

# 27. TIME MANAGEMENT RULE

The 90-minute limit is more important than theoretical completeness.

If a feature is consuming too much time:

STOP.

Implement the simplest functional version.

For example:

Instead of:
- sophisticated authentication
- OAuth
- JWT refresh tokens
- password reset

Use:
- demo/current user

Instead of:
- WebSocket infrastructure

Use:
- REST API refresh

Instead of:
- sophisticated notification service

Use:
- persisted reminder settings

Instead of:
- advanced calendar library customization

Use:
- simple React calendar grid

A working MVP is more valuable than an incomplete sophisticated system.

---

# 28. DO NOT OVERENGINEER

Do NOT introduce:

- microservices
- Redis
- Kafka
- RabbitMQ
- GraphQL
- Kubernetes
- Docker
- Redux unless truly needed
- complex authentication
- payment systems
- email infrastructure
- notification infrastructure
- WebSockets unless there is significant time remaining

Keep the application understandable for a subsequent viva.

---

# 29. VIVA READINESS

The implementation must be understandable.

Be able to explain:

### Why React?

Component-based UI and fast development.

### Why Express?

Lightweight REST API backend.

### Why MongoDB?

Event/RSVP/invite data is naturally document-oriented and the requirement specifies MongoDB.

### Why backend Ticketmaster integration?

Protect API key and centralize event normalization/business logic.

### Why server-side RSVP validation?

Business rules must not be trusted to the client.

### How does Friend Invite work?

RSVP → unique token → share link → click endpoint → persisted count.

### Why isn't authentication implemented?

Only implement authentication if explicitly required by the final problem statement. Avoid spending the limited MVP development time on functionality outside the core requirements.

---

# 30. FINAL DEFINITION OF DONE

The project is DONE when a user can:

1. Open the application.
2. See a calendar.
3. See event titles inside calendar dates.
4. Navigate between months.
5. Click a date.
6. See all events on that date.
7. Click an event.
8. View complete event details.
9. Click Interested.
10. See the RSVP persisted.
11. Open My Events.
12. Generate a Friend Share Link.
13. Open the invite link.
14. Record a click.
15. See Friends Attending update.
16. Refresh the application.
17. Still see the RSVP data.

If all of the above works, prioritize final testing and GitHub submission over additional features.

---

# 31. AGENT BEHAVIOR

When asked to implement something:

- Inspect first.
- Make the smallest coherent change.
- Run the application/tests.
- Fix errors immediately.
- Keep architecture clean.
- Keep business logic server-side.
- Keep secrets out of source control.
- Commit meaningful milestones.

Do not ask for confirmation for every implementation step.

If a reasonable implementation choice is ambiguous, choose the simplest option that preserves the architecture and continue.

If a dependency is unnecessary, do not install it.

If a feature is not required for the MVP, do not spend significant time on it.

Always protect the working state of the application.

The ultimate goal is:

FAST + FUNCTIONAL + CLEAN + DEMONSTRABLE

not:

OVERENGINEERED + INCOMPLETE