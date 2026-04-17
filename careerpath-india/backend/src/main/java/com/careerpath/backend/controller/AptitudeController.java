package com.careerpath.backend.controller;

import com.careerpath.backend.dto.AptitudeSubmitRequest;
import com.careerpath.backend.service.AptitudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aptitude")
@RequiredArgsConstructor
public class AptitudeController {

    private final AptitudeService aptitudeService;

    @PostMapping("/submit")
    public ResponseEntity<?> submit(
            @RequestBody AptitudeSubmitRequest request,
            Authentication auth) {
        return ResponseEntity.ok(aptitudeService.submitResult(auth.getName(), request));
    }

    @GetMapping("/result")
    public ResponseEntity<?> getResult(Authentication auth) {
        return aptitudeService.getLatestResult(auth.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/score")
    public ResponseEntity<?> getScore(Authentication auth) {
        return aptitudeService.getLatestResult(auth.getName())
                .map(r -> ResponseEntity.ok(
                    java.util.Map.of(
                        "score", r.getScore(),
                        "total", r.getTotalQuestions(),
                        "categoryScores", r.getCategoryScores() != null ? r.getCategoryScores() : java.util.Map.of()
                    )
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(Authentication auth) {
        return ResponseEntity.ok(aptitudeService.getRecommendations(auth.getName()));
    }
}
