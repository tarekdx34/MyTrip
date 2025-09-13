// Aircraft.java
package com.mytrip.airline.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "aircraft")
public class Aircraft {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aircraftID") // Exact match to database
    private Long aircraftID;
    
    @Column(name = "aircraftModel", nullable = false, length = 100) // Exact match to database
    private String aircraftModel;
    
    @Column(name = "manufacturer", nullable = false, length = 100)
    private String manufacturer;
    
    @Column(name = "registration", nullable = false, unique = true, length = 20)
    private String registration;
    
    @Column(name = "capacity", nullable = false)
    private Integer capacity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airportID") // Exact match to database
    private Airport airport;
    
    // Constructors
    public Aircraft() {}
    
    public Aircraft(String aircraftModel, String manufacturer, String registration, Integer capacity) {
        this.aircraftModel = aircraftModel;
        this.manufacturer = manufacturer;
        this.registration = registration;
        this.capacity = capacity;
    }
    
    // Getters and Setters
    public Long getAircraftID() {
        return aircraftID;
    }
    
    public void setAircraftID(Long aircraftID) {
        this.aircraftID = aircraftID;
    }
    
    public String getAircraftModel() {
        return aircraftModel;
    }
    
    public void setAircraftModel(String aircraftModel) {
        this.aircraftModel = aircraftModel;
    }
    
    public String getManufacturer() {
        return manufacturer;
    }
    
    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }
    
    public String getRegistration() {
        return registration;
    }
    
    public void setRegistration(String registration) {
        this.registration = registration;
    }
    
    public Integer getCapacity() {
        return capacity;
    }
    
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
    
    public Airport getAirport() {
        return airport;
    }
    
    public void setAirport(Airport airport) {
        this.airport = airport;
    }
}