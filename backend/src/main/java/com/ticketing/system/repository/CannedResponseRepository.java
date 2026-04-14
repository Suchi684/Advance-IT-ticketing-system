package com.ticketing.system.repository;

import com.ticketing.system.model.CannedResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CannedResponseRepository extends JpaRepository<CannedResponse, Long> {
    List<CannedResponse> findByCategory(String category);
}
