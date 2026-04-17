package com.careerpath.backend.controller;

import com.careerpath.backend.service.CareerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/careers")
@RequiredArgsConstructor
public class CareerController {

    private final CareerService careerService;

    @GetMapping
    public ResponseEntity<?> getAllCareers(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(careerService.searchCareers(search));
        }
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(careerService.getCareersByCategory(category));
        }
        return ResponseEntity.ok(careerService.getAllCareers());
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(careerService.getAllCareers());
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations() {
        return ResponseEntity.ok(careerService.getAllCareers());
    }

    @GetMapping("/{careerName}")
    public ResponseEntity<?> getCareerByName(@PathVariable String careerName) {
        return ResponseEntity.ok(careerService.getCareerByName(careerName));
    }
}
