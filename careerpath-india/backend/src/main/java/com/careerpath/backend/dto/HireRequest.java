package com.careerpath.backend.dto;

import lombok.Data;

@Data
public class HireRequest {
    private String teacherEmail;
    private String subject;
    private String message;
    private String sessionType;
    private String preferredDate;
    private String preferredTime;
}
