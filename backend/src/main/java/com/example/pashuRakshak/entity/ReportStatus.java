package com.example.pashuRakshak.entity;

public enum ReportStatus {
    SUBMITTED("Report Submitted"),
    SEARCHING_FOR_HELP("Searching for Help"),
    HELP_ON_THE_WAY("Help is on the Way"),
    TEAM_DISPATCHED("Team Dispatched"),
    ANIMAL_RESCUED("Animal Rescued"),
    CASE_RESOLVED("Case Resolved");
    
    private final String displayName;
    
    ReportStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}