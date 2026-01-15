package com.civitas.ticket.model;

public class StatusEvent {
    private String status;
    private String details;
    private String timestamp;

    // COSTRUTTORE VUOTO (Obbligatorio per MongoDB) 
    public StatusEvent() {}

    // COSTRUTTORE COMPLETO 
    public StatusEvent(String status, String details, String timestamp) {
        this.status = status;
        this.details = details;
        this.timestamp = timestamp;
    }

    // GETTER (Senza questi vedi "Object 0" o campi vuoti)
    public String getStatus() { return status; }
    public String getDetails() { return details; }
    public String getTimestamp() { return timestamp; }

    // SETTER
    public void setStatus(String status) { this.status = status; }
    public void setDetails(String details) { this.details = details; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}