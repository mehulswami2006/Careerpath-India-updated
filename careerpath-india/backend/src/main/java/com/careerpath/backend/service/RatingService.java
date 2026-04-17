package com.careerpath.backend.service;

import com.careerpath.backend.dto.RatingRequest;
import com.careerpath.backend.model.Rating;
import com.careerpath.backend.model.User;
import com.careerpath.backend.repository.RatingRepository;
import com.careerpath.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.OptionalDouble;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    public Rating rateTeacher(String studentEmail, RatingRequest req) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Rating rating = new Rating();
        rating.setStudentEmail(studentEmail);
        rating.setStudentName(student.getName());
        rating.setTeacherEmail(req.getTeacherEmail());
        rating.setRating(req.getRating());
        rating.setFeedback(req.getFeedback());
        rating.setSubject(req.getSubject());
        ratingRepository.save(rating);

        // Recalculate teacher average rating
        List<Rating> allRatings = ratingRepository.findByTeacherEmail(req.getTeacherEmail());
        OptionalDouble avg = allRatings.stream()
            .mapToInt(Rating::getRating)
            .average();

        if (avg.isPresent()) {
            userRepository.findByEmail(req.getTeacherEmail()).ifPresent(teacher -> {
                teacher.setRating(Math.round(avg.getAsDouble() * 10.0) / 10.0);
                teacher.setTotalRatings(allRatings.size());
                userRepository.save(teacher);
            });
        }

        return rating;
    }

    public List<Rating> getTeacherRatings(String teacherEmail) {
        return ratingRepository.findByTeacherEmail(teacherEmail);
    }

    public List<Rating> getStudentRatings(String studentEmail) {
        return ratingRepository.findByStudentEmail(studentEmail);
    }
}
