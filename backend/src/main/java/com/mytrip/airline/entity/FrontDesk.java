package com.mytrip.airline.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "front_desk")
public class FrontDesk {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long frontDeskID;

    @OneToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    private String employeeNumber;

    private String department;

    // Getters and Setters

    public Long getFrontDeskID() {
        return frontDeskID;
    }

    public void setFrontDeskID(Long frontDeskID) {
        this.frontDeskID = frontDeskID;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
