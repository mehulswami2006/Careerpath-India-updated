package com.careerpath.backend.service;

import com.careerpath.backend.dto.QuizSubmitRequest;
import com.careerpath.backend.model.Quiz;
import com.careerpath.backend.model.QuizResult;
import com.careerpath.backend.model.User;
import com.careerpath.backend.repository.QuizRepository;
import com.careerpath.backend.repository.QuizResultRepository;
import com.careerpath.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;

    public Quiz createQuiz(String teacherEmail, Quiz quiz) {
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        quiz.setTeacherEmail(teacherEmail);
        quiz.setTeacher(teacher.getName());
        return quizRepository.save(quiz);
    }

    public Quiz getQuizById(String id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found: " + id));
    }

    public List<Quiz> getQuizzesByTeacher(String email) {
        return quizRepository.findByTeacherEmail(email);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public QuizResult submitQuiz(String studentEmail, QuizSubmitRequest req) {
        QuizResult result = new QuizResult();
        result.setStudentEmail(studentEmail);
        result.setQuizId(req.getQuizId());
        result.setScore(req.getScore() != null ? req.getScore() : 0);
        result.setTotal(req.getTotal() != null ? req.getTotal() : 0);
        result.setPercentage(req.getPercentage() != null ? req.getPercentage() : 0);
        result.setAnswers(req.getAnswers());
        return quizResultRepository.save(result);
    }

    public List<QuizResult> getStudentResults(String email) {
        return quizResultRepository.findByStudentEmail(email);
    }

    public List<QuizResult> getQuizResults(String quizId) {
        return quizResultRepository.findByQuizId(quizId);
    }
}
