package com.example.pashuRakshak.repository;

import com.example.pashuRakshak.entity.AnimalReport;
import com.example.pashuRakshak.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnimalReportRepository extends JpaRepository<AnimalReport, Long> {

       Optional<AnimalReport> findByTrackingId(String trackingId);

       List<AnimalReport> findByStatus(ReportStatus status);

       List<AnimalReport> findByAssignedNgoId(Long ngoId);

       List<AnimalReport> findByReporterEmail(String reporterEmail);

       @Query("SELECT r FROM AnimalReport r WHERE r.status IN :statuses ORDER BY r.createdAt DESC")
       List<AnimalReport> findByStatusIn(@Param("statuses") List<ReportStatus> statuses);

       @Query("SELECT r FROM AnimalReport r WHERE " +
                     "r.status IN ('SUBMITTED', 'SEARCHING_FOR_HELP') AND " +
                     "SQRT(POWER(r.latitude - :lat, 2) + POWER(r.longitude - :lng, 2)) <= :radius")
       List<AnimalReport> findNearbyReports(@Param("lat") Double latitude,
                     @Param("lng") Double longitude,
                     @Param("radius") Double radius);

       // Count methods for statistics
       long countByStatus(ReportStatus status);
}