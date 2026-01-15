package com.civitas.notification.controller;

import com.civitas.notification.model.Notification;
import com.civitas.notification.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    // 1. Endpoint per ottenere le notifiche di un utente
    // Esempio chiamata: GET /api/notifications?user=mario
    @GetMapping
    public List<Notification> getUserNotifications(@RequestParam String user) {
        return repository.findByRecipientOrderByCreatedAtDesc(user);
    }

    // 2. Endpoint per segnare una notifica come letta
    // Esempio chiamata: PATCH /api/notifications/1/read
    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        repository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            repository.save(notification);
        });
    }

    // 3.post di TEST per creare una notifica manualmente (utile per noi ora!)
    @PostMapping("/test")
    public Notification createTestNotification(@RequestParam String user, @RequestParam String msg) {
        return repository.save(new Notification(user, "Test Notifica", msg));
    }

    // 4. NUOVO ENDPOINT: Segna TUTTO come letto per un utente
    @PatchMapping("/read-all")
    public void markAllAsRead(@RequestParam String user) {
        List<Notification> unread = repository.findByRecipientAndIsReadFalse(user);
        unread.forEach(n -> n.setRead(true));
        repository.saveAll(unread);
    }
}