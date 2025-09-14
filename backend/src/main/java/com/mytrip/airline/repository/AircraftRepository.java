package com.mytrip.airline.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mytrip.airline.entity.Aircraft;
import com.mytrip.airline.entity.Airport;

@Repository
public interface AircraftRepository extends JpaRepository<Aircraft, Long> {
    
    // Find aircraft by registration number
    Optional<Aircraft> findByRegistration(String registration);
    
    // Check if registration already exists
    boolean existsByRegistration(String registration);
    
    // Find aircraft by manufacturer
    List<Aircraft> findByManufacturer(String manufacturer);
    
    // Find aircraft by model
    List<Aircraft> findByAircraftModel(String aircraftModel);
    
    // Find aircraft at specific airport
    List<Aircraft> findByAirport(Airport airport);
    
    // Find aircraft by airport ID
    List<Aircraft> findByAirport_AirportID(Long airportID);
    
    // Find aircraft with capacity greater than specified
    List<Aircraft> findByCapacityGreaterThan(Integer capacity);
    
    // Find aircraft with capacity between range
    List<Aircraft> findByCapacityBetween(Integer minCapacity, Integer maxCapacity);
    
    // Custom query to find available aircraft (not assigned to current flights)
    @Query("SELECT a FROM Aircraft a WHERE a.aircraftID NOT IN " +
           "(SELECT f.aircraft.aircraftID FROM Flight f WHERE f.status IN ('scheduled', 'boarding', 'departed'))")
    List<Aircraft> findAvailableAircraft();
    
    // Count aircraft by manufacturer
    @Query("SELECT COUNT(a) FROM Aircraft a WHERE a.manufacturer = :manufacturer")
    Long countByManufacturer(@Param("manufacturer") String manufacturer);
    
    // Find aircraft by model containing (search functionality)
    List<Aircraft> findByAircraftModelContainingIgnoreCase(String model);
}