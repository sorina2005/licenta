package ro.university.vehicledamagemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.university.vehicledamagemanager.model.RepairItem;

@Repository
public interface RepairItemRepository extends JpaRepository<RepairItem, Long> {
}