package ro.university.vehicledamagemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.university.vehicledamagemanager.model.DamagePart;
import java.util.List;

@Repository
public interface DamagePartRepository extends JpaRepository<DamagePart, Long> {
    List<DamagePart> findByDamageCaseId(Long caseId);
}