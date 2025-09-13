package com.mytrip.airline.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.mytrip.airline.dto.FlightRequest;
import com.mytrip.airline.dto.FlightResponse;
import com.mytrip.airline.entity.Flight;

public class FlightMapper {

    public static FlightResponse toResponse(Flight flight) {
        if (flight == null) {
            return null;
        }
        FlightResponse response = new FlightResponse();
        response.setFlightID(flight.getFlightID());
        response.setFlightNumber(flight.getFlightNumber());
        response.setDepartureTime(flight.getDepartureTime());
        response.setArrivalTime(flight.getArrivalTime());
        response.setDuration(flight.getDuration());
        response.setPrice(flight.getPrice());
        response.setAvailableSeats(flight.getAvailableSeats());
        response.setStatus(flight.getStatus());
        
        // Map related entities to DTOs
        if (flight.getAircraft() != null) {
            response.setAircraft(AircraftMapper.toResponse(flight.getAircraft()));
        }
        if (flight.getDepartureAirport() != null) {
            response.setDepartureAirport(AirportMapper.toDto(flight.getDepartureAirport()));
        }
        if (flight.getArrivalAirport() != null) {
            response.setArrivalAirport(AirportMapper.toDto(flight.getArrivalAirport()));
        }
        
        return response;
    }

    public static List<FlightResponse> toResponseList(List<Flight> flights) {
        return flights.stream()
                .map(FlightMapper::toResponse)
                .collect(Collectors.toList());
    }

    public static Flight toEntity(FlightRequest request) {
        if (request == null) {
            return null;
        }
        Flight entity = new Flight();
        entity.setFlightNumber(request.getFlightNumber());
        entity.setDepartureTime(request.getDepartureTime());
        entity.setArrivalTime(request.getArrivalTime());
        entity.setDuration(request.getDuration());
        entity.setPrice(request.getPrice());
        entity.setAvailableSeats(request.getAvailableSeats());
        entity.setStatus(request.getStatus());
        
        // Note: Relationships (aircraft, airports) are not set here. 
        // This is typically handled in the service layer where you fetch the full entity from the repository.
        
        return entity;
    }
}