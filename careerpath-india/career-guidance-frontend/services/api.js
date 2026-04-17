import { getToken, removeToken } from './auth';

const BASE_URL = 'http://localhost:8080';

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// AUTH
export const authAPI = {
  login: (data) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/api/auth/profile'),
};

// STUDENT
export const studentAPI = {
  getDashboard: () => request('/api/student/dashboard'),
  getProfile: (id) => request(`/api/student/${id}/profile`),
  updateProfile: (id, data) => request(`/api/student/profile`, { method: 'PUT', body: JSON.stringify(data) }),
  getEnrolledCourses: () => request('/api/student/courses'),
  getQuizResults: () => request('/api/student/quiz-results'),
};

// TEACHER
export const teacherAPI = {
  getDashboard: () => request('/api/teacher/dashboard'),
  getProfile: (id) => request(`/api/teacher/${id}/profile`),
  updateProfile: (id, data) => request(`/api/teacher/profile`, { method: 'PUT', body: JSON.stringify(data) }),
  getBySubject: (subject) => request(`/api/teacher?subject=${encodeURIComponent(subject)}`),
  getAllTeachers: () => request('/api/teacher/all'),
  updateSubjects: (subjects) => request('/api/teacher/subjects', { method: 'PUT', body: JSON.stringify({ subjects }) }),
};

// APTITUDE
export const aptitudeAPI = {
  getQuestions: () => request('/api/aptitude/questions'),
  submitTest: (data) => request('/api/aptitude/submit', { method: 'POST', body: JSON.stringify(data) }),
  getScore: () => request('/api/aptitude/score'),
};

// CAREER
export const careerAPI = {
  getRecommendations: () => request('/api/career/recommendations'),
  getCareerDetails: (career) => request(`/api/career/${encodeURIComponent(career)}`),
  getAllCareers: () => request('/api/career/all'),
};

// COURSES
export const courseAPI = {
  getAll: () => request('/api/courses'),
  getByCareer: (career) => request(`/api/courses?career=${encodeURIComponent(career)}`),
  getCourseById: (id) => request(`/api/courses/${id}`),
  enroll: (courseId) => request(`/api/courses/${courseId}/enroll`, { method: 'POST' }),
};

// SUBJECTS
export const subjectAPI = {
  getAll: () => request('/api/subjects'),
  getTeachersBySubject: (subject) => request(`/api/subjects/${encodeURIComponent(subject)}/teachers`),
};

// HIRE TUTOR
export const hireTutorAPI = {
  sendRequest: (teacherId, data) => request(`/api/hire-tutor/${teacherId}/request`, { method: 'POST', body: JSON.stringify(data) }),
  getStudentRequests: () => request('/api/hire-tutor/student/requests'),
  getTeacherRequests: () => request('/api/hire-tutor/teacher/requests'),
  acceptRequest: (requestId) => request(`/api/hire-tutor/${requestId}/accept`, { method: 'PUT' }),
  rejectRequest: (requestId) => request(`/api/hire-tutor/${requestId}/reject`, { method: 'PUT' }),
};

// APPOINTMENTS
export const appointmentAPI = {
  create: (data) => request('/api/appointments', { method: 'POST', body: JSON.stringify(data) }),
  /** Teacher sets session for a student after accepting a hire (CONFIRMED + optional meeting link) */
  createTeacherSchedule: (data) => request('/api/appointments/teacher-schedule', { method: 'POST', body: JSON.stringify(data) }),
  getStudentAppointments: () => request('/api/appointments/student'),
  getTeacherAppointments: () => request('/api/appointments/teacher'),
  confirm: (id) => request(`/api/appointments/${id}/confirm`, { method: 'PUT' }),
  sendMeetingLink: (id, link) => request(`/api/appointments/${id}/meeting-link`, { method: 'PUT', body: JSON.stringify({ link }) }),
  cancel: (id) => request(`/api/appointments/${id}/cancel`, { method: 'DELETE' }),
};

// QUIZ
export const quizAPI = {
  getByTeacher: () => request('/api/quiz/teacher'),
  getByStudent: () => request('/api/quiz/student'),
  getQuizById: (id) => request(`/api/quiz/${id}`),
  submitQuiz: (id, answers) => request(`/api/quiz/${id}/submit`, { method: 'POST', body: JSON.stringify({ answers }) }),
  createQuiz: (data) => request('/api/quiz', { method: 'POST', body: JSON.stringify(data) }),
};

// RATINGS
export const ratingAPI = {
  rateTeacher: (teacherId, data) => request(`/api/ratings/teacher/${teacherId}`, { method: 'POST', body: JSON.stringify(data) }),
  rateStudent: (studentId, data) => request(`/api/ratings/student/${studentId}`, { method: 'POST', body: JSON.stringify(data) }),
  getTeacherRatings: (teacherId) => request(`/api/ratings/teacher/${teacherId}`),
};

export default {
  auth: authAPI,
  student: studentAPI,
  teacher: teacherAPI,
  aptitude: aptitudeAPI,
  career: careerAPI,
  course: courseAPI,
  subject: subjectAPI,
  hireTutor: hireTutorAPI,
  appointment: appointmentAPI,
  quiz: quizAPI,
  rating: ratingAPI,
};
