package com.example.pashuRakshak.service;

import com.example.pashuRakshak.dto.DashboardStatsResponse;
import com.example.pashuRakshak.dto.NgoStatsResponse;
import com.example.pashuRakshak.dto.UserStatsResponse;
import com.example.pashuRakshak.entity.ReportStatus;
import com.example.pashuRakshak.entity.User;
import com.example.pashuRakshak.entity.UserRole;
import com.example.pashuRakshak.repository.AnimalReportRepository;
import com.example.pashuRakshak.repository.NgoRepository;
import com.example.pashuRakshak.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private AnimalReportRepository reportRepository;

    @Autowired
    private NgoService ngoService;

    /**
     * Get comprehensive dashboard statistics
     */
    public DashboardStatsResponse getDashboardStats() {
        UserStatsResponse userStats = getUserStats();
        NgoStatsResponse ngoStats = ngoService.getNgoStats();

        // Report statistics
        long totalReports = reportRepository.count();
        long pendingReports = reportRepository.countByStatus(ReportStatus.SUBMITTED);
        // Count reports that are assigned/being processed by NGOs (all active statuses)
        long assignedReports = reportRepository.countByStatus(ReportStatus.SEARCHING_FOR_HELP)
                + reportRepository.countByStatus(ReportStatus.HELP_ON_THE_WAY)
                + reportRepository.countByStatus(ReportStatus.TEAM_DISPATCHED)
                + reportRepository.countByStatus(ReportStatus.ANIMAL_RESCUED);
        long resolvedReports = reportRepository.countByStatus(ReportStatus.CASE_RESOLVED);

        return new DashboardStatsResponse(
                userStats, ngoStats,
                totalReports, pendingReports, assignedReports, resolvedReports);
    }

    /**
     * Get user statistics
     */
    public UserStatsResponse getUserStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabled(true);
        long inactiveUsers = userRepository.countByEnabled(false);

        // Count users by role
        Map<String, Long> usersByRole = new HashMap<>();
        for (UserRole role : UserRole.values()) {
            long count = userRepository.findAll().stream()
                    .filter(user -> user.getRoles().contains(role))
                    .count();
            usersByRole.put(role.name(), count);
        }

        return new UserStatsResponse(totalUsers, activeUsers, inactiveUsers, usersByRole);
    }

    /**
     * Approve NGO representative - enable user account
     */
    public boolean approveNgoRepresentative(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Check if user has NGO role
            if (!user.getRoles().contains(UserRole.NGO)) {
                return false; // User is not an NGO representative
            }

            // Enable the user account
            user.setEnabled(true);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            return true;
        }
        return false;
    }

    /**
     * Get pending NGO representatives (NGO role users who are not enabled)
     */
    public long getPendingNgoRepresentativesCount() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().contains(UserRole.NGO) && !user.isEnabled())
                .count();
    }
}
