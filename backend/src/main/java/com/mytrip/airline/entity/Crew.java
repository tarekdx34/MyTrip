package com.mytrip.airline.entity;

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

    @Enumerated(EnumType.STRING)
    private Position position;

    private String licenseNumber;

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

    public enum Position {
        pilot,
        co_pilot,
        flight_attendant,
        cabin_crew
    }
}
