package com.mytrip.airline.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "front_desk")
public class FrontDesk {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "frontDeskID")
    private Long frontDeskID;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @Column(name = "employeeNumber", length = 50)
    private String employeeNumber;

    @Column(name = "department", length = 100)
    private String department;

    // Default constructor
    public FrontDesk() {}

    // Constructor with parameters
    public FrontDesk(User user, String employeeNumber, String department) {
        this.user = user;
        this.employeeNumber = employeeNumber;
        this.department = department;
    }

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

    @Override
    public String toString() {
        return "FrontDesk{" +
                "frontDeskID=" + frontDeskID +
                ", employeeNumber='" + employeeNumber + '\'' +
                ", department='" + department + '\'' +
                '}';
    }
}