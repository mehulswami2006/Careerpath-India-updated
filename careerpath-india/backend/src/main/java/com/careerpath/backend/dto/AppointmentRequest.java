package com.careerpath.backend.dto;

import lombok.Data;

@Data
public class AppointmentRequest {
    private String teacherEmail;
    private String subject;
    private String date;
    private String time;
    private Integer duration;
    private String type;
    private String message;
}
