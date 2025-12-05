package com.example.pashuRakshak.service;

import com.example.pashuRakshak.dto.JwtResponse;
import com.example.pashuRakshak.dto.LoginRequest;
import com.example.pashuRakshak.dto.SignupRequest;
import com.example.pashuRakshak.entity.Ngo;
import com.example.pashuRakshak.entity.User;
import com.example.pashuRakshak.entity.UserRole;
import com.example.pashuRakshak.entity.VerificationStatus;
import com.example.pashuRakshak.repository.NgoRepository;
import com.example.pashuRakshak.repository.UserRepository;
import com.example.pashuRakshak.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    NgoRepository ngoRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
                userDetails.getEmail(), user.getFullName(), user.getRoles());
    }

    public String registerUser(SignupRequest signUpRequest) {
        // Check if username already exists in users table
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return "Error: Username is already taken!";
        }

        // Check if email already exists in users table
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return "Error: Email is already in use!";
        }

        // Handle NGO registration - save to BOTH users table (for auth) and ngos table (for org details)
        if ("NGO".equalsIgnoreCase(signUpRequest.getUserType())) {
            // Check if email already exists in ngos table
            if (ngoRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
                return "Error: Email is already registered as an NGO!";
            }

            // Validate required NGO fields
            if (signUpRequest.getNgoName() == null || signUpRequest.getNgoName().trim().isEmpty()) {
                return "Error: NGO name is required!";
            }
            if (signUpRequest.getAddress() == null || signUpRequest.getAddress().trim().isEmpty()) {
                return "Error: Address is required!";
            }
            if (signUpRequest.getLatitude() == null || signUpRequest.getLongitude() == null) {
                return "Error: Location coordinates are required!";
            }
            if (signUpRequest.getPhone() == null || signUpRequest.getPhone().trim().isEmpty()) {
                return "Error: Phone number is required!";
            }

            // 1. Create User record for authentication (disabled until admin approval)
            User user = new User(signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword()),
                    signUpRequest.getFullName());

            user.setPhone(signUpRequest.getPhone());
            user.setEnabled(false); // Disabled until admin approves the NGO

            Set<UserRole> roles = new HashSet<>();
            roles.add(UserRole.NGO);
            user.setRoles(roles);
            userRepository.save(user);

            // 2. Create NGO record for organization details
            Ngo ngo = new Ngo();
            ngo.setName(signUpRequest.getNgoName());
            ngo.setEmail(signUpRequest.getEmail());
            ngo.setPhone(signUpRequest.getPhone());
            ngo.setAddress(signUpRequest.getAddress());
            ngo.setLatitude(signUpRequest.getLatitude());
            ngo.setLongitude(signUpRequest.getLongitude());
            ngo.setDescription(signUpRequest.getDescription());
            ngo.setRegistrationDocumentUrl(signUpRequest.getRegistrationDocumentUrl());
            ngo.setVerificationStatus(VerificationStatus.PENDING);
            ngo.setIsActive(false);
            ngo.setCreatedAt(LocalDateTime.now());
            ngo.setUpdatedAt(LocalDateTime.now());

            ngoRepository.save(ngo);

            return "NGO registration submitted successfully! Your account will be activated after admin verification.";
        }

        // Handle regular USER registration - save to users table
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFullName());

        user.setPhone(signUpRequest.getPhone());

        Set<UserRole> roles = new HashSet<>();
        roles.add(UserRole.USER);
        user.setRoles(roles);
        userRepository.save(user);

        return "User registered successfully!";
    }

    public boolean validateToken(String token) {
        return jwtUtils.validateJwtToken(token);
    }
}
