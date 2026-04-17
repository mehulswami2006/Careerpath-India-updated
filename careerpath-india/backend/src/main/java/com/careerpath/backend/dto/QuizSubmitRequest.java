package com.careerpath.backend.dto;

import lombok.Data;

import java.util.Map;

@Data
public class QuizSubmitRequest {
    private String quizId;
    private Map<String, Integer> answers;
    private Integer score;
    private Integer total;
    private Integer percentage;
}
