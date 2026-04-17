package com.careerpath.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProfileRequest {
    private String name;
    private String phone;
    private String bio;
    private String city;
    private String qualification;
    private Integer experience;
    private Integer hourlyRate;
    private List<String> subjects;
    private String interests;
}
