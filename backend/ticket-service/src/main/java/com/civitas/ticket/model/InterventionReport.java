package com.civitas.ticket.model;

import java.time.LocalDateTime;

public class InterventionReport {
    private String description; // Testo dell'intervento svolto [cite: 239, 247]
    private String photoUrl;    // URL della foto dell'intervento [cite: 239, 247]
    private LocalDateTime resolutionDate;

    // Costruttore vuoto (necessario per MongoDB/Spring)
    public InterventionReport() {}

    public InterventionReport(String description, String photoUrl) {
        this.description = description;
        this.photoUrl = photoUrl;
        this.resolutionDate = LocalDateTime.now();
    }

    // Aggiungi Getter e Setter per tutti i campi
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public LocalDateTime getResolutionDate() { return resolutionDate; }
    public void setResolutionDate(LocalDateTime resolutionDate) { this.resolutionDate = resolutionDate; }
}
