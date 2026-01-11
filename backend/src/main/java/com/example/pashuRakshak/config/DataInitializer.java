package com.example.pashuRakshak.config;

import com.example.pashuRakshak.entity.AnimalReport;
import com.example.pashuRakshak.entity.Ngo;
import com.example.pashuRakshak.entity.ReportStatus;
import com.example.pashuRakshak.entity.User;
import com.example.pashuRakshak.entity.UserRole;
import com.example.pashuRakshak.repository.AnimalReportRepository;
import com.example.pashuRakshak.repository.NgoRepository;
import com.example.pashuRakshak.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AnimalReportRepository reportRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize with some sample NGOs if database is empty
        if (ngoRepository.count() == 0) {
            createSampleNgos();
        }

        // Initialize with some sample users if database is empty
        if (userRepository.count() == 0) {
            createSampleUsers();
        }

        // Initialize with some sample reports if database is empty
        if (reportRepository.count() == 0) {
            createSampleReports();
        }
    }

    private void createSampleNgos() {
        // Sample NGO 1 - Pune
        Ngo ngo1 = new Ngo();
        ngo1.setName("Pune Animal Welfare Society");
        ngo1.setEmail("contact@pawspune.org");
        ngo1.setPhone("+91-9876543210");
        ngo1.setAddress("123 FC Road, Pune, Maharashtra");
        ngo1.setLatitude(18.5204);
        ngo1.setLongitude(73.8567);
        ngo1.setDescription("Dedicated to rescuing and caring for injured animals in Pune");
        ngo1.setVerificationStatus(com.example.pashuRakshak.entity.VerificationStatus.APPROVED);
        ngo1.setIsActive(true);
        ngo1.setCreatedAt(LocalDateTime.now());
        ngo1.setUpdatedAt(LocalDateTime.now());

        // Sample NGO 2 - Mumbai
        Ngo ngo2 = new Ngo();
        ngo2.setName("Mumbai Animal Care Foundation");
        ngo2.setEmail("help@macfmumbai.org");
        ngo2.setPhone("+91-9876543211");
        ngo2.setAddress("456 Bandra West, Mumbai, Maharashtra");
        ngo2.setLatitude(19.0760);
        ngo2.setLongitude(72.8777);
        ngo2.setDescription("Emergency animal rescue services in Mumbai");
        ngo2.setVerificationStatus(com.example.pashuRakshak.entity.VerificationStatus.APPROVED);
        ngo2.setIsActive(true);
        ngo2.setCreatedAt(LocalDateTime.now());
        ngo2.setUpdatedAt(LocalDateTime.now());

        // Sample NGO 3 - Delhi
        Ngo ngo3 = new Ngo();
        ngo3.setName("Delhi Animal Rescue Team");
        ngo3.setEmail("rescue@dartdelhi.org");
        ngo3.setPhone("+91-9876543212");
        ngo3.setAddress("789 Connaught Place, New Delhi");
        ngo3.setLatitude(28.7041);
        ngo3.setLongitude(77.1025);
        ngo3.setDescription("24/7 animal emergency response in Delhi NCR");
        ngo3.setVerificationStatus(com.example.pashuRakshak.entity.VerificationStatus.APPROVED);
        ngo3.setIsActive(true);
        ngo3.setCreatedAt(LocalDateTime.now());
        ngo3.setUpdatedAt(LocalDateTime.now());

        Ngo savedNgo1 = ngoRepository.save(ngo1);
        ngoRepository.save(ngo2);
        ngoRepository.save(ngo3);

        System.out.println("Sample NGOs initialized successfully!");

        // Store first NGO ID for linking to sample user
        this.sampleNgoId = savedNgo1.getId();
    }

    private Long sampleNgoId;

    private void createSampleUsers() {
        // Sample Admin User
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@pashurakshak.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("System Administrator");
        admin.setPhone("+91-9999999999");
        admin.setEnabled(true);
        Set<UserRole> adminRoles = new HashSet<>();
        adminRoles.add(UserRole.ADMIN);
        admin.setRoles(adminRoles);

        // Sample NGO User (linked to first NGO - Pune Animal Welfare Society)
        User ngoUser = new User();
        ngoUser.setUsername("ngouser");
        ngoUser.setEmail("ngo@pawspune.org");
        ngoUser.setPassword(passwordEncoder.encode("ngo123"));
        ngoUser.setFullName("NGO Representative");
        ngoUser.setPhone("+91-9876543210");
        ngoUser.setEnabled(true);
        ngoUser.setNgoId(sampleNgoId); // Link to the first NGO
        Set<UserRole> ngoRoles = new HashSet<>();
        ngoRoles.add(UserRole.NGO);
        ngoUser.setRoles(ngoRoles);

        // Sample Regular User
        User regularUser = new User();
        regularUser.setUsername("testuser");
        regularUser.setEmail("user@example.com");
        regularUser.setPassword(passwordEncoder.encode("user123"));
        regularUser.setFullName("Test User");
        regularUser.setPhone("+91-9876543213");
        regularUser.setEnabled(true);
        Set<UserRole> userRoles = new HashSet<>();
        userRoles.add(UserRole.USER);
        regularUser.setRoles(userRoles);

        userRepository.save(admin);
        userRepository.save(ngoUser);
        userRepository.save(regularUser);

        System.out.println("Sample users initialized successfully!");
        System.out.println("Test credentials:");
        System.out.println("Admin: admin/admin123");
        System.out.println("NGO: ngouser/ngo123 (linked to NGO ID: " + sampleNgoId + ")");
        System.out.println("User: testuser/user123");
    }

    private void createSampleReports() {
        // Sample Report 1 - Injured Dog
        AnimalReport report1 = new AnimalReport();
        report1.setTrackingId("PR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        report1.setAnimalType("Dog");
        report1.setCondition("Critical");
        report1.setInjuryDescription("Injured leg, unable to walk");
        report1.setAdditionalNotes("Dog appears to be a stray, very scared of humans");
        report1.setLatitude(18.5204);
        report1.setLongitude(73.8567);
        report1.setAddress("FC Road, Pune, Maharashtra");
        report1.setImageUrls(List.of("https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400"));
        report1.setStatus(ReportStatus.SUBMITTED);
        report1.setReporterName("Rahul Sharma");
        report1.setReporterPhone("+91-9876543214");
        report1.setReporterEmail("rahul@example.com");
        report1.setCreatedAt(LocalDateTime.now().minusDays(2));
        report1.setUpdatedAt(LocalDateTime.now().minusDays(2));

        // Sample Report 2 - Cat stuck on tree
        AnimalReport report2 = new AnimalReport();
        report2.setTrackingId("PR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        report2.setAnimalType("Cat");
        report2.setCondition("Stressed");
        report2.setInjuryDescription("Stuck on a high tree branch, meowing constantly");
        report2.setAdditionalNotes("White Persian cat, possibly escaped from nearby home");
        report2.setLatitude(19.0760);
        report2.setLongitude(72.8777);
        report2.setAddress("Bandra West, Mumbai, Maharashtra");
        report2.setImageUrls(List.of("https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"));
        report2.setStatus(ReportStatus.HELP_ON_THE_WAY);
        report2.setReporterName("Priya Patel");
        report2.setReporterPhone("+91-9876543215");
        report2.setReporterEmail("priya@example.com");
        report2.setAssignedNgoId(sampleNgoId);
        report2.setAssignedNgoName("Pune Animal Welfare Society");
        report2.setCreatedAt(LocalDateTime.now().minusDays(1));
        report2.setUpdatedAt(LocalDateTime.now().minusHours(12));

        // Sample Report 3 - Cow with wound
        AnimalReport report3 = new AnimalReport();
        report3.setTrackingId("PR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        report3.setAnimalType("Cow");
        report3.setCondition("Moderate");
        report3.setInjuryDescription("Open wound on left side, possibly from an accident");
        report3.setAdditionalNotes("Cow is calm but in pain, needs immediate medical attention");
        report3.setLatitude(28.7041);
        report3.setLongitude(77.1025);
        report3.setAddress("Connaught Place, New Delhi");
        report3.setImageUrls(List.of("https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=400"));
        report3.setStatus(ReportStatus.CASE_RESOLVED);
        report3.setReporterName("Amit Kumar");
        report3.setReporterPhone("+91-9876543216");
        report3.setReporterEmail("amit@example.com");
        report3.setCreatedAt(LocalDateTime.now().minusDays(5));
        report3.setUpdatedAt(LocalDateTime.now().minusDays(3));

        reportRepository.save(report1);
        reportRepository.save(report2);
        reportRepository.save(report3);

        System.out.println("Sample animal reports initialized successfully!");
    }
}
