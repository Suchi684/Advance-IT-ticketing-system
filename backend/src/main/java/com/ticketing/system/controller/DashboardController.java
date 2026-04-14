package com.ticketing.system.controller;

import com.ticketing.system.model.dto.AgentPerformance;
import com.ticketing.system.model.dto.AgentWorkload;
import com.ticketing.system.model.dto.DashboardStats;
import com.ticketing.system.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
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

    @GetMapping("/my-performance")
    public ResponseEntity<AgentPerformance> getMyPerformance(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getMyPerformance(authentication.getName()));
    }
}
