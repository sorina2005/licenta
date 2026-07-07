package ro.university.vehicledamagemanager.controller;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ro.university.vehicledamagemanager.exception.UserNotFoundException;
import ro.university.vehicledamagemanager.model.DamageReport;
import ro.university.vehicledamagemanager.model.RepairItem;
import ro.university.vehicledamagemanager.model.Role;
import ro.university.vehicledamagemanager.model.User;
import ro.university.vehicledamagemanager.repository.DamageReportRepository;
import ro.university.vehicledamagemanager.repository.RepairItemRepository;
import ro.university.vehicledamagemanager.repository.UserRepository;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DashboardController {

    private final DamageReportRepository damageReportRepository;
    private final UserRepository userRepository;
    private final RepairItemRepository repairItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DashboardController(DamageReportRepository damageReportRepository,
                               UserRepository userRepository,
                               RepairItemRepository repairItemRepository,
                               PasswordEncoder passwordEncoder) {
        this.damageReportRepository = damageReportRepository;
        this.userRepository = userRepository;
        this.repairItemRepository = repairItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // client-facing endpoints

    // get all reports for the authenticated client
    @GetMapping("/client/reports")
    public ResponseEntity<?> getClientReports(Principal principal) {
        try {
            if (principal == null || principal.getName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"message\":\"User not authenticated.\"}");
            }
            String username = principal.getName();

            var user = userRepository
                    .findByUsernameOrEmail(username)
                    .orElseThrow(() -> new UserNotFoundException(
                            "Utilizatorul cu username/email '" + username + "' nu exista."));

            Long userId = user.getId();
            var userReports = damageReportRepository.findByUserId(userId);
            return ResponseEntity.ok(userReports);

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404)
                    .body("{\"message\":\"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("{\"message\":\"Eroare la extragerea dosarelor: " + e.getMessage() + "\"}");
        }
    }

    // process license plate image using python script
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

    // role-specific data retrieval endpoints

    // get unassigned reports for operators
    @GetMapping("/operator/unassigned")
    public ResponseEntity<?> getUnassignedReports() {
        // returns all reports for now
        return ResponseEntity.ok(damageReportRepository.findAll());
    }

    // get cases for inspectors
    @GetMapping("/inspector/cases")
    public ResponseEntity<?> getInspectorCases() {
        // returns all reports for now
        return ResponseEntity.ok(damageReportRepository.findAll());
    }

    // get approved cases for service centers
    @GetMapping("/service/approved-cases")
    public ResponseEntity<?> getApprovedCasesForService() {
        // returns all reports for now
        return ResponseEntity.ok(damageReportRepository.findAll());
    }

    // admin user management endpoints

    // get all registered users
    @GetMapping("/admin/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la accesarea bazei de date: " + e.getMessage());
        }
    }

    // create a new user
    @PostMapping("/admin/users")
    public ResponseEntity<?> createByAdmin(@RequestBody Map<String, String> request) {
        try {
            User user = new User();
            user.setUsername(request.get("username"));
            user.setEmail(request.get("email"));
            user.setPassword(passwordEncoder.encode(request.get("password")));
            user.setRole(Role.valueOf(request.get("role").toUpperCase()));

            userRepository.save(user);
            return ResponseEntity.ok().body("{\"status\":\"success\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la crearea utilizatorului: " + e.getMessage());
        }
    }

    // update a user role
    @PutMapping("/admin/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String roleValue = request.get("role");
            return userRepository.findById(id)
                    .map(user -> {
                        user.setRole(Role.valueOf(roleValue.toUpperCase()));
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

    // delete a user by id
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // admin report management endpoints

    // get all damage reports
    @GetMapping("/admin/reports")
    public ResponseEntity<?> getAllReportsForAdmin() {
        try {
            return ResponseEntity.ok(damageReportRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la extragerea dosarelor: " + e.getMessage());
        }
    }

//    // update report status
//    @PutMapping("/admin/reports/{id}/status")
//    public ResponseEntity<?> updateReportStatus(
//            @PathVariable Long id,
//            @RequestBody Map<String, String> request) {
//        try {
//            String newStatus = request.get("status");
//            if (newStatus == null || newStatus.isEmpty()) {
//                return ResponseEntity.badRequest().body("Statusul transmis este invalid.");
//            }
//
//            return damageReportRepository.findById(id)
//                    .map(report -> {
//                        report.setStatus(newStatus.toUpperCase());
//                        damageReportRepository.save(report);
//                        return ResponseEntity.ok().body("{\"message\":\"Status actualizat cu succes!\"}");
//                    })
//                    .orElse(ResponseEntity.status(404).body("Dosarul de dauna cu ID-ul " + id + " nu a fost gasit."));
//
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Eroare la actualizarea statusului: " + e.getMessage());
//        }
//    }

    // log repair items and finalize report status
    @PutMapping("/admin/reports/{id}/finalize-repair")
    public ResponseEntity<?> finalizeRepair(@PathVariable Long id, @RequestBody List<RepairItem> items) {
        try {
            Optional<DamageReport> reportOptional = damageReportRepository.findById(id);
            if (reportOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            DamageReport report = reportOptional.get();

            for (RepairItem item : items) {
                item.setDamageReport(report);
                repairItemRepository.save(item);
            }

            report.setStatus("REPARATIE_EFECTUATA");
            damageReportRepository.save(report);

            return ResponseEntity.ok("{\"message\":\"Devizul a fost inregistrat.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la salvarea devizului.\"}");
        }
    }

    // close report permanently
    @PutMapping("/admin/reports/{id}/close-file")
    public ResponseEntity<?> closeFile(@PathVariable Long id) {
        try {
            Optional<DamageReport> reportOptional = damageReportRepository.findById(id);
            if (reportOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            DamageReport report = reportOptional.get();
            report.setStatus("FINALIZAT");
            damageReportRepository.save(report);

            return ResponseEntity.ok("{\"message\":\"Dosarul a fost inchis definitiv.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la inchiderea dosarului.\"}");
        }
    }

    // admin pdf export endpoints

    // export all reports to pdf
    @GetMapping("/admin/reports/export/pdf")
    public void exportToPDF(HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=raport_global_daune.pdf";
        response.setHeader(headerKey, headerValue);

        // create a4 document
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // report title
        Font fontTitle = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);
        Paragraph titleParagraph = new Paragraph("Raport Global Dosare Daune - AutoDamage Hub", fontTitle);
        titleParagraph.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(titleParagraph);

        // spacer
        document.add(new Paragraph(" "));

        // create table with 5 columns
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.0f, 2.0f, 4.0f, 2.0f, 2.0f});

        // table header
        table.addCell("ID");
        table.addCell("Inmatriculare");
        table.addCell("Descriere Incident");
        table.addCell("Status");
        table.addCell("Client");

        // populate table from database
        List<DamageReport> reports = damageReportRepository.findAll();
        for (DamageReport r : reports) {
            table.addCell(String.valueOf(r.getId()));
            table.addCell(r.getLicensePlate());
            table.addCell(r.getDescription() != null ? r.getDescription() : "Fara descriere");
            table.addCell(r.getStatus());
            table.addCell(r.getUser() != null ? r.getUser().getUsername() : "Anonim");
        }

        document.add(table);
        document.close();
    }

    // export specific user history to pdf
    @GetMapping("/admin/users/{userId}/report/pdf")
    public void exportUserReportToPDF(@PathVariable Long userId, HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=fisa_daune_client_" + userId + ".pdf";
        response.setHeader(headerKey, headerValue);

        // find user in database
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.sendError(404, "Utilizatorul nu a fost gasit.");
            return;
        }

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // configure fonts
        Font fontTitle = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 16);
        Font fontSection = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 12);
        Font fontBody = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA, 10);
        Font fontTableHeader = com.lowagie.text.FontFactory.getFont(com.lowagie.text.FontFactory.HELVETICA_BOLD, 10);

        // report header
        Paragraph title = new Paragraph("AUTODAMAGE HUB - FISA DE DAUNALITATE CLIENT", fontTitle);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph("------------------------------------------------------------------------------------------------------------------------"));
        document.add(new Paragraph(" "));

        // section 1: client data
        document.add(new Paragraph("1. DATE IDENTIFICARE ASIGURAT / CLIENT", fontSection));
        document.add(new Paragraph("ID Client: " + user.getId(), fontBody));
        document.add(new Paragraph("Nume Utilizator: " + user.getUsername(), fontBody));
        document.add(new Paragraph("Adresa de Email: " + user.getEmail(), fontBody));
        document.add(new Paragraph("Data Emitere Document: " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), fontBody));

        document.add(new Paragraph(" "));

        // section 2: history of reports and repairs
        document.add(new Paragraph("2. ISTORIC DOSARE REPARATII SI DAUNE ASOCIATE", fontSection));
        document.add(new Paragraph(" "));

        // create table with fixed widths
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.0f, 2.0f, 5.0f, 2.0f});

        // table header cells
        table.addCell(new com.lowagie.text.pdf.PdfPCell(new Paragraph("ID Dosar", fontTableHeader)));
        table.addCell(new com.lowagie.text.pdf.PdfPCell(new Paragraph("Numar Auto", fontTableHeader)));
        table.addCell(new com.lowagie.text.pdf.PdfPCell(new Paragraph("Descriere Avarii si Reparatii Efectuate", fontTableHeader)));
        table.addCell(new com.lowagie.text.pdf.PdfPCell(new Paragraph("Status Curent", fontTableHeader)));

        // filter reports for the selected user
        List<DamageReport> userReports = damageReportRepository.findByUserId(userId);

        if (userReports.isEmpty()) {
            com.lowagie.text.pdf.PdfPCell emptyCell = new com.lowagie.text.pdf.PdfPCell(new Paragraph("Nu exista dosare inregistrate pentru acest client.", fontBody));
            emptyCell.setColspan(4);
            emptyCell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            table.addCell(emptyCell);
        } else {
            for (DamageReport r : userReports) {
                table.addCell(new com.lowagie.text.pdf.PdfPCell(new Paragraph(String.valueOf(r.getId()), fontBody)));
                table.addCell(new com.lowagie.text.pdf.PdfPCell(new Paragraph(r.getLicensePlate(), fontBody)));
                table.addCell(new com.lowagie.text.pdf.PdfPCell(new Paragraph(r.getDescription() != null ? r.getDescription() : "Fara descriere specficata.", fontBody)));
                table.addCell(new com.lowagie.text.pdf.PdfPCell(new Paragraph(r.getStatus(), fontBody)));
            }
        }

        document.add(table);

        // document footer
        document.add(new Paragraph(" "));
        Paragraph footer = new Paragraph("Document generat in mod automat de platforma AutoDamage Hub. Datele continute au valoare juridica in relatia cu service-urile partenere si asiguratorii.", fontBody);
        footer.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(footer);

        document.close();
    }
}