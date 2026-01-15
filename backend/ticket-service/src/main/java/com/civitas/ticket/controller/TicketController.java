package com.civitas.ticket.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.civitas.ticket.model.InterventionReport;
import com.civitas.ticket.model.Ticket;
import com.civitas.ticket.repository.TicketRepository;
import com.civitas.ticket.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    @Autowired
    private TicketService ticketService;
    
    @Autowired
    private TicketRepository ticketRepository;

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    // Endpoint per il Manager: Rifiuta segnalazione 
    @PatchMapping("/{id}/reject")
    public ResponseEntity<Ticket> rejectTicket(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.rejectTicket(id));
    }

    // Endpoint per l'Operatore: Prendi in carico 
    @PatchMapping("/{id}/take-charge")
    public ResponseEntity<Ticket> takeCharge(@PathVariable String id, @RequestParam String operatorId) {
        return ResponseEntity.ok(ticketService.takeCharge(id, operatorId));
    }

    // Endpoint per l'Operatore: Chiudi con Report [cite: 239, 247]
   @PostMapping("/{id}/close")
    public ResponseEntity<?> closeTicket(@PathVariable String id, @RequestBody InterventionReport report) {
        try {
            Ticket updatedTicket = ticketService.closeTicket(id, report);
            return ResponseEntity.ok(updatedTicket);
        } catch (RuntimeException e) {
            // Se il report è vuoto, invia il messaggio d'errore al frontend
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
