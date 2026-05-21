package ro.university.vehicledamagemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.university.vehicledamagemanager.model.DamageCase;
import java.util.List;

@Repository
public interface DamageCaseRepository extends JpaRepository<DamageCase, Long> {
    List<DamageCase> findByCreatorId(Long userId);
    List<DamageCase> findByVehicleId(Long vehicleId);
}