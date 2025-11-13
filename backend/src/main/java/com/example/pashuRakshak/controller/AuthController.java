package com.example.pashuRakshak.controller;

import com.example.pashuRakshak.dto.JwtResponse;
import com.example.pashuRakshak.dto.LoginRequest;
import com.example.pashuRakshak.dto.SignupRequest;
import com.example.pashuRakshak.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    AuthService authService;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: Invalid username or password!");
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        String result = authService.registerUser(signUpRequest);
        
        if (result.startsWith("Error:")) {
            return ResponseEntity.badRequest().body(result);
        }
        
        return ResponseEntity.ok(result);
    }
}