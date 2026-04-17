package com.careerpath.backend.dto;

import lombok.Data;

import java.util.Map;

@Data
public class AptitudeSubmitRequest {
    private Map<String, Integer> answers;
    private Integer score;
    private Integer total;
    private Integer percentage;
    private Map<String, Integer> sectionScores;
}
