package com.ticketing.system.model.dto;

import com.ticketing.system.model.Contact;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ContactSummary {
    private Long id;
    private String email;
    private String name;
    private String phone;
    private String company;
    private String notes;
    private LocalDateTime createdAt;
    private long totalTickets;
    private List<Map<String, Object>> categories;

    public ContactSummary() {}

    public static ContactSummary from(Contact c, long totalTickets, List<Map<String, Object>> categories) {
        ContactSummary s = new ContactSummary();
        s.id = c.getId();
        s.email = c.getEmail();
        s.name = c.getName();
        s.phone = c.getPhone();
        s.company = c.getCompany();
        s.notes = c.getNotes();
        s.createdAt = c.getCreatedAt();
        s.totalTickets = totalTickets;
        s.categories = categories;
        return s;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public long getTotalTickets() { return totalTickets; }
    public void setTotalTickets(long totalTickets) { this.totalTickets = totalTickets; }
    public List<Map<String, Object>> getCategories() { return categories; }
    public void setCategories(List<Map<String, Object>> categories) { this.categories = categories; }
}
