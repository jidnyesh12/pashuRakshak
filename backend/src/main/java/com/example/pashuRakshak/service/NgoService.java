package com.example.pashuRakshak.service;

import com.example.pashuRakshak.dto.NgoRequest;
import com.example.pashuRakshak.entity.Ngo;
import com.example.pashuRakshak.repository.NgoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NgoService {
    
    @Autowired
    private NgoRepository ngoRepository;
    
    public Ngo createNgo(NgoRequest request) {
        Ngo ngo = new Ngo();
        ngo.setName(request.getName());
        ngo.setEmail(request.getEmail());
        ngo.setPhone(request.getPhone());
        ngo.setAddress(request.getAddress());
        ngo.setLatitude(request.getLatitude());
        ngo.setLongitude(request.getLongitude());
        ngo.setDescription(request.getDescription());
        ngo.setIsActive(true);
        ngo.setCreatedAt(LocalDateTime.now());
        ngo.setUpdatedAt(LocalDateTime.now());
        
        return ngoRepository.save(ngo);
    }
    
    public List<Ngo> getAllActiveNgos() {
        return ngoRepository.findByIsActiveTrue();
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
}