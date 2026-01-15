package com.civitas.ticket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.civitas.ticket.model.InterventionReport;
import com.civitas.ticket.model.Ticket;
import com.civitas.ticket.repository.TicketRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    // Task: Moderation API - Rifiuta un ticket inappropriato 
    public Ticket rejectTicket(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trovato"));
        
        ticket.setStatus("REJECTED");
        // REGISTRAZIONE NELLA TIMELINE 
        ticket.addHistoryEvent("REJECTED", "Ticket rifiutato dal moderatore.");
        
        return ticketRepository.save(ticket);
    }

    // Task: Workflow Logic - Prendi in carico il ticket 
    public Ticket takeCharge(String id, String operatorId) {
    Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket non trovato"));
    
    ticket.setStatus("IN_PROGRESS");
    ticket.setAssignedOperatorId(operatorId);
    
    // DEBUG: Stampa la dimensione della history prima dell'aggiunta
    System.out.println("History prima: " + (ticket.getHistory() != null ? ticket.getHistory().size() : "null"));
    
    ticket.addHistoryEvent("IN_PROGRESS", "Preso in carico da: " + operatorId);
    
    // DEBUG: Stampa dopo l'aggiunta
    System.out.println("History dopo: " + ticket.getHistory().size());
    
    return ticketRepository.save(ticket);
}

    // Task: Close Ticket Logic - Richiede obbligatoriamente il Report 
    public Ticket closeTicket(String id, InterventionReport report) {
        // Controllo validità report (Full Compliance) 
        if (report == null || report.getDescription() == null || report.getDescription().isEmpty()) {
            throw new RuntimeException("Il report di intervento è obbligatorio per chiudere il ticket");
        }
        
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trovato"));
        
        ticket.setReport(report);
        ticket.setStatus("RESOLVED");
        
        // REGISTRAZIONE NELLA TIMELINE 
        ticket.addHistoryEvent("RESOLVED", "Lavoro completato e ticket chiuso.");
        
        return ticketRepository.save(ticket);
    }
}