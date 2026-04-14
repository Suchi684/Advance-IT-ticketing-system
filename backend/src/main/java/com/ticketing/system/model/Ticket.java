package com.ticketing.system.model;

import com.ticketing.system.model.enums.Category;
import com.ticketing.system.model.enums.Priority;
import com.ticketing.system.model.enums.TicketStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets", indexes = {
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_assigned_agent", columnList = "assigned_agent_id"),
    @Index(name = "idx_received_date", columnList = "received_date")
})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_email", nullable = false)
    private String fromEmail;

    @Column(name = "to_email")
    private String toEmail;

    @Column(length = 500)
    private String subject;

    @Column(columnDefinition = "LONGTEXT")
    private String body;

    @Column(name = "html_body", columnDefinition = "LONGTEXT")
    private String htmlBody;

    @Column(name = "received_date")
    private LocalDateTime receivedDate;

    @Enumerated(EnumType.STRING)
    private Category category = Category.GENERAL;

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.OPEN;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    @Column(name = "message_id", unique = true, length = 500)
    private String messageId;

    @Column(name = "has_attachments")
    private Boolean hasAttachments = false;

    @Column(name = "attachment_info", columnDefinition = "TEXT")
    private String attachmentInfo;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Ticket() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFromEmail() { return fromEmail; }
    public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }
    public String getToEmail() { return toEmail; }
    public void setToEmail(String toEmail) { this.toEmail = toEmail; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getHtmlBody() { return htmlBody; }
    public void setHtmlBody(String htmlBody) { this.htmlBody = htmlBody; }
    public LocalDateTime getReceivedDate() { return receivedDate; }
    public void setReceivedDate(LocalDateTime receivedDate) { this.receivedDate = receivedDate; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public User getAssignedAgent() { return assignedAgent; }
    public void setAssignedAgent(User assignedAgent) { this.assignedAgent = assignedAgent; }
    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }
    public Boolean getHasAttachments() { return hasAttachments; }
    public void setHasAttachments(Boolean hasAttachments) { this.hasAttachments = hasAttachments; }
    public String getAttachmentInfo() { return attachmentInfo; }
    public void setAttachmentInfo(String attachmentInfo) { this.attachmentInfo = attachmentInfo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
