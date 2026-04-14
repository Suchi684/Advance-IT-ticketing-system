package com.ticketing.system.controller;

import com.ticketing.system.model.SlaPolicy;
import com.ticketing.system.service.SlaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sla")
public class SlaController {

    private final SlaService slaService;

    public SlaController(SlaService slaService) {
        this.slaService = slaService;
    }

    @GetMapping
    public ResponseEntity<List<SlaPolicy>> getAll() {
        return ResponseEntity.ok(slaService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SlaPolicy> update(@PathVariable Long id, @RequestBody SlaPolicy slaPolicy) {
        return ResponseEntity.ok(slaService.update(id, slaPolicy));
    }
}
