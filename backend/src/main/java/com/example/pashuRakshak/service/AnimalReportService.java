package com.example.pashuRakshak.service;

import com.example.pashuRakshak.dto.ReportRequest;
import com.example.pashuRakshak.dto.ReportResponse;
import com.example.pashuRakshak.entity.AnimalReport;
import com.example.pashuRakshak.entity.ReportStatus;
import com.example.pashuRakshak.repository.AnimalReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnimalReportService {
    
    @Autowired
    private AnimalReportRepository reportRepository;
    
    public ReportResponse createReport(ReportRequest request) {
        AnimalReport report = new AnimalReport();
        report.setTrackingId(generateTrackingId());
        report.setAnimalType(request.getAnimalType());
        report.setCondition(request.getCondition());
        report.setInjuryDescription(request.getInjuryDescription());
        report.setAdditionalNotes(request.getAdditionalNotes());
        report.setLatitude(request.getLatitude());
        report.setLongitude(request.getLongitude());
        report.setImageUrls(request.getImageUrls());
        report.setReporterName(request.getReporterName());
        report.setReporterPhone(request.getReporterPhone());
        report.setReporterEmail(request.getReporterEmail());
        report.setStatus(ReportStatus.SUBMITTED);
        report.setCreatedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());
        
        AnimalReport savedReport = reportRepository.save(report);
        return convertToResponse(savedReport);
    }
    
    public Optional<ReportResponse> getReportByTrackingId(String trackingId) {
        return reportRepository.findByTrackingId(trackingId)
                .map(this::convertToResponse);
    }
    
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ReportResponse> getAvailableReports() {
        List<ReportStatus> availableStatuses = List.of(
            ReportStatus.SUBMITTED, 
            ReportStatus.SEARCHING_FOR_HELP
        );
        return reportRepository.findByStatusIn(availableStatuses).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ReportResponse> getReportsByNgo(Long ngoId) {
        return reportRepository.findByAssignedNgoId(ngoId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<ReportResponse> acceptReport(Long reportId, Long ngoId, String ngoName) {
        Optional<AnimalReport> reportOpt = reportRepository.findById(reportId);
        if (reportOpt.isPresent()) {
            AnimalReport report = reportOpt.get();
            if (report.getStatus() == ReportStatus.SUBMITTED || 
                report.getStatus() == ReportStatus.SEARCHING_FOR_HELP) {
                
                report.setAssignedNgoId(ngoId);
                report.setAssignedNgoName(ngoName);
                report.setStatus(ReportStatus.HELP_ON_THE_WAY);
                report.setUpdatedAt(LocalDateTime.now());
                
                AnimalReport savedReport = reportRepository.save(report);
                return Optional.of(convertToResponse(savedReport));
            }
        }
        return Optional.empty();
    }
    
    public Optional<ReportResponse> updateReportStatus(Long reportId, ReportStatus status) {
        Optional<AnimalReport> reportOpt = reportRepository.findById(reportId);
        if (reportOpt.isPresent()) {
            AnimalReport report = reportOpt.get();
            report.setStatus(status);
            report.setUpdatedAt(LocalDateTime.now());
            
            AnimalReport savedReport = reportRepository.save(report);
            return Optional.of(convertToResponse(savedReport));
        }
        return Optional.empty();
    }
    
    public Optional<ReportResponse> acceptReportByTrackingId(String trackingId, Long ngoId, String ngoName) {
        Optional<AnimalReport> reportOpt = reportRepository.findByTrackingId(trackingId);
        if (reportOpt.isPresent()) {
            AnimalReport report = reportOpt.get();
            if (report.getStatus() == ReportStatus.SUBMITTED || 
                report.getStatus() == ReportStatus.SEARCHING_FOR_HELP) {
                
                report.setAssignedNgoId(ngoId);
                report.setAssignedNgoName(ngoName);
                report.setStatus(ReportStatus.HELP_ON_THE_WAY);
                report.setUpdatedAt(LocalDateTime.now());
                
                AnimalReport savedReport = reportRepository.save(report);
                return Optional.of(convertToResponse(savedReport));
            }
        }
        return Optional.empty();
    }
    
    public Optional<ReportResponse> updateReportStatusByTrackingId(String trackingId, ReportStatus status) {
        Optional<AnimalReport> reportOpt = reportRepository.findByTrackingId(trackingId);
        if (reportOpt.isPresent()) {
            AnimalReport report = reportOpt.get();
            report.setStatus(status);
            report.setUpdatedAt(LocalDateTime.now());
            
            AnimalReport savedReport = reportRepository.save(report);
            return Optional.of(convertToResponse(savedReport));
        }
        return Optional.empty();
    }
    
    private String generateTrackingId() {
        return "PR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private ReportResponse convertToResponse(AnimalReport report) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setTrackingId(report.getTrackingId());
        response.setAnimalType(report.getAnimalType());
        response.setCondition(report.getCondition());
        response.setInjuryDescription(report.getInjuryDescription());
        response.setAdditionalNotes(report.getAdditionalNotes());
        response.setLatitude(report.getLatitude());
        response.setLongitude(report.getLongitude());
        response.setImageUrls(report.getImageUrls());
        response.setStatus(report.getStatus());
        response.setReporterName(report.getReporterName());
        response.setReporterPhone(report.getReporterPhone());
        response.setReporterEmail(report.getReporterEmail());
        response.setCreatedAt(report.getCreatedAt());
        response.setUpdatedAt(report.getUpdatedAt());
        response.setAssignedNgoId(report.getAssignedNgoId());
        response.setAssignedNgoName(report.getAssignedNgoName());
        return response;
    }
}