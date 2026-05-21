package ro.university.vehicledamagemanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class DamageReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String rawText;

    private String detectedParts;
    private String location;
    private String urgency;
    private String intent;

    @Column(columnDefinition = "TEXT")
    private String aiResponseText;

    private LocalDateTime createdAt = LocalDateTime.now();
}