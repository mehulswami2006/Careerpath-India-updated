const BASE_URL = "http://localhost:8080";

// ── Token helpers ────────────────────────────────────────────────────────────
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt_token");
}

export function setToken(token) {
  localStorage.setItem("jwt_token", token);
}

export function removeToken() {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_id");
}

export function getRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_role");
}

export function setUserInfo({ role, name, email, id }) {
  if (role)  localStorage.setItem("user_role", role);
  if (name)  localStorage.setItem("user_name", name);
  if (email) localStorage.setItem("user_email", email);
  if (id)    localStorage.setItem("user_id", String(id));
}

export function getUserInfo() {
  if (typeof window === "undefined") return {};
  return {
    role:  localStorage.getItem("user_role"),
    name:  localStorage.getItem("user_name"),
    email: localStorage.getItem("user_email"),
    id:    localStorage.getItem("user_id"),
  };
}

// ── Core fetch ───────────────────────────────────────────────────────────────
async function request(path, method = "GET", body = null, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);

  if (res.status === 401) {
    removeToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) throw new Error(data?.message || data || `HTTP ${res.status}`);
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login:    (body) => request("/api/auth/login",    "POST", body, false),
  register: (body) => request("/api/auth/register", "POST", body, false),
};

// ── Student ──────────────────────────────────────────────────────────────────
export const studentApi = {
  getProfile:          ()           => request("/api/students/profile"),
  getDashboard:        ()           => request("/api/students/dashboard"),
  getEnrolledCourses:  ()           => request("/api/students/courses"),
  enrollCourse:        (courseId)   => request(`/api/students/courses/${courseId}/enroll`, "POST"),
  getRecommendations:  ()           => request("/api/students/recommendations"),
  getAppointments:     ()           => request("/api/students/appointments"),
  getQuizResults:      ()           => request("/api/students/quiz-results"),
};

// ── Teacher ──────────────────────────────────────────────────────────────────
export const teacherApi = {
  getProfile:          ()             => request("/api/teachers/profile"),
  getDashboard:        ()             => request("/api/teachers/dashboard"),
  getCourses:          ()             => request("/api/teachers/courses"),
  selectCourse:        (courseId)     => request(`/api/teachers/courses/${courseId}/select`, "POST"),
  getHiringRequests:   ()             => request("/api/teachers/hiring-requests"),
  respondHiring:       (id, action)   => request(`/api/teachers/hiring-requests/${id}/${action}`, "PUT"),
  getAppointments:     ()             => request("/api/teachers/appointments"),
  sendMeetingLink:     (id, link)     => request(`/api/teachers/appointments/${id}/meeting-link`, "PUT", { link }),
  finishMeeting:       (id)           => request(`/api/teachers/appointments/${id}/finish`, "PUT"),
  getStudents:         ()             => request("/api/teachers/students"),
  rateStudent:         (id, body)     => request(`/api/teachers/students/${id}/rate`, "POST", body),
  createQuiz:          (body)         => request("/api/quizzes", "POST", body),
  getQuizResults:      ()             => request("/api/teachers/quiz-results"),
  getRatings:          ()             => request("/api/teachers/ratings"),
};

// ── Courses ──────────────────────────────────────────────────────────────────
export const courseApi = {
  getAll:      (params) => request(`/api/courses${params ? "?" + new URLSearchParams(params) : ""}`),
  getById:     (id)     => request(`/api/courses/${id}`),
  getForCareer:(career) => request(`/api/courses?career=${encodeURIComponent(career)}`),
};

// ── Aptitude / Career ─────────────────────────────────────────────────────────
export const aptitudeApi = {
  getQuestions:   ()     => request("/api/aptitude/questions"),
  submitTest:     (body) => request("/api/aptitude/submit", "POST", body),
  getRecommended: ()     => request("/api/career/recommendations"),
  getCareerDetail:(name) => request(`/api/career/${encodeURIComponent(name)}`),
};

// ── Hire Teacher ─────────────────────────────────────────────────────────────
export const hireApi = {
  searchTeachers: (params) => request(`/api/teachers?${new URLSearchParams(params)}`),
  getTeacher:     (id)     => request(`/api/teachers/${id}`),
  sendRequest:    (body)   => request("/api/hiring-requests", "POST", body),
};

// ── Quiz ─────────────────────────────────────────────────────────────────────
export const quizApi = {
  getAll:     ()     => request("/api/quizzes"),
  getById:    (id)   => request(`/api/quizzes/${id}`),
  submit:     (id, body) => request(`/api/quizzes/${id}/submit`, "POST", body),
};

// ── Ratings ──────────────────────────────────────────────────────────────────
export const ratingApi = {
  rateTeacher: (teacherId, body) => request(`/api/teachers/${teacherId}/rate`, "POST", body),
};
