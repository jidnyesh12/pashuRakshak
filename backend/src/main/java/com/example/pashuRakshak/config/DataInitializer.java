package com.example.pashuRakshak.config;

import com.example.pashuRakshak.entity.Ngo;
import com.example.pashuRakshak.entity.User;
import com.example.pashuRakshak.entity.UserRole;
import com.example.pashuRakshak.repository.NgoRepository;
import com.example.pashuRakshak.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private UserRepository userRepository;

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
        ngo3.setIsActive(true);
        ngo3.setCreatedAt(LocalDateTime.now());
        ngo3.setUpdatedAt(LocalDateTime.now());

        ngoRepository.save(ngo1);
        ngoRepository.save(ngo2);
        ngoRepository.save(ngo3);

        System.out.println("Sample NGOs initialized successfully!");
    }

    private void createSampleUsers() {
        // Sample Admin User
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@pashurakshak.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("System Administrator");
        admin.setPhone("+91-9999999999");
        admin.setEnabled(true); // Explicitly enable
        Set<UserRole> adminRoles = new HashSet<>();
        adminRoles.add(UserRole.ADMIN);
        admin.setRoles(adminRoles);

        // Sample NGO User (already approved for testing)
        User ngoUser = new User();
        ngoUser.setUsername("ngouser");
        ngoUser.setEmail("ngo@pawspune.org");
        ngoUser.setPassword(passwordEncoder.encode("ngo123"));
        ngoUser.setFullName("NGO Representative");
        ngoUser.setPhone("+91-9876543210");
        ngoUser.setEnabled(true); // Explicitly enable for testing
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
        regularUser.setEnabled(true); // Explicitly enable
        Set<UserRole> userRoles = new HashSet<>();
        userRoles.add(UserRole.USER);
        regularUser.setRoles(userRoles);

        userRepository.save(admin);
        userRepository.save(ngoUser);
        userRepository.save(regularUser);

        System.out.println("Sample users initialized successfully!");
        System.out.println("Test credentials:");
        System.out.println("Admin: admin/admin123");
        System.out.println("NGO: ngouser/ngo123");
        System.out.println("User: testuser/user123");
    }
}