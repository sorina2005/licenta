package ro.university.vehicledamagemanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ro.university.vehicledamagemanager.model.DamageReport;
import ro.university.vehicledamagemanager.model.RepairItem;
import ro.university.vehicledamagemanager.model.User;
import ro.university.vehicledamagemanager.repository.DamageReportRepository;
import ro.university.vehicledamagemanager.repository.RepairItemRepository;
import ro.university.vehicledamagemanager.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminReportController {

    @Autowired
    private DamageReportRepository damageReportRepository;

    @Autowired
    private UserRepository userRepository; // Injectat corect la nivel de clasa

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody DamageReport report) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

            User user = userRepository.findAll().stream()
                    .filter(u -> currentUsername.equalsIgnoreCase(u.getUsername()) || currentUsername.equalsIgnoreCase(u.getEmail()))
                    .findFirst()
                    .orElse(null);

            if (user == null) {
                user = userRepository.findAll().stream().findFirst().orElse(null);
            }

            if (user == null) {
                return ResponseEntity.status(500).body("{\"message\":\"Eroare: Nu exista niciun utilizator in tabela users din baza de date.\"}");
            }

            report.setUser(user);

            if (report.getStatus() == null || report.getStatus().isEmpty()) {
                report.setStatus("IN_ASTEPTARE");
            }

            DamageReport savedReport = damageReportRepository.save(report);
            return ResponseEntity.ok(savedReport);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la nivelul serverului: " + e.getMessage() + "\"}");
        }
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReportStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        try {
            DamageReport report = damageReportRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Dosarul nu a fost gasit"));

            String newStatus = payload.get("status");
            report.setStatus(newStatus);

            damageReportRepository.save(report);
            return ResponseEntity.ok().body("{\"message\":\"Status actualizat cu succes!\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la actualizarea statusului: " + e.getMessage() + "\"}");
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable Long id) {
        try {
            DamageReport report = damageReportRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Dosarul nu a fost gasit"));
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la preluarea dosarului: " + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<?> reviewReport(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        try {
            DamageReport report = damageReportRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Dosarul nu a fost gasit"));

            String newStatus = payload.get("status");
            report.setStatus(newStatus);

            damageReportRepository.save(report);
            return ResponseEntity.ok().body("{\"message\":\"Decizia operatorului a fost salvata!\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la salvarea deciziei: " + e.getMessage() + "\"}");
        }
    }
    @GetMapping("/inspector/reports")
    public ResponseEntity<?> getInspectorReports() {
        try {
            List<DamageReport> reports = damageReportRepository.findAll().stream()
                    .filter(r -> "VALIDAT_PENTRU_INSPECTIE".equalsIgnoreCase(r.getStatus()))
                    .collect(java.util.stream.Collectors.toList());

            for (DamageReport r : reports) {
                if (r.getImages() != null) {
                    r.getImages().size();
                }
            }

            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la preluarea dosarelor\"}");
        }
    }

    @PutMapping("/{id}/inspector-review")
    public ResponseEntity<?> inspectorReview(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        try {
            DamageReport report = damageReportRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Dosarul nu a fost gasit"));

            String newStatus = payload.get("status");
            report.setStatus(newStatus);

            damageReportRepository.save(report);
            return ResponseEntity.ok().body("{\"message\":\"Decizia inspectorului a fost salvata!\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la salvarea deciziei: " + e.getMessage() + "\"}");
        }
    }

    @Autowired
    private RepairItemRepository repairItemRepository;

    @PostMapping("/{id}/finalize")
    public ResponseEntity<?> finalizeReport(@PathVariable Long id, @RequestBody List<RepairItem> items) {
        try {
            DamageReport report = damageReportRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Dosarul nu a fost gasit"));

            for (RepairItem item : items) {
                item.setDamageReport(report);
                repairItemRepository.save(item);
            }

            report.setStatus("FINALIZAT");
            damageReportRepository.save(report);

            return ResponseEntity.ok().body("{\"message\":\"Devizul a fost salvat si reparatia finalizata!\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la finalizarea reparatiei: " + e.getMessage() + "\"}");
        }
    }
}