package com.careerguide.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.careerguide.backend.model.AptitudeResult;
import com.careerguide.backend.repository.AptitudeRepository;

@RestController
@RequestMapping("/api/aptitude")
@CrossOrigin("*")
public class AptitudeController {

    @Autowired
    private AptitudeRepository aptitudeRepository;

    @PostMapping("/submit")
    public AptitudeResult submitTest(@RequestBody AptitudeResult result){
        return aptitudeRepository.save(result);
    }
}