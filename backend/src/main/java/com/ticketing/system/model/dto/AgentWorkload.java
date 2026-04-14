package com.ticketing.system.model.dto;

public class AgentWorkload {
    private Long agentId;
    private String agentName;
    private long ticketCount;

    public AgentWorkload(Long agentId, String agentName, long ticketCount) {
        this.agentId = agentId;
        this.agentName = agentName;
        this.ticketCount = ticketCount;
    }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }
    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }
    public long getTicketCount() { return ticketCount; }
    public void setTicketCount(long ticketCount) { this.ticketCount = ticketCount; }
}
