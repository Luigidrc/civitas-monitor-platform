package com.civitas.ticket.repository;

import com.civitas.ticket.model.Ticket;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    // Trova i ticket filtrando per Comune (Multi-tenancy)
    List<Ticket> findByMunicipalityIdIgnoreCase(String municipalityId);

    // Trova i ticket vicino a un punto entro una certa distanza
    List<Ticket> findByLocationNear(Point location, Distance distance);

    // Trova i ticket all'interno di un'area specifica
    List<Ticket> findByLocationWithin(org.springframework.data.geo.Box box);
}