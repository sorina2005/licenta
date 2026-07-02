package ro.university.vehicledamagemanager.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "damage_images")
public class DamageImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "damage_report_id")
    @JsonBackReference
    private DamageReport damageReport;

    // Getters si Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public DamageReport getDamageReport() { return damageReport; }
    public void setDamageReport(DamageReport damageReport) { this.damageReport = damageReport; }
}