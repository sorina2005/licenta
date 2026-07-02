package ro.university.vehicledamagemanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ro.university.vehicledamagemanager.model.DamageImage;
import ro.university.vehicledamagemanager.model.DamageReport;
import ro.university.vehicledamagemanager.model.User;
import ro.university.vehicledamagemanager.repository.DamageImageRepository;
import ro.university.vehicledamagemanager.repository.DamageReportRepository;
import ro.university.vehicledamagemanager.repository.UserRepository;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DamageReportController {

    @Autowired
    private DamageReportRepository damageReportRepository;

    @Autowired
    private DamageImageRepository damageImageRepository;

    @Autowired
    private UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads/";

    @PostMapping("/{id}/upload-images")
    public ResponseEntity<?> uploadImages(@PathVariable Long id, @RequestParam("files") MultipartFile[] files) {
        try {
            DamageReport report = damageReportRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Dosarul nu a fost gasit"));

            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

            User user = userRepository.findAll().stream()
                    .filter(u -> currentUsername.equalsIgnoreCase(u.getUsername()) || currentUsername.equalsIgnoreCase(u.getEmail()))
                    .findFirst()
                    .orElse(null);

            if (user == null) {
                user = report.getUser();
            }

            if (user == null) {
                user = userRepository.findAll().stream().findFirst().orElse(null);
            }

            Long userId = (user != null) ? user.getId() : 0L;
            Path reportFolderPath = Paths.get("uploads", "dosar_" + id).toAbsolutePath().normalize();

            if (!Files.exists(reportFolderPath)) {
                Files.createDirectories(reportFolderPath);
            }

            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                if (file.isEmpty()) continue;

                String originalName = file.getOriginalFilename();
                String extension = "";
                if (originalName != null && originalName.contains(".")) {
                    extension = originalName.substring(originalName.lastIndexOf("."));
                }

                String uniqueFileName = "dosar_" + id + "_user_" + userId + "_foto_" + (i + 1) + "_" + System.currentTimeMillis() + extension;
                Path filePath = reportFolderPath.resolve(uniqueFileName);

                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                DamageImage damageImage = new DamageImage();
                String relativePath = "dosar_" + id + "/" + uniqueFileName;

                damageImage.setFileName(relativePath);
                damageImage.setDamageReport(report);
                damageImageRepository.save(damageImage);
            }

            return ResponseEntity.ok().body("{\"message\":\"Imaginile au fost salvate cu succes!\"}");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la salvarea fisierelor: " + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/api/admin/reports")
    public ResponseEntity<?> createReport(@RequestBody DamageReport report) {
        try {
            // 1. Extragem automat username-ul din token-ul JWT trimis în Header
            String currentUsername = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication().getName();

            // 2. Căutăm utilizatorul în baza de date
            User user = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("Utilizatorul curent nu a fost găsit în sistem."));

            // 3. Legăm dosarul de acest utilizator (rezolvă eroarea de Foreign Key)
            report.setUser(user);

            // 4. Forțăm starea inițială corectă, în caz că lipsește din frontend
            if (report.getStatus() == null) {
                report.setStatus("IN_ASTEPTARE");
            }

            // 5. Salvarea persistentă în MySQL
            DamageReport savedReport = damageReportRepository.save(report);
            return ResponseEntity.ok(savedReport);

        } catch (Exception e) {
            e.printStackTrace(); // Vei vedea detaliile complete în consola IntelliJ
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la salvare pe server: " + e.getMessage() + "\"}");
        }
    }
}