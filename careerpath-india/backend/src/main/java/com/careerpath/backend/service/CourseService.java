package com.careerpath.backend.service;

import com.careerpath.backend.model.Course;
import com.careerpath.backend.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getCoursesByCategory(String category) {
        return courseRepository.findByCategory(category);
    }

    public Course getCourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course enrollStudent(String courseId, String email) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        if (course.getEnrolledStudents() == null) {
            course.setEnrolledStudents(new ArrayList<>());
        }

        if (!course.getEnrolledStudents().contains(email)) {
            course.getEnrolledStudents().add(email);
            int count = course.getStudents() != null ? course.getStudents() : 0;
            course.setStudents(count + 1);
            courseRepository.save(course);
        }

        return course;
    }

    public List<Course> getStudentCourses(String email) {
        return courseRepository.findAll().stream()
                .filter(c -> c.getEnrolledStudents() != null
                        && c.getEnrolledStudents().contains(email))
                .toList();
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }
}
