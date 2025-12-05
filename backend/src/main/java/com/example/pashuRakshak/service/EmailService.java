package com.example.pashuRakshak.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    public void sendNgoApprovalEmail(String toEmail, String ngoName) {
        // Email service - logs to console for now
        System.out.println("=== NGO APPROVAL EMAIL ===");
        System.out.println("To: " + toEmail);
        System.out.println("NGO: " + ngoName);
        System.out.println("Status: APPROVED");
        System.out.println("========================");
    }
    
    public void sendNgoRejectionEmail(String toEmail, String ngoName, String reason) {
        // Email service - logs to console for now
        System.out.println("=== NGO REJECTION EMAIL ===");
        System.out.println("To: " + toEmail);
        System.out.println("NGO: " + ngoName);
        System.out.println("Reason: " + reason);
        System.out.println("===========================");
    }
}
