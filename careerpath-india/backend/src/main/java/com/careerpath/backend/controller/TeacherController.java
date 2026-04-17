package com.careerpath.backend.controller;

import com.careerpath.backend.dto.UpdateProfileRequest;
import com.careerpath.backend.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        return ResponseEntity.ok(teacherService.getProfile(auth.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication auth) {
        return ResponseEntity.ok(teacherService.updateProfile(auth.getName(), request));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Authentication auth) {
        return ResponseEntity.ok(teacherService.getDashboard(auth.getName()));
    }

    @PutMapping("/subjects")
    public ResponseEntity<?> updateSubjects(
            @RequestBody Map<String, List<String>> body,
            Authentication auth) {
        List<String> subjects = body.get("subjects");
        return ResponseEntity.ok(teacherService.updateSubjects(auth.getName(), subjects));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping
    public ResponseEntity<?> getTeachers(
            @RequestParam(required = false) String subject) {
        if (subject != null && !subject.isBlank()) {
            return ResponseEntity.ok(teacherService.getTeachersBySubject(subject));
        }
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }
}
