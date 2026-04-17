package com.careerpath.backend.controller;

import com.careerpath.backend.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<?> getAllCourses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String career) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(courseService.getCoursesByCategory(category));
        }
        if (career != null && !career.isBlank()) {
            return ResponseEntity.ok(courseService.getCoursesByCategory(career));
        }
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable String id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PostMapping("/enroll")
    public ResponseEntity<?> enroll(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String courseId = body.get("courseId");
        return ResponseEntity.ok(courseService.enrollStudent(courseId, auth.getName()));
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<?> enrollById(
            @PathVariable String courseId,
            Authentication auth) {
        return ResponseEntity.ok(courseService.enrollStudent(courseId, auth.getName()));
    }

    @GetMapping("/enrolled")
    public ResponseEntity<?> getEnrolledCourses(Authentication auth) {
        return ResponseEntity.ok(courseService.getStudentCourses(auth.getName()));
    }
}
