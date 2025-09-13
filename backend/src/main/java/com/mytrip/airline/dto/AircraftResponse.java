package com.mytrip.airline.dto;

public class AircraftResponse {
    private Long aircraftID;
    private String aircraftModel;
    private String manufacturer;
    private String registration;
    private int capacity;
    private AirportDto airport; // Nested Airport DTO

    // Getters and setters
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

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public AirportDto getAirport() {
        return airport;
    }

    public void setAirport(AirportDto airport) {
        this.airport = airport;
    }
}