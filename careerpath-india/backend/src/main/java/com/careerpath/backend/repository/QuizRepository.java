package com.careerpath.backend.repository;

import com.careerpath.backend.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByTeacherEmail(String teacherEmail);
    List<Quiz> findByCourseId(String courseId);
}
