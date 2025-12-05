package com.example.pashuRakshak.controller;

import com.example.pashuRakshak.dto.ChangePasswordRequest;
import com.example.pashuRakshak.dto.UpdateUserRequest;
import com.example.pashuRakshak.dto.UserResponse;
import com.example.pashuRakshak.entity.UserRole;
import com.example.pashuRakshak.service.UserPrincipal;
import com.example.pashuRakshak.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ==================== USER PROFILE MANAGEMENT ====================

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<UserResponse> user = userService.getUserByUsername(userPrincipal.getUsername());

        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserProfile(
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication) {

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<UserResponse> updatedUser = userService.updateUser(userPrincipal.getUsername(), request);

        if (updatedUser.isPresent()) {
            return ResponseEntity.ok(updatedUser.get());
        } else {
            return ResponseEntity.badRequest()
                    .body("Failed to update profile. Email might already be in use.");
        }
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String result = userService.changePassword(userPrincipal.getUsername(), request);

        if ("Password changed successfully".equals(result)) {
            return ResponseEntity.ok(Map.of("message", result));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", result));
        }
    }

    // ==================== ADMIN USER MANAGEMENT ====================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<UserResponse> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        Optional<UserResponse> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        Optional<UserResponse> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String role) {
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            List<UserResponse> users = userService.getUsersByRole(userRole);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        boolean success = userService.toggleUserStatus(id);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "User status updated successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        boolean success = userService.deleteUser(id);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== NGO REPRESENTATIVE MANAGEMENT ====================

    @GetMapping("/ngo-representatives")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getNgoRepresentatives() {
        List<UserResponse> ngoReps = userService.getUsersByRole(UserRole.NGO);
        return ResponseEntity.ok(ngoReps);
    }

    @GetMapping("/ngo-representatives/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getPendingNgoRepresentatives() {
        List<UserResponse> ngoReps = userService.getUsersByRole(UserRole.NGO).stream()
                .filter(user -> !user.isEnabled())
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(ngoReps);
    }

    // ==================== ROLE MANAGEMENT ====================

    @PostMapping("/{id}/roles/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addRoleToUser(@PathVariable Long id, @PathVariable String role) {
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            boolean success = userService.addRoleToUser(id, userRole);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Role added successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid role: " + role));
        }
    }

    @DeleteMapping("/{id}/roles/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeRoleFromUser(@PathVariable Long id, @PathVariable String role) {
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            boolean success = userService.removeRoleFromUser(id, userRole);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Role removed successfully"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Cannot remove role or user not found"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid role: " + role));
        }
    }
}