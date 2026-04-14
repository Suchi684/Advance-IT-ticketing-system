package com.ticketing.system.model;

import jakarta.persistence.*;

@Entity
@Table(name = "category_configs")
public class CategoryConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 100)
    private String label;

    @Column(length = 7)
    private String color;

    @Column(name = "base_credits")
    private Integer baseCredits = 5;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    public CategoryConfig() {}

    public CategoryConfig(String name, String label, String color, Integer baseCredits, Boolean isDefault) {
        this.name = name;
        this.label = label;
        this.color = color;
        this.baseCredits = baseCredits;
        this.isDefault = isDefault;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public Integer getBaseCredits() { return baseCredits; }
    public void setBaseCredits(Integer baseCredits) { this.baseCredits = baseCredits; }
    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }
}
