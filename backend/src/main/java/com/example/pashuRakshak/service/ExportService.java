package com.example.pashuRakshak.service;

import com.example.pashuRakshak.entity.AnimalReport;
import com.example.pashuRakshak.entity.Ngo;
import com.example.pashuRakshak.entity.User;
import com.example.pashuRakshak.repository.AnimalReportRepository;
import com.example.pashuRakshak.repository.NgoRepository;
import com.example.pashuRakshak.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportService {

    @Autowired
    private AnimalReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NgoRepository ngoRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Export all reports to CSV format
     */
    public byte[] exportReportsToCsv() {
        List<AnimalReport> reports = reportRepository.findAll();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        // CSV Header
        writer.println(
                "Tracking ID,Animal Type,Condition,Injury Description,Address,Latitude,Longitude,Status,Reporter Name,Reporter Phone,Reporter Email,Assigned NGO,Assigned Worker,Created At,Updated At");

        // CSV Data
        for (AnimalReport report : reports) {
            writer.println(String.format(
                    "\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%s,%s,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"",
                    escapeCsv(report.getTrackingId()),
                    escapeCsv(report.getAnimalType()),
                    escapeCsv(report.getCondition()),
                    escapeCsv(report.getInjuryDescription()),
                    escapeCsv(report.getAddress()),
                    report.getLatitude(),
                    report.getLongitude(),
                    report.getStatus() != null ? report.getStatus().name() : "",
                    escapeCsv(report.getReporterName()),
                    escapeCsv(report.getReporterPhone()),
                    escapeCsv(report.getReporterEmail()),
                    escapeCsv(report.getAssignedNgoName()),
                    escapeCsv(report.getAssignedWorkerName()),
                    report.getCreatedAt() != null ? report.getCreatedAt().format(DATE_FORMATTER) : "",
                    report.getUpdatedAt() != null ? report.getUpdatedAt().format(DATE_FORMATTER) : ""));
        }

        writer.flush();
        return out.toByteArray();
    }

    /**
     * Export all users to CSV format
     */
    public byte[] exportUsersToCsv() {
        List<User> users = userRepository.findAll();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        // CSV Header
        writer.println("ID,Username,Email,Full Name,Phone,Age,Gender,Roles,NGO ID,Enabled,Created At,Updated At");

        // CSV Data
        for (User user : users) {
            String roles = user.getRoles() != null
                    ? user.getRoles().stream().map(Enum::name).reduce((a, b) -> a + "; " + b).orElse("")
                    : "";

            writer.println(String.format("%d,\"%s\",\"%s\",\"%s\",\"%s\",%s,\"%s\",\"%s\",%s,%s,\"%s\",\"%s\"",
                    user.getId(),
                    escapeCsv(user.getUsername()),
                    escapeCsv(user.getEmail()),
                    escapeCsv(user.getFullName()),
                    escapeCsv(user.getPhone()),
                    user.getAge() != null ? user.getAge() : "",
                    escapeCsv(user.getGender()),
                    roles,
                    user.getNgoId() != null ? user.getNgoId() : "",
                    user.isEnabled(),
                    user.getCreatedAt() != null ? user.getCreatedAt().format(DATE_FORMATTER) : "",
                    user.getUpdatedAt() != null ? user.getUpdatedAt().format(DATE_FORMATTER) : ""));
        }

        writer.flush();
        return out.toByteArray();
    }

    /**
     * Export all NGOs to CSV format
     */
    public byte[] exportNgosToCsv() {
        List<Ngo> ngos = ngoRepository.findAll();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        // CSV Header
        writer.println(
                "ID,Unique ID,Name,Email,Phone,Address,Latitude,Longitude,Verification Status,Is Active,Verified By,Verified At,Rejection Reason,Created At,Updated At");

        // CSV Data
        for (Ngo ngo : ngos) {
            writer.println(String.format(
                    "%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%s,%s,\"%s\",%s,%s,\"%s\",\"%s\",\"%s\",\"%s\"",
                    ngo.getId(),
                    escapeCsv(ngo.getUniqueId()),
                    escapeCsv(ngo.getName()),
                    escapeCsv(ngo.getEmail()),
                    escapeCsv(ngo.getPhone()),
                    escapeCsv(ngo.getAddress()),
                    ngo.getLatitude(),
                    ngo.getLongitude(),
                    ngo.getVerificationStatus() != null ? ngo.getVerificationStatus().name() : "",
                    ngo.getIsActive(),
                    ngo.getVerifiedBy() != null ? ngo.getVerifiedBy() : "",
                    ngo.getVerifiedAt() != null ? ngo.getVerifiedAt().format(DATE_FORMATTER) : "",
                    escapeCsv(ngo.getRejectionReason()),
                    ngo.getCreatedAt() != null ? ngo.getCreatedAt().format(DATE_FORMATTER) : "",
                    ngo.getUpdatedAt() != null ? ngo.getUpdatedAt().format(DATE_FORMATTER) : ""));
        }

        writer.flush();
        return out.toByteArray();
    }

    /**
     * Export pending NGO representatives to CSV format
     */
    public byte[] exportPendingNgoRepresentativesToCsv() {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream().anyMatch(role -> role.name().equals("NGO")))
                .filter(user -> !user.isEnabled())
                .toList();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        // CSV Header
        writer.println("ID,Username,Email,Full Name,Phone,NGO ID,Created At");

        // CSV Data
        for (User user : users) {
            writer.println(String.format("%d,\"%s\",\"%s\",\"%s\",\"%s\",%s,\"%s\"",
                    user.getId(),
                    escapeCsv(user.getUsername()),
                    escapeCsv(user.getEmail()),
                    escapeCsv(user.getFullName()),
                    escapeCsv(user.getPhone()),
                    user.getNgoId() != null ? user.getNgoId() : "",
                    user.getCreatedAt() != null ? user.getCreatedAt().format(DATE_FORMATTER) : ""));
        }

        writer.flush();
        return out.toByteArray();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        // Escape double quotes by doubling them
        return value.replace("\"", "\"\"").replace("\n", " ").replace("\r", " ");
    }
}
