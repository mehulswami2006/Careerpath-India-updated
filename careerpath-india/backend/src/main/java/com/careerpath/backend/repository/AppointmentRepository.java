package com.careerpath.backend.repository;

import com.careerpath.backend.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByStudentEmail(String studentEmail);
    List<Appointment> findByTeacherEmail(String teacherEmail);
    List<Appointment> findByStudentEmailAndStatus(String studentEmail, String status);
    List<Appointment> findByTeacherEmailAndStatus(String teacherEmail, String status);
}
