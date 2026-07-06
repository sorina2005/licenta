package ro.university.vehicledamagemanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.university.vehicledamagemanager.repository.DamageReportRepository;
import ro.university.vehicledamagemanager.repository.RepairItemRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
public class AnalyticsController {

    @Autowired
    private DamageReportRepository damageReportRepository;

    @Autowired
    private RepairItemRepository repairItemRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        try {
            long totalReports = damageReportRepository.count();
            
            long pending = damageReportRepository.findAll().stream().filter(r -> "IN_ASTEPTARE".equalsIgnoreCase(r.getStatus())).count();
            long approved = damageReportRepository.findAll().stream().filter(r -> "APROBAT".equalsIgnoreCase(r.getStatus())).count();
            long rejected = damageReportRepository.findAll().stream().filter(r -> "RESPINS".equalsIgnoreCase(r.getStatus())).count();
            long finalized = damageReportRepository.findAll().stream().filter(r -> "FINALIZAT".equalsIgnoreCase(r.getStatus())).count();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalReports", totalReports);
            stats.put("avgAnalysisTime", "42s");
            stats.put("aiApprovalRate", "94%");
            
            List<Map<String, Object>> monthlyData = List.of(
                Map.of("name", "Ian", "Dosare", 120),
                Map.of("name", "Feb", "Dosare", 150),
                Map.of("name", "Mar", "Dosare", 180),
                Map.of("name", "Apr", "Dosare", 220),
                Map.of("name", "Mai", "Dosare", 260),
                Map.of("name", "Iun", "Dosare", totalReports)
            );
            stats.put("monthlyEvolution", monthlyData);

            List<Map<String, Object>> statusDistribution = List.of(
                Map.of("name", "In Asteptare", "value", pending),
                Map.of("name", "Aprobat", "value", approved),
                Map.of("name", "Respins", "value", rejected),
                Map.of("name", "Finalizat", "value", finalized)
            );
            stats.put("statusDistribution", statusDistribution);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la procesarea datelor statistice\"}");
        }
    }
}