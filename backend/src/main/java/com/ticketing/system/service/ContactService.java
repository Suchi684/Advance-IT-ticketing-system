package com.ticketing.system.service;

import com.ticketing.system.model.Contact;
import com.ticketing.system.model.dto.ContactSummary;
import com.ticketing.system.model.dto.TicketResponse;
import com.ticketing.system.repository.ContactRepository;
import com.ticketing.system.repository.TicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final TicketRepository ticketRepository;

    public ContactService(ContactRepository contactRepository, TicketRepository ticketRepository) {
        this.contactRepository = contactRepository;
        this.ticketRepository = ticketRepository;
    }

    public Page<Contact> getAll(Pageable pageable) {
        return contactRepository.findAll(pageable);
    }

    public Page<ContactSummary> getAllWithSummary(Pageable pageable) {
        Page<Contact> contactsPage = contactRepository.findAll(pageable);
        List<Contact> contacts = contactsPage.getContent();
        if (contacts.isEmpty()) {
            return contactsPage.map(c -> ContactSummary.from(c, 0L, new ArrayList<>()));
        }
        List<String> emails = contacts.stream().map(Contact::getEmail).collect(Collectors.toList());
        Map<String, List<Map<String, Object>>> byEmail = new HashMap<>();
        Map<String, Long> totalsByEmail = new HashMap<>();
        for (Object[] row : ticketRepository.countByCategoryForEmails(emails)) {
            String email = (String) row[0];
            String category = row[1] == null ? "GENERAL" : row[1].toString();
            Long count = (Long) row[2];
            Map<String, Object> entry = new HashMap<>();
            entry.put("category", category);
            entry.put("count", count);
            byEmail.computeIfAbsent(email, k -> new ArrayList<>()).add(entry);
            totalsByEmail.merge(email, count, Long::sum);
        }
        return contactsPage.map(c -> ContactSummary.from(
                c,
                totalsByEmail.getOrDefault(c.getEmail(), 0L),
                byEmail.getOrDefault(c.getEmail(), new ArrayList<>())
        ));
    }

    public List<Map<String, Object>> getCategorySummary(Long id) {
        Contact contact = getById(id);
        List<Object[]> rows = ticketRepository.countGroupByCategoryForEmail(contact.getEmail());
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("category", row[0] == null ? "GENERAL" : row[0].toString());
            entry.put("count", row[1]);
            result.add(entry);
        }
        return result;
    }

    public List<Map<String, Object>> getContactsByAgent(Long agentId) {
        List<Object[]> rows = ticketRepository.countContactsByAgent(agentId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            String email = (String) row[0];
            Long ticketCount = (Long) row[1];
            Long resolved = row[2] == null ? 0L : ((Number) row[2]).longValue();
            Map<String, Object> entry = new HashMap<>();
            entry.put("email", email);
            entry.put("ticketCount", ticketCount);
            entry.put("resolvedCount", resolved);
            Optional<Contact> contact = contactRepository.findByEmail(email);
            if (contact.isPresent()) {
                Contact c = contact.get();
                entry.put("contactId", c.getId());
                entry.put("name", c.getName());
                entry.put("company", c.getCompany());
                entry.put("phone", c.getPhone());
            } else {
                entry.put("contactId", null);
                entry.put("name", null);
                entry.put("company", null);
                entry.put("phone", null);
            }
            result.add(entry);
        }
        return result;
    }

    public Contact getById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    public Optional<Contact> getByEmail(String email) {
        return contactRepository.findByEmail(email);
    }

    public Contact createOrUpdate(Contact contact) {
        Optional<Contact> existing = contactRepository.findByEmail(contact.getEmail());
        if (existing.isPresent()) {
            Contact c = existing.get();
            if (contact.getName() != null) c.setName(contact.getName());
            if (contact.getPhone() != null) c.setPhone(contact.getPhone());
            if (contact.getCompany() != null) c.setCompany(contact.getCompany());
            if (contact.getNotes() != null) c.setNotes(contact.getNotes());
            return contactRepository.save(c);
        }
        return contactRepository.save(contact);
    }

    public void delete(Long id) {
        contactRepository.deleteById(id);
    }

    public Page<TicketResponse> getContactTickets(String email, Pageable pageable) {
        return ticketRepository.findByFromEmail(email, pageable)
                .map(TicketResponse::from);
    }
}
