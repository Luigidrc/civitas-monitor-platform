package com.civitas.ticket.controller;

import com.civitas.ticket.model.Ticket;
import com.civitas.ticket.repository.TicketRepository;
import com.civitas.ticket.service.FileStorageService;
import com.civitas.ticket.service.GeofencingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final GeofencingService geofencingService;
    private final FileStorageService fileStorageService;

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<?> createTicket(
            @RequestPart("ticket") Ticket ticket,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {

        // Controllo Geofencing (invariato)
        if (!geofencingService.isWithinCityLimits(ticket.getLocation())) {
            return ResponseEntity.badRequest().body("Fuori dai confini.");
        }

        // Gestione Media Module (Multi-upload)
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String filename = fileStorageService.save(file);
                    ticket.getImageNames().add(filename);
                }
            }
        }

        ticket.setStatus("OPEN");
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @GetMapping("/nearby")
    public List<Ticket> getNearbyTickets(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radiusKm) {

        Point location = new Point(lng, lat);
        Distance distance = new Distance(radiusKm, Metrics.KILOMETERS);

        return ticketRepository.findByLocationNear(location, distance);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
}