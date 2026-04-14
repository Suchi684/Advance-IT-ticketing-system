package com.ticketing.system.controller;

import com.ticketing.system.model.CannedResponse;
import com.ticketing.system.service.CannedResponseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/canned-responses")
public class CannedResponseController {

    private final CannedResponseService cannedResponseService;

    public CannedResponseController(CannedResponseService cannedResponseService) {
        this.cannedResponseService = cannedResponseService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll(@RequestParam(required = false) String category) {
        List<CannedResponse> responses;
        if (category != null && !category.isEmpty()) {
            responses = cannedResponseService.getByCategory(category);
        } else {
            responses = cannedResponseService.getAll();
        }
        List<Map<String, Object>> result = responses.stream()
                .map(this::mapResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody CannedResponse cannedResponse,
                                                       Authentication authentication) {
        CannedResponse saved = cannedResponseService.create(cannedResponse, authentication.getName());
        return ResponseEntity.ok(mapResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id,
                                                       @RequestBody CannedResponse cannedResponse) {
        CannedResponse updated = cannedResponseService.update(id, cannedResponse);
        return ResponseEntity.ok(mapResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        cannedResponseService.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Canned response deleted successfully");
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> mapResponse(CannedResponse cr) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", cr.getId());
        map.put("title", cr.getTitle());
        map.put("body", cr.getBody());
        map.put("category", cr.getCategory());
        map.put("createdAt", cr.getCreatedAt());
        if (cr.getCreatedBy() != null) {
            map.put("createdByName", cr.getCreatedBy().getName());
            map.put("createdById", cr.getCreatedBy().getId());
        }
        return map;
    }
}
