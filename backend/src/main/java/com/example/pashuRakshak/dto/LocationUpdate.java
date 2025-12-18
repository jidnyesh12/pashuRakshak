package com.example.pashuRakshak.dto;

public class LocationUpdate {
    private String trackingId;
    private Long workerId;
    private Double latitude;
    private Double longitude;

    public LocationUpdate() {
    }

    public LocationUpdate(String trackingId, Long workerId, Double latitude, Double longitude) {
        this.trackingId = trackingId;
        this.workerId = workerId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public Long getWorkerId() {
        return workerId;
    }

    public void setWorkerId(Long workerId) {
        this.workerId = workerId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
