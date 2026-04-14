package com.ticketing.system.service;

import com.ticketing.system.email.EmailSenderService;
import com.ticketing.system.model.Ticket;
import com.ticketing.system.model.TicketReply;
import com.ticketing.system.model.User;
import com.ticketing.system.model.enums.ReplyType;
import com.ticketing.system.repository.TicketReplyRepository;
import com.ticketing.system.repository.TicketRepository;
import com.ticketing.system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketReplyService {

    private final TicketReplyRepository replyRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final EmailSenderService emailSenderService;

    public TicketReplyService(TicketReplyRepository replyRepository, TicketRepository ticketRepository,
                               UserRepository userRepository, EmailSenderService emailSenderService) {
        this.replyRepository = replyRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.emailSenderService = emailSenderService;
    }

    public List<TicketReply> getReplies(Long ticketId) {
        return replyRepository.findByTicketIdOrderBySentDateDesc(ticketId);
    }

    public TicketReply sendReply(Long ticketId, String toEmail, String subject, String body, String agentEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        String replySubject = subject != null ? subject : "Re: " + ticket.getSubject();

        emailSenderService.sendEmail(toEmail, replySubject, body);

        TicketReply reply = new TicketReply();
        reply.setTicket(ticket);
        reply.setFromEmail(agentEmail);
        reply.setToEmail(toEmail);
        reply.setSubject(replySubject);
        reply.setBody(body);
        reply.setReplyType(ReplyType.REPLY);
        reply.setSentByAgent(agent);

        return replyRepository.save(reply);
    }

    public TicketReply forwardEmail(Long ticketId, String toEmail, String subject, String body, String agentEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        String fwdSubject = subject != null ? subject : "Fwd: " + ticket.getSubject();
        String fwdBody = body + "\n\n--- Original Message ---\nFrom: " + ticket.getFromEmail() +
                "\nSubject: " + ticket.getSubject() + "\n\n" +
                (ticket.getBody() != null ? ticket.getBody() : "");

        emailSenderService.sendEmail(toEmail, fwdSubject, fwdBody);

        TicketReply reply = new TicketReply();
        reply.setTicket(ticket);
        reply.setFromEmail(agentEmail);
        reply.setToEmail(toEmail);
        reply.setSubject(fwdSubject);
        reply.setBody(fwdBody);
        reply.setReplyType(ReplyType.FORWARD);
        reply.setSentByAgent(agent);

        return replyRepository.save(reply);
    }

    public void forwardToAll(Long ticketId, String subject, String body, String agentEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        List<User> agents = userRepository.findAll();
        String[] emails = agents.stream()
                .map(User::getEmail)
                .filter(email -> !email.equals(agentEmail))
                .toArray(String[]::new);

        if (emails.length == 0) return;

        String fwdSubject = subject != null ? subject : "Fwd: " + ticket.getSubject();
        String fwdBody = body + "\n\n--- Original Message ---\nFrom: " + ticket.getFromEmail() +
                "\nSubject: " + ticket.getSubject() + "\n\n" +
                (ticket.getBody() != null ? ticket.getBody() : "");

        emailSenderService.sendEmailToMultiple(emails, fwdSubject, fwdBody);

        for (String email : emails) {
            TicketReply reply = new TicketReply();
            reply.setTicket(ticket);
            reply.setFromEmail(agentEmail);
            reply.setToEmail(email);
            reply.setSubject(fwdSubject);
            reply.setBody(fwdBody);
            reply.setReplyType(ReplyType.FORWARD);
            reply.setSentByAgent(agent);
            replyRepository.save(reply);
        }
    }
}
