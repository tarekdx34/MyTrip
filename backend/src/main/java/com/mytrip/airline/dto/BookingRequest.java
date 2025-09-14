package com.mytrip.airline.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;

public class BookingRequest {

    @NotNull(message = "Passenger ID is required")
    private Long passengerID;

    @NotNull(message = "Flight ID is required")
    private Long flightID;

    private String seatNumber;

    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;

    // Getters and Setters
    public Long getPassengerID() {
        return passengerID;
    }

    public void setPassengerID(Long passengerID) {
        this.passengerID = passengerID;
    }

    public Long getFlightID() {
        return flightID;
    }

    public void setFlightID(Long flightID) {
        this.flightID = flightID;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}