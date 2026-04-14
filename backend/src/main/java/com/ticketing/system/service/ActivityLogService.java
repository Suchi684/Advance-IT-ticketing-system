package com.ticketing.system.service;

import com.ticketing.system.model.ActivityLog;
import com.ticketing.system.model.Ticket;
import com.ticketing.system.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public void log(Ticket ticket, String action, String details, String performedBy) {
        ActivityLog log = new ActivityLog();
        log.setTicket(ticket);
        log.setAction(action);
        log.setDetails(details);
        log.setPerformedBy(performedBy);
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getByTicketId(Long ticketId) {
        return activityLogRepository.findByTicketIdOrderByCreatedAtDesc(ticketId);
    }
}
