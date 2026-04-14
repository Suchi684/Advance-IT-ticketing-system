package com.ticketing.system.model.dto;

import com.ticketing.system.model.Ticket;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private Integer credits;
    private LocalDateTime deadline;
    private Boolean reminderSent;
    private Boolean hasAttachments;
    private String attachmentInfo;
    private List<Map<String, Object>> tags;
    private Integer csatRating;
    private String csatComment;
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
    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }
    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    public Boolean getReminderSent() { return reminderSent; }
    public void setReminderSent(Boolean reminderSent) { this.reminderSent = reminderSent; }
    public Boolean getHasAttachments() { return hasAttachments; }
    public void setHasAttachments(Boolean hasAttachments) { this.hasAttachments = hasAttachments; }
    public String getAttachmentInfo() { return attachmentInfo; }
    public void setAttachmentInfo(String attachmentInfo) { this.attachmentInfo = attachmentInfo; }
    public List<Map<String, Object>> getTags() { return tags; }
    public void setTags(List<Map<String, Object>> tags) { this.tags = tags; }
    public Integer getCsatRating() { return csatRating; }
    public void setCsatRating(Integer csatRating) { this.csatRating = csatRating; }
    public String getCsatComment() { return csatComment; }
    public void setCsatComment(String csatComment) { this.csatComment = csatComment; }
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
        r.setCategory(ticket.getCategory());
        r.setStatus(ticket.getStatus().name());
        r.setPriority(ticket.getPriority().name());
        r.setCredits(ticket.getCredits());
        r.setDeadline(ticket.getDeadline());
        r.setReminderSent(ticket.getReminderSent());
        r.setHasAttachments(ticket.getHasAttachments());
        r.setAttachmentInfo(ticket.getAttachmentInfo());
        r.setCreatedAt(ticket.getCreatedAt());
        r.setUpdatedAt(ticket.getUpdatedAt());
        if (ticket.getAssignedAgent() != null) {
            r.setAssignedAgentId(ticket.getAssignedAgent().getId());
            r.setAssignedAgentName(ticket.getAssignedAgent().getName());
        }
        if (ticket.getTags() != null) {
            List<Map<String, Object>> tagList = new ArrayList<>();
            for (com.ticketing.system.model.Tag tag : ticket.getTags()) {
                Map<String, Object> tagMap = new HashMap<>();
                tagMap.put("id", tag.getId());
                tagMap.put("name", tag.getName());
                tagMap.put("color", tag.getColor());
                tagList.add(tagMap);
            }
            r.setTags(tagList);
        }
        r.setCsatRating(ticket.getCsatRating());
        r.setCsatComment(ticket.getCsatComment());
        return r;
    }
}
