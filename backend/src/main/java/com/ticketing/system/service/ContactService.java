package com.ticketing.system.service;

import com.ticketing.system.model.Contact;
import com.ticketing.system.model.dto.TicketResponse;
import com.ticketing.system.repository.ContactRepository;
import com.ticketing.system.repository.TicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
