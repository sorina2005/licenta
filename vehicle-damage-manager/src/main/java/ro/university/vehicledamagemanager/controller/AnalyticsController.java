package ro.university.vehicledamagemanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.university.vehicledamagemanager.model.DamageReport;
import ro.university.vehicledamagemanager.repository.DamageReportRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analytics")
public class AnalyticsController {

    @Autowired
    private DamageReportRepository damageReportRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        try {
            List<DamageReport> allReports = damageReportRepository.findAll();
            long totalReports = allReports.size();

            long pending = allReports.stream().filter(r -> "IN_ASTEPTARE".equalsIgnoreCase(r.getStatus())).count();
            long approved = allReports.stream().filter(r -> "APROBAT".equalsIgnoreCase(r.getStatus())).count();
            long rejected = allReports.stream().filter(r -> "RESPINS".equalsIgnoreCase(r.getStatus())).count();
            long finalized = allReports.stream().filter(r -> "FINALIZAT".equalsIgnoreCase(r.getStatus())).count();

            double approvalRate = totalReports > 0 ? ((double) approved / totalReports) * 100 : 0.0;

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalReports", totalReports);
            stats.put("avgAnalysisTime", "42s");
            stats.put("aiApprovalRate", String.format(Locale.US, "%.1f%%", approvalRate));

            String[] shortMonths = {"Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"};

            Map<Integer, Long> monthlyCounts = allReports.stream()
                    .filter(r -> r.getCreatedAt() != null)
                    .collect(Collectors.groupingBy(
                            r -> r.getCreatedAt().getMonthValue(),
                            Collectors.counting()
                    ));

            List<Map<String, Object>> monthlyData = new ArrayList<>();
            for (int i = 1; i <= 12; i++) {
                long count = monthlyCounts.getOrDefault(i, 0L);
                monthlyData.add(Map.of("name", shortMonths[i - 1], "Dosare", count));
            }
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