package com.ticketing.system.controller;

import com.ticketing.system.model.ActivityLog;
import com.ticketing.system.model.TicketReply;
import com.ticketing.system.model.dto.TicketReplyRequest;
import com.ticketing.system.service.ActivityLogService;
import com.ticketing.system.service.TicketReplyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets/{ticketId}")
public class TicketReplyController {

    private final TicketReplyService replyService;
    private final ActivityLogService activityLogService;

    public TicketReplyController(TicketReplyService replyService, ActivityLogService activityLogService) {
        this.replyService = replyService;
        this.activityLogService = activityLogService;
    }

    @GetMapping("/replies")
    public ResponseEntity<List<Map<String, Object>>> getReplies(@PathVariable Long ticketId) {
        List<Map<String, Object>> replies = replyService.getReplies(ticketId).stream()
                .map(this::mapReply)
                .collect(Collectors.toList());
        return ResponseEntity.ok(replies);
    }

    @PostMapping("/reply")
    public ResponseEntity<Map<String, Object>> reply(
            @PathVariable Long ticketId,
            @Valid @RequestBody TicketReplyRequest request,
            Authentication authentication) {
        TicketReply reply = replyService.sendReply(
                ticketId, request.getToEmail(), request.getSubject(), request.getBody(), authentication.getName());
        return ResponseEntity.ok(mapReply(reply));
    }

    @PostMapping("/forward")
    public ResponseEntity<Map<String, Object>> forward(
            @PathVariable Long ticketId,
            @Valid @RequestBody TicketReplyRequest request,
            Authentication authentication) {
        TicketReply reply = replyService.forwardEmail(
                ticketId, request.getToEmail(), request.getSubject(), request.getBody(), authentication.getName());
        return ResponseEntity.ok(mapReply(reply));
    }

    @PostMapping("/note")
    public ResponseEntity<Map<String, Object>> addNote(
            @PathVariable Long ticketId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        TicketReply note = replyService.addNote(ticketId, body.get("body"), authentication.getName());
        return ResponseEntity.ok(mapReply(note));
    }

    @PostMapping("/forward-all")
    public ResponseEntity<Map<String, String>> forwardAll(
            @PathVariable Long ticketId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        replyService.forwardToAll(ticketId, body.get("subject"), body.get("body"), authentication.getName());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Forwarded to all agents successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, Object>>> getActivity(@PathVariable Long ticketId) {
        List<ActivityLog> logs = activityLogService.getByTicketId(ticketId);
        List<Map<String, Object>> result = logs.stream().map(log -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", log.getId());
            map.put("action", log.getAction());
            map.put("details", log.getDetails());
            map.put("performedBy", log.getPerformedBy());
            map.put("createdAt", log.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    private Map<String, Object> mapReply(TicketReply reply) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", reply.getId());
        map.put("fromEmail", reply.getFromEmail());
        map.put("toEmail", reply.getToEmail());
        map.put("subject", reply.getSubject());
        map.put("body", reply.getBody());
        map.put("sentDate", reply.getSentDate());
        map.put("replyType", reply.getReplyType().name());
        if (reply.getSentByAgent() != null) {
            map.put("sentByAgentName", reply.getSentByAgent().getName());
        }
        return map;
    }
}
