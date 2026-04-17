package com.careerpath.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String role; // STUDENT or TEACHER

    private List<String> subjects;

    private Double rating = 0.0;

    private Integer totalRatings = 0;

    private Integer experience;

    private Integer hourlyRate;

    private String qualification;

    private String bio;

    private String city;

    private String phone;

    private Integer aptitudeScore;

    private Integer coursesEnrolled = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
}
