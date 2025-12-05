package com.example.pashuRakshak.dto;

public class NgoStatsResponse {
    private Long totalNgos;
    private Long pendingNgos;
    private Long approvedNgos;
    private Long rejectedNgos;
    private Long activeNgos;
    private Long inactiveNgos;

    public NgoStatsResponse() {
    }

    public NgoStatsResponse(Long totalNgos, Long pendingNgos, Long approvedNgos,
            Long rejectedNgos, Long activeNgos, Long inactiveNgos) {
        this.totalNgos = totalNgos;
        this.pendingNgos = pendingNgos;
        this.approvedNgos = approvedNgos;
        this.rejectedNgos = rejectedNgos;
        this.activeNgos = activeNgos;
        this.inactiveNgos = inactiveNgos;
    }

    // Getters and Setters
    public Long getTotalNgos() {
        return totalNgos;
    }

    public void setTotalNgos(Long totalNgos) {
        this.totalNgos = totalNgos;
    }

    public Long getPendingNgos() {
        return pendingNgos;
    }

    public void setPendingNgos(Long pendingNgos) {
        this.pendingNgos = pendingNgos;
    }

    public Long getApprovedNgos() {
        return approvedNgos;
    }

    public void setApprovedNgos(Long approvedNgos) {
        this.approvedNgos = approvedNgos;
    }

    public Long getRejectedNgos() {
        return rejectedNgos;
    }

    public void setRejectedNgos(Long rejectedNgos) {
        this.rejectedNgos = rejectedNgos;
    }

    public Long getActiveNgos() {
        return activeNgos;
    }

    public void setActiveNgos(Long activeNgos) {
        this.activeNgos = activeNgos;
    }

    public Long getInactiveNgos() {
        return inactiveNgos;
    }

    public void setInactiveNgos(Long inactiveNgos) {
        this.inactiveNgos = inactiveNgos;
    }
}
