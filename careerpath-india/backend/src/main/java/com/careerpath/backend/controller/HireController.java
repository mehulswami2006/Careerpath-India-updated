package com.careerpath.backend.controller;

import com.careerpath.backend.dto.HireRequest;
import com.careerpath.backend.service.HireService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class HireController {

    private final HireService hireService;

    // ── /api/hire/* ──────────────────────────────────────────────────────────

    @PostMapping("/api/hire/request")
    public ResponseEntity<?> sendRequest(
            @RequestBody HireRequest request,
            Authentication auth) {
        return ResponseEntity.ok(hireService.sendRequest(auth.getName(), request));
    }

    @GetMapping("/api/hire/requests")
    public ResponseEntity<?> getRequests(Authentication auth) {
        String role = extractRole(auth);
        return ResponseEntity.ok(hireService.getRequestsForUser(auth.getName(), role));
    }

    @GetMapping("/api/hire/student/requests")
    public ResponseEntity<?> getStudentRequests(Authentication auth) {
        return ResponseEntity.ok(hireService.getStudentRequests(auth.getName()));
    }

    @GetMapping("/api/hire/teacher/requests")
    public ResponseEntity<?> getTeacherRequests(Authentication auth) {
        return ResponseEntity.ok(hireService.getTeacherRequests(auth.getName()));
    }

    @PutMapping("/api/hire/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(hireService.updateStatus(id, "ACCEPTED", auth.getName()));
    }

    @PutMapping("/api/hire/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(hireService.updateStatus(id, "REJECTED", auth.getName()));
    }

    // ── /api/hire-tutor/* ────────────────────────────────────────────────────
    // Matches the frontend's hireTutorAPI paths

    @PostMapping("/api/hire-tutor/{teacherId}/request")
    public ResponseEntity<?> sendRequestByTeacherId(
            @PathVariable String teacherId,
            @RequestBody HireRequest request,
            Authentication auth) {
        request.setTeacherEmail(teacherId);
        return ResponseEntity.ok(hireService.sendRequest(auth.getName(), request));
    }

    @GetMapping("/api/hire-tutor/student/requests")
    public ResponseEntity<?> studentRequests(Authentication auth) {
        return ResponseEntity.ok(hireService.getStudentRequests(auth.getName()));
    }

    @GetMapping("/api/hire-tutor/teacher/requests")
    public ResponseEntity<?> teacherRequests(Authentication auth) {
        return ResponseEntity.ok(hireService.getTeacherRequests(auth.getName()));
    }

    @PutMapping("/api/hire-tutor/{id}/accept")
    public ResponseEntity<?> acceptTutor(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(hireService.updateStatus(id, "ACCEPTED", auth.getName()));
    }

    @PutMapping("/api/hire-tutor/{id}/reject")
    public ResponseEntity<?> rejectTutor(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(hireService.updateStatus(id, "REJECTED", auth.getName()));
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private String extractRole(Authentication auth) {
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("STUDENT");
    }
}
