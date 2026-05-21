package ro.university.vehicledamagemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.university.vehicledamagemanager.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
}