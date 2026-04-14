package com.ticketing.system.controller;

import com.ticketing.system.model.Contact;
import com.ticketing.system.model.dto.TicketResponse;
import com.ticketing.system.service.ContactService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public ResponseEntity<Page<Contact>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(contactService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getById(id));
    }

    @GetMapping("/{id}/tickets")
    public ResponseEntity<Page<TicketResponse>> getContactTickets(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Contact contact = contactService.getById(id);
        Pageable pageable = PageRequest.of(page, size, Sort.by("receivedDate").descending());
        return ResponseEntity.ok(contactService.getContactTickets(contact.getEmail(), pageable));
    }

    @PostMapping
    public ResponseEntity<Contact> create(@RequestBody Contact contact) {
        return ResponseEntity.ok(contactService.createOrUpdate(contact));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> update(@PathVariable Long id, @RequestBody Contact contact) {
        Contact existing = contactService.getById(id);
        if (contact.getName() != null) existing.setName(contact.getName());
        if (contact.getPhone() != null) existing.setPhone(contact.getPhone());
        if (contact.getCompany() != null) existing.setCompany(contact.getCompany());
        if (contact.getNotes() != null) existing.setNotes(contact.getNotes());
        if (contact.getEmail() != null) existing.setEmail(contact.getEmail());
        return ResponseEntity.ok(contactService.createOrUpdate(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        contactService.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Contact deleted successfully");
        return ResponseEntity.ok(response);
    }
}
