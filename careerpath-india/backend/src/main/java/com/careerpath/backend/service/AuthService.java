package com.careerpath.backend.service;

import com.careerpath.backend.dto.AuthResponse;
import com.careerpath.backend.dto.LoginRequest;
import com.careerpath.backend.dto.RegisterRequest;
import com.careerpath.backend.model.User;
import com.careerpath.backend.repository.UserRepository;
import com.careerpath.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered. Please login.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase());
        user.setRating(0.0);
        user.setTotalRatings(0);

        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(
            saved.getEmail(), saved.getRole(), saved.getName(), saved.getId()
        );

        return new AuthResponse(token, saved.getName(), saved.getEmail(), saved.getRole(), saved.getId());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
            user.getEmail(), user.getRole(), user.getName(), user.getId()
        );

        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole(), user.getId());
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
