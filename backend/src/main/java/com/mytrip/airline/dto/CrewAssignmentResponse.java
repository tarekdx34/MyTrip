package com.mytrip.airline.dto;

import com.mytrip.airline.entity.CrewAssignment;
import java.time.LocalDateTime;

public class CrewAssignmentResponse {
    
    private Long assignmentId;
    private Long flightId;
    private Long crewId;
    private LocalDateTime assignmentDate;
    private Long assignedBy;
    private String status;
    private String flightNumber;
    private String crewName;
    private String crewPosition;
    
    // Constructor from entity
    public CrewAssignmentResponse(CrewAssignment assignment) {
        this.assignmentId = assignment.getAssignmentId();
        this.flightId = assignment.getFlightId();
        this.crewId = assignment.getCrewId();
        this.assignmentDate = assignment.getAssignmentDate();
        this.assignedBy = assignment.getAssignedBy();
        this.status = assignment.getStatus().name();
        
        // Add related data if available
        if (assignment.getFlight() != null) {
            this.flightNumber = assignment.getFlight().getFlightNumber();
        }
        if (assignment.getCrew() != null) {
            this.crewName = assignment.getCrew().getUser().getName();
            this.crewPosition = assignment.getCrew().getPosition().name();
        }
    }
    
    // Getters and Setters
    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }
    
    public Long getFlightId() { return flightId; }
    public void setFlightId(Long flightId) { this.flightId = flightId; }
    
    public Long getCrewId() { return crewId; }
    public void setCrewId(Long crewId) { this.crewId = crewId; }
    
    public LocalDateTime getAssignmentDate() { return assignmentDate; }
    public void setAssignmentDate(LocalDateTime assignmentDate) { this.assignmentDate = assignmentDate; }
    
    public Long getAssignedBy() { return assignedBy; }
    public void setAssignedBy(Long assignedBy) { this.assignedBy = assignedBy; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }
    
    public String getCrewName() { return crewName; }
    public void setCrewName(String crewName) { this.crewName = crewName; }
    
    public String getCrewPosition() { return crewPosition; }
    public void setCrewPosition(String crewPosition) { this.crewPosition = crewPosition; }
}