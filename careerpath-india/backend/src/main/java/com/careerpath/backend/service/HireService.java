package com.careerpath.backend.service;

import com.careerpath.backend.dto.HireRequest;
import com.careerpath.backend.model.HireRequestModel;
import com.careerpath.backend.model.User;
import com.careerpath.backend.repository.HireRequestRepository;
import com.careerpath.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HireService {

    private final HireRequestRepository hireRequestRepository;
    private final UserRepository userRepository;

    /**
     * Resolves MongoDB user id or email to the teacher's email for hire_requests.teacherEmail.
     */
    public String resolveTeacherEmail(String teacherIdOrEmail) {
        if (teacherIdOrEmail == null || teacherIdOrEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Teacher is required");
        }
        User teacher = userRepository.findById(teacherIdOrEmail)
                .or(() -> userRepository.findByEmail(teacherIdOrEmail))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));
        if (!"TEACHER".equals(teacher.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a teacher");
        }
        return teacher.getEmail();
    }

    public HireRequestModel sendRequest(String studentEmail, HireRequest request) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String teacherEmail = resolveTeacherEmail(request.getTeacherEmail());

        HireRequestModel hire = new HireRequestModel();
        hire.setStudentEmail(studentEmail);
        hire.setStudentName(student.getName());
        hire.setTeacherEmail(teacherEmail);
        hire.setSubject(request.getSubject());
        hire.setMessage(request.getMessage());
        hire.setSessionType(request.getSessionType() != null ? request.getSessionType() : "Online");
        hire.setPreferredDate(request.getPreferredDate());
        hire.setPreferredTime(request.getPreferredTime());
        hire.setStatus("PENDING");

        return hireRequestRepository.save(hire);
    }

    public List<HireRequestModel> getStudentRequests(String email) {
        return hireRequestRepository.findByStudentEmail(email);
    }

    public List<HireRequestModel> getTeacherRequests(String email) {
        return hireRequestRepository.findByTeacherEmail(email);
    }

    public List<HireRequestModel> getRequestsForUser(String email, String role) {
        if ("TEACHER".equals(role)) {
            return hireRequestRepository.findByTeacherEmail(email);
        }
        return hireRequestRepository.findByStudentEmail(email);
    }

    public HireRequestModel updateStatus(String id, String status, String teacherEmail) {
        HireRequestModel hire = hireRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hire request not found: " + id));
        if (teacherEmail == null || !teacherEmail.equalsIgnoreCase(hire.getTeacherEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the assigned teacher can update this request");
        }
        hire.setStatus(status);
        return hireRequestRepository.save(hire);
    }
}
