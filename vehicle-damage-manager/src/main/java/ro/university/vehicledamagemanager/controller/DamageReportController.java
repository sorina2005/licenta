package ro.university.vehicledamagemanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ro.university.vehicledamagemanager.model.DamageImage;
import ro.university.vehicledamagemanager.model.DamageReport;
import ro.university.vehicledamagemanager.model.RepairItem;
import ro.university.vehicledamagemanager.model.User;
import ro.university.vehicledamagemanager.repository.DamageImageRepository;
import ro.university.vehicledamagemanager.repository.DamageReportRepository;
import ro.university.vehicledamagemanager.repository.UserRepository;



import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/client/reports")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DamageReportController {

    @Autowired
    private DamageReportRepository damageReportRepository;

    @Autowired
    private DamageImageRepository damageImageRepository;

    @Autowired
    private UserRepository userRepository;


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

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody Map<String, Object> payload) {
        try {
            String username = (String) payload.get("username");
            if (username == null || username.isEmpty()) {
                return ResponseEntity.badRequest().body("{\"message\":\"Username-ul lipseste din cerere.\"}");
            }

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost gasit."));

            DamageReport report = new DamageReport();

            if (payload.containsKey("licensePlate")) {
                report.setLicensePlate((String) payload.get("licensePlate"));
            } else {
                return ResponseEntity.badRequest().body("{\"message\":\"Numarul de inmatriculare (licensePlate) lipseste din cerere.\"}");
            }

            report.setDescription(payload.containsKey("description") ? (String) payload.get("description") : "Dosar deschis prin asistent electronic");
            report.setStatus(payload.containsKey("status") ? (String) payload.get("status") : "IN_ASTEPTARE");
            report.setUser(user);

            DamageReport savedReport = damageReportRepository.save(report);
            return ResponseEntity.ok(savedReport);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la salvare pe server: " + e.getMessage() + "\"}");
        }
    }


}