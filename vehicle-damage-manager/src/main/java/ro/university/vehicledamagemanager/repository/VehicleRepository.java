package ro.university.vehicledamagemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.university.vehicledamagemanager.model.Vehicle;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Query(value = "SELECT * FROM vehicles WHERE user_id = :userId", nativeQuery = true)
    List<Vehicle> findByOwnerId(@Param("userId") Long userId);

    List<Vehicle> findByPlateNumber(String plateNumber);

    @Query(value = "SELECT * FROM vehicles WHERE user_id = :userId AND plate_number = :plateNumber LIMIT 1", nativeQuery = true)
    Optional<Vehicle> findByUserIdAndPlateNumber(@Param("userId") Long userId, @Param("plateNumber") String plateNumber);

}