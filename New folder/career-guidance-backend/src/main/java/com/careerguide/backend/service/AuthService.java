package com.careerguide.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.careerguide.backend.model.User;
import com.careerguide.backend.repository.UserRepository;
import com.careerguide.backend.util.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER USER
    public String registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already exists!";
        }

        userRepository.save(user);

        return "User registered successfully!";
    }

    // LOGIN USER
    public String loginUser(String email, String password) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return "User not found";
        }

        if (!user.getPassword().equals(password)) {
            return "Invalid password";
        }

        // Generate JWT Token
        String token = jwtUtil.generateToken(user.getEmail());

        return token;
    }
}