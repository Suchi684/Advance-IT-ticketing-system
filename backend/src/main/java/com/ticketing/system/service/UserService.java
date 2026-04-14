package com.ticketing.system.service;

import com.ticketing.system.model.User;
import com.ticketing.system.model.enums.UserRole;
import com.ticketing.system.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllAgents() {
        return userRepository.findByRole(UserRole.AGENT);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
