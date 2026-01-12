package com.civitas.notification.service;

import com.civitas.notification.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    // Questo metodo scatta ogni volta che arriva un messaggio nella coda
    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receiveMessage(String message) {
        System.out.println("📨 NOTIFICA RICEVUTA: " + message);
        System.out.println("   -> Sto simulando l'invio di una email...");
        System.out.println("   -> Fatto! ✅");
    }
}