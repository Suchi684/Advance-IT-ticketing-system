package com.ticketing.system.repository;

import com.ticketing.system.model.Ticket;
import com.ticketing.system.model.enums.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    boolean existsByMessageId(String messageId);

    Page<Ticket> findByCategory(String category, Pageable pageable);

    Page<Ticket> findByStatus(TicketStatus status, Pageable pageable);

    Page<Ticket> findByCategoryAndStatus(String category, TicketStatus status, Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:search IS NULL OR LOWER(t.subject) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.fromEmail) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Ticket> findWithFilters(
        @Param("category") String category,
        @Param("status") TicketStatus status,
        @Param("search") String search,
        Pageable pageable
    );

    long countByCategory(String category);

    long countByStatus(TicketStatus status);

    @Query("SELECT t.category, COUNT(t) FROM Ticket t GROUP BY t.category")
    List<Object[]> countGroupByCategory();

    @Query("SELECT t.assignedAgent.id, t.assignedAgent.name, COUNT(t) FROM Ticket t " +
           "WHERE t.assignedAgent IS NOT NULL GROUP BY t.assignedAgent.id, t.assignedAgent.name")
    List<Object[]> countGroupByAgent();

    Page<Ticket> findByAssignedAgentEmail(String email, Pageable pageable);

    Page<Ticket> findByFromEmail(String fromEmail, Pageable pageable);

    long countByAssignedAgentId(Long agentId);

    long countByAssignedAgentIdAndStatus(Long agentId, TicketStatus status);

    @Query("SELECT COALESCE(SUM(t.credits), 0) FROM Ticket t WHERE t.assignedAgent.id = :agentId AND t.status = 'RESOLVED'")
    long sumCreditsByAgentId(@Param("agentId") Long agentId);

    @Query("SELECT t.assignedAgent.id, t.assignedAgent.name, COUNT(t), " +
           "SUM(CASE WHEN t.status = 'RESOLVED' THEN 1 ELSE 0 END), " +
           "COALESCE(SUM(CASE WHEN t.status = 'RESOLVED' THEN t.credits ELSE 0 END), 0) " +
           "FROM Ticket t WHERE t.assignedAgent IS NOT NULL GROUP BY t.assignedAgent.id, t.assignedAgent.name")
    List<Object[]> getAgentPerformanceData();

    @Query("SELECT t FROM Ticket t WHERE t.deadline IS NOT NULL AND t.deadline < :now " +
           "AND t.reminderSent = false AND t.assignedAgent IS NOT NULL " +
           "AND t.status NOT IN ('RESOLVED', 'CLOSED')")
    List<Ticket> findOverdueTickets(@Param("now") java.time.LocalDateTime now);
}
