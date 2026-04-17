package com.careerpath.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@Document(collection = "aptitude_results")
public class AptitudeResult {

    @Id
    private String id;

    private String userEmail;

    private Map<String, Integer> answers;

    private Integer score;

    private Integer totalQuestions;

    private Map<String, Integer> categoryScores;

    private LocalDateTime createdAt = LocalDateTime.now();
}
