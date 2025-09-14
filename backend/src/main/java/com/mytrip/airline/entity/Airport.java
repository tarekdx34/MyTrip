// Airport.java
package com.mytrip.airline.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "airport")
public class Airport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "airportID") // Exact match to database
    private Long airportID;
    
    @Column(name = "airportCode", nullable = false, unique = true, length = 10) // Exact match to database
    private String airportCode;
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "city", nullable = false, length = 100)
    private String city;
    
    @Column(name = "country", nullable = false, length = 100)
    private String country;
    
    // Constructors
    public Airport() {}
    
    public Airport(String airportCode, String name, String city, String country) {
        this.airportCode = airportCode;
        this.name = name;
        this.city = city;
        this.country = country;
    }
    
    // Getters and Setters
    public Long getAirportID() {
        return airportID;
    }
    
    public void setAirportID(Long airportID) {
        this.airportID = airportID;
    }
    
    public String getAirportCode() {
        return airportCode;
    }
    
    public void setAirportCode(String airportCode) {
        this.airportCode = airportCode;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
}