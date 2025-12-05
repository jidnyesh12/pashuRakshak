package com.example.pashuRakshak.service;

import com.example.pashuRakshak.dto.NgoRequest;
import com.example.pashuRakshak.entity.Ngo;
import com.example.pashuRakshak.entity.User;
import com.example.pashuRakshak.entity.VerificationStatus;
import com.example.pashuRakshak.repository.NgoRepository;
import com.example.pashuRakshak.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NgoService {

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

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

            if (emailService != null) {
                emailService.sendNgoApprovalEmail(ngo.getEmail(), ngo.getName());
            }

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

            // Also disable the corresponding User account
            Optional<User> userOpt = userRepository.findByEmail(ngo.getEmail());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setEnabled(false);
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
            }

            if (emailService != null) {
                emailService.sendNgoRejectionEmail(ngo.getEmail(), ngo.getName(), reason);
            }

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
}
