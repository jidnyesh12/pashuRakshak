package com.example.pashuRakshak.controller;

import com.example.pashuRakshak.dto.DashboardStatsResponse;
import com.example.pashuRakshak.dto.NgoStatsResponse;
import com.example.pashuRakshak.dto.UserStatsResponse;
import com.example.pashuRakshak.service.AdminService;
import com.example.pashuRakshak.service.NgoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private NgoService ngoService;

    /**
     * Get comprehensive dashboard statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get user statistics
     */
    @GetMapping("/users/stats")
    public ResponseEntity<UserStatsResponse> getUserStats() {
        UserStatsResponse stats = adminService.getUserStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get NGO statistics
     */
    @GetMapping("/ngos/stats")
    public ResponseEntity<NgoStatsResponse> getNgoStats() {
        NgoStatsResponse stats = ngoService.getNgoStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Approve NGO representative (enable user account)
     */
    @PostMapping("/users/{id}/approve-ngo")
    public ResponseEntity<?> approveNgoRepresentative(@PathVariable Long id) {
        boolean success = adminService.approveNgoRepresentative(id);
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "NGO representative approved successfully");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found or is not an NGO representative");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
