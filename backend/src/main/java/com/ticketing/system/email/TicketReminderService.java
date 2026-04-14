package com.ticketing.system.email;

import com.ticketing.system.model.Ticket;
import com.ticketing.system.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TicketReminderService {

    private static final Logger log = LoggerFactory.getLogger(TicketReminderService.class);
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a");

    private final TicketRepository ticketRepository;
    private final EmailSenderService emailSenderService;

    public TicketReminderService(TicketRepository ticketRepository, EmailSenderService emailSenderService) {
        this.ticketRepository = ticketRepository;
        this.emailSenderService = emailSenderService;
    }

    @Scheduled(fixedDelay = 300000)
    public void checkOverdueTickets() {
        List<Ticket> overdueTickets = ticketRepository.findOverdueTickets(LocalDateTime.now());

        if (overdueTickets.isEmpty()) {
            return;
        }

        log.info("Found {} overdue tickets, sending reminders...", overdueTickets.size());

        for (Ticket ticket : overdueTickets) {
            try {
                String agentEmail = ticket.getAssignedAgent().getEmail();
                String agentName = ticket.getAssignedAgent().getName();
                String subject = "Overdue Ticket Reminder - #" + ticket.getId() + ": " + ticket.getSubject();

                String body = buildReminderEmail(ticket, agentName);

                emailSenderService.sendEmail(agentEmail, subject, body);

                ticket.setReminderSent(true);
                ticketRepository.save(ticket);

                log.info("Reminder sent to {} for ticket #{}", agentEmail, ticket.getId());
            } catch (Exception e) {
                log.error("Failed to send reminder for ticket #{}: {}", ticket.getId(), e.getMessage());
            }
        }
    }

    private String buildReminderEmail(Ticket ticket, String agentName) {
        String deadlineStr = ticket.getDeadline() != null ? ticket.getDeadline().format(FMT) : "N/A";
        String priorityColor = "#3498db";
        switch (ticket.getPriority()) {
            case URGENT: priorityColor = "#e74c3c"; break;
            case HIGH: priorityColor = "#f39c12"; break;
            case MEDIUM: priorityColor = "#3498db"; break;
            case LOW: priorityColor = "#95a5a6"; break;
        }

        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='font-family: Segoe UI, sans-serif; background: #f0f2f5; padding: 20px;'>"
            + "<div style='max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);'>"
            + "<div style='background: linear-gradient(135deg, #e74c3c, #c0392b); padding: 24px 32px; color: #fff;'>"
            + "<h2 style='margin: 0 0 4px 0; font-size: 1.3rem;'>Overdue Task Reminder</h2>"
            + "<p style='margin: 0; opacity: 0.9; font-size: 0.9rem;'>A ticket assigned to you has passed its deadline</p>"
            + "</div>"
            + "<div style='padding: 32px;'>"
            + "<p style='font-size: 1rem; color: #2c3e50;'>Hi <strong>" + agentName + "</strong>,</p>"
            + "<p style='color: #555; line-height: 1.6;'>The following ticket has exceeded its deadline and requires your attention:</p>"
            + "<div style='background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #e74c3c;'>"
            + "<table style='width: 100%; border-collapse: collapse;'>"
            + "<tr><td style='padding: 6px 0; color: #7f8c8d; font-size: 0.85rem;'>Ticket</td><td style='padding: 6px 0; font-weight: 600; color: #2c3e50;'>#" + ticket.getId() + "</td></tr>"
            + "<tr><td style='padding: 6px 0; color: #7f8c8d; font-size: 0.85rem;'>Subject</td><td style='padding: 6px 0; font-weight: 600; color: #2c3e50;'>" + (ticket.getSubject() != null ? ticket.getSubject() : "(No Subject)") + "</td></tr>"
            + "<tr><td style='padding: 6px 0; color: #7f8c8d; font-size: 0.85rem;'>From</td><td style='padding: 6px 0; color: #2c3e50;'>" + ticket.getFromEmail() + "</td></tr>"
            + "<tr><td style='padding: 6px 0; color: #7f8c8d; font-size: 0.85rem;'>Category</td><td style='padding: 6px 0; color: #2c3e50;'>" + ticket.getCategory() + "</td></tr>"
            + "<tr><td style='padding: 6px 0; color: #7f8c8d; font-size: 0.85rem;'>Priority</td><td style='padding: 6px 0;'><span style='background: " + priorityColor + "; color: #fff; padding: 2px 10px; border-radius: 10px; font-size: 0.8rem;'>" + ticket.getPriority() + "</span></td></tr>"
            + "<tr><td style='padding: 6px 0; color: #7f8c8d; font-size: 0.85rem;'>Deadline</td><td style='padding: 6px 0; font-weight: 600; color: #e74c3c;'>" + deadlineStr + "</td></tr>"
            + "<tr><td style='padding: 6px 0; color: #7f8c8d; font-size: 0.85rem;'>Credits</td><td style='padding: 6px 0; font-weight: 600; color: #8e44ad;'>" + ticket.getCredits() + " pts</td></tr>"
            + "</table>"
            + "</div>"
            + "<p style='color: #555; line-height: 1.6;'>Please resolve this ticket as soon as possible. Completing it will earn you <strong>" + ticket.getCredits() + " credits</strong>.</p>"
            + "<p style='color: #7f8c8d; font-size: 0.85rem; margin-top: 24px;'>- TicketDesk System</p>"
            + "</div>"
            + "</div>"
            + "</body></html>";
    }
}
