package com.example.pashuRakshak.dto;

import com.example.pashuRakshak.entity.ReportStatus;
import java.time.LocalDateTime;
import java.util.List;

public class ReportResponse {
    
    private Long id;
    private String trackingId;
    private String animalType;
    private String condition;
    private String injuryDescription;
    private String additionalNotes;
    private Double latitude;
    private Double longitude;
    private String address;
    private List<String> imageUrls;
    private ReportStatus status;
    private String statusDisplayName;
    private String reporterName;
    private String reporterPhone;
    private String reporterEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long assignedNgoId;
    private String assignedNgoName;
    
    // Constructors
    public ReportResponse() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTrackingId() { return trackingId; }
    public void setTrackingId(String trackingId) { this.trackingId = trackingId; }
    
    public String getAnimalType() { return animalType; }
    public void setAnimalType(String animalType) { this.animalType = animalType; }
    
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getInjuryDescription() { return injuryDescription; }
    public void setInjuryDescription(String injuryDescription) { this.injuryDescription = injuryDescription; }
    
    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    
    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { 
        this.status = status; 
        this.statusDisplayName = status != null ? status.getDisplayName() : null;
    }
    
    public String getStatusDisplayName() { return statusDisplayName; }
    public void setStatusDisplayName(String statusDisplayName) { this.statusDisplayName = statusDisplayName; }
    
    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    
    public String getReporterPhone() { return reporterPhone; }
    public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
    
    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getAssignedNgoId() { return assignedNgoId; }
    public void setAssignedNgoId(Long assignedNgoId) { this.assignedNgoId = assignedNgoId; }
    
    public String getAssignedNgoName() { return assignedNgoName; }
    public void setAssignedNgoName(String assignedNgoName) { this.assignedNgoName = assignedNgoName; }
}