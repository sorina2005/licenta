package ro.university.vehicledamagemanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer conversationId;
    private String sender; // 'user' sau 'bot'
    
    @Column(columnDefinition = "TEXT")
    private String text;
    
    private String intent;
    private Double confidence;
    private LocalDateTime createdAt = LocalDateTime.now();
}