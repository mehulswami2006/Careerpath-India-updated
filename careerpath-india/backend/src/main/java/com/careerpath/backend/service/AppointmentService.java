package com.careerpath.backend.service;

import com.careerpath.backend.dto.AppointmentRequest;
import com.careerpath.backend.dto.MeetingLinkRequest;
import com.careerpath.backend.dto.TeacherScheduleRequest;
import com.careerpath.backend.model.Appointment;
import com.careerpath.backend.model.User;
import com.careerpath.backend.repository.AppointmentRepository;
import com.careerpath.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public Appointment createAppointment(String studentEmail, AppointmentRequest req) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        User teacher = userRepository.findByEmail(req.getTeacherEmail())
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + req.getTeacherEmail()));

        Appointment apt = new Appointment();
        apt.setStudentEmail(studentEmail);
        apt.setStudentName(student.getName());
        apt.setTeacherEmail(req.getTeacherEmail());
        apt.setTeacherName(teacher.getName());
        apt.setSubject(req.getSubject());
        apt.setDate(req.getDate());
        apt.setTime(req.getTime());
        apt.setDuration(req.getDuration() != null ? req.getDuration() : 60);
        apt.setType(req.getType() != null ? req.getType() : "Online");
        apt.setMessage(req.getMessage());
        apt.setStatus("PENDING");

        return appointmentRepository.save(apt);
    }

    /**
     * Teacher schedules a session for a student (e.g. after accepting a hire request).
     * Stored as CONFIRMED so both parties see an agreed session; optional meeting link.
     */
    public Appointment createAppointmentByTeacher(String teacherAuthEmail, TeacherScheduleRequest req) {
        if (req.getStudentEmail() == null || req.getStudentEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "studentEmail is required");
        }
        if (req.getDate() == null || req.getDate().isBlank() || req.getTime() == null || req.getTime().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "date and time are required");
        }

        User teacher = userRepository.findByEmail(teacherAuthEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));
        if (!"TEACHER".equals(teacher.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only teachers can schedule this way");
        }

        User student = userRepository.findByEmail(req.getStudentEmail().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        if (!"STUDENT".equals(student.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Target user is not a student");
        }

        Appointment apt = new Appointment();
        apt.setStudentEmail(student.getEmail());
        apt.setStudentName(student.getName());
        apt.setTeacherEmail(teacher.getEmail());
        apt.setTeacherName(teacher.getName());
        apt.setSubject(req.getSubject() != null ? req.getSubject() : "Session");
        apt.setDate(req.getDate());
        apt.setTime(req.getTime());
        apt.setDuration(req.getDuration() != null ? req.getDuration() : 60);
        apt.setType(req.getType() != null ? req.getType() : "Online");
        apt.setMessage(req.getMessage());
        apt.setStatus("CONFIRMED");
        if (req.getMeetingLink() != null && !req.getMeetingLink().isBlank()) {
            apt.setMeetingLink(req.getMeetingLink().trim());
        }

        return appointmentRepository.save(apt);
    }

    public List<Appointment> getStudentAppointments(String email) {
        return appointmentRepository.findByStudentEmail(email);
    }

    public List<Appointment> getTeacherAppointments(String email) {
        return appointmentRepository.findByTeacherEmail(email);
    }

    public Appointment confirm(String id) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
        apt.setStatus("CONFIRMED");
        return appointmentRepository.save(apt);
    }

    public Appointment reject(String id) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
        apt.setStatus("REJECTED");
        return appointmentRepository.save(apt);
    }

    public Appointment addMeetingLink(String id, MeetingLinkRequest req) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
        apt.setMeetingLink(req.getLink());
        return appointmentRepository.save(apt);
    }

    public Appointment cancel(String id) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
        apt.setStatus("CANCELLED");
        return appointmentRepository.save(apt);
    }

    public Appointment complete(String id) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
        apt.setStatus("COMPLETED");
        return appointmentRepository.save(apt);
    }
}
