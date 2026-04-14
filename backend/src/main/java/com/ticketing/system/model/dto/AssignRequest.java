package com.ticketing.system.model.dto;

import jakarta.validation.constraints.NotNull;

public class AssignRequest {
    @NotNull
    private Long agentId;

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }
}
