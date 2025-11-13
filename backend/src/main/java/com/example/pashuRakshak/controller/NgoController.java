package com.example.pashuRakshak.controller;

import com.example.pashuRakshak.dto.NgoRequest;
import com.example.pashuRakshak.entity.Ngo;
import com.example.pashuRakshak.service.NgoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ngos")
@CrossOrigin(origins = "http://localhost:3000")
public class NgoController {
    
    @Autowired
    private NgoService ngoService;
    
    @PostMapping
    public ResponseEntity<Ngo> createNgo(@Valid @RequestBody NgoRequest request) {
        Ngo ngo = ngoService.createNgo(request);
        return new ResponseEntity<>(ngo, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Ngo>> getAllActiveNgos() {
        List<Ngo> ngos = ngoService.getAllActiveNgos();
        return ResponseEntity.ok(ngos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Ngo> getNgoById(@PathVariable Long id) {
        Optional<Ngo> ngo = ngoService.getNgoById(id);
        return ngo.map(n -> ResponseEntity.ok(n))
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<Ngo> getNgoByEmail(@PathVariable String email) {
        Optional<Ngo> ngo = ngoService.getNgoByEmail(email);
        return ngo.map(n -> ResponseEntity.ok(n))
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/nearby")
    public ResponseEntity<List<Ngo>> getNearbyNgos(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "0.1") Double radius) {
        
        List<Ngo> ngos = ngoService.getNearbyNgos(latitude, longitude, radius);
        return ResponseEntity.ok(ngos);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Ngo> updateNgo(@PathVariable Long id, @Valid @RequestBody NgoRequest request) {
        Optional<Ngo> ngo = ngoService.updateNgo(id, request);
        return ngo.map(n -> ResponseEntity.ok(n))
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateNgo(@PathVariable Long id) {
        boolean deactivated = ngoService.deactivateNgo(id);
        return deactivated ? ResponseEntity.noContent().build() 
                          : ResponseEntity.notFound().build();
    }
}