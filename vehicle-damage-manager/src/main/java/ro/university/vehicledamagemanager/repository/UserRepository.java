package ro.university.vehicledamagemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.university.vehicledamagemanager.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Metoda existentă pentru login
    Optional<User> findByUsername(String username);

    // Adaugă această metodă pentru inițierea resetării parolei
    Optional<User> findByEmail(String email);

    // Adaugă această metodă pentru finalizarea resetării parolei
    Optional<User> findByResetToken(String resetToken);
}