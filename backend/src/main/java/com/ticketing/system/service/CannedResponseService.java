package com.ticketing.system.service;

import com.ticketing.system.model.CannedResponse;
import com.ticketing.system.model.User;
import com.ticketing.system.repository.CannedResponseRepository;
import com.ticketing.system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CannedResponseService {

    private final CannedResponseRepository cannedResponseRepository;
    private final UserRepository userRepository;

    public CannedResponseService(CannedResponseRepository cannedResponseRepository, UserRepository userRepository) {
        this.cannedResponseRepository = cannedResponseRepository;
        this.userRepository = userRepository;
    }

    public List<CannedResponse> getAll() {
        return cannedResponseRepository.findAll();
    }

    public List<CannedResponse> getByCategory(String category) {
        return cannedResponseRepository.findByCategory(category);
    }

    public CannedResponse create(CannedResponse cannedResponse, String agentEmail) {
        User user = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cannedResponse.setCreatedBy(user);
        return cannedResponseRepository.save(cannedResponse);
    }

    public CannedResponse update(Long id, CannedResponse updated) {
        CannedResponse existing = cannedResponseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Canned response not found"));
        existing.setTitle(updated.getTitle());
        existing.setBody(updated.getBody());
        existing.setCategory(updated.getCategory());
        return cannedResponseRepository.save(existing);
    }

    public void delete(Long id) {
        cannedResponseRepository.deleteById(id);
    }
}
