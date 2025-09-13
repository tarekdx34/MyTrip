// Flight.java
package com.mytrip.airline.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "flight")
public class Flight {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flightID") // Assuming camelCase based on other tables
    private Long flightID;
    
    @Column(name = "flightNumber", unique = true, nullable = false, length = 20)
    private String flightNumber;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aircraftID", nullable = false) // Changed to camelCase
    private Aircraft aircraft;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "departureAirportID", nullable = false) // Changed to camelCase
    private Airport departureAirport;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "arrivalAirportID", nullable = false) // Changed to camelCase
    private Airport arrivalAirport;
    
    @Column(name = "departureTime", nullable = false)
    private LocalDateTime departureTime;
    
    @Column(name = "arrivalTime", nullable = false)
    private LocalDateTime arrivalTime;
    
    @Column(name = "duration")
    private Integer duration; // in minutes
    
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "availableSeats", nullable = false)
    private Integer availableSeats;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private FlightStatus status = FlightStatus.SCHEDULED;
    
    public enum FlightStatus {
        SCHEDULED, BOARDING, DEPARTED, ARRIVED, CANCELLED, DELAYED,scheduled,boarding,departed,arrived,cancelled,delayed
    }
    
    // Constructors
    public Flight() {}
    
    public Flight(String flightNumber, Aircraft aircraft, Airport departureAirport, 
                  Airport arrivalAirport, LocalDateTime departureTime, LocalDateTime arrivalTime, 
                  BigDecimal price, Integer availableSeats) {
        this.flightNumber = flightNumber;
        this.aircraft = aircraft;
        this.departureAirport = departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.price = price;
        this.availableSeats = availableSeats;
        this.status = FlightStatus.SCHEDULED;
        
        if (departureTime != null && arrivalTime != null) {
            this.duration = (int) java.time.Duration.between(departureTime, arrivalTime).toMinutes();
        }
    }
    
    // Getters and Setters
    public Long getFlightID() { return flightID; }
    public void setFlightID(Long flightID) { this.flightID = flightID; }
    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }
    public Aircraft getAircraft() { return aircraft; }
    public void setAircraft(Aircraft aircraft) { this.aircraft = aircraft; }
    public Airport getDepartureAirport() { return departureAirport; }
    public void setDepartureAirport(Airport departureAirport) { this.departureAirport = departureAirport; }
    public Airport getArrivalAirport() { return arrivalAirport; }
    public void setArrivalAirport(Airport arrivalAirport) { this.arrivalAirport = arrivalAirport; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; updateDuration(); }
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; updateDuration(); }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public FlightStatus getStatus() { return status; }
    public void setStatus(FlightStatus status) { this.status = status; }
    
    private void updateDuration() {
        if (departureTime != null && arrivalTime != null) {
            this.duration = (int) java.time.Duration.between(departureTime, arrivalTime).toMinutes();
        }
    }
    
    @Override
    public String toString() {
        return "Flight{" +
                "flightID=" + flightID +
                ", flightNumber='" + flightNumber + '\'' +
                ", aircraft=" + (aircraft != null ? aircraft.getRegistration() : null) +
                ", departureAirport=" + (departureAirport != null ? departureAirport.getAirportCode() : null) +
                ", arrivalAirport=" + (arrivalAirport != null ? arrivalAirport.getAirportCode() : null) +
                ", departureTime=" + departureTime +
                ", arrivalTime=" + arrivalTime +
                ", duration=" + duration +
                ", price=" + price +
                ", availableSeats=" + availableSeats +
                ", status=" + status +
                '}';
    }
}
