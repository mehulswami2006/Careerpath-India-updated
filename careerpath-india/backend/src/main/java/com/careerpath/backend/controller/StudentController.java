package com.careerpath.backend.controller;

import com.careerpath.backend.dto.UpdateProfileRequest;
import com.careerpath.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        return ResponseEntity.ok(studentService.getProfile(auth.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication auth) {
        return ResponseEntity.ok(studentService.updateProfile(auth.getName(), request));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Authentication auth) {
        return ResponseEntity.ok(studentService.getDashboard(auth.getName()));
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getEnrolledCourses(Authentication auth) {
        // Delegate to course service via student service
        return ResponseEntity.ok(studentService.getDashboard(auth.getName()));
    }
}
