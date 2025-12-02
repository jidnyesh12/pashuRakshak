package com.example.pashuRakshak.controller;

import com.example.pashuRakshak.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "File must be an image"));
            }

            // Check file size (5MB limit)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB"));
            }

            System.out.println("Uploading file: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");
            String imageUrl = cloudinaryService.uploadFile(file, "reports");
            System.out.println("Upload successful: " + imageUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("url", imageUrl);
            response.put("message", "Image uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Upload error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    @PostMapping("/images")
    public ResponseEntity<?> uploadMultipleImages(@RequestParam("files") MultipartFile[] files) {
        try {
            if (files.length == 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "No files provided"));
            }

            if (files.length > 5) {
                return ResponseEntity.badRequest().body(Map.of("error", "Maximum 5 files allowed"));
            }

            List<String> imageUrls = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            for (MultipartFile file : files) {
                try {
                    // Validate each file
                    if (file.isEmpty()) {
                        errors.add("Empty file: " + file.getOriginalFilename());
                        continue;
                    }

                    String contentType = file.getContentType();
                    if (contentType == null || !contentType.startsWith("image/")) {
                        errors.add("Invalid file type: " + file.getOriginalFilename());
                        continue;
                    }

                    if (file.getSize() > 5 * 1024 * 1024) {
                        errors.add("File too large: " + file.getOriginalFilename());
                        continue;
                    }

                    System.out.println("Uploading file: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");
                    String imageUrl = cloudinaryService.uploadFile(file, "reports");
                    System.out.println("Upload successful: " + imageUrl);
                    imageUrls.add(imageUrl);
                } catch (Exception e) {
                    System.err.println("Upload error for " + file.getOriginalFilename() + ": " + e.getMessage());
                    e.printStackTrace();
                    errors.add("Failed to upload " + file.getOriginalFilename() + ": " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("urls", imageUrls);
            response.put("uploaded", imageUrls.size());
            response.put("total", files.length);
            
            if (!errors.isEmpty()) {
                response.put("errors", errors);
            }

            if (imageUrls.isEmpty()) {
                return ResponseEntity.status(400).body(response);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload images: " + e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testCloudinaryConfig() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cloudinary service is available");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Cloudinary configuration error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/image")
    public ResponseEntity<?> deleteImage(@RequestParam("url") String imageUrl) {
        try {
            String publicId = cloudinaryService.extractPublicId(imageUrl);
            if (publicId != null) {
                cloudinaryService.deleteFile(publicId);
                return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid image URL"));
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete image: " + e.getMessage()));
        }
    }
}