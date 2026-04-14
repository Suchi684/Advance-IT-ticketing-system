package com.ticketing.system.model.dto;

import com.ticketing.system.model.Ticket;
import java.time.LocalDateTime;

public class TicketResponse {
    private Long id;
    private String fromEmail;
    private String toEmail;
    private String subject;
    private String body;
    private String htmlBody;
    private LocalDateTime receivedDate;
    private String category;
    private String status;
    private String priority;
    private Long assignedAgentId;
    private String assignedAgentName;
    private Boolean hasAttachments;
    private String attachmentInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Long getAssignedAgentId() { return assignedAgentId; }
    public void setAssignedAgentId(Long assignedAgentId) { this.assignedAgentId = assignedAgentId; }
    public String getAssignedAgentName() { return assignedAgentName; }
    public void setAssignedAgentName(String assignedAgentName) { this.assignedAgentName = assignedAgentName; }
    public Boolean getHasAttachments() { return hasAttachments; }
    public void setHasAttachments(Boolean hasAttachments) { this.hasAttachments = hasAttachments; }
    public String getAttachmentInfo() { return attachmentInfo; }
    public void setAttachmentInfo(String attachmentInfo) { this.attachmentInfo = attachmentInfo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static TicketResponse from(Ticket ticket) {
        TicketResponse r = new TicketResponse();
        r.setId(ticket.getId());
        r.setFromEmail(ticket.getFromEmail());
        r.setToEmail(ticket.getToEmail());
        r.setSubject(ticket.getSubject());
        r.setBody(ticket.getBody());
        r.setHtmlBody(ticket.getHtmlBody());
        r.setReceivedDate(ticket.getReceivedDate());
        r.setCategory(ticket.getCategory().name());
        r.setStatus(ticket.getStatus().name());
        r.setPriority(ticket.getPriority().name());
        r.setHasAttachments(ticket.getHasAttachments());
        r.setAttachmentInfo(ticket.getAttachmentInfo());
        r.setCreatedAt(ticket.getCreatedAt());
        r.setUpdatedAt(ticket.getUpdatedAt());
        if (ticket.getAssignedAgent() != null) {
            r.setAssignedAgentId(ticket.getAssignedAgent().getId());
            r.setAssignedAgentName(ticket.getAssignedAgent().getName());
        }
        return r;
    }
}
