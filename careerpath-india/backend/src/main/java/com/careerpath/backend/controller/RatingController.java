package com.careerpath.backend.controller;

import com.careerpath.backend.dto.RatingRequest;
import com.careerpath.backend.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<?> rateTeacher(
            @RequestBody RatingRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ratingService.rateTeacher(auth.getName(), request));
    }

    @PostMapping("/teacher/{teacherEmail}")
    public ResponseEntity<?> rateTeacherByEmail(
            @PathVariable String teacherEmail,
            @RequestBody RatingRequest request,
            Authentication auth) {
        request.setTeacherEmail(teacherEmail);
        return ResponseEntity.ok(ratingService.rateTeacher(auth.getName(), request));
    }

    @GetMapping("/teacher/{teacherEmail}")
    public ResponseEntity<?> getTeacherRatings(@PathVariable String teacherEmail) {
        return ResponseEntity.ok(ratingService.getTeacherRatings(teacherEmail));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyRatings(Authentication auth) {
        return ResponseEntity.ok(ratingService.getStudentRatings(auth.getName()));
    }
}
