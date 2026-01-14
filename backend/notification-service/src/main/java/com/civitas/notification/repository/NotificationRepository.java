package com.civitas.notification.repository;

import com.civitas.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Metodo per trovare le notifiche di un utente specifico
    List<Notification> findByRecipientOrderByCreatedAtDesc(String recipient);

    // Metodo per contare quelle non lette
    long countByRecipientAndIsReadFalse(String recipient);
}