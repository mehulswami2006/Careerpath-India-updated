package com.careerpath.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@Document(collection = "quiz_results")
public class QuizResult {

    @Id
    private String id;

    private String studentEmail;

    private String quizId;

    private Integer score;

    private Integer total;

    private Integer percentage;

    private Map<String, Integer> answers;

    private LocalDateTime createdAt = LocalDateTime.now();
}
