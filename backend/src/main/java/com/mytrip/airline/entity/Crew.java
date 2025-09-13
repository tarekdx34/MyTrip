package com.mytrip.airline.entity;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;

@Entity
@Table(name = "crew")
public class Crew {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long crewID;

    @OneToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    private String employeeNumber;
    
    private String licenseNumber; // This was missing!

    @Enumerated(EnumType.STRING)
    @Column(name = "position")
    private Position position;
    
    // Single Position enum with proper mapping
    public enum Position {
        PILOT("pilot"),
        CO_PILOT("co_pilot"),
        FLIGHT_ATTENDANT("flight_attendant"),
        CABIN_CREW("cabin_crew");
        
        private final String value;
        
        Position(String value) {
            this.value = value;
        }
        
        @JsonValue
        public String getValue() {
            return value;
        }
        
        // Method to create enum from string value
        public static Position fromValue(String value) {
            for (Position position : Position.values()) {
                if (position.value.equals(value)) {
                    return position;
                }
            }
            throw new IllegalArgumentException("Invalid position: " + value);
        }
    }

    // Getters and Setters
    public Long getCrewID() {
        return crewID;
    }

    public void setCrewID(Long crewID) {
        this.crewID = crewID;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public void setEmployeeNumber(String employeeNumber) {
        this.employeeNumber = employeeNumber;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }
}