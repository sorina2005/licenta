package ro.university.vehicledamagemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.university.vehicledamagemanager.model.DamageReport;

import java.util.List;
import java.util.List;

public interface DamageReportRepository extends JpaRepository<DamageReport, Long> {
    List<DamageReport> findByUserId(Long userId);
    List<DamageReport> findByStatusIn(List<String> statuses);
}