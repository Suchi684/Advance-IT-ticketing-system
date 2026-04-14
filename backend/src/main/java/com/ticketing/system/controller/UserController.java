package com.ticketing.system.controller;

import com.ticketing.system.model.User;
import com.ticketing.system.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/agents")
    public ResponseEntity<List<Map<String, Object>>> getAgents() {
        List<Map<String, Object>> agents = userService.getAllAgents().stream()
                .map(agent -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", agent.getId());
                    map.put("name", agent.getName());
                    map.put("email", agent.getEmail());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(agents);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole().name());
        return ResponseEntity.ok(map);
    }
}
