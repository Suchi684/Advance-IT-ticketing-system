package com.ticketing.system.repository;

import com.ticketing.system.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByTicketIdOrderByCreatedAtDesc(Long ticketId);
}
