package ro.university.vehicledamagemanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "damage_cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DamageCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime creationDate;

    private String status; // Exemplu: PENDING, ANALYZING, COMPLETED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User creator;

    @OneToMany(mappedBy = "damageCase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DamagePart> damagedParts = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        creationDate = LocalDateTime.now();
    }
}