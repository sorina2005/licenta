package ro.university.vehicledamagemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.university.vehicledamagemanager.model.DamageReport;

public interface DamageReportRepository extends JpaRepository<DamageReport, Long> {
}