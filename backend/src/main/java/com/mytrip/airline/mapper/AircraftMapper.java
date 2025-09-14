package com.mytrip.airline.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.mytrip.airline.dto.AircraftResponse;
import com.mytrip.airline.entity.Aircraft;

public class AircraftMapper {

    public static AircraftResponse toResponse(Aircraft aircraft) {
        if (aircraft == null) {
            return null;
        }
        AircraftResponse response = new AircraftResponse();
        response.setAircraftID(aircraft.getAircraftID());
        response.setAircraftModel(aircraft.getAircraftModel());
        response.setManufacturer(aircraft.getManufacturer());
        response.setRegistration(aircraft.getRegistration());
        response.setCapacity(aircraft.getCapacity());
        
        // Map the related Airport entity to a DTO
        if (aircraft.getAirport() != null) {
            response.setAirport(AirportMapper.toDto(aircraft.getAirport()));
        }
        
        return response;
    }

    public static List<AircraftResponse> toResponseList(List<Aircraft> aircraftList) {
        return aircraftList.stream()
                .map(AircraftMapper::toResponse)
                .collect(Collectors.toList());
    }

    public static Aircraft toEntity(AircraftResponse response) {
        if (response == null) {
            return null;
        }
        Aircraft entity = new Aircraft();
        entity.setAircraftID(response.getAircraftID());
        entity.setAircraftModel(response.getAircraftModel());
        entity.setManufacturer(response.getManufacturer());
        entity.setRegistration(response.getRegistration());
        entity.setCapacity(response.getCapacity());
        
        // Map the related Airport DTO back to an entity
        if (response.getAirport() != null) {
            entity.setAirport(AirportMapper.toEntity(response.getAirport()));
        }
        
        return entity;
    }
}