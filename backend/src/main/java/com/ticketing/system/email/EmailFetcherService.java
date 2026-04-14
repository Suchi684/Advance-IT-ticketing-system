package com.ticketing.system.email;

import com.ticketing.system.classifier.EmailClassifierService;
import com.ticketing.system.model.Contact;
import com.ticketing.system.model.Ticket;
import com.ticketing.system.repository.ContactRepository;
import com.ticketing.system.repository.SlaRepository;
import com.ticketing.system.repository.TicketRepository;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.search.FlagTerm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
public class EmailFetcherService {

    private static final Logger log = LoggerFactory.getLogger(EmailFetcherService.class);

    private final TicketRepository ticketRepository;
    private final EmailClassifierService classifierService;
    private final ContactRepository contactRepository;
    private final SlaRepository slaRepository;

    @Value("${mail.imap.host}")
    private String imapHost;

    @Value("${mail.imap.port}")
    private int imapPort;

    @Value("${mail.imap.username}")
    private String imapUsername;

    @Value("${mail.imap.password}")
    private String imapPassword;

    public EmailFetcherService(TicketRepository ticketRepository, EmailClassifierService classifierService,
                               ContactRepository contactRepository, SlaRepository slaRepository) {
        this.ticketRepository = ticketRepository;
        this.classifierService = classifierService;
        this.contactRepository = contactRepository;
        this.slaRepository = slaRepository;
    }

    public void fetchAndProcessEmails() {
        Properties props = new Properties();
        props.put("mail.store.protocol", "imaps");
        props.put("mail.imaps.host", imapHost);
        props.put("mail.imaps.port", String.valueOf(imapPort));
        props.put("mail.imaps.ssl.enable", "true");
        props.put("mail.imaps.timeout", "10000");
        props.put("mail.imaps.connectiontimeout", "10000");

        Store store = null;
        Folder inbox = null;

        try {
            Session session = Session.getInstance(props);
            store = session.getStore("imaps");
            store.connect(imapHost, imapUsername, imapPassword);

            inbox = store.getFolder("Tickets");
            inbox.open(Folder.READ_WRITE);

            Message[] messages = inbox.search(new FlagTerm(new Flags(Flags.Flag.SEEN), false));
            log.info("Found {} unread emails", messages.length);

            for (Message message : messages) {
                try {
                    processMessage((MimeMessage) message);
                    message.setFlag(Flags.Flag.SEEN, true);
                } catch (Exception e) {
                    log.error("Error processing email: {}", e.getMessage(), e);
                }
            }

        } catch (Exception e) {
            log.error("Error fetching emails: {}", e.getMessage(), e);
        } finally {
            try {
                if (inbox != null && inbox.isOpen()) inbox.close(false);
                if (store != null && store.isConnected()) store.close();
            } catch (MessagingException e) {
                log.error("Error closing mail connection: {}", e.getMessage());
            }
        }
    }

