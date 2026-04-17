package com.careerpath.backend.repository;

import com.careerpath.backend.model.Career;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CareerRepository extends MongoRepository<Career, String> {
    Optional<Career> findByNameIgnoreCase(String name);
    List<Career> findByCategory(String category);
    List<Career> findByNameContainingIgnoreCase(String keyword);
}
