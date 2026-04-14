package com.ticketing.system.service;

import com.ticketing.system.model.SlaPolicy;
import com.ticketing.system.model.enums.Priority;
import com.ticketing.system.repository.SlaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SlaService {

    private final SlaRepository slaRepository;

    public SlaService(SlaRepository slaRepository) {
        this.slaRepository = slaRepository;
    }

    public List<SlaPolicy> getAll() {
        return slaRepository.findAll();
    }

    public SlaPolicy update(Long id, SlaPolicy updated) {
        SlaPolicy existing = slaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SLA policy not found"));
        existing.setResponseHours(updated.getResponseHours());
        existing.setResolutionHours(updated.getResolutionHours());
        existing.setIsActive(updated.getIsActive());
        return slaRepository.save(existing);
    }

    public Optional<SlaPolicy> findByPriority(Priority priority) {
        return slaRepository.findByPriority(priority);
    }
}
