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
    public ResponseEntity<?> getClientReports() {
        return ResponseEntity.ok(damageReportRepository.findAll());
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
}