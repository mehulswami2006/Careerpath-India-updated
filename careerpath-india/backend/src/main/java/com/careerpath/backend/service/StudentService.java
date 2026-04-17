package com.careerpath.backend.service;

import com.careerpath.backend.dto.UpdateProfileRequest;
import com.careerpath.backend.model.Appointment;
import com.careerpath.backend.model.Course;
import com.careerpath.backend.model.QuizResult;
import com.careerpath.backend.model.User;
import com.careerpath.backend.repository.AppointmentRepository;
import com.careerpath.backend.repository.AptitudeResultRepository;
import com.careerpath.backend.repository.CourseRepository;
import com.careerpath.backend.repository.QuizResultRepository;
import com.careerpath.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final AptitudeResultRepository aptitudeResultRepository;
    private final AppointmentRepository appointmentRepository;
    private final QuizResultRepository quizResultRepository;
    private final CourseRepository courseRepository;

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public User updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getCity() != null) user.setCity(request.getCity());

        return userRepository.save(user);
    }

    public Map<String, Object> getDashboard(String email) {
        Map<String, Object> dashboard = new HashMap<>();

        // Aptitude score
        aptitudeResultRepository
            .findTopByUserEmailOrderByCreatedAtDesc(email)
            .ifPresent(r -> {
                dashboard.put("aptitudeScore", r.getScore());
                dashboard.put("categoryScores", r.getCategoryScores());
            });

        // Appointments pending
        List<Appointment> allAppointments = appointmentRepository.findByStudentEmail(email);
        long pending = allAppointments.stream()
            .filter(a -> "PENDING".equals(a.getStatus())).count();
        long confirmed = allAppointments.stream()
            .filter(a -> "CONFIRMED".equals(a.getStatus())).count();
        dashboard.put("appointmentsPending", pending);
        dashboard.put("appointmentsConfirmed", confirmed);
        dashboard.put("totalAppointments", allAppointments.size());

        // Quiz results
        List<QuizResult> quizResults = quizResultRepository.findByStudentEmail(email);
        dashboard.put("quizCompleted", quizResults.size());
        if (!quizResults.isEmpty()) {
            double avgScore = quizResults.stream()
                .filter(r -> r.getPercentage() != null)
                .mapToInt(QuizResult::getPercentage)
                .average()
                .orElse(0.0);
            dashboard.put("averageQuizScore", Math.round(avgScore));
        }

        // Enrolled courses
        List<Course> allCourses = courseRepository.findAll();
        long enrolled = allCourses.stream()
            .filter(c -> c.getEnrolledStudents() != null
                && c.getEnrolledStudents().contains(email))
            .count();
        dashboard.put("coursesEnrolled", enrolled);

        // Total XP points
        int xp = (quizResults.size() * 100) + ((int) enrolled * 50) + (pending > 0 ? 25 : 0);
        dashboard.put("totalPoints", xp);

        return dashboard;
    }
}
