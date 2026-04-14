package com.ticketing.system.model;

import com.ticketing.system.model.enums.ReplyType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_replies", indexes = {
    @Index(name = "idx_ticket_id", columnList = "ticket_id")
})
public class TicketReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "from_email", nullable = false)
    private String fromEmail;

    @Column(name = "to_email", nullable = false)
    private String toEmail;

    @Column(length = 500)
    private String subject;

    @Column(columnDefinition = "LONGTEXT")
    private String body;

    @Column(name = "sent_date")
    private LocalDateTime sentDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "reply_type", nullable = false)
    private ReplyType replyType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sent_by_agent_id")
    private User sentByAgent;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public TicketReply() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }
    public String getFromEmail() { return fromEmail; }
    public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }
    public String getToEmail() { return toEmail; }
    public void setToEmail(String toEmail) { this.toEmail = toEmail; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public LocalDateTime getSentDate() { return sentDate; }
    public void setSentDate(LocalDateTime sentDate) { this.sentDate = sentDate; }
    public ReplyType getReplyType() { return replyType; }
    public void setReplyType(ReplyType replyType) { this.replyType = replyType; }
    public User getSentByAgent() { return sentByAgent; }
    public void setSentByAgent(User sentByAgent) { this.sentByAgent = sentByAgent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
