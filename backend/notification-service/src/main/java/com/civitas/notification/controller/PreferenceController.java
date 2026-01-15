package com.civitas.notification.controller;

import com.civitas.notification.model.UserPreference;
import com.civitas.notification.repository.UserPreferenceRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@CrossOrigin(origins = "*") // Importante per il frontend!
public class PreferenceController {

    private final UserPreferenceRepository repository;

    public PreferenceController(UserPreferenceRepository repository) {
        this.repository = repository;
    }

    // 1. Leggi le preferenze (se non esistono, crea quelle di default)
    @GetMapping
    public UserPreference getPreferences(@RequestParam String userId) {
        return repository.findByUserId(userId)
                .orElseGet(() -> repository.save(new UserPreference(userId, true, true)));
    }

    // 2. Aggiorna le preferenze
    @PutMapping
    public UserPreference updatePreferences(@RequestParam String userId,
                                            @RequestParam boolean email,
                                            @RequestParam boolean push) {
        UserPreference pref = repository.findByUserId(userId)
                .orElse(new UserPreference(userId, true, true));

        pref.setEmailEnabled(email);
        pref.setPushEnabled(push);

        return repository.save(pref);
    }
}