package com.careerpath.backend.controller;

import com.careerpath.backend.dto.QuizSubmitRequest;
import com.careerpath.backend.model.Quiz;
import com.careerpath.backend.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<?> createQuiz(
            @RequestBody Quiz quiz,
            Authentication auth) {
        return ResponseEntity.ok(quizService.createQuiz(auth.getName(), quiz));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuiz(@PathVariable String id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @GetMapping("/teacher")
    public ResponseEntity<?> getByTeacher(Authentication auth) {
        return ResponseEntity.ok(quizService.getQuizzesByTeacher(auth.getName()));
    }

    @GetMapping("/student")
    public ResponseEntity<?> getAllForStudent() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submit(
            @RequestBody QuizSubmitRequest request,
            Authentication auth) {
        return ResponseEntity.ok(quizService.submitQuiz(auth.getName(), request));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitById(
            @PathVariable String id,
            @RequestBody QuizSubmitRequest request,
            Authentication auth) {
        request.setQuizId(id);
        return ResponseEntity.ok(quizService.submitQuiz(auth.getName(), request));
    }

    @GetMapping("/results")
    public ResponseEntity<?> getMyResults(Authentication auth) {
        return ResponseEntity.ok(quizService.getStudentResults(auth.getName()));
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<?> getQuizResults(@PathVariable String id) {
        return ResponseEntity.ok(quizService.getQuizResults(id));
    }
}
