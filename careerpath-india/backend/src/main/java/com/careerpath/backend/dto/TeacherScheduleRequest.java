package com.careerpath.backend.dto;

import lombok.Data;

@Data
public class TeacherScheduleRequest {

    private String studentEmail;

    private String subject;

    private String date;

    private String time;

    private Integer duration;

    private String type;

    private String message;

    /** Optional — if set, saved on the appointment so the student can join immediately */
    private String meetingLink;
}
