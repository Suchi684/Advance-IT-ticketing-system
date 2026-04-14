package com.ticketing.system.controller;

import com.ticketing.system.model.dto.AgentWorkload;
import com.ticketing.system.model.dto.DashboardStats;
import com.ticketing.system.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
