package com.careerpath.backend.service;

import com.careerpath.backend.dto.UpdateProfileRequest;
import com.careerpath.backend.model.Appointment;
import com.careerpath.backend.model.HireRequestModel;
import com.careerpath.backend.model.Rating;
import com.careerpath.backend.model.User;
import com.careerpath.backend.repository.AppointmentRepository;
import com.careerpath.backend.repository.HireRequestRepository;
import com.careerpath.backend.repository.RatingRepository;
import com.careerpath.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.OptionalDouble;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final HireRequestRepository hireRequestRepository;
    private final RatingRepository ratingRepository;

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }

    public User updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (request.getName() != null)          user.setName(request.getName());
        if (request.getPhone() != null)         user.setPhone(request.getPhone());
        if (request.getBio() != null)           user.setBio(request.getBio());
        if (request.getCity() != null)          user.setCity(request.getCity());
        if (request.getQualification() != null) user.setQualification(request.getQualification());
        if (request.getExperience() != null)    user.setExperience(request.getExperience());
        if (request.getHourlyRate() != null)    user.setHourlyRate(request.getHourlyRate());
        if (request.getSubjects() != null)      user.setSubjects(request.getSubjects());

        return userRepository.save(user);
    }

    public Map<String, Object> getDashboard(String email) {
        Map<String, Object> dashboard = new HashMap<>();

        // Appointments
        List<Appointment> appointments = appointmentRepository.findByTeacherEmail(email);
        dashboard.put("totalAppointments", appointments.size());

        long confirmed = appointments.stream()
            .filter(a -> "CONFIRMED".equals(a.getStatus())).count();
        long completed = appointments.stream()
            .filter(a -> "COMPLETED".equals(a.getStatus())).count();
        dashboard.put("confirmedAppointments", confirmed);
        dashboard.put("completedAppointments", completed);

        // Pending hire requests
        List<HireRequestModel> hireRequests = hireRequestRepository.findByTeacherEmail(email);
        long pending = hireRequests.stream()
            .filter(r -> "PENDING".equals(r.getStatus())).count();
        dashboard.put("pendingRequests", pending);
        dashboard.put("totalHireRequests", hireRequests.size());

        // Unique students
        Set<String> students = new HashSet<>();
        appointments.forEach(a -> {
            if (a.getStudentEmail() != null) students.add(a.getStudentEmail());
        });
        dashboard.put("totalStudents", students.size());

        // Ratings
        List<Rating> ratings = ratingRepository.findByTeacherEmail(email);
        OptionalDouble avg = ratings.stream()
            .mapToInt(Rating::getRating)
            .average();
        double avgRating = avg.isPresent() ? Math.round(avg.getAsDouble() * 10.0) / 10.0 : 0.0;
        dashboard.put("rating", avgRating);
        dashboard.put("totalRatings", ratings.size());

        // Estimated earnings (hourlyRate × confirmed sessions × avg 1hr)
        User teacher = userRepository.findByEmail(email).orElse(null);
        if (teacher != null && teacher.getHourlyRate() != null) {
            dashboard.put("totalEarnings", teacher.getHourlyRate() * completed);
        } else {
            dashboard.put("totalEarnings", 0);
        }

        return dashboard;
    }

    public User updateSubjects(String email, List<String> subjects) {
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        teacher.setSubjects(subjects);
        return userRepository.save(teacher);
    }

    public List<User> getTeachersBySubject(String subject) {
        return userRepository.findByRoleAndSubjectsContaining("TEACHER", subject);
    }

    public List<User> getAllTeachers() {
        return userRepository.findByRole("TEACHER");
    }
}
