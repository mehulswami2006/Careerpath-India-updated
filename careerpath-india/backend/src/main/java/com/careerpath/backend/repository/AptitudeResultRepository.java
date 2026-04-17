package com.careerpath.backend.repository;

import com.careerpath.backend.model.AptitudeResult;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AptitudeResultRepository extends MongoRepository<AptitudeResult, String> {
    Optional<AptitudeResult> findTopByUserEmailOrderByCreatedAtDesc(String userEmail);
}
