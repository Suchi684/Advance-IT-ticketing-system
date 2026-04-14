package com.ticketing.system.controller;

import com.ticketing.system.model.dto.AssignRequest;
import com.ticketing.system.model.dto.TicketResponse;
import com.ticketing.system.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<Page<TicketResponse>> getTickets(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "receivedDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(ticketService.getTickets(category, status, search, pageable));
    }

    @GetMapping("/assigned")
    public ResponseEntity<Page<TicketResponse>> getAssignedTickets(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Sort sort = Sort.by("receivedDate").descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(ticketService.getAssignedTickets(authentication.getName(), pageable));
    }

    @PutMapping("/bulk/status")
    public ResponseEntity<Map<String, String>> bulkUpdateStatus(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Integer> rawIds = (List<Integer>) body.get("ticketIds");
        List<Long> ticketIds = rawIds.stream().map(Integer::longValue).toList();
        String status = (String) body.get("status");
        ticketService.bulkUpdateStatus(ticketIds, status);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Bulk status update completed");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/bulk/assign")
    public ResponseEntity<Map<String, String>> bulkAssign(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Integer> rawIds = (List<Integer>) body.get("ticketIds");
        List<Long> ticketIds = rawIds.stream().map(Integer::longValue).toList();
        Long agentId = ((Number) body.get("agentId")).longValue();
        ticketService.bulkAssign(ticketIds, agentId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Bulk assign completed");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assignTicket(@PathVariable Long id, @Valid @RequestBody AssignRequest request) {
        return ResponseEntity.ok(ticketService.assignTicket(id, request.getAgentId()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TicketResponse> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ticketService.updateStatus(id, body.get("status")));
    }

    @PutMapping("/{id}/priority")
    public ResponseEntity<TicketResponse> updatePriority(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ticketService.updatePriority(id, body.get("priority")));
    }

    @PutMapping("/{id}/category")
    public ResponseEntity<TicketResponse> updateCategory(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ticketService.updateCategory(id, body.get("category")));
    }

    @PutMapping("/{id}/deadline")
    public ResponseEntity<TicketResponse> updateDeadline(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ticketService.updateDeadline(id, body.get("deadline")));
    }

    @PutMapping("/{id}/tags")
    public ResponseEntity<TicketResponse> updateTags(@PathVariable Long id, @RequestBody Map<String, List<String>> body) {
        List<String> tags = body.get("tags");
        return ResponseEntity.ok(ticketService.updateTags(id, tags));
    }

    @PutMapping("/{id}/csat")
    public ResponseEntity<TicketResponse> updateCsat(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Integer rating = (Integer) body.get("rating");
        String comment = (String) body.get("comment");
        return ResponseEntity.ok(ticketService.updateCsat(id, rating, comment));
    }
}
