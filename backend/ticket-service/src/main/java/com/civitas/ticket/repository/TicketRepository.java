package com.civitas.ticket.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.civitas.ticket.model.Ticket;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    // Utile per la tua Dashboard Manager: filtra per comune 
    List<Ticket> findByTenantId(String tenantId);
    
    // Per l'App Operatore: trova i ticket assegnati a lui 
    List<Ticket> findByAssignedOperatorId(String operatorId);
}
