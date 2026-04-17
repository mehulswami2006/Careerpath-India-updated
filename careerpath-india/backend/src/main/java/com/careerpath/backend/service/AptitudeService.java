package com.careerpath.backend.service;

import com.careerpath.backend.dto.AptitudeSubmitRequest;
import com.careerpath.backend.model.AptitudeResult;
import com.careerpath.backend.model.User;
import com.careerpath.backend.repository.AptitudeResultRepository;
import com.careerpath.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AptitudeService {

    private final AptitudeResultRepository aptitudeResultRepository;
    private final UserRepository userRepository;

    public AptitudeResult submitResult(String email, AptitudeSubmitRequest request) {
        AptitudeResult result = new AptitudeResult();
        result.setUserEmail(email);
        result.setAnswers(request.getAnswers() != null ? request.getAnswers() : new HashMap<>());
        result.setScore(request.getScore() != null ? request.getScore() : 0);
        result.setTotalQuestions(request.getTotal() != null ? request.getTotal() : 25);
        result.setCategoryScores(request.getSectionScores() != null
            ? request.getSectionScores() : new HashMap<>());

        AptitudeResult saved = aptitudeResultRepository.save(result);

        // Update user's aptitude score
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setAptitudeScore(request.getScore());
            userRepository.save(user);
        });

        return saved;
    }

    public Optional<AptitudeResult> getLatestResult(String email) {
        return aptitudeResultRepository.findTopByUserEmailOrderByCreatedAtDesc(email);
    }

    public Map<String, Object> getRecommendations(String email) {
        Map<String, Object> response = new HashMap<>();

        aptitudeResultRepository.findTopByUserEmailOrderByCreatedAtDesc(email)
            .ifPresent(result -> {
                response.put("score", result.getScore());
                response.put("totalQuestions", result.getTotalQuestions());
                response.put("categoryScores", result.getCategoryScores());
                response.put("createdAt", result.getCreatedAt());

                Map<String, Integer> scores = result.getCategoryScores();
                if (scores != null) {
                    // Determine top category and suggest careers
                    String topCategory = scores.entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse("General");
                    response.put("strongestArea", topCategory);

                    // Career recommendations based on score
                    int total = result.getScore() != null ? result.getScore() : 0;
                    if (total >= 80) {
                        response.put("recommendedCategory", "Technology");
                        response.put("message", "Excellent! You are well-suited for competitive careers.");
                    } else if (total >= 60) {
                        response.put("recommendedCategory", "Engineering");
                        response.put("message", "Good performance! Engineering and science roles suit you.");
                    } else if (total >= 40) {
                        response.put("recommendedCategory", "Business");
                        response.put("message", "You have good aptitude for business and management.");
                    } else {
                        response.put("recommendedCategory", "Creative");
                        response.put("message", "You show creative potential. Explore arts and design.");
                    }
                }
            });

        if (response.isEmpty()) {
            response.put("message", "No aptitude test taken yet. Please complete the test first.");
        }

        return response;
    }
}
