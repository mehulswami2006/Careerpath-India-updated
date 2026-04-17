package com.careerpath.backend.repository;

import com.careerpath.backend.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RatingRepository extends MongoRepository<Rating, String> {
    List<Rating> findByTeacherEmail(String teacherEmail);
    List<Rating> findByStudentEmail(String studentEmail);
}
