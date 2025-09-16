package com.mytrip.airline.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crew_assignments")
public class CrewAssignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignmentID")
    private Long assignmentId;
    
    @Column(name = "flightID", nullable = false)
    private Long flightId;
    
    @Column(name = "crewID", nullable = false)
    private Long crewId;
    
    @Column(name = "assignmentDate")
    private LocalDateTime assignmentDate;
    
    @Column(name = "assignedBy")
    private Long assignedBy;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AssignmentStatus status;
    
    // Foreign key relationships (optional, for better JPA handling)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flightID", insertable = false, updatable = false)
    private Flight flight;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crewID", insertable = false, updatable = false)
    private Crew crew;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignedBy", insertable = false, updatable = false)
    private Admin admin;
    
    // Constructors
    public CrewAssignment() {
        this.assignmentDate = LocalDateTime.now();
        this.status = AssignmentStatus.ASSIGNED;
    }
    
    public CrewAssignment(Long flightId, Long crewId, Long assignedBy) {
        this();
        this.flightId = flightId;
        this.crewId = crewId;
        this.assignedBy = assignedBy;
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
    
    public AssignmentStatus getStatus() { return status; }
    public void setStatus(AssignmentStatus status) { this.status = status; }
    
    public Flight getFlight() { return flight; }
    public void setFlight(Flight flight) { this.flight = flight; }
    
    public Crew getCrew() { return crew; }
    public void setCrew(Crew crew) { this.crew = crew; }
    
    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }
    
    public enum AssignmentStatus {
        ASSIGNED, COMPLETED, CANCELLED
    }
}