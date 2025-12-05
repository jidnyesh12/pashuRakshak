package com.example.pashuRakshak.controller;

import com.example.pashuRakshak.dto.JwtResponse;
import com.example.pashuRakshak.dto.LoginRequest;
import com.example.pashuRakshak.dto.SignupRequest;
import com.example.pashuRakshak.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (DisabledException e) {
            // User account is disabled - likely an NGO pending approval
            return ResponseEntity.status(403)
                    .body("Error: Your account is not yet activated. Please wait for admin approval.");
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest()
                    .body("Error: Invalid username or password!");
        } catch (Exception e) {
            // Log the actual error for debugging
            System.err.println("Login error: " + e.getClass().getName() + " - " + e.getMessage());
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

    @GetMapping("/validateToken")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
        }
        String token = authorizationHeader.substring(7);
        if (authService.validateToken(token)) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(401).body(false);
        }
    }
}
