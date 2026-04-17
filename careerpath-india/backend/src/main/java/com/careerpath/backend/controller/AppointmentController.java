package com.careerpath.backend.controller;

import com.careerpath.backend.dto.AppointmentRequest;
import com.careerpath.backend.dto.MeetingLinkRequest;
import com.careerpath.backend.dto.TeacherScheduleRequest;
import com.careerpath.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody AppointmentRequest request,
            Authentication auth) {
        return ResponseEntity.ok(appointmentService.createAppointment(auth.getName(), request));
    }

    @PostMapping("/teacher-schedule")
    public ResponseEntity<?> createByTeacher(
            @RequestBody TeacherScheduleRequest request,
            Authentication auth) {
        return ResponseEntity.ok(appointmentService.createAppointmentByTeacher(auth.getName(), request));
    }

    @GetMapping
    public ResponseEntity<?> getAll(Authentication auth) {
        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("STUDENT");
        if ("TEACHER".equals(role)) {
            return ResponseEntity.ok(appointmentService.getTeacherAppointments(auth.getName()));
        }
        return ResponseEntity.ok(appointmentService.getStudentAppointments(auth.getName()));
    }

    @GetMapping("/student")
    public ResponseEntity<?> getStudentAppointments(Authentication auth) {
        return ResponseEntity.ok(appointmentService.getStudentAppointments(auth.getName()));
    }

    @GetMapping("/teacher")
    public ResponseEntity<?> getTeacherAppointments(Authentication auth) {
        return ResponseEntity.ok(appointmentService.getTeacherAppointments(auth.getName()));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.confirm(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.reject(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.complete(id));
    }

    @PutMapping("/{id}/meeting-link")
    public ResponseEntity<?> addMeetingLink(
            @PathVariable String id,
            @RequestBody MeetingLinkRequest request) {
        return ResponseEntity.ok(appointmentService.addMeetingLink(id, request));
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.cancel(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.cancel(id));
    }
}
