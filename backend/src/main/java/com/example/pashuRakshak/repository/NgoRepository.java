package com.example.pashuRakshak.repository;

import com.example.pashuRakshak.entity.Ngo;
import com.example.pashuRakshak.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NgoRepository extends JpaRepository<Ngo, Long> {

       Optional<Ngo> findByEmail(String email);

       List<Ngo> findByIsActiveTrue();

       List<Ngo> findByVerificationStatus(VerificationStatus status);

       // Find NGOs within a certain radius (simplified version using basic math)
       @Query("SELECT n FROM Ngo n WHERE n.isActive = true AND " +
                     "SQRT(POWER(n.latitude - :lat, 2) + POWER(n.longitude - :lng, 2)) <= :radius")
       List<Ngo> findNearbyNgos(@Param("lat") Double latitude,
                     @Param("lng") Double longitude,
                     @Param("radius") Double radius);

       // Count methods for statistics
       long countByVerificationStatus(VerificationStatus status);

       long countByIsActive(Boolean isActive);
}