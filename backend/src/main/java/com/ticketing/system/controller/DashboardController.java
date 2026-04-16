package com.ticketing.system.controller;

import com.ticketing.system.model.dto.AgentPerformance;
import com.ticketing.system.model.dto.AgentWorkload;
import com.ticketing.system.model.dto.DashboardStats;
import com.ticketing.system.service.ContactService;
import com.ticketing.system.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final ContactService contactService;

    public DashboardController(DashboardService dashboardService, ContactService contactService) {
        this.dashboardService = dashboardService;
        this.contactService = contactService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/agent-workload")
    public ResponseEntity<List<AgentWorkload>> getAgentWorkload() {
        return ResponseEntity.ok(dashboardService.getAgentWorkload());
    }

    @GetMapping("/agent-performance")
    public ResponseEntity<List<AgentPerformance>> getAgentPerformance() {
        return ResponseEntity.ok(dashboardService.getAgentPerformance());
    }

    @GetMapping("/agent-performance/{agentId}")
    public ResponseEntity<AgentPerformance> getAgentPerformanceById(@PathVariable Long agentId) {
        return ResponseEntity.ok(dashboardService.getAgentPerformanceById(agentId));
    }

    @GetMapping("/agent-performance/{agentId}/contacts")
    public ResponseEntity<List<Map<String, Object>>> getAgentContacts(@PathVariable Long agentId) {
        return ResponseEntity.ok(contactService.getContactsByAgent(agentId));
    }

    @GetMapping("/my-performance")
    public ResponseEntity<AgentPerformance> getMyPerformance(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getMyPerformance(authentication.getName()));
    }
}
