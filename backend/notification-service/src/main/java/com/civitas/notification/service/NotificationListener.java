package com.civitas.notification.service;

import com.civitas.notification.model.Notification;
import com.civitas.notification.model.UserPreference;
import com.civitas.notification.repository.NotificationRepository;
import com.civitas.notification.repository.UserPreferenceRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    private final NotificationRepository notificationRepository;
    private final UserPreferenceRepository preferenceRepository;

    public NotificationListener(NotificationRepository notificationRepository, UserPreferenceRepository preferenceRepository) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
    }

    // Ascolta la coda "ticket.created.queue" (definita in RabbitMQConfig)
    @RabbitListener(queues = "ticket.created.queue")
    public void handleTicketCreated(String messageBody) {
        System.out.println("📬 Messaggio ricevuto da RabbitMQ: " + messageBody);

        // NOTA: In un caso reale, il messaggio sarebbe un JSON (es. {"userId":"Luigi", "text":"..."})
        // Per semplicità ora assumiamo che il messaggio sia una stringa grezza o simuliamo i dati.

        String userId = "Luigi"; // Simuliamo che il destinatario sia sempre Luigi per ora
        String title = "Nuovo Ticket";
        String content = messageBody; // Usiamo il testo del messaggio come contenuto

        // 1. Salviamo SEMPRE la notifica nel DB (per la campanella sul sito)
        Notification notif = new Notification(userId, title, content);
        notificationRepository.save(notif);
        System.out.println("✅ Notifica salvata nel DB per la Dashboard.");

        // 2. Controlliamo le preferenze per invii extra (Email/Push)
        UserPreference prefs = preferenceRepository.findByUserId(userId)
                .orElse(new UserPreference(userId, true, true)); // Default tutto attivo

        // 3. Logica Email
        if (prefs.isEmailEnabled()) {
            sendSimulatedEmail(userId, content);
        } else {
            System.out.println("🔕 L'utente " + userId + " ha disattivato le EMAIL. Skip.");
        }

        // 4. Logica Push
        if (prefs.isPushEnabled()) {
            sendSimulatedPush(userId, content);
        } else {
            System.out.println("🔕 L'utente " + userId + " ha disattivato le PUSH. Skip.");
        }
    }

    private void sendSimulatedEmail(String to, String text) {
        // Qui ci andrebbe JavaMailSender
        System.out.println("📧 [SIMULAZIONE] Invio Email a " + to + ": " + text);
    }

    private void sendSimulatedPush(String to, String text) {
        // Qui ci andrebbe Firebase / WebSockets
        System.out.println("📱 [SIMULAZIONE] Invio Push a " + to + ": " + text);
    }
}