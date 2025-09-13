package com.mytrip.airline.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mytrip.airline.dto.AircraftRequest;
import com.mytrip.airline.dto.AircraftResponse;
import com.mytrip.airline.entity.Aircraft;
import com.mytrip.airline.entity.Airport;
import com.mytrip.airline.mapper.AircraftMapper;
import com.mytrip.airline.repository.AircraftRepository;
import com.mytrip.airline.repository.AirportRepository;

@Service
public class AircraftService {

    @Autowired
    private AircraftRepository aircraftRepository;

    @Autowired
    private AirportRepository airportRepository;

    // Create new aircraft - accepts a DTO and returns a DTO
    public AircraftResponse createAircraft(AircraftRequest request) {
        if (aircraftRepository.existsByRegistration(request.getRegistration())) {
            throw new RuntimeException("Aircraft registration already exists");
        }
        
        Aircraft aircraft = new Aircraft(
            request.getAircraftModel(),
            request.getManufacturer(),
            request.getRegistration(),
            request.getCapacity()
        );
        
        if (request.getAirportId() != null) {
            Optional<Airport> airportOptional = airportRepository.findById(request.getAirportId());
            if (airportOptional.isEmpty()) {
                throw new RuntimeException("Airport not found");
            }
            aircraft.setAirport(airportOptional.get());
        }
        
        Aircraft savedAircraft = aircraftRepository.save(aircraft);
        return AircraftMapper.toResponse(savedAircraft);
    }
    
    // Get all aircraft - returns a List of DTOs
    public List<AircraftResponse> getAllAircraft() {
        List<Aircraft> aircrafts = aircraftRepository.findAll();
        return AircraftMapper.toResponseList(aircrafts);
    }
    
    // Get aircraft by ID - returns an Optional DTO
    public Optional<AircraftResponse> getAircraftById(Long id) {
        return aircraftRepository.findById(id).map(AircraftMapper::toResponse);
    }
    
    // Get aircraft by registration - returns an Optional DTO
    public Optional<AircraftResponse> getAircraftByRegistration(String registration) {
        return aircraftRepository.findByRegistration(registration).map(AircraftMapper::toResponse);
    }
    
    // Get aircraft by manufacturer - returns a List of DTOs
    public List<AircraftResponse> getAircraftByManufacturer(String manufacturer) {
        List<Aircraft> aircrafts = aircraftRepository.findByManufacturer(manufacturer);
        return AircraftMapper.toResponseList(aircrafts);
    }
    
    // Get aircraft by model - returns a List of DTOs
    public List<AircraftResponse> getAircraftByModel(String aircraftModel) {
        List<Aircraft> aircrafts = aircraftRepository.findByAircraftModel(aircraftModel);
        return AircraftMapper.toResponseList(aircrafts);
    }
    
    // Get aircraft at specific airport - returns a List of DTOs
    public List<AircraftResponse> getAircraftAtAirport(Long airportId) {
        List<Aircraft> aircrafts = aircraftRepository.findByAirport_AirportID(airportId);
        return AircraftMapper.toResponseList(aircrafts);
    }
    
    // Get aircraft by capacity range - returns a List of DTOs
    public List<AircraftResponse> getAircraftByCapacityRange(Integer minCapacity, Integer maxCapacity) {
        List<Aircraft> aircrafts = aircraftRepository.findByCapacityBetween(minCapacity, maxCapacity);
        return AircraftMapper.toResponseList(aircrafts);
    }
    
    // Get large aircraft (capacity > specified) - returns a List of DTOs
    public List<AircraftResponse> getLargeAircraft(Integer minCapacity) {
        List<Aircraft> aircrafts = aircraftRepository.findByCapacityGreaterThan(minCapacity);
        return AircraftMapper.toResponseList(aircrafts);
    }
    
    // Get available aircraft (not assigned to current flights) - returns a List of DTOs
    public List<AircraftResponse> getAvailableAircraft() {
        List<Aircraft> aircrafts = aircraftRepository.findAvailableAircraft();
        return AircraftMapper.toResponseList(aircrafts);
    }
    
    // Update aircraft - accepts DTOs and returns a DTO
    public AircraftResponse updateAircraft(Long aircraftId, AircraftRequest request) {
        Optional<Aircraft> aircraftOptional = aircraftRepository.findById(aircraftId);
        
        if (aircraftOptional.isEmpty()) {
            throw new RuntimeException("Aircraft not found");
        }
        
        Aircraft aircraft = aircraftOptional.get();
        
        if (!aircraft.getRegistration().equals(request.getRegistration()) && aircraftRepository.existsByRegistration(request.getRegistration())) {
            throw new RuntimeException("Aircraft registration already exists");
        }
        
        aircraft.setAircraftModel(request.getAircraftModel());
        aircraft.setManufacturer(request.getManufacturer());
        aircraft.setRegistration(request.getRegistration());
        aircraft.setCapacity(request.getCapacity());
        
        if (request.getAirportId() != null) {
            Optional<Airport> airportOptional = airportRepository.findById(request.getAirportId());
            if (airportOptional.isEmpty()) {
                throw new RuntimeException("Airport not found");
            }
            aircraft.setAirport(airportOptional.get());
        } else {
            aircraft.setAirport(null);
        }
        
        Aircraft updatedAircraft = aircraftRepository.save(aircraft);
        return AircraftMapper.toResponse(updatedAircraft);
    }
    
    // Delete aircraft
    public void deleteAircraft(Long aircraftId) {
        if (!aircraftRepository.existsById(aircraftId)) {
            throw new RuntimeException("Aircraft not found");
        }
        aircraftRepository.deleteById(aircraftId);
    }
    
    // Search aircraft by model - returns a List of DTOs
    public List<AircraftResponse> searchAircraftByModel(String model) {
        List<Aircraft> aircrafts = aircraftRepository.findByAircraftModelContainingIgnoreCase(model);
        return AircraftMapper.toResponseList(aircrafts);
    }
    
    // Get aircraft count by manufacturer
    public Long getAircraftCountByManufacturer(String manufacturer) {
        return aircraftRepository.countByManufacturer(manufacturer);
    }
    
    // Assign aircraft to airport - returns a DTO
    public AircraftResponse assignAircraftToAirport(Long aircraftId, Long airportId) {
        Optional<Aircraft> aircraftOptional = aircraftRepository.findById(aircraftId);
        Optional<Airport> airportOptional = airportRepository.findById(airportId);
        
        if (aircraftOptional.isEmpty()) {
            throw new RuntimeException("Aircraft not found");
        }
        
        if (airportOptional.isEmpty()) {
            throw new RuntimeException("Airport not found");
        }
        
        Aircraft aircraft = aircraftOptional.get();
        aircraft.setAirport(airportOptional.get());
        
        Aircraft assignedAircraft = aircraftRepository.save(aircraft);
        return AircraftMapper.toResponse(assignedAircraft);
    }
}