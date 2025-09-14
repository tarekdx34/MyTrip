package com.mytrip.airline.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mytrip.airline.dto.AirportDto;
import com.mytrip.airline.entity.Airport;
import com.mytrip.airline.mapper.AirportMapper;
import com.mytrip.airline.repository.AirportRepository;

@Service
public class AirportService {

    @Autowired
    private AirportRepository airportRepository;
    
    // Create new airport - returns a DTO
    public AirportDto createAirport(AirportDto dto) {
        if (airportRepository.existsByAirportCode(dto.getAirportCode())) {
            throw new RuntimeException("Airport code already exists");
        }
        
        Airport airport = AirportMapper.toEntity(dto);
        Airport savedAirport = airportRepository.save(airport);
        return AirportMapper.toDto(savedAirport);
    }
    
    // Get all airports - returns a List of DTOs
    public List<AirportDto> getAllAirports() {
        List<Airport> airports = airportRepository.findAll();
        return airports.stream()
                .map(AirportMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get airport by ID - returns an Optional DTO
    public Optional<AirportDto> getAirportById(Long id) {
        return airportRepository.findById(id)
                .map(AirportMapper::toDto);
    }
    
    // Get airport by code - returns an Optional DTO
    public Optional<AirportDto> getAirportByCode(String airportCode) {
        return airportRepository.findByAirportCode(airportCode)
                .map(AirportMapper::toDto);
    }
    
    // Get airports by city - returns a List of DTOs
    public List<AirportDto> getAirportsByCity(String city) {
        List<Airport> airports = airportRepository.findByCity(city);
        return airports.stream()
                .map(AirportMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get airports by country - returns a List of DTOs
    public List<AirportDto> getAirportsByCountry(String country) {
        List<Airport> airports = airportRepository.findByCountry(country);
        return airports.stream()
                .map(AirportMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Search airports by name - returns a List of DTOs
    public List<AirportDto> searchAirportsByName(String name) {
        List<Airport> airports = airportRepository.findByNameContainingIgnoreCase(name);
        return airports.stream()
                .map(AirportMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Search airports by city (for autocomplete) - returns a List of DTOs
    public List<AirportDto> searchAirportsByCity(String city) {
        List<Airport> airports = airportRepository.findByCityContainingIgnoreCase(city);
        return airports.stream()
                .map(AirportMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Update airport - accepts DTOs and returns a DTO
    public AirportDto updateAirport(Long airportId, AirportDto dto) {
        Optional<Airport> airportOptional = airportRepository.findById(airportId);
        
        if (airportOptional.isEmpty()) {
            throw new RuntimeException("Airport not found");
        }
        
        Airport airport = airportOptional.get();
        
        if (!airport.getAirportCode().equals(dto.getAirportCode()) && airportRepository.existsByAirportCode(dto.getAirportCode())) {
            throw new RuntimeException("Airport code already exists");
        }
        
        airport.setAirportCode(dto.getAirportCode());
        airport.setName(dto.getName());
        airport.setCity(dto.getCity());
        airport.setCountry(dto.getCountry());
        
        Airport updatedAirport = airportRepository.save(airport);
        return AirportMapper.toDto(updatedAirport);
    }
    
    // Delete airport
    public void deleteAirport(Long airportId) {
        if (!airportRepository.existsById(airportId)) {
            throw new RuntimeException("Airport not found");
        }
        airportRepository.deleteById(airportId);
    }
    
    // Get airports with most aircraft - returns a List of DTOs
    public List<AirportDto> getAirportsWithMostAircraft() {
        List<Airport> airports = airportRepository.findAirportsWithMostAircraft();
        return airports.stream()
                .map(AirportMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Search airports for flight booking (by city and country) - returns a List of DTOs
    public List<AirportDto> findAirportsForBooking(String city, String country) {
        List<Airport> airports;
        if (country != null && !country.isEmpty()) {
            airports = airportRepository.findByCityAndCountry(city, country);
        } else {
            airports = airportRepository.findByCity(city);
        }
        return airports.stream()
                .map(AirportMapper::toDto)
                .collect(Collectors.toList());
    }
}