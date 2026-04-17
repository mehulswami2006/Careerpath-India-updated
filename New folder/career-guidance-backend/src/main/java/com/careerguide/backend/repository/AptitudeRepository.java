package com.careerguide.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.careerguide.backend.model.AptitudeResult;

@Repository
public interface AptitudeRepository extends MongoRepository<AptitudeResult, String> {

}