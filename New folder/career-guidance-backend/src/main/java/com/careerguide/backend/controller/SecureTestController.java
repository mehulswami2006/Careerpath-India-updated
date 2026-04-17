package com.careerguide.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecureTestController {

    @GetMapping("/api/test/secure")
    public String secureAPI() {

        return "JWT is working. Access granted!";
    }
}