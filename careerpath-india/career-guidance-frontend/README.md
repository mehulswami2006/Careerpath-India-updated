# CareerPath India — AI Career Guidance & Tutor Hiring Platform

A complete full-stack frontend built with **Next.js 14 (App Router)**, **TailwindCSS**, and **JavaScript** that connects to a Spring Boot backend.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Framework   | Next.js 14 (App Router) |
| Language    | JavaScript (ES2022+)    |
| Styling     | TailwindCSS             |
| API Calls   | Fetch API               |
| Auth        | JWT (localStorage)      |

---

## 🔗 Backend Connection

The frontend connects to a **Spring Boot** backend at:

```
http://localhost:8080
```

### Auth Flow
1. User logs in → `POST /api/auth/login`
2. Response: `{ "token": "JWT_TOKEN" }`
3. Token stored in `localStorage`
4. Every request includes: `Authorization: Bearer TOKEN`

---

## 📁 Project Structure

```
career-guidance-frontend/
├── app/
│   ├── layout.js                    # Root layout
│   ├── page.js                      # Redirect to dashboard
│   ├── login/page.js                # Login page
│   ├── register/page.js             # Registration
│   ├── student-dashboard/page.js    # Student home
│   ├── teacher-dashboard/page.js    # Teacher home
│   ├── profile/page.js              # User profile
│   ├── aptitude-test/page.js        # 25-question aptitude test
│   ├── career-recommendation/page.js# AI career explorer (105+ careers)
│   ├── career-details/[career]/     # Career detail pages
│   ├── courses/page.js              # Course catalog
│   ├── subjects/page.js             # Subject browser
│   ├── teachers/page.js             # Teacher listing + hire flow
│   ├── hire-tutor/[teacherId]/      # Hire tutor form
│   ├── appointments/page.js         # Appointment management
│   ├── quiz/
│   │   ├── [quizId]/page.js         # Quiz attempt
│   │   └── create/page.js           # Create quiz (teachers)
│   └── ratings/page.js              # Rating system
│
├── components/
│   ├── Navbar.js                    # Top navigation
│   ├── Sidebar.js                   # Left sidebar navigation
│   ├── DashboardLayout.js           # Layout wrapper with auth guard
│   ├── DashboardCard.js             # Metric cards
│   ├── CareerCard.js                # Career display card
│   ├── TeacherCard.js               # Teacher profile card
│   ├── CourseCard.js                # Course card
│   ├── SubjectCard.js               # Subject card
│   ├── AppointmentCard.js           # Appointment card
│   ├── ProfileCard.js               # User profile card
│   ├── QuizComponent.js             # Interactive quiz UI
│   ├── RatingComponent.js           # Star rating widget
│   └── SearchBar.js                 # Search + FilterPanel
│
├── services/
│   ├── api.js                       # Centralized API service
│   └── auth.js                      # JWT auth helpers
│
├── data/
│   ├── careers.js                   # 105+ career dataset
│   └── subjects.js                  # 20 subjects + aptitude questions
│
└── styles/
    └── globals.css                  # Global styles + CSS variables
```

---

## 🎯 Features

### Student Features
- **Aptitude Test** — 25 MCQs across 5 sections (Logic, Math, Science, Coding, Communication)
- **AI Career Recommendations** — Browse 105+ careers with salary, skills, degrees, universities
- **Career Details** — Roadmap, top universities in India, required skills
- **Course Enrollment** — Browse and enroll in courses
- **Find Tutors** — Browse by subject, filter by rating/price
- **Hire Tutor** — Send session request with message and preferred time
- **Appointments** — View confirmed sessions with meeting links
- **Quiz Attempts** — Take quizzes assigned by tutors
- **Rate Teachers** — 1-5 star ratings with feedback

### Teacher Features
- **Teacher Dashboard** — Stats on students, earnings, ratings
- **Subject Management** — Select subjects they teach
- **Appointment Management** — Accept/reject student requests
- **Send Meeting Links** — Google Meet, Zoom, Teams
- **Create Quizzes** — Build MCQ quizzes for students
- **View Ratings** — See student feedback

### Shared
- JWT authentication with role-based routing
- Responsive design (mobile + desktop)
- Indian context (₹ salary, Indian universities, 🇮🇳)
- 105+ career dataset with icons, colors, categories

---

## 🗂️ Career Dataset

Contains **105+ careers** organized in categories:
- Technology (Software, AI, Cloud, Blockchain, etc.)
- Engineering (Mechanical, Civil, Aerospace, EV, etc.)
- Medicine (Doctor, Dentist, Cardiologist, etc.)
- Government & Defense (IAS, IPS, Army, Navy, Air Force, etc.)
- Finance (CA, Investment Banking, CFA, etc.)
- Creative (Film, Design, Animation, etc.)
- Science (ISRO, Quantum Computing, Marine Biology, etc.)
- And many more...

---

## 🎨 Design

- **Color Palette**: Saffron orange (#ff7d10) + Navy blue (#1e2b89) — India flag inspired
- **Typography**: Plus Jakarta Sans
- **Animations**: Smooth slide-up transitions
- **Layout**: Fixed sidebar (260px) + scrollable main content

---

## 📡 API Endpoints

All endpoints are in `/services/api.js`:

| Service     | Endpoint Pattern              |
|-------------|-------------------------------|
| Auth        | `/api/auth/*`                 |
| Student     | `/api/student/*`              |
| Teacher     | `/api/teacher/*`              |
| Aptitude    | `/api/aptitude/*`             |
| Career      | `/api/career/*`               |
| Courses     | `/api/courses/*`              |
| Subjects    | `/api/subjects/*`             |
| Hire Tutor  | `/api/hire-tutor/*`           |
| Appointments| `/api/appointments/*`         |
| Quiz        | `/api/quiz/*`                 |
| Ratings     | `/api/ratings/*`              |

---

## 🔐 Authentication Guard

`DashboardLayout.js` automatically redirects to `/login` if no valid JWT token is present.

---

## 📝 Demo Credentials

Use these if your backend supports demo accounts:

- **Student**: `student@demo.com` / `password123`
- **Teacher**: `teacher@demo.com` / `password123`

---

## 🛠️ Customization

- Edit `data/careers.js` to add/modify careers
- Edit `data/subjects.js` to add subjects or aptitude questions
- Change base URL in `services/api.js` (`BASE_URL`)
- Modify theme colors in `styles/globals.css` (CSS variables)
