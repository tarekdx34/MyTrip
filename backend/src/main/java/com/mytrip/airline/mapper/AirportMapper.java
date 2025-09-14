package com.mytrip.airline.mapper;

import com.mytrip.airline.dto.AirportDto;
import com.mytrip.airline.entity.Airport;

public class AirportMapper {

    public static AirportDto toDto(Airport airport) {
        if (airport == null) {
            return null;
        }
        AirportDto dto = new AirportDto();
        dto.setAirportID(airport.getAirportID());
        dto.setAirportCode(airport.getAirportCode());
        dto.setName(airport.getName());
        dto.setCity(airport.getCity());
        dto.setCountry(airport.getCountry());
        return dto;
    }

    public static Airport toEntity(AirportDto dto) {
        if (dto == null) {
            return null;
        }
        Airport entity = new Airport();
        entity.setAirportID(dto.getAirportID());
        entity.setAirportCode(dto.getAirportCode());
        entity.setName(dto.getName());
        entity.setCity(dto.getCity());
        entity.setCountry(dto.getCountry());
        return entity;
    }
}