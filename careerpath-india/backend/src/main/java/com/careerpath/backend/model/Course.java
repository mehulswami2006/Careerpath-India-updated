package com.careerpath.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "courses")
public class Course {

    @Id
    private String id;

    private String title;

    private String description;

    private String career;

    private String category;

    private String teacherEmail;

    private String teacher;

    private String difficulty;

    private String duration;

    private Double price;

    private String icon;

    private String color;

    private Double rating;

    private Integer students;

    private String youtubeId;

    private List<String> topics;

    private List<String> enrolledStudents;
}
