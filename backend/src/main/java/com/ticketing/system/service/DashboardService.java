package com.ticketing.system.service;

import com.ticketing.system.model.dto.AgentWorkload;
import com.ticketing.system.model.dto.DashboardStats;
import com.ticketing.system.model.enums.TicketStatus;
import com.ticketing.system.repository.TicketRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TicketRepository ticketRepository;

    public DashboardService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public DashboardStats getStats() {
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgress = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long resolved = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long closed = ticketRepository.countByStatus(TicketStatus.CLOSED);

        Map<String, Long> byCategory = new HashMap<>();
        for (Object[] row : ticketRepository.countGroupByCategory()) {
            byCategory.put(row[0].toString(), (Long) row[1]);
        }

        return new DashboardStats(total, open, inProgress, resolved, closed, byCategory);
    }

    public List<AgentWorkload> getAgentWorkload() {
        return ticketRepository.countGroupByAgent().stream()
                .map(row -> new AgentWorkload((Long) row[0], (String) row[1], (Long) row[2]))
                .collect(Collectors.toList());
    }
}
