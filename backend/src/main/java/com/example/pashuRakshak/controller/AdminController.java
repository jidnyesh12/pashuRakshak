package com.example.pashuRakshak.controller;

import com.example.pashuRakshak.dto.DashboardStatsResponse;
import com.example.pashuRakshak.dto.NgoStatsResponse;
import com.example.pashuRakshak.dto.ReportResponse;
import com.example.pashuRakshak.dto.UserStatsResponse;
import com.example.pashuRakshak.service.AdminService;
import com.example.pashuRakshak.service.AnimalReportService;
import com.example.pashuRakshak.service.ExportService;
import com.example.pashuRakshak.service.NgoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private NgoService ngoService;

    @Autowired
    private AnimalReportService animalReportService;

    @Autowired
    private ExportService exportService;

    // ==================== DASHBOARD STATISTICS ====================

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

    // ==================== NGO REPRESENTATIVE MANAGEMENT ====================

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

    /**
     * Reject NGO representative (keep disabled, optionally send rejection email)
     */
    @PostMapping("/users/{id}/reject-ngo")
    public ResponseEntity<?> rejectNgoRepresentative(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        String reason = payload != null ? payload.get("reason") : null;
        boolean success = adminService.rejectNgoRepresentative(id, reason);
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "NGO representative rejected");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found or is not an NGO representative");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ==================== REPORTS MANAGEMENT ====================

    /**
     * Get all reports (admin only - bypasses user filtering)
     */
    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        List<ReportResponse> reports = animalReportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    /**
     * Get reports by status
     */
    @GetMapping("/reports/status/{status}")
    public ResponseEntity<?> getReportsByStatus(@PathVariable String status) {
        try {
            com.example.pashuRakshak.entity.ReportStatus reportStatus = com.example.pashuRakshak.entity.ReportStatus
                    .valueOf(status.toUpperCase());
            List<ReportResponse> reports = adminService.getReportsByStatus(reportStatus);
            return ResponseEntity.ok(reports);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status: " + status));
        }
    }

    // ==================== EXPORT ENDPOINTS ====================

    /**
     * Export all reports to CSV
     */
    @GetMapping("/export/reports")
    public ResponseEntity<byte[]> exportReports() {
        byte[] csvData = exportService.exportReportsToCsv();
        String filename = "reports_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
                + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    /**
     * Export all users to CSV
     */
    @GetMapping("/export/users")
    public ResponseEntity<byte[]> exportUsers() {
        byte[] csvData = exportService.exportUsersToCsv();
        String filename = "users_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
                + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    /**
     * Export all NGOs to CSV
     */
    @GetMapping("/export/ngos")
    public ResponseEntity<byte[]> exportNgos() {
        byte[] csvData = exportService.exportNgosToCsv();
        String filename = "ngos_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    /**
     * Export pending NGO representatives to CSV
     */
    @GetMapping("/export/ngo-representatives/pending")
    public ResponseEntity<byte[]> exportPendingNgoRepresentatives() {
        byte[] csvData = exportService.exportPendingNgoRepresentativesToCsv();
        String filename = "pending_ngo_reps_"
                + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
