package com.example.pashuRakshak.service;

import com.example.pashuRakshak.dto.JwtResponse;
import com.example.pashuRakshak.dto.LoginRequest;
import com.example.pashuRakshak.dto.SignupRequest;
import com.example.pashuRakshak.entity.User;
import com.example.pashuRakshak.entity.UserRole;
import com.example.pashuRakshak.repository.UserRepository;
import com.example.pashuRakshak.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
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
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return "Error: Username is already taken!";
        }
        
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return "Error: Email is already in use!";
        }
        
        // Create new user's account
        User user = new User(signUpRequest.getUsername(), 
                           signUpRequest.getEmail(),
                           encoder.encode(signUpRequest.getPassword()),
                           signUpRequest.getFullName());
        
        user.setPhone(signUpRequest.getPhone());
        
        Set<UserRole> roles = new HashSet<>();
        
        if ("NGO".equalsIgnoreCase(signUpRequest.getUserType())) {
            roles.add(UserRole.NGO);
        } else {
            roles.add(UserRole.USER);
        }
        
        user.setRoles(roles);
        userRepository.save(user);
        
        return "User registered successfully!";
    }
}