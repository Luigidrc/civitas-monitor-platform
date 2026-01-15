package com.civitas.notification.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_NAME = "ticket.created.queue";

    @Bean
    public Queue notificationQueue() {
        // Crea la coda automaticamente se non esiste
        return new Queue(QUEUE_NAME, true);
    }
}