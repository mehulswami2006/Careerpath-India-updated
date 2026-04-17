# CareerPath India — Spring Boot Backend

## Quick Start

```bash
# 1. Start MongoDB
mongod --dbpath /data/db

# 2. Run the backend
mvn spring-boot:run

# Server starts at http://localhost:8080
# MongoDB: careerpathdb (auto-created)
# Demo data auto-loaded on first run
```

## Demo Credentials
| Role    | Email               | Password    |
|---------|---------------------|-------------|
| Student | student@demo.com    | password123 |
| Teacher | teacher@demo.com    | password123 |
| Teacher | teacher2@demo.com   | password123 |

## API Reference

### Auth (public)
```
POST /api/auth/register    Body: { name, email, password, role }
POST /api/auth/login       Body: { email, password }
GET  /api/auth/profile     Header: Authorization: Bearer <token>
```

### Student
```
GET  /api/student/profile
GET  /api/student/dashboard
PUT  /api/student/profile
```

### Teacher
```
GET  /api/teacher/profile
GET  /api/teacher/dashboard
PUT  /api/teacher/profile
PUT  /api/teacher/subjects    Body: { subjects: [...] }
GET  /api/teacher?subject=CS
GET  /api/teacher/all
```

### Aptitude
```
POST /api/aptitude/submit      Body: { score, total, sectionScores }
GET  /api/aptitude/result
GET  /api/aptitude/score
GET  /api/aptitude/recommendations
```

### Careers (public)
```
GET  /api/careers
GET  /api/careers?category=Technology
GET  /api/careers?search=engineer
GET  /api/careers/{careerName}
```

### Courses
```
GET  /api/courses
GET  /api/courses/{id}
GET  /api/courses/enrolled
POST /api/courses/{id}/enroll
```

### Subjects (public)
```
GET /api/subjects
GET /api/subjects/{subject}/teachers
```

### Hire Tutor
```
POST /api/hire-tutor/{teacherId}/request   Body: { subject, message, sessionType, preferredDate }
GET  /api/hire-tutor/student/requests
GET  /api/hire-tutor/teacher/requests
PUT  /api/hire-tutor/{id}/accept
PUT  /api/hire-tutor/{id}/reject
```

### Appointments
```
POST /api/appointments         Body: { teacherEmail, subject, date, time, duration, type, message }
GET  /api/appointments
GET  /api/appointments/student
GET  /api/appointments/teacher
PUT  /api/appointments/{id}/confirm
PUT  /api/appointments/{id}/reject
PUT  /api/appointments/{id}/meeting-link   Body: { link }
PUT  /api/appointments/{id}/complete
DELETE /api/appointments/{id}/cancel
```

### Quiz
```
POST /api/quiz              Body: { title, subject, questions: [...] }
GET  /api/quiz/teacher
GET  /api/quiz/student
GET  /api/quiz/{id}
POST /api/quiz/{id}/submit  Body: { quizId, answers, score, total, percentage }
GET  /api/quiz/results
```

### Ratings
```
POST /api/ratings                      Body: { teacherEmail, rating, feedback, subject }
POST /api/ratings/teacher/{email}
GET  /api/ratings/teacher/{email}
GET  /api/ratings/my
```

## MongoDB Collections
- users
- aptitude_results
- careers
- courses
- hire_requests
- appointments
- quizzes
- quiz_results
- ratings

## Tech Stack
- Java 17
- Spring Boot 3.2.3
- Spring Security + JWT (jjwt 0.12.3)
- Spring Data MongoDB
- Lombok
- Bean Validation

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 8080 in use | `lsof -ti:8080 \| xargs kill` |
| MongoDB not connecting | Ensure MongoDB running: `mongod` |
| Lombok errors | Enable annotation processing in your IDE |
| JWT 401 errors | Token may be expired — re-login |
| CORS error | Frontend must run at http://localhost:3000 |
