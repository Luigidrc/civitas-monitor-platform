package com.civitas.ticket.service;

import org.springframework.beans.factory.annotation.Value; // FONDAMENTALE
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path root;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.root = Paths.get(uploadDir);
    }

    public String save(MultipartFile file) {
        try {
            // Se esiste già, non fa nulla. Se non esiste, la crea.
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));

            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Errore nel salvataggio del file: " + e.getMessage());
        }
    }
}