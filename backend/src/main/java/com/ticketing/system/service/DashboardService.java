package com.ticketing.system.service;

import com.ticketing.system.model.User;
import com.ticketing.system.model.dto.AgentPerformance;
import com.ticketing.system.model.dto.AgentWorkload;
import com.ticketing.system.model.dto.DashboardStats;
import com.ticketing.system.model.enums.TicketStatus;
import com.ticketing.system.repository.TicketRepository;
import com.ticketing.system.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public DashboardService(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
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

    public List<AgentPerformance> getAgentPerformance() {
        return ticketRepository.getAgentPerformanceData().stream()
                .map(row -> new AgentPerformance(
                        (Long) row[0],
                        (String) row[1],
                        (Long) row[2],
                        (Long) row[3],
                        0, 0,
                        (Long) row[4]
                ))
                .map(ap -> {
                    long open = ticketRepository.countByAssignedAgentIdAndStatus(ap.getAgentId(), TicketStatus.OPEN);
                    long inProg = ticketRepository.countByAssignedAgentIdAndStatus(ap.getAgentId(), TicketStatus.IN_PROGRESS);
                    ap.setOpen(open);
                    ap.setInProgress(inProg);
                    return ap;
                })
                .collect(Collectors.toList());
    }

    public AgentPerformance getAgentPerformanceById(Long agentId) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        long total = ticketRepository.countByAssignedAgentId(agentId);
        long resolved = ticketRepository.countByAssignedAgentIdAndStatus(agentId, TicketStatus.RESOLVED);
        long open = ticketRepository.countByAssignedAgentIdAndStatus(agentId, TicketStatus.OPEN);
        long inProgress = ticketRepository.countByAssignedAgentIdAndStatus(agentId, TicketStatus.IN_PROGRESS);
        long credits = ticketRepository.sumCreditsByAgentId(agentId);
        return new AgentPerformance(agentId, agent.getName(), total, resolved, open, inProgress, credits);
    }

    public AgentPerformance getMyPerformance(String email) {
        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getAgentPerformanceById(agent.getId());
    }
}
