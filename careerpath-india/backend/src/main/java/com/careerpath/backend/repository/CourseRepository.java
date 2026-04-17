package com.careerpath.backend.repository;

import com.careerpath.backend.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByCareer(String career);
    List<Course> findByTeacherEmail(String teacherEmail);
    List<Course> findByCategory(String category);
}
