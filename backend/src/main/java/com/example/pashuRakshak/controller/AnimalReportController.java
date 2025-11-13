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
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"})
public class AnimalReportController {
    
    @Autowired
    private AnimalReportService reportService;
    
    @PostMapping
    public ResponseEntity<ReportResponse> createReport(@Valid @RequestBody ReportRequest request) {
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
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        List<ReportResponse> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
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
        
        Long ngoId = Long.valueOf(request.get("ngoId").toString());
        String ngoName = request.get("ngoName").toString();
        
        Optional<ReportResponse> report = reportService.acceptReportByTrackingId(trackingId, ngoId, ngoName);
        return report.map(r -> ResponseEntity.ok(r))
                    .orElse(ResponseEntity.badRequest().build());
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