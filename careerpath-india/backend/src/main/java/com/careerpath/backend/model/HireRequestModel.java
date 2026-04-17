package com.careerpath.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "hire_requests")
public class HireRequestModel {

    @Id
    private String id;

    private String studentEmail;

    private String studentName;

    private String teacherEmail;

    private String subject;

    private String message;

    private String sessionType;

    private String preferredDate;

    private String preferredTime;

    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED

    private LocalDateTime createdAt = LocalDateTime.now();
}
