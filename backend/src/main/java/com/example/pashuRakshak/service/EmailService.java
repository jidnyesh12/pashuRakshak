package com.example.pashuRakshak.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Brand Colors
    private static final String PRIMARY_COLOR = "#00bcd4"; // Cyan 500
    private static final String TEXT_COLOR = "#1f2937"; // Gray 800
    private static final String BG_COLOR = "#f3f4f6"; // Gray 100

    public void sendNgoApprovalEmail(String toEmail, String ngoName) {
        String subject = "Pashu Rakshak - NGO Account Approved";
        String content = "<p>Dear <strong>" + ngoName + "</strong>,</p>" +
                "<p>Congratulations! Your NGO account on Pashu Rakshak has been approved.</p>" +
                "<p>You can now log in to your dashboard and start managing rescue cases.</p>" +
                "<p>Thank you for your partnership in saving animals.</p>";

        sendHtmlEmail(toEmail, subject, "Account Approved", content);
    }

    public void sendNgoRejectionEmail(String toEmail, String ngoName, String reason) {
        String subject = "Pashu Rakshak - NGO Account Update";
        String content = "<p>Dear <strong>" + ngoName + "</strong>,</p>" +
                "<p>We regret to inform you that your NGO account application on Pashu Rakshak has been declined.</p>" +
                "<div style=\"background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;\">"
                +
                "<strong style=\"color: #b91c1c;\">Reason:</strong> <span style=\"color: #7f1d1d;\">" + reason
                + "</span>" +
                "</div>" +
                "<p>If you believe this is an error or if you have addressed the issues, please contact support or register again with correct details.</p>";

        sendHtmlEmail(toEmail, subject, "Application Status", content);
    }

    public void sendWorkerWelcomeEmail(String toEmail, String name, String password, String ngoName) {
        String subject = "Pashu Rakshak - Welcome to " + ngoName;
        String content = "<p>Dear <strong>" + name + "</strong>,</p>" +
                "<p>You have been added as a worker for <strong>" + ngoName + "</strong> on Pashu Rakshak.</p>" +
                "<p>Your login credentials are:</p>" +
                "<div style=\"background-color: #eff6ff; border: 1px solid #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;\">"
                +
                "<p style=\"margin: 0 0 10px 0;\"><strong>Email:</strong> " + toEmail + "</p>" +
                "<p style=\"margin: 0;\"><strong>Password:</strong> " + password + "</p>" +
                "</div>" +
                "<p>Please log in and change your password immediately.</p>";

        sendHtmlEmail(toEmail, subject, "Welcome Aboard", content);
    }

    public void sendNgoRepresentativeApprovalEmail(String toEmail, String fullName) {
        String subject = "Pashu Rakshak - NGO Representative Account Approved";
        String content = "<p>Dear <strong>" + fullName + "</strong>,</p>" +
                "<p>Congratulations! Your NGO Representative account on Pashu Rakshak has been approved.</p>" +
                "<p>You can now log in to your dashboard and start managing your NGO operations:</p>" +
                "<ul>" +
                "<li>Accept and manage animal rescue reports</li>" +
                "<li>Assign workers to tasks</li>" +
                "<li>Track case progress</li>" +
                "<li>Manage your NGO profile</li>" +
                "</ul>" +
                "<p>Thank you for joining our mission to protect animals.</p>";

        sendHtmlEmail(toEmail, subject, "Account Approved", content);
    }

    public void sendNgoRepresentativeRejectionEmail(String toEmail, String fullName, String reason) {
        String subject = "Pashu Rakshak - NGO Representative Application Update";
        String content = "<p>Dear <strong>" + fullName + "</strong>,</p>" +
                "<p>We regret to inform you that your NGO Representative application on Pashu Rakshak has been declined.</p>"
                +
                "<div style=\"background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;\">"
                +
                "<strong style=\"color: #b91c1c;\">Reason:</strong> <span style=\"color: #7f1d1d;\">" + reason
                + "</span>" +
                "</div>" +
                "<p>If you believe this is an error or if you have addressed the issues, please register again with corrected details or contact our support team.</p>";

        sendHtmlEmail(toEmail, subject, "Application Status", content);
    }

    private void sendHtmlEmail(String to, String subject, String title, String bodyContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);

            String htmlTemplate = buildHtmlTemplate(title, bodyContent);
            helper.setText(htmlTemplate, true);

            mailSender.send(message);
            System.out.println("HTML email sent to " + to + " with subject: " + subject);
        } catch (MessagingException e) {
            System.err.println("Failed to send HTML email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String buildHtmlTemplate(String title, String content) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: " + BG_COLOR
                + "; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }"
                +
                ".header { background-color: " + PRIMARY_COLOR + "; padding: 30px 20px; text-align: center; }" +
                ".header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em; }"
                +
                ".content { padding: 40px 30px; color: " + TEXT_COLOR + "; line-height: 1.6; font-size: 16px; }" +
                ".footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }"
                +
                ".button { display: inline-block; background-color: " + PRIMARY_COLOR
                + "; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-top: 20px; }"
                +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<div class=\"header\">" +
                "<h1>Pashu Rakshak</h1>" +
                "</div>" +
                "<div class=\"content\">" +
                "<h2 style=\"color: #111827; margin-top: 0; font-size: 20px; font-weight: 600;\">" + title + "</h2>" +
                content +
                "<p style=\"margin-top: 30px; color: #4b5563;\">Best regards,<br>The Pashu Rakshak Team</p>" +
                "</div>" +
                "<div class=\"footer\">" +
                "&copy; " + java.time.Year.now().getValue() + " Pashu Rakshak. All rights reserved.<br>" +
                "Protecting animals, connecting communities." +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
