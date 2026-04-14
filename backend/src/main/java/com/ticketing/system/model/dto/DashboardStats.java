package com.ticketing.system.model.dto;

import java.util.Map;

public class DashboardStats {
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long closedTickets;
    private Map<String, Long> ticketsByCategory;

    public DashboardStats(long totalTickets, long openTickets, long inProgressTickets,
                          long resolvedTickets, long closedTickets, Map<String, Long> ticketsByCategory) {
        this.totalTickets = totalTickets;
        this.openTickets = openTickets;
        this.inProgressTickets = inProgressTickets;
        this.resolvedTickets = resolvedTickets;
        this.closedTickets = closedTickets;
        this.ticketsByCategory = ticketsByCategory;
    }

    public long getTotalTickets() { return totalTickets; }
    public void setTotalTickets(long totalTickets) { this.totalTickets = totalTickets; }
    public long getOpenTickets() { return openTickets; }
    public void setOpenTickets(long openTickets) { this.openTickets = openTickets; }
    public long getInProgressTickets() { return inProgressTickets; }
    public void setInProgressTickets(long inProgressTickets) { this.inProgressTickets = inProgressTickets; }
    public long getResolvedTickets() { return resolvedTickets; }
    public void setResolvedTickets(long resolvedTickets) { this.resolvedTickets = resolvedTickets; }
    public long getClosedTickets() { return closedTickets; }
    public void setClosedTickets(long closedTickets) { this.closedTickets = closedTickets; }
    public Map<String, Long> getTicketsByCategory() { return ticketsByCategory; }
    public void setTicketsByCategory(Map<String, Long> ticketsByCategory) { this.ticketsByCategory = ticketsByCategory; }
}
