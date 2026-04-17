package com.careerpath.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "appointments")
public class Appointment {

    @Id
    private String id;

    private String studentEmail;

    private String studentName;

    private String teacherEmail;

    private String teacherName;

    private String subject;

    private String meetingLink;

    private String status = "PENDING"; // PENDING, CONFIRMED, COMPLETED, CANCELLED, REJECTED

    private String date;

    private String time;

    private Integer duration = 60;

    private String type = "Online";

    private String message;

    private LocalDateTime createdAt = LocalDateTime.now();
}
