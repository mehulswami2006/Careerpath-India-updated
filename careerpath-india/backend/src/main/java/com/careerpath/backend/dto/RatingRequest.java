package com.careerpath.backend.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private String teacherEmail;
    private Integer rating;
    private String feedback;
    private String subject;
}
