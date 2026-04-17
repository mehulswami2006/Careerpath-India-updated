package com.careerpath.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@Document(collection = "quizzes")
public class Quiz {

    @Id
    private String id;

    private String title;

    private String subject;

    private String teacherEmail;

    private String teacher;

    private String courseId;

    private List<Map<String, Object>> questions;

    private LocalDateTime createdAt = LocalDateTime.now();
}
