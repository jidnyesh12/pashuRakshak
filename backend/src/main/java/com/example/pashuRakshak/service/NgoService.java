package com.example.pashuRakshak.service;

import com.example.pashuRakshak.dto.NgoRequest;
import com.example.pashuRakshak.entity.Ngo;
import com.example.pashuRakshak.entity.User;
import com.example.pashuRakshak.entity.UserRole;
import com.example.pashuRakshak.entity.VerificationStatus;
import com.example.pashuRakshak.repository.NgoRepository;
import com.example.pashuRakshak.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class NgoService {

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Ngo createNgo(NgoRequest request) {
        Ngo ngo = new Ngo();
        ngo.setName(request.getName());
        ngo.setEmail(request.getEmail());
        ngo.setPhone(request.getPhone());
        ngo.setAddress(request.getAddress());
        ngo.setLatitude(request.getLatitude());
        ngo.setLongitude(request.getLongitude());
        ngo.setDescription(request.getDescription());
        ngo.setRegistrationDocumentUrl(request.getRegistrationDocumentUrl());
        ngo.setVerificationStatus(VerificationStatus.PENDING);
        ngo.setIsActive(false);
        ngo.setCreatedAt(LocalDateTime.now());
        ngo.setUpdatedAt(LocalDateTime.now());

        return ngoRepository.save(ngo);
    }

    public List<Ngo> getAllNgos() {
        List<Ngo> allNgos = ngoRepository.findAll();
        // Fix any NGOs with null verification status (from before migration)
        for (Ngo ngo : allNgos) {
            if (ngo.getVerificationStatus() == null) {
                ngo.setVerificationStatus(VerificationStatus.APPROVED);
                if (ngo.getIsActive() == null) {
                    ngo.setIsActive(true);
                }
                ngoRepository.save(ngo);
            }
        }
        return allNgos;
    }

    public List<Ngo> getAllActiveNgos() {
        return ngoRepository.findByIsActiveTrue();
    }

    public List<Ngo> getPendingNgos() {
        return ngoRepository.findByVerificationStatus(VerificationStatus.PENDING);
    }

    public Optional<Ngo> getNgoById(Long id) {
        return ngoRepository.findById(id);
    }

    public Optional<Ngo> getNgoByEmail(String email) {
        return ngoRepository.findByEmail(email);
    }

    public List<Ngo> getNearbyNgos(Double latitude, Double longitude, Double radiusInDegrees) {
        return ngoRepository.findNearbyNgos(latitude, longitude, radiusInDegrees);
    }

    public Optional<Ngo> approveNgo(Long id, Long adminId) {
        Optional<Ngo> ngoOpt = ngoRepository.findById(id);
        if (ngoOpt.isPresent()) {
            Ngo ngo = ngoOpt.get();

            // Generate Unique ID if not present
            if (ngo.getUniqueId() == null) {
                long count = ngoRepository.count();
                // Format: PR-NGO-AX001 (based on total count + 1)
                // Note: Ideally, we should check for uniqueness or use a sequence, but count+1
                // is a simple start per request
                String generatedId = String.format("PR-NGO-AX%03d", count + 1);
                ngo.setUniqueId(generatedId);
            }

            ngo.setVerificationStatus(VerificationStatus.APPROVED);
            ngo.setIsActive(true);
            ngo.setVerifiedBy(adminId);
            ngo.setVerifiedAt(LocalDateTime.now());
            ngo.setUpdatedAt(LocalDateTime.now());

            Ngo savedNgo = ngoRepository.save(ngo);

            // Also enable the corresponding User account for login
            Optional<User> userOpt = userRepository.findByEmail(ngo.getEmail());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setEnabled(true);
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
            }

            // Send approval email
            emailService.sendNgoApprovalEmail(ngo.getEmail(), ngo.getName());

            return Optional.of(savedNgo);
        }
        return Optional.empty();
    }

    public Optional<Ngo> rejectNgo(Long id, Long adminId, String reason) {
        Optional<Ngo> ngoOpt = ngoRepository.findById(id);
        if (ngoOpt.isPresent()) {
            Ngo ngo = ngoOpt.get();
            ngo.setVerificationStatus(VerificationStatus.REJECTED);
            ngo.setIsActive(false);
            ngo.setVerifiedBy(adminId);
            ngo.setVerifiedAt(LocalDateTime.now());
            ngo.setRejectionReason(reason);
            ngo.setUpdatedAt(LocalDateTime.now());

            Ngo savedNgo = ngoRepository.save(ngo);

            // Send rejection email
            emailService.sendNgoRejectionEmail(ngo.getEmail(), ngo.getName(), reason);

            return Optional.of(savedNgo);
        }
        return Optional.empty();
    }

    public Optional<Ngo> updateNgo(Long id, NgoRequest request) {
        Optional<Ngo> ngoOpt = ngoRepository.findById(id);
        if (ngoOpt.isPresent()) {
            Ngo ngo = ngoOpt.get();
            ngo.setName(request.getName());
            ngo.setEmail(request.getEmail());
            ngo.setPhone(request.getPhone());
            ngo.setAddress(request.getAddress());
            ngo.setLatitude(request.getLatitude());
            ngo.setLongitude(request.getLongitude());
            ngo.setDescription(request.getDescription());
            ngo.setUpdatedAt(LocalDateTime.now());

            return Optional.of(ngoRepository.save(ngo));
        }
        return Optional.empty();
    }

    public boolean deactivateNgo(Long id) {
        Optional<Ngo> ngoOpt = ngoRepository.findById(id);
        if (ngoOpt.isPresent()) {
            Ngo ngo = ngoOpt.get();
            ngo.setIsActive(false);
            ngo.setUpdatedAt(LocalDateTime.now());
            ngoRepository.save(ngo);
            return true;
        }
        return false;
    }

    public List<Ngo> getApprovedNgos() {
        return ngoRepository.findByVerificationStatus(VerificationStatus.APPROVED);
    }

    public List<Ngo> getRejectedNgos() {
        return ngoRepository.findByVerificationStatus(VerificationStatus.REJECTED);
    }

    public boolean toggleNgoActiveStatus(Long id) {
        Optional<Ngo> ngoOpt = ngoRepository.findById(id);
        if (ngoOpt.isPresent()) {
            Ngo ngo = ngoOpt.get();
            ngo.setIsActive(!ngo.getIsActive());
            ngo.setUpdatedAt(LocalDateTime.now());
            ngoRepository.save(ngo);
            return true;
        }
        return false;
    }

    public com.example.pashuRakshak.dto.NgoStatsResponse getNgoStats() {
        long total = ngoRepository.count();
        long pending = ngoRepository.countByVerificationStatus(VerificationStatus.PENDING);
        long approved = ngoRepository.countByVerificationStatus(VerificationStatus.APPROVED);
        long rejected = ngoRepository.countByVerificationStatus(VerificationStatus.REJECTED);
        long active = ngoRepository.countByIsActive(true);
        long inactive = ngoRepository.countByIsActive(false);

        return new com.example.pashuRakshak.dto.NgoStatsResponse(
                total, pending, approved, rejected, active, inactive);
    }

    public User addWorker(Long ngoId, String name, String email, String phone, Integer age, String gender) {
        Optional<Ngo> ngoOpt = ngoRepository.findById(ngoId);
        if (ngoOpt.isEmpty()) {
            throw new RuntimeException("NGO not found");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User with this email already exists");
        }

        User worker = new User();
        worker.setUsername(email); // Use email as username
        worker.setEmail(email);
        worker.setFullName(name);
        worker.setPhone(phone);
        worker.setAge(age);
        worker.setGender(gender);
        worker.setPassword(passwordEncoder.encode("123123123")); // Default password
        worker.setRoles(Set.of(UserRole.NGO_WORKER));
        worker.setNgoId(ngoId);
        worker.setEnabled(true);
        worker.setCreatedAt(LocalDateTime.now());
        worker.setUpdatedAt(LocalDateTime.now());

        User savedWorker = userRepository.save(worker);

        // Send welcome email with credentials
        emailService.sendWorkerWelcomeEmail(email, name, "123123123", ngoOpt.get().getName());

        emailService.sendWorkerWelcomeEmail(email, name, "123123123", ngoOpt.get().getName());

        return savedWorker;
    }

    public java.util.List<User> getWorkers(Long ngoId) {
        return userRepository.findByNgoId(ngoId);
    }
}
