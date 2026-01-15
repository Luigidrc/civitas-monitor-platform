package com.civitas.notification.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // L'ID dell'utente (che arriverà dal token di Login del Membro A)
    // Per ora usiamo una stringa univoca, es. "mario"
    @Column(unique = true, nullable = false)
    private String userId;

    private boolean emailEnabled = true; // Di default SI
    private boolean pushEnabled = true;  // Di default SI

    // Costruttori, Getter e Setter
    public UserPreference() {}

    public UserPreference(String userId, boolean emailEnabled, boolean pushEnabled) {
        this.userId = userId;
        this.emailEnabled = emailEnabled;
        this.pushEnabled = pushEnabled;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public boolean isEmailEnabled() { return emailEnabled; }
    public void setEmailEnabled(boolean emailEnabled) { this.emailEnabled = emailEnabled; }

    public boolean isPushEnabled() { return pushEnabled; }
    public void setPushEnabled(boolean pushEnabled) { this.pushEnabled = pushEnabled; }
}