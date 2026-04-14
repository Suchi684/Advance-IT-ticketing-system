package com.ticketing.system.service;

import com.ticketing.system.model.Ticket;
import com.ticketing.system.model.User;
import com.ticketing.system.model.dto.TicketResponse;
import com.ticketing.system.model.enums.Category;
import com.ticketing.system.model.enums.Priority;
import com.ticketing.system.model.enums.TicketStatus;
import com.ticketing.system.repository.TicketRepository;
import com.ticketing.system.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public Page<TicketResponse> getTickets(String category, String status, String search, Pageable pageable) {
        Category cat = category != null && !category.isEmpty() ? Category.valueOf(category) : null;
        TicketStatus st = status != null && !status.isEmpty() ? TicketStatus.valueOf(status) : null;
        String searchTerm = (search != null && !search.isEmpty()) ? search : null;

        return ticketRepository.findWithFilters(cat, st, searchTerm, pageable)
                .map(TicketResponse::from);
    }

    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        return TicketResponse.from(ticket);
    }

    public TicketResponse assignTicket(Long ticketId, Long agentId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        ticket.setAssignedAgent(agent);
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }
        ticketRepository.save(ticket);
        return TicketResponse.from(ticket);
    }

    public TicketResponse updateStatus(Long ticketId, String status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(TicketStatus.valueOf(status));
        ticketRepository.save(ticket);
        return TicketResponse.from(ticket);
    }

    public TicketResponse updatePriority(Long ticketId, String priority) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setPriority(Priority.valueOf(priority));
        ticketRepository.save(ticket);
        return TicketResponse.from(ticket);
    }

    public Page<TicketResponse> getAssignedTickets(String agentEmail, Pageable pageable) {
        return ticketRepository.findByAssignedAgentEmail(agentEmail, pageable)
                .map(TicketResponse::from);
    }

    public TicketResponse updateCategory(Long ticketId, String category) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setCategory(Category.valueOf(category));
        ticketRepository.save(ticket);
        return TicketResponse.from(ticket);
    }
}
