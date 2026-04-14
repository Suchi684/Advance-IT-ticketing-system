package com.ticketing.system.repository;

import com.ticketing.system.model.TicketReply;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketReplyRepository extends JpaRepository<TicketReply, Long> {
    List<TicketReply> findByTicketIdOrderBySentDateDesc(Long ticketId);
}
