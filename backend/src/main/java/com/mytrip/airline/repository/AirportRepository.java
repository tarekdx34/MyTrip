package com.mytrip.airline.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mytrip.airline.entity.Airport;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {
    
    // Find airport by code (like JFK, LAX)
    Optional<Airport> findByAirportCode(String airportCode);
    
    // Check if airport code already exists
    boolean existsByAirportCode(String airportCode);
    
    // Find airports by city
    List<Airport> findByCity(String city);
    
    // Find airports by country
    List<Airport> findByCountry(String country);
    
    // Search airports by name containing
    List<Airport> findByNameContainingIgnoreCase(String name);
    
    // Find airports by city containing (for search suggestions)
    List<Airport> findByCityContainingIgnoreCase(String city);
    
    // Custom query to get airports with their aircraft count
    @Query("SELECT a FROM Airport a LEFT JOIN Aircraft ac ON a.airportID = ac.airport.airportID " +
           "GROUP BY a.airportID ORDER BY COUNT(ac.aircraftID) DESC")
    List<Airport> findAirportsWithMostAircraft();
    
    // Find airports by city and country
    List<Airport> findByCityAndCountry(String city, String country);
}