# 🎓 CareerPath India — Full Stack Application

**AI-powered Career Guidance and Tutor Hiring Platform for India**

---

## 📦 Project Structure

```
careerpath-india/
├── backend/                   ← Spring Boot 3 + MongoDB + JWT
│   ├── src/main/java/...
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── career-guidance-frontend/  ← Next.js 14 + TailwindCSS
│   ├── app/                   (15 pages)
│   ├── components/            (14 components)
│   ├── services/              (api.js + auth.js)
│   ├── data/                  (careers.js + subjects.js)
│   └── package.json
│
└── README.md
```

---

## 🚀 Running the Full Stack

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MongoDB 6+ (local or Docker)

### Step 1 — Start MongoDB
Data is persisted on disk under MongoDB’s configured data directory. Stopping and restarting `mongod` with the same `--dbpath` does **not** erase your database. The backend uses database `careerpathdb` (see `backend/src/main/resources/application.properties`).

```bash
# Option A: Local
mongod --dbpath /data/db

# Option B: Docker (add a named volume so data survives container removal)
docker run -d -p 27017:27017 -v mongodb_data:/data/db --name mongodb mongo:latest
```

Demo users and seed careers/courses are loaded only when those collections are empty (first run), so normal registrations and tutor hire requests persist across restarts.

### Step 2 — Start Backend
```bash
cd backend
mvn spring-boot:run
# Runs at http://localhost:8080
# Auto-loads 65+ careers, 12 courses, 3 demo users
```

### Step 3 — Start Frontend
```bash
cd career-guidance-frontend
npm install
npm run dev
# Runs at http://localhost:3000
```

### Step 4 — Open Browser
```
http://localhost:3000
```

---

## 🔐 Demo Credentials

| Role    | Email               | Password    |
|---------|---------------------|-------------|
| Student | student@demo.com    | password123 |
| Teacher | teacher@demo.com    | password123 |

---

## 🏗️ Architecture

```
Browser (Next.js 14)
        │  HTTP + JWT Bearer Token
        ▼
Spring Boot 3 (port 8080)
        │
        ├── Spring Security (JWT Filter)
        ├── Controllers (11 modules)
        ├── Services (business logic)
        └── Repositories
                │
                ▼
        MongoDB (port 27017)
        Database: careerpathdb
        Collections: users, careers, courses,
                     appointments, hire_requests,
                     quizzes, quiz_results,
                     aptitude_results, ratings
```

---

## ✨ Features

### Student
- Aptitude test (25 MCQs, 5 sections) with AI career recommendations
- Browse 65+ careers with roadmap, salary, universities
- Enroll in courses (free & paid)
- Find tutors by subject, hire with one click
- Book appointments, join via Google Meet / Zoom / Teams
- Attempt quizzes with score breakdown
- Rate tutors (1–5 stars)

### Teacher
- Dashboard with students, earnings, ratings stats
- Select subjects to teach
- Accept / reject hire requests
- Confirm appointments and send meeting links
- Create MCQ quizzes for students
- View all ratings and feedback

---

## 🛠️ Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Next.js 14, TailwindCSS, Fetch API      |
| Backend   | Spring Boot 3.2, Spring Security        |
| Auth      | JWT (jjwt 0.12.3), BCrypt               |
| Database  | MongoDB 6+                              |
| Language  | Java 17 (backend), JavaScript (frontend)|
