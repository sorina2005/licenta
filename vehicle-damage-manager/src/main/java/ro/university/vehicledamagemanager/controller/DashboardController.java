package ro.university.vehicledamagemanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ro.university.vehicledamagemanager.repository.DamageReportRepository;
import ro.university.vehicledamagemanager.repository.UserRepository;


import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DamageReportRepository damageReportRepository;
    private final UserRepository userRepository;

    public DashboardController(DamageReportRepository damageReportRepository, UserRepository userRepository) {
        this.damageReportRepository = damageReportRepository;
        this.userRepository = userRepository;
    }

    // Am eliminat @PreAuthorize pentru a permite accesul conform regulilor din SecurityConfig
    @GetMapping("/client/reports")
    public ResponseEntity<?> getClientReports(@RequestParam(value = "username", required = false) String username) {
        try {
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.ok(java.util.Collections.emptyList());
            }

            java.util.Optional<ro.university.vehicledamagemanager.model.User> userOpt = userRepository.findByUsername(username.trim());
            if (userOpt.isEmpty()) {
                return ResponseEntity.ok(java.util.Collections.emptyList());
            }

            Long loggedInUserId = userOpt.get().getId();

            java.util.List<ro.university.vehicledamagemanager.model.DamageReport> filteredReports = damageReportRepository.findAll().stream()
                    .filter(report -> report.getUser() != null && report.getUser().getId().equals(loggedInUserId))
                    .toList();

            return ResponseEntity.ok(filteredReports);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la filtrare: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/operator/unassigned")
    public ResponseEntity<?> getUnassignedReports() {
        return ResponseEntity.ok(damageReportRepository.findAll());
    }

    @GetMapping("/inspector/cases")
    public ResponseEntity<?> getInspectorCases() {
        return ResponseEntity.ok(damageReportRepository.findAll());
    }

    @GetMapping("/service/approved-cases")
    public ResponseEntity<?> getApprovedCasesForService() {
        return ResponseEntity.ok(damageReportRepository.findAll());
    }

    @GetMapping("/admin/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la accesarea bazei de date: " + e.getMessage());
        }
    }

    @PostMapping("/client/process-plate")
    public ResponseEntity<?> processPlate(@RequestParam("file") MultipartFile file) {
        try {
            Path tempFile = Files.createTempFile("plate_", file.getOriginalFilename());
            file.transferTo(tempFile.toFile());

            File currentDir = new File(System.getProperty("user.dir"));
            File scriptDir = new File(currentDir.getParentFile(), "proiect_procesare");

            if (!scriptDir.exists() || !new File(scriptDir, "process_image.py").exists()) {
                scriptDir = new File(currentDir, "proiect_procesare");
            }

            ProcessBuilder pb = new ProcessBuilder(
                    "python",
                    "process_image.py",
                    tempFile.toAbsolutePath().toString()
            );

            pb.directory(scriptDir);
            pb.redirectErrorStream(true);

            Process p = pb.start();

            BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                result.append(line);
            }

            Files.delete(tempFile);

            String output = result.toString().trim();

            int jsonStart = output.indexOf("{");
            int jsonEnd = output.lastIndexOf("}");

            if (jsonStart != -1 && jsonEnd != -1 && jsonEnd > jsonStart) {
                String cleanJson = output.substring(jsonStart, jsonEnd + 1);
                return ResponseEntity.ok(cleanJson);
            }

            return ResponseEntity.status(500).body("{\"status\":\"error\", \"message\":\"Scriptul nu a returnat un obiect valid.\"}");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/admin/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        try {
            String roleValue = request.get("role");
            return userRepository.findById(id)
                    .map(user -> {
                        user.setRole(com.example.vehicledamagemanager.model.Role.valueOf(roleValue.toUpperCase()));
                        userRepository.save(user);
                        return ResponseEntity.ok().body("{\"status\":\"success\"}");
                    })
                    .orElse(ResponseEntity.status(404).body("Eroare: Utilizatorul nu a fost gasit."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Eroare: Rolul specificat nu exista in structura Enum.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare interna Java: " + e.getMessage());
        }
    }

    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/admin/users")
    public ResponseEntity<?> createByAdmin(@RequestBody java.util.Map<String, String> request) {
        try {
            ro.university.vehicledamagemanager.model.User user = new ro.university.vehicledamagemanager.model.User();
            user.setUsername(request.get("username"));
            user.setEmail(request.get("email"));
            user.setPassword(passwordEncoder.encode(request.get("password")));
            user.setRole(com.example.vehicledamagemanager.model.Role.valueOf(request.get("role").toUpperCase()));

            userRepository.save(user);
            return ResponseEntity.ok().body("{\"status\":\"success\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la crearea utilizatorului: " + e.getMessage());
        }
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/admin/reports")
    public ResponseEntity<?> getAllReportsForAdmin() {
        try {
            return ResponseEntity.ok(damageReportRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la extragerea dosarelor: " + e.getMessage());
        }
    }

    @GetMapping("/admin/reports/export/pdf")
    public void exportToPDF(jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=raport_global_daune.pdf";
        response.setHeader(headerKey, headerValue);

        // Creare document A4
        com.lowagie.text.Document document = new com.lowagie.text.Document(com.lowagie.text.PageSize.A4);
        com.lowagie.text.pdf.PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // Titlu Raport
        com.lowagie.text.Font fontTitle = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);
        com.lowagie.text.Paragraph titleParagraph = new com.lowagie.text.Paragraph("Raport Global Dosare Daune - AutoDamage Hub", fontTitle);
        titleParagraph.setAlignment(com.lowagie.text.Paragraph.ALIGN_CENTER);
        document.add(titleParagraph);

        // Spaciere
        document.add(new com.lowagie.text.Paragraph(" "));

        // Creare tabel cu 5 coloane
        com.lowagie.text.pdf.PdfPTable table = new com.lowagie.text.pdf.PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[] {1.0f, 2.0f, 4.0f, 2.0f, 2.0f});

        // Header Tabel
        table.addCell("ID");
        table.addCell("Inmatriculare");
        table.addCell("Descriere Incident");
        table.addCell("Status");
        table.addCell("Client");

        // Populare tabel din baza de date
        java.util.List<ro.university.vehicledamagemanager.model.DamageReport> reports = damageReportRepository.findAll();
        for (ro.university.vehicledamagemanager.model.DamageReport r : reports) {
            table.addCell(String.valueOf(r.getId()));
            table.addCell(r.getLicensePlate());
            table.addCell(r.getDescription() != null ? r.getDescription() : "Fara descriere");
            table.addCell(r.getStatus());
            table.addCell(r.getUser() != null ? r.getUser().getUsername() : "Anonim");
        }

        document.add(table);
        document.close();
    }

    @PutMapping("/api/admin/reports/{id}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            if (newStatus == null || newStatus.isEmpty()) {
                return ResponseEntity.badRequest().body("Statusul transmis este invalid.");
            }

            return damageReportRepository.findById(id)
                    .map(report -> {
                        report.setStatus(newStatus.toUpperCase());
                        damageReportRepository.save(report);
                        return ResponseEntity.ok().body("{\"message\":\"Status actualizat cu succes!\"}");
                    })
                    .orElse(ResponseEntity.status(404).body("Dosarul de dauna cu ID-ul " + id + " nu a fost gasit."));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la actualizarea statusului: " + e.getMessage());
        }
    }

    @GetMapping("/admin/users/{userId}/report/pdf")
    public void exportUserReportToPDF(@PathVariable Long userId, jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=fisa_daune_client_" + userId + ".pdf";
        response.setHeader(headerKey, headerValue);

        // Cautare utilizator in baza de date
        ro.university.vehicledamagemanager.model.User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.sendError(404, "Utilizatorul nu a fost gasit.");
            return;
        }

        com.lowagie.text.Document document = new com.lowagie.text.Document(com.lowagie.text.PageSize.A4);
        com.lowagie.text.pdf.PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // Configurare Fonturi pentru aspect profesional
        com.lowagie.text.Font fontTitle = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 16);
        com.lowagie.text.Font fontSection = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 12);
        com.lowagie.text.Font fontBody = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA, 10);
        com.lowagie.text.Font fontTableHeader = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 10);

        // Antet Raport
        com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph("AUTODAMAGE HUB - FISA DE DAUNALITATE CLIENT", fontTitle);
        title.setAlignment(com.lowagie.text.Paragraph.ALIGN_CENTER);
        document.add(title);

        document.add(new com.lowagie.text.Paragraph("------------------------------------------------------------------------------------------------------------------------"));
        document.add(new com.lowagie.text.Paragraph(" "));

        // Sectiunea 1: Date Client
        document.add(new com.lowagie.text.Paragraph("1. DATE IDENTIFICARE ASIGURAT / CLIENT", fontSection));
        document.add(new com.lowagie.text.Paragraph("ID Client: " + user.getId(), fontBody));
        document.add(new com.lowagie.text.Paragraph("Nume Utilizator: " + user.getUsername(), fontBody));
        document.add(new com.lowagie.text.Paragraph("Adresa de Email: " + user.getEmail(), fontBody));
        document.add(new com.lowagie.text.Paragraph("Data Emitere Document: " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), fontBody));

        document.add(new com.lowagie.text.Paragraph(" "));

        // Sectiunea 2: Istoric Dosare si Reparatii Executate
        document.add(new com.lowagie.text.Paragraph("2. ISTORIC DOSARE REPARATII SI DAUNE ASOCIATE", fontSection));
        document.add(new com.lowagie.text.Paragraph(" "));

        // Creare tabel cu dimensiuni fixe pentru coloane
        com.lowagie.text.pdf.PdfPTable table = new com.lowagie.text.pdf.PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[] {1.0f, 2.0f, 5.0f, 2.0f});

        // Celule Header Tabel
        table.addCell(new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Paragraph("ID Dosar", fontTableHeader)));
        table.addCell(new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Paragraph("Numar Auto", fontTableHeader)));
        table.addCell(new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Paragraph("Descriere Avarii si Reparatii Efectuate", fontTableHeader)));
        table.addCell(new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Paragraph("Status Curent", fontTableHeader)));

        // Filtrare dosare specifice utilizatorului selectat
        java.util.List<ro.university.vehicledamagemanager.model.DamageReport> allReports = damageReportRepository.findAll();
        java.util.List<ro.university.vehicledamagemanager.model.DamageReport> userReports = allReports.stream()
                .filter(r -> r.getUser() != null && r.getUser().getId().equals(userId))
                .toList();

        if (userReports.isEmpty()) {
            com.lowagie.text.pdf.PdfPCell emptyCell = new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Paragraph("Nu exista dosare inregistrate pentru acest client.", fontBody));
            emptyCell.setColspan(4);
            emptyCell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            table.addCell(emptyCell);
        } else {
            for (ro.university.vehicledamagemanager.model.DamageReport r : userReports) {
                table.addCell(new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Paragraph(String.valueOf(r.getId()), fontBody)));
                table.addCell(new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Paragraph(r.getLicensePlate(), fontBody)));
                table.addCell(new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Paragraph(r.getDescription() != null ? r.getDescription() : "Fara descriere specficata.", fontBody)));
                table.addCell(new com.lowagie.text.pdf.PdfPCell(new com.lowagie.text.Paragraph(r.getStatus(), fontBody)));
            }
        }

        document.add(table);

        // Subsol document (Clauza de conformitate)
        document.add(new com.lowagie.text.Paragraph(" "));
        com.lowagie.text.Paragraph footer = new com.lowagie.text.Paragraph("Document generat in mod automat de platforma AutoDamage Hub. Datele continute au valoare juridica in relatia cu service-urile partenere si asiguratorii.", fontBody);
        footer.setAlignment(com.lowagie.text.Paragraph.ALIGN_CENTER);
        document.add(footer);

        document.close();
    }
}