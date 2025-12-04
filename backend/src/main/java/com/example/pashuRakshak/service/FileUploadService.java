package com.example.pashuRakshak.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadService.class);

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "folder", "pashurakshak"));

            String secureUrl = (String) uploadResult.get("secure_url");
            logger.info("File uploaded successfully to Cloudinary: {}", secureUrl);
            return secureUrl;
        } catch (IOException e) {
            logger.error("Error uploading file to Cloudinary", e);
            throw new RuntimeException("Failed to upload file", e);
        }
    }
}