    private void processMessage(MimeMessage message) throws Exception {
        String messageId = message.getMessageID();

        if (messageId != null && ticketRepository.existsByMessageId(messageId)) {
            log.debug("Skipping duplicate email: {}", messageId);
            return;
        }

        String from = extractEmail(message.getFrom());
        String fromName = extractName(message.getFrom());
        String to = extractEmail(message.getRecipients(Message.RecipientType.TO));
        String subject = message.getSubject();
        Date receivedDate = message.getReceivedDate();

        Map<String, String> content = extractContent(message);
        String body = content.get("text");
        String htmlBody = content.get("html");
        String attachmentInfo = content.get("attachments");
        boolean hasAttachments = attachmentInfo != null && !attachmentInfo.equals("[]");

        String category = classifierService.classify(subject, body != null ? body : htmlBody);

        Ticket ticket = new Ticket();
        ticket.setFromEmail(from);
        ticket.setToEmail(to);
        ticket.setSubject(subject);
        ticket.setBody(body);
        ticket.setHtmlBody(htmlBody);
        ticket.setReceivedDate(receivedDate != null ?
            LocalDateTime.ofInstant(receivedDate.toInstant(), ZoneId.systemDefault()) : LocalDateTime.now());
        ticket.setCategory(category);
        ticket.setMessageId(messageId);
        ticket.setHasAttachments(hasAttachments);
        ticket.setAttachmentInfo(attachmentInfo);

        // Set SLA deadline based on priority
        slaRepository.findByPriority(ticket.getPriority()).ifPresent(sla -> {
            if (sla.getIsActive() && sla.getResolutionHours() != null) {
                ticket.setDeadline(LocalDateTime.now().plusHours(sla.getResolutionHours()));
            }
        });

        ticketRepository.save(ticket);
        log.info("Saved ticket: [{}] {} -> Category: {}", ticket.getId(), subject, category);

        // Auto-create or update contact
        if (from != null && !from.isEmpty()) {
            Contact contact = contactRepository.findByEmail(from).orElse(null);
            if (contact == null) {
                contact = new Contact();
                contact.setEmail(from);
                if (fromName != null) {
                    contact.setName(fromName);
                }
                contactRepository.save(contact);
                log.info("Auto-created contact for: {} ({})", from, fromName);
            } else if (contact.getName() == null && fromName != null) {
                contact.setName(fromName);
                contactRepository.save(contact);
                log.info("Updated contact name for: {} -> {}", from, fromName);
            }
        }
    }

    private Map<String, String> extractContent(Part part) throws Exception {
        Map<String, String> result = new HashMap<>();
        result.put("text", null);
        result.put("html", null);
        result.put("attachments", "[]");

        List<Map<String, String>> attachments = new ArrayList<>();
        extractContentRecursive(part, result, attachments);

        if (!attachments.isEmpty()) {
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < attachments.size(); i++) {
                Map<String, String> att = attachments.get(i);
                if (i > 0) sb.append(",");
                sb.append("{\"name\":\"").append(escapeJson(att.get("name")))
                  .append("\",\"contentType\":\"").append(escapeJson(att.get("contentType")))
                  .append("\",\"size\":\"").append(att.get("size")).append("\"}");
            }
            sb.append("]");
            result.put("attachments", sb.toString());
        }

        return result;
    }

    private void extractContentRecursive(Part part, Map<String, String> result,
                                          List<Map<String, String>> attachments) throws Exception {
        String contentType = part.getContentType().toLowerCase();

        if (part.isMimeType("text/plain") && result.get("text") == null) {
            result.put("text", (String) part.getContent());
        } else if (part.isMimeType("text/html") && result.get("html") == null) {
            result.put("html", (String) part.getContent());
        } else if (part.isMimeType("multipart/*")) {
            Multipart multipart = (Multipart) part.getContent();
            for (int i = 0; i < multipart.getCount(); i++) {
                extractContentRecursive(multipart.getBodyPart(i), result, attachments);
            }
        }

        String disposition = part.getDisposition();
        if (disposition != null && (disposition.equalsIgnoreCase(Part.ATTACHMENT) ||
                disposition.equalsIgnoreCase(Part.INLINE))) {
            String fileName = part.getFileName();
            if (fileName != null) {
                Map<String, String> att = new HashMap<>();
                att.put("name", fileName);
                att.put("contentType", part.getContentType().split(";")[0]);
                att.put("size", String.valueOf(part.getSize()));
                attachments.add(att);
            }
        }
    }

    private String extractName(Address[] addresses) {
        if (addresses == null || addresses.length == 0) return null;
        Address addr = addresses[0];
        if (addr instanceof InternetAddress) {
            String personal = ((InternetAddress) addr).getPersonal();
            return (personal != null && !personal.isBlank()) ? personal : null;
        }
        return null;
    }

    private String extractEmail(Address[] addresses) {
        if (addresses == null || addresses.length == 0) return "";
        Address addr = addresses[0];
        if (addr instanceof InternetAddress) {
            return ((InternetAddress) addr).getAddress();
        }
        return addr.toString();
    }

    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
