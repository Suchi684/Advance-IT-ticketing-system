package com.ticketing.system.repository;

import com.ticketing.system.model.SlaPolicy;
import com.ticketing.system.model.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SlaRepository extends JpaRepository<SlaPolicy, Long> {
    Optional<SlaPolicy> findByPriority(Priority priority);
}
