package com.ticketing.system.model.dto;

public class AgentPerformance {
    private Long agentId;
    private String agentName;
    private long totalAssigned;
    private long resolved;
    private long open;
    private long inProgress;
    private long totalCredits;

    public AgentPerformance(Long agentId, String agentName, long totalAssigned,
                            long resolved, long open, long inProgress, long totalCredits) {
        this.agentId = agentId;
        this.agentName = agentName;
        this.totalAssigned = totalAssigned;
        this.resolved = resolved;
        this.open = open;
        this.inProgress = inProgress;
        this.totalCredits = totalCredits;
    }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }
    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }
    public long getTotalAssigned() { return totalAssigned; }
    public void setTotalAssigned(long totalAssigned) { this.totalAssigned = totalAssigned; }
    public long getResolved() { return resolved; }
    public void setResolved(long resolved) { this.resolved = resolved; }
    public long getOpen() { return open; }
    public void setOpen(long open) { this.open = open; }
    public long getInProgress() { return inProgress; }
    public void setInProgress(long inProgress) { this.inProgress = inProgress; }
    public long getTotalCredits() { return totalCredits; }
    public void setTotalCredits(long totalCredits) { this.totalCredits = totalCredits; }
}
