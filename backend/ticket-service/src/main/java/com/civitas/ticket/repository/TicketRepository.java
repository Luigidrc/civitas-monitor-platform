package com.civitas.ticket.repository;

import com.civitas.ticket.model.Ticket;
// import org.springframework.data.domain.Range;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    // Trova i ticket vicino a un punto entro una certa distanza (raggio)
    List<Ticket> findByLocationNear(Point location, Distance distance);

    // Trova i ticket all'interno di un'area specifica (es. un quadrato/box)
    // Utile per la visualizzazione su mappa quando l'utente sposta la visuale
    List<Ticket> findByLocationWithin(org.springframework.data.geo.Box box);
}