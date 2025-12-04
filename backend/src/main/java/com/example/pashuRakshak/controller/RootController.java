package com.example.pashuRakshak.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class RootController {
    
    @GetMapping
    public ResponseEntity<?> getApiInfo() {
        return ResponseEntity.ok(Map.of(
            "message", "Pashu Rakshak API is running",
            "version", "1.0.0",
            "endpoints", Map.of(
                "auth", "/api/auth",
                "users", "/api/users", 
                "reports", "/api/reports",
                "ngos", "/api/ngos"
            )
        ));
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", System.currentTimeMillis()
        ));
    }
}