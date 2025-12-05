package com.example.pashuRakshak.dto;

public class DashboardStatsResponse {
    private UserStatsResponse userStats;
    private NgoStatsResponse ngoStats;
    private Long totalReports;
    private Long pendingReports;
    private Long assignedReports;
    private Long resolvedReports;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(UserStatsResponse userStats, NgoStatsResponse ngoStats,
            Long totalReports, Long pendingReports, Long assignedReports, Long resolvedReports) {
        this.userStats = userStats;
        this.ngoStats = ngoStats;
        this.totalReports = totalReports;
        this.pendingReports = pendingReports;
        this.assignedReports = assignedReports;
        this.resolvedReports = resolvedReports;
    }

    // Getters and Setters
    public UserStatsResponse getUserStats() {
        return userStats;
    }

    public void setUserStats(UserStatsResponse userStats) {
        this.userStats = userStats;
    }

    public NgoStatsResponse getNgoStats() {
        return ngoStats;
    }

    public void setNgoStats(NgoStatsResponse ngoStats) {
        this.ngoStats = ngoStats;
    }

    public Long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(Long totalReports) {
        this.totalReports = totalReports;
    }

    public Long getPendingReports() {
        return pendingReports;
    }

    public void setPendingReports(Long pendingReports) {
        this.pendingReports = pendingReports;
    }

    public Long getAssignedReports() {
        return assignedReports;
    }

    public void setAssignedReports(Long assignedReports) {
        this.assignedReports = assignedReports;
    }

    public Long getResolvedReports() {
        return resolvedReports;
    }

    public void setResolvedReports(Long resolvedReports) {
        this.resolvedReports = resolvedReports;
    }
}
