package com.mytrip.airline.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CrewAssignmentRequest {
    
    @JsonProperty("flightID")
    private Long flightId;
    
    @JsonProperty("crewID") 
    private Long crewId;
    
    @JsonProperty("assignedBy")
    private Long assignedBy;
    
    private String status;
    
    // Constructors
    public CrewAssignmentRequest() {}
    
    public CrewAssignmentRequest(Long flightId, Long crewId, Long assignedBy) {
        this.flightId = flightId;
        this.crewId = crewId;
        this.assignedBy = assignedBy;
    }
    
    // Getters and Setters
    public Long getFlightId() { return flightId; }
    public void setFlightId(Long flightId) { this.flightId = flightId; }
    
    public Long getCrewId() { return crewId; }
    public void setCrewId(Long crewId) { this.crewId = crewId; }
    
    public Long getAssignedBy() { return assignedBy; }
    public void setAssignedBy(Long assignedBy) { this.assignedBy = assignedBy; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}