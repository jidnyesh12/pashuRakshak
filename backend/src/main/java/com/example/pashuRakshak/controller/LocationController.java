package com.example.pashuRakshak.controller;

import com.example.pashuRakshak.dto.LocationUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class LocationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/location.update")
    public void sendLocationUpdate(@Payload LocationUpdate update) {
        // Broadcast the update to subscribers of this specific case
        String destination = "/topic/case/" + update.getTrackingId();
        messagingTemplate.convertAndSend(destination, update);

        // System.out.println("Location update for case " + update.getTrackingId() + ":
        // " + update.getLatitude() + ", " + update.getLongitude());
    }
}
