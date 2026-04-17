package com.careerpath.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  CareerPath India Backend Started!");
        System.out.println("  URL: http://localhost:8080");
        System.out.println("  Frontend: http://localhost:3000");
        System.out.println("========================================\n");
    }
}
