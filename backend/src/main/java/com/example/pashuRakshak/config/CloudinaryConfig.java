package com.example.pashuRakshak.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        System.out.println("Initializing Cloudinary with cloud_name: " + cloudName);
        System.out.println("API Key present: " + (apiKey != null && !apiKey.isEmpty()));
        System.out.println("API Secret present: " + (apiSecret != null && !apiSecret.isEmpty()));
        
        if (cloudName == null || cloudName.isEmpty() || cloudName.equals("YOUR_CLOUDINARY_CLOUD_NAME")) {
            System.err.println("WARNING: Cloudinary cloud_name not configured properly!");
        }
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_CLOUDINARY_API_KEY")) {
            System.err.println("WARNING: Cloudinary api_key not configured properly!");
        }
        if (apiSecret == null || apiSecret.isEmpty() || apiSecret.equals("YOUR_CLOUDINARY_API_SECRET")) {
            System.err.println("WARNING: Cloudinary api_secret not configured properly!");
        }
        
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }
}