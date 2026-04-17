package com.careerpath.backend.service;

import com.careerpath.backend.model.Career;
import com.careerpath.backend.repository.CareerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CareerService {

    private final CareerRepository careerRepository;

    public List<Career> getAllCareers() {
        return careerRepository.findAll();
    }

    public Career getCareerByName(String name) {
        return careerRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Career not found: " + name));
    }

    public List<Career> getCareersByCategory(String category) {
        return careerRepository.findByCategory(category);
    }

    public List<Career> searchCareers(String keyword) {
        return careerRepository.findByNameContainingIgnoreCase(keyword);
    }
}
