package com.civitas.ticket.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String description;
    private String tenantId;           // Isolamento dati per Comune [cite: 5, 11]
    private String status;             // RECEIVED, IN_PROGRESS, RESOLVED, REJECTED 
    private String assignedOperatorId; // ID Operatore assegnato 
    private List<StatusEvent> history = new ArrayList<>(); // Storico per Timeline 
    private InterventionReport report; // Report obbligatorio per chiusura [cite: 11, 19]

    // Metodo fondamentale per il Workflow e la Timeline 
    public void addHistoryEvent(String status, String details) {
        if (this.history == null) {
            this.history = new ArrayList<>();
        }
        // Usiamo ZonedDateTime per compatibilità massima con il Frontend 
        String timestamp = java.time.ZonedDateTime.now().toString();
        this.history.add(new StatusEvent(status, details, timestamp));
    }

    // --- GETTER E SETTER (Indispensabili per il salvataggio su MongoDB) ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedOperatorId() { return assignedOperatorId; }
    public void setAssignedOperatorId(String assignedOperatorId) { this.assignedOperatorId = assignedOperatorId; }

    public List<StatusEvent> getHistory() {
        if (this.history == null) { this.history = new ArrayList<>(); }
        return history;
    }
    public void setHistory(List<StatusEvent> history) { this.history = history; }

    public InterventionReport getReport() { return report; }
    public void setReport(InterventionReport report) { this.report = report; }
}