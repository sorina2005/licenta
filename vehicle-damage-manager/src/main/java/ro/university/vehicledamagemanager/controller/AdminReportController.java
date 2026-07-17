package ro.university.vehicledamagemanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ro.university.vehicledamagemanager.model.DamageReport;
import ro.university.vehicledamagemanager.model.RepairItem;
import ro.university.vehicledamagemanager.model.User;
import ro.university.vehicledamagemanager.repository.DamageReportRepository;
import ro.university.vehicledamagemanager.repository.RepairItemRepository;
import ro.university.vehicledamagemanager.repository.UserRepository;
import ro.university.vehicledamagemanager.service.EmailService;
import ro.university.vehicledamagemanager.service.PdfReportService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminReportController {

    @Autowired
    private DamageReportRepository damageReportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RepairItemRepository repairItemRepository;

    @Autowired
    private PdfReportService pdfReportService;

    @Autowired
    private EmailService emailService;

    // report creation and retrieval endpoints

    // create a new damage report
    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody DamageReport report) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

            User user = userRepository.findByUsernameOrEmail(currentUsername).orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"message\":\"Utilizatorul autentificat nu a fost gasit in sistem.\"}");
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

    // get damage report by id
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

    // get filtered reports for inspectors
    @GetMapping("/inspector/reports")
    public ResponseEntity<?> getInspectorReports() {
        try {
            List<DamageReport> reports = damageReportRepository.findAll().stream()
                    .filter(r -> "VALIDAT_PENTRU_INSPECTIE".equalsIgnoreCase(r.getStatus())
                            || "REPARATIE_EFECTUATA".equalsIgnoreCase(r.getStatus())
                            || "FINALIZAT".equalsIgnoreCase(r.getStatus()))
                    .collect(Collectors.toList());

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

    // workflow status update endpoints

    // update report status and notify user via email
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReportStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            DamageReport report = damageReportRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Dosarul nu a fost gasit"));

            String newStatus = payload.get("status");
            report.setStatus(newStatus);

            damageReportRepository.save(report);

            if (report.getUser() != null && report.getUser().getEmail() != null) {
                emailService.sendStatusEmail(
                        report.getUser().getEmail(),
                        report.getId(),
                        report.getLicensePlate(),
                        newStatus
                );
            }

            return ResponseEntity.ok().body("{\"message\":\"Status actualizat si email trimis!\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\":\"Eroare: " + e.getMessage() + "\"}");
        }
    }


    // export report details to pdf
    @GetMapping("/{id}/export-pdf")
    public ResponseEntity<byte[]> exportReportToPdf(@PathVariable Long id) {
        DamageReport report = damageReportRepository.findById(id).orElseThrow();
        byte[] pdfBytes = pdfReportService.generateDamageReport(report);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Dosar_Dauna_" + id + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    // save operator review decision
    @PutMapping("/{id}/review")
    public ResponseEntity<?> reviewReport(@PathVariable Long id, @RequestBody Map<String, String> payload) {
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

    // save inspector review decision
    @PutMapping("/{id}/inspector-review")
    public ResponseEntity<?> inspectorReview(@PathVariable Long id, @RequestBody Map<String, String> payload) {
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

    // processing and generation endpoints

    // finalize repair and save repair items
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