package com.example.pashuRakshak.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendNgoApprovalEmail(String toEmail, String ngoName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Pashu Rakshak - NGO Account Approved");
            message.setText("Dear " + ngoName + ",\n\n" +
                    "Congratulations! Your NGO account on Pashu Rakshak has been approved.\n" +
                    "You can now log in to your dashboard and start managing rescue cases.\n\n" +
                    "Thank you for your partnership in saving animals.\n\n" +
                    "Best regards,\n" +
                    "The Pashu Rakshak Team");

            mailSender.send(message);
            System.out.println("Approval email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send approval email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendNgoRejectionEmail(String toEmail, String ngoName, String reason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Pashu Rakshak - NGO Account Update");
            message.setText("Dear " + ngoName + ",\n\n" +
                    "We regret to inform you that your NGO account application on Pashu Rakshak has been declined.\n\n"
                    +
                    "Reason: " + reason + "\n\n" +
                    "If you believe this is an error or if you have addressed the issues, please contact support or register again with correct details.\n\n"
                    +
                    "Best regards,\n" +
                    "The Pashu Rakshak Team");

            mailSender.send(message);
            System.out.println("Rejection email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send rejection email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendWorkerWelcomeEmail(String toEmail, String name, String password, String ngoName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Pashu Rakshak - Welcome to " + ngoName);
            message.setText("Dear " + name + ",\n\n" +
                    "You have been added as a worker for " + ngoName + " on Pashu Rakshak.\n\n" +
                    "Your login credentials are:\n" +
                    "Email: " + toEmail + "\n" +
                    "Password: " + password + "\n\n" +
                    "Please log in and change your password immediately.\n\n" +
                    "Best regards,\n" +
                    "The Pashu Rakshak Team");

            mailSender.send(message);
            System.out.println("Worker welcome email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send worker welcome email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
