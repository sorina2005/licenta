package ro.university.vehicledamagemanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "damage_parts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DamagePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String partName; // Exemplu: Front Bumper, Headlight

    private String severity; // Exemplu: Low, Medium, High

    private Double confidenceScore; // Scorul oferit de AI

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private DamageCase damageCase;
}