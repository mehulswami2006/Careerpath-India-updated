package com.careerpath.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "ratings")
public class Rating {

    @Id
    private String id;

    private String studentEmail;

    private String studentName;

    private String teacherEmail;

    private Integer rating;

    private String feedback;

    private String subject;

    private LocalDateTime createdAt = LocalDateTime.now();
}
