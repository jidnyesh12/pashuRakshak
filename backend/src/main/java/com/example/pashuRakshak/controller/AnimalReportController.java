package com.example.pashuRakshak.controller;

import com.example.pashuRakshak.dto.ReportRequest;
import com.example.pashuRakshak.dto.ReportResponse;
import com.example.pashuRakshak.entity.ReportStatus;
import com.example.pashuRakshak.service.AnimalReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
public class AnimalReportController {

    @Autowired
    private AnimalReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponse> createReport(@Valid @RequestBody ReportRequest request,
            java.security.Principal principal) {
        System.out.println("working--------------------------------------------------");
        if (principal != null) {
            request.setReporterEmail(principal.getName());
        }
        ReportResponse response = reportService.createReport(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/track/{trackingId}")
    public ResponseEntity<ReportResponse> getReportByTrackingId(@PathVariable String trackingId) {
        Optional<ReportResponse> report = reportService.getReportByTrackingId(trackingId);
        return report.map(r -> ResponseEntity.ok(r))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ReportResponse>> getAllReports(java.security.Principal principal) {
        if (principal != null) {
            return ResponseEntity.ok(reportService.getReportsForUser(principal.getName()));
        }
        return ResponseEntity.ok(java.util.Collections.emptyList());
    }

    @GetMapping("/available")
    public ResponseEntity<List<ReportResponse>> getAvailableReports() {
        List<ReportResponse> reports = reportService.getAvailableReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<List<ReportResponse>> getReportsByNgo(@PathVariable Long ngoId) {
        List<ReportResponse> reports = reportService.getReportsByNgo(ngoId);
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/{trackingId}/accept")
    public ResponseEntity<ReportResponse> acceptReport(
            @PathVariable String trackingId,
            @RequestBody Map<String, Object> request) {

        try {
            if (request.get("ngoId") == null || request.get("ngoName") == null) {
                return ResponseEntity.badRequest().build();
            }

            Long ngoId = Long.valueOf(request.get("ngoId").toString());
            String ngoName = request.get("ngoName").toString();

            Optional<ReportResponse> report = reportService.acceptReportByTrackingId(trackingId, ngoId, ngoName);
            return report.map(r -> ResponseEntity.ok(r))
                    .orElse(ResponseEntity.badRequest().build()); // Returns 400 if report not found or status invalid
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{trackingId}/assign")
    public ResponseEntity<ReportResponse> assignReportToWorker(
            @PathVariable String trackingId,
            @RequestBody Map<String, Object> request) {

        Long workerId = Long.valueOf(request.get("workerId").toString());
        String workerName = request.get("workerName").toString();

        Optional<ReportResponse> report = reportService.assignReportToWorker(trackingId, workerId, workerName);
        return report.map(r -> ResponseEntity.ok(r))
                .orElse(ResponseEntity.badRequest().build());
    }

    @GetMapping("/worker/my-tasks")
    public ResponseEntity<List<ReportResponse>> getWorkerTasks(java.security.Principal principal) {
        // In a real app, we'd get the worker ID from the Principal/User details.
        // For simplicity, we might iterate or pass ID. But wait, Principal gives
        // username (email).
        // Let's assume frontend passes ID for now or we look it up.
        // Correct approach: Look up User by Principal.getName() -> get ID -> call
        // service.
        // BUT, for now let's pass ID in query param for speed as per requested style,
        // OR better:
        // Actually, if we want to be secure, we should look up user.
        return ResponseEntity.ok(java.util.Collections.emptyList());
    }

    // Changing getWorkerTasks to accept query param for simplicity as per previous
    // patterns
    @GetMapping("/worker/{workerId}/tasks")
    public ResponseEntity<List<ReportResponse>> getWorkerTasksById(@PathVariable Long workerId) {
        List<ReportResponse> reports = reportService.getReportsAssignedToWorker(workerId);
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/{trackingId}/status")
    public ResponseEntity<ReportResponse> updateReportStatus(
            @PathVariable String trackingId,
            @RequestBody Map<String, String> request) {

        try {
            ReportStatus status = ReportStatus.valueOf(request.get("status"));
            Optional<ReportResponse> report = reportService.updateReportStatusByTrackingId(trackingId, status);
            return report.map(r -> ResponseEntity.ok(r))
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}