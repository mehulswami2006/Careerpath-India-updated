package com.careerpath.backend.repository;

import com.careerpath.backend.model.HireRequestModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HireRequestRepository extends MongoRepository<HireRequestModel, String> {
    List<HireRequestModel> findByStudentEmail(String studentEmail);
    List<HireRequestModel> findByTeacherEmail(String teacherEmail);
    List<HireRequestModel> findByStudentEmailOrTeacherEmail(String studentEmail, String teacherEmail);
}
