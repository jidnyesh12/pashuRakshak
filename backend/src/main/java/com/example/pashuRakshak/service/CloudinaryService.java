package com.example.pashuRakshak.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "pashu-rakshak/reports",
                        "resource_type", "image"
                ));
        return uploadResult.get("secure_url").toString();
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "pashu-rakshak/" + folder,
                        "resource_type", "image"
                ));
        return uploadResult.get("secure_url").toString();
    }

    public String uploadFileWithOptimization(MultipartFile file, String folder) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "pashu-rakshak/" + folder,
                        "resource_type", "image",
                        "quality", "auto:good",
                        "format", "auto"
                ));
        return uploadResult.get("secure_url").toString();
    }

    public void deleteFile(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    public String extractPublicId(String imageUrl) {
        // Extract public ID from Cloudinary URL
        // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/pashu-rakshak/reports/sample.jpg
        // Public ID: pashu-rakshak/reports/sample
        if (imageUrl.contains("/upload/")) {
            String[] parts = imageUrl.split("/upload/");
            if (parts.length > 1) {
                String afterUpload = parts[1];
                // Remove version if present (v1234567890/)
                if (afterUpload.matches("^v\\d+/.*")) {
                    afterUpload = afterUpload.substring(afterUpload.indexOf('/') + 1);
                }
                // Remove file extension
                int lastDot = afterUpload.lastIndexOf('.');
                if (lastDot > 0) {
                    afterUpload = afterUpload.substring(0, lastDot);
                }
                return afterUpload;
            }
        }
        return null;
    }
}