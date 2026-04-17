package com.careerpath.backend.repository;

import com.careerpath.backend.model.QuizResult;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuizResultRepository extends MongoRepository<QuizResult, String> {
    List<QuizResult> findByStudentEmail(String studentEmail);
    List<QuizResult> findByQuizId(String quizId);
}
