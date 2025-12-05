package com.example.pashuRakshak.controller;

import com.example.pashuRakshak.dto.NgoRequest;
import com.example.pashuRakshak.entity.Ngo;
import com.example.pashuRakshak.service.NgoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ngos")
public class NgoController {

    @Autowired
    private NgoService ngoService;

    @PostMapping
    public ResponseEntity<Ngo> createNgo(@Valid @RequestBody NgoRequest request) {
        Ngo ngo = ngoService.createNgo(request);
        return new ResponseEntity<>(ngo, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Ngo>> getAllActiveNgos() {
        List<Ngo> ngos = ngoService.getAllActiveNgos();
        return ResponseEntity.ok(ngos);
    }

    // Admin endpoints - require ADMIN role
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ngo>> getAllNgos() {
        List<Ngo> ngos = ngoService.getAllNgos();

        return ResponseEntity.ok(ngos);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ngo>> getPendingNgos() {
        List<Ngo> ngos = ngoService.getPendingNgos();
        return ResponseEntity.ok(ngos);
    }

    @GetMapping("/approved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ngo>> getApprovedNgos() {
        List<Ngo> ngos = ngoService.getApprovedNgos();
        return ResponseEntity.ok(ngos);
    }

    @GetMapping("/rejected")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ngo>> getRejectedNgos() {
        List<Ngo> ngos = ngoService.getRejectedNgos();
        return ResponseEntity.ok(ngos);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getNgoStats() {
        com.example.pashuRakshak.dto.NgoStatsResponse stats = ngoService.getNgoStats();
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveNgo(@PathVariable Long id, Principal principal) {
        // Get admin user ID from principal
        Long adminId = 1L; // Default fallback
        if (principal != null && principal.getName() != null) {
            // Try to get user ID from principal name
            // This assumes principal.getName() returns username
            // In a production system, you'd fetch the user entity by username
            try {
                // For now, using default admin ID
                // TODO: Implement proper user lookup by username from principal
                adminId = 1L;
            } catch (Exception e) {
                adminId = 1L;
            }
        }

        Optional<Ngo> ngo = ngoService.approveNgo(id, adminId);
        if (ngo.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "NGO approved successfully");
            response.put("ngo", ngo.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectNgo(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            Principal principal) {

        String reason = payload.get("reason");
        if (reason == null || reason.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Rejection reason is required");
        }

        // Get admin user ID from principal
        Long adminId = 1L; // Default fallback
        if (principal != null && principal.getName() != null) {
            // Try to get user ID from principal name
            try {
                adminId = 1L;
            } catch (Exception e) {
                adminId = 1L;
            }
        }

        Optional<Ngo> ngo = ngoService.rejectNgo(id, adminId, reason);
        if (ngo.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "NGO rejected");
            response.put("ngo", ngo.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleNgoActiveStatus(@PathVariable Long id) {
        boolean success = ngoService.toggleNgoActiveStatus(id);
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "NGO active status toggled successfully");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ngo> getNgoById(@PathVariable Long id) {
        Optional<Ngo> ngo = ngoService.getNgoById(id);
        return ngo.map(n -> ResponseEntity.ok(n))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Ngo> getNgoByEmail(@PathVariable String email) {
        Optional<Ngo> ngo = ngoService.getNgoByEmail(email);
        return ngo.map(n -> ResponseEntity.ok(n))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Ngo>> getNearbyNgos(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "0.1") Double radius) {

        List<Ngo> ngos = ngoService.getNearbyNgos(latitude, longitude, radius);
        return ResponseEntity.ok(ngos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ngo> updateNgo(@PathVariable Long id, @Valid @RequestBody NgoRequest request) {
        Optional<Ngo> ngo = ngoService.updateNgo(id, request);
        return ngo.map(n -> ResponseEntity.ok(n))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateNgo(@PathVariable Long id) {
        boolean deactivated = ngoService.deactivateNgo(id);
        return deactivated ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/workers")
    public ResponseEntity<?> addWorker(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        String name = payload.get("name");
        String email = payload.get("email");
        String phone = payload.get("phone");

        if (name == null || email == null) {
            return ResponseEntity.badRequest().body("Name and Email are required");
        }

        String ageStr = payload.get("age");
        Integer age = ageStr != null ? Integer.parseInt(ageStr) : null;
        String gender = payload.get("gender");

        try {
            com.example.pashuRakshak.entity.User worker = ngoService.addWorker(id, name, email, phone, age, gender);
            return ResponseEntity.ok(worker);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/workers")
    public ResponseEntity<List<com.example.pashuRakshak.entity.User>> getWorkers(@PathVariable Long id) {
        List<com.example.pashuRakshak.entity.User> workers = ngoService.getWorkers(id);
        return ResponseEntity.ok(workers);
    }
}