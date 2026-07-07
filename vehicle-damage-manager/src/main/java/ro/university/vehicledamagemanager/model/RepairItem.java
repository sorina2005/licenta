package ro.university.vehicledamagemanager.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "repair_items")
public class RepairItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String componentName;
    private Double partPrice;
    private Integer quantity;
    private Double laborPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "damage_report_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private DamageReport damageReport;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getComponentName() { return componentName; }
    public void setComponentName(String componentName) { this.componentName = componentName; }
    public Double getPartPrice() { return partPrice; }
    public void setPartPrice(Double partPrice) { this.partPrice = partPrice; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getLaborPrice() { return laborPrice; }
    public void setLaborPrice(Double laborPrice) { this.laborPrice = laborPrice; }
    public DamageReport getDamageReport() { return damageReport; }
    public void setDamageReport(DamageReport damageReport) { this.damageReport = damageReport; }
}