package ro.university.vehicledamagemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.university.vehicledamagemanager.model.DamageImage;

@Repository
public interface DamageImageRepository extends JpaRepository<DamageImage, Long> {
}