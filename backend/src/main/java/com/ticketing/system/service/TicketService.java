package com.ticketing.system.service;

import com.ticketing.system.model.CategoryConfig;
import com.ticketing.system.model.Tag;
import com.ticketing.system.model.Ticket;
import com.ticketing.system.model.User;
import com.ticketing.system.model.dto.TicketResponse;
import com.ticketing.system.model.enums.Priority;
import com.ticketing.system.model.enums.TicketStatus;
import com.ticketing.system.repository.CategoryConfigRepository;
import com.ticketing.system.repository.TagRepository;
import com.ticketing.system.repository.TicketRepository;
import com.ticketing.system.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CategoryConfigRepository categoryConfigRepository;
    private final TagRepository tagRepository;
    private final ActivityLogService activityLogService;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository,
                         CategoryConfigRepository categoryConfigRepository, TagRepository tagRepository,
                         ActivityLogService activityLogService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.categoryConfigRepository = categoryConfigRepository;
        this.tagRepository = tagRepository;
        this.activityLogService = activityLogService;
    }

    public Page<TicketResponse> getTickets(String category, String status, String search, Pageable pageable) {
        String cat = (category != null && !category.isEmpty()) ? category : null;
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
        if (ticket.getCredits() == null || ticket.getCredits() == 0) {
            ticket.setCredits(calculateCredits(ticket.getCategory(), ticket.getPriority()));
        }
        ticketRepository.save(ticket);
        activityLogService.log(ticket, "ASSIGN", "Assigned to " + agent.getName(), "system");
        return TicketResponse.from(ticket);
    }

    public TicketResponse updateStatus(Long ticketId, String status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        TicketStatus oldStatus = ticket.getStatus();
        TicketStatus newStatus = TicketStatus.valueOf(status);
        ticket.setStatus(newStatus);

        if (newStatus == TicketStatus.RESOLVED && oldStatus != TicketStatus.RESOLVED) {
            if (ticket.getCredits() == null || ticket.getCredits() == 0) {
                ticket.setCredits(calculateCredits(ticket.getCategory(), ticket.getPriority()));
            }
            User agent = ticket.getAssignedAgent();
            if (agent != null) {
                int current = agent.getTotalCredits() != null ? agent.getTotalCredits() : 0;
                agent.setTotalCredits(current + ticket.getCredits());
                userRepository.save(agent);
            }
        }

        ticketRepository.save(ticket);
        activityLogService.log(ticket, "STATUS_CHANGE", "Status changed from " + oldStatus + " to " + newStatus, "system");
        return TicketResponse.from(ticket);
    }

    public TicketResponse updatePriority(Long ticketId, String priority) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        Priority oldPriority = ticket.getPriority();
        ticket.setPriority(Priority.valueOf(priority));
        ticket.setCredits(calculateCredits(ticket.getCategory(), ticket.getPriority()));
        ticketRepository.save(ticket);
        activityLogService.log(ticket, "PRIORITY_CHANGE", "Priority changed from " + oldPriority + " to " + priority, "system");
        return TicketResponse.from(ticket);
    }

    public Page<TicketResponse> getAssignedTickets(String agentEmail, Pageable pageable) {
        return ticketRepository.findByAssignedAgentEmail(agentEmail, pageable)
                .map(TicketResponse::from);
    }

    public TicketResponse updateCategory(Long ticketId, String category) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        String oldCategory = ticket.getCategory();
        ticket.setCategory(category);
        ticket.setCredits(calculateCredits(ticket.getCategory(), ticket.getPriority()));
        ticketRepository.save(ticket);
        activityLogService.log(ticket, "CATEGORY_CHANGE", "Category changed from " + oldCategory + " to " + category, "system");
        return TicketResponse.from(ticket);
    }

    public TicketResponse updateDeadline(Long ticketId, String deadline) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        if (deadline != null && !deadline.isEmpty()) {
            ticket.setDeadline(java.time.LocalDateTime.parse(deadline));
            ticket.setReminderSent(false);
        } else {
            ticket.setDeadline(null);
        }
        ticketRepository.save(ticket);
        activityLogService.log(ticket, "DEADLINE_SET", "Deadline set to " + deadline, "system");
        return TicketResponse.from(ticket);
    }

    public TicketResponse updateTags(Long ticketId, List<String> tagNames) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        Set<Tag> tags = new HashSet<>();
        for (String name : tagNames) {
            Tag tag = tagRepository.findByName(name).orElseGet(() -> {
                Tag newTag = new Tag();
                newTag.setName(name);
                return tagRepository.save(newTag);
            });
            tags.add(tag);
        }
        ticket.setTags(tags);
        ticketRepository.save(ticket);
        return TicketResponse.from(ticket);
    }

    public void bulkUpdateStatus(List<Long> ticketIds, String status) {
        for (Long ticketId : ticketIds) {
            updateStatus(ticketId, status);
        }
    }

    public void bulkAssign(List<Long> ticketIds, Long agentId) {
        for (Long ticketId : ticketIds) {
            assignTicket(ticketId, agentId);
        }
    }

    public TicketResponse updateCsat(Long ticketId, Integer rating, String comment) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setCsatRating(rating);
        ticket.setCsatComment(comment);
        ticketRepository.save(ticket);
        return TicketResponse.from(ticket);
    }

    public int calculateCredits(String categoryName, Priority priority) {
        int base = categoryConfigRepository.findByName(categoryName)
                .map(CategoryConfig::getBaseCredits)
                .orElse(5);

        int bonus;
        switch (priority) {
            case URGENT: bonus = 10; break;
            case HIGH: bonus = 5; break;
            case MEDIUM: bonus = 2; break;
            default: bonus = 0;
        }
        return base + bonus;
    }
}
