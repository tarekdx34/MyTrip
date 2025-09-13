package com.mytrip.airline.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mytrip.airline.entity.Flight.FlightStatus;

public class FlightRequest {
    private String flightNumber;
    private Long aircraftID;
    private Long departureAirportID;
    private Long arrivalAirportID;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Integer duration;
    private BigDecimal price;
    private Integer availableSeats;
    private FlightStatus status;

    // Getters and setters
    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public Long getAircraftID() {
        return aircraftID;
    }

    public void setAircraftID(Long aircraftID) {
        this.aircraftID = aircraftID;
    }

    public Long getDepartureAirportID() {
        return departureAirportID;
    }

    public void setDepartureAirportID(Long departureAirportID) {
        this.departureAirportID = departureAirportID;
    }

    public Long getArrivalAirportID() {
        return arrivalAirportID;
    }

    public void setArrivalAirportID(Long arrivalAirportID) {
        this.arrivalAirportID = arrivalAirportID;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public FlightStatus getStatus() {
        return status;
    }

    public void setStatus(FlightStatus status) {
        this.status = status;
    }
}