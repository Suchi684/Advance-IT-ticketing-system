package com.ticketing.system.model;

import com.ticketing.system.model.enums.Priority;
import jakarta.persistence.*;

@Entity
@Table(name = "sla_policies")
public class SlaPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Priority priority;

    @Column(name = "response_hours")
    private Integer responseHours;

    @Column(name = "resolution_hours")
    private Integer resolutionHours;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public SlaPolicy() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public Integer getResponseHours() { return responseHours; }
    public void setResponseHours(Integer responseHours) { this.responseHours = responseHours; }
    public Integer getResolutionHours() { return resolutionHours; }
    public void setResolutionHours(Integer resolutionHours) { this.resolutionHours = resolutionHours; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
