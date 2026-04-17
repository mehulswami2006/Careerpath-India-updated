package com.careerpath.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "careers")
public class Career {

    @Id
    private String id;

    private String name;

    private String category;

    private String description;

    private List<String> skills;

    private String salaryRange;

    private List<String> degrees;

    private List<String> topUniversities;

    private String jobOutlook;

    private String icon;

    private String color;
}
