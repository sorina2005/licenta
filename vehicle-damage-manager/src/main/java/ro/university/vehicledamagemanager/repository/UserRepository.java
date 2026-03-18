package ro.university.vehicledamagemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.university.vehicledamagemanager.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}