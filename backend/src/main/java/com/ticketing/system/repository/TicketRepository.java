package com.ticketing.system.repository;

import com.ticketing.system.model.Ticket;
import com.ticketing.system.model.enums.Category;
import com.ticketing.system.model.enums.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    boolean existsByMessageId(String messageId);

    Page<Ticket> findByCategory(Category category, Pageable pageable);

    Page<Ticket> findByStatus(TicketStatus status, Pageable pageable);

    Page<Ticket> findByCategoryAndStatus(Category category, TicketStatus status, Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:search IS NULL OR LOWER(t.subject) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.fromEmail) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Ticket> findWithFilters(
        @Param("category") Category category,
        @Param("status") TicketStatus status,
        @Param("search") String search,
        Pageable pageable
    );

    long countByCategory(Category category);

    long countByStatus(TicketStatus status);

    @Query("SELECT t.category, COUNT(t) FROM Ticket t GROUP BY t.category")
    List<Object[]> countGroupByCategory();

    @Query("SELECT t.assignedAgent.id, t.assignedAgent.name, COUNT(t) FROM Ticket t " +
           "WHERE t.assignedAgent IS NOT NULL GROUP BY t.assignedAgent.id, t.assignedAgent.name")
    List<Object[]> countGroupByAgent();

    Page<Ticket> findByAssignedAgentEmail(String email, Pageable pageable);
}
