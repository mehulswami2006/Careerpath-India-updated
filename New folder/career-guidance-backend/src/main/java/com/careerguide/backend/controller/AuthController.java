package com.careerguide.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.careerguide.backend.model.User;
import com.careerguide.backend.dto.LoginRequest;
import com.careerguide.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public Map<String, String> registerUser(@RequestBody User user) {

        String message = authService.registerUser(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", message);

        return response;
    }

    @PostMapping("/login")
    public Map<String, String> loginUser(@RequestBody LoginRequest loginRequest) {

        String token = authService.loginUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return response;
    }
}