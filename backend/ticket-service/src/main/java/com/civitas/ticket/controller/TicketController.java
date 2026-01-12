package com.civitas.ticket.controller;

import com.civitas.ticket.model.Ticket;
import com.civitas.ticket.repository.TicketRepository;
import com.civitas.ticket.service.GeofencingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    // Devi dichiarare ENTRAMBI come private final per l'iniezione automatica
    private final TicketRepository ticketRepository;
    private final GeofencingService geofencingService;

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Ticket ticket) {
        // Ora geofencingService è riconosciuto!
        if (!geofencingService.isWithinCityLimits(ticket.getLocation())) {
            return ResponseEntity.badRequest()
                    .body("Errore: La posizione indicata è fuori dai confini comunali.");
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