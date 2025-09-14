package com.mytrip.airline.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mytrip.airline.entity.Aircraft;
import com.mytrip.airline.entity.Airport;
import com.mytrip.airline.entity.Flight;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    
    // Find flight by flight number
    Optional<Flight> findByFlightNumber(String flightNumber);
    
    // Check if flight number already exists
    boolean existsByFlightNumber(String flightNumber);
    
    // Find flights by departure airport
    List<Flight> findByDepartureAirport(Airport departureAirport);
    
    // Find flights by arrival airport
    List<Flight> findByArrivalAirport(Airport arrivalAirport);
    
    // Find flights by departure airport ID
    List<Flight> findByDepartureAirport_AirportID(Long departureAirportID);
    
    // Find flights by arrival airport ID
    List<Flight> findByArrivalAirport_AirportID(Long arrivalAirportID);
    
    // Find flights by aircraft
    List<Flight> findByAircraft(Aircraft aircraft);
    
    // Find flights by aircraft ID
    List<Flight> findByAircraft_AircraftID(Long aircraftID);
    
    // Find flights by status
    List<Flight> findByStatus(Flight.FlightStatus status);
    
    // Find flights departing between dates
    List<Flight> findByDepartureTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    // Find flights arriving between dates
    List<Flight> findByArrivalTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    // Find flights by price range
    List<Flight> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Find flights with available seats greater than specified
    List<Flight> findByAvailableSeatsGreaterThan(Integer seats);
    
    // Find flights departing on a specific date
    @Query("SELECT f FROM Flight f WHERE DATE(f.departureTime) = DATE(:date)")
    List<Flight> findByDepartureDate(@Param("date") LocalDateTime date);
    
    // Find flights arriving on a specific date
    @Query("SELECT f FROM Flight f WHERE DATE(f.arrivalTime) = DATE(:date)")
    List<Flight> findByArrivalDate(@Param("date") LocalDateTime date);
    
    // Search flights by route (departure and arrival airports)
    @Query("SELECT f FROM Flight f WHERE f.departureAirport.airportID = :departureAirportID " +
           "AND f.arrivalAirport.airportID = :arrivalAirportID")
    List<Flight> findByRoute(@Param("departureAirportID") Long departureAirportID, 
                            @Param("arrivalAirportID") Long arrivalAirportID);
    
    // Search flights by route and departure date
    @Query("SELECT f FROM Flight f WHERE f.departureAirport.airportID = :departureAirportID " +
           "AND f.arrivalAirport.airportID = :arrivalAirportID " +
           "AND DATE(f.departureTime) = DATE(:departureDate) " +
           "ORDER BY f.departureTime")
    List<Flight> findByRouteAndDate(@Param("departureAirportID") Long departureAirportID,
                                   @Param("arrivalAirportID") Long arrivalAirportID,
                                   @Param("departureDate") LocalDateTime departureDate);
    
    // Find available flights (with available seats and not cancelled)
    @Query("SELECT f FROM Flight f WHERE f.availableSeats > 0 " +
           "AND f.status NOT IN ('CANCELLED') " +
           "AND f.departureTime > :currentTime " +
           "ORDER BY f.departureTime")
    List<Flight> findAvailableFlights(@Param("currentTime") LocalDateTime currentTime);
    
    // Find flights by duration range
    List<Flight> findByDurationBetween(Integer minDuration, Integer maxDuration);
    
    // Find delayed flights
    @Query("SELECT f FROM Flight f WHERE f.status = 'DELAYED'")
    List<Flight> findDelayedFlights();
    
    // Find upcoming flights (departing in next X hours)
    @Query("SELECT f FROM Flight f WHERE f.departureTime BETWEEN :now AND :futureTime " +
           "AND f.status IN ('SCHEDULED', 'BOARDING') " +
           "ORDER BY f.departureTime")
    List<Flight> findUpcomingFlights(@Param("now") LocalDateTime now, 
                                    @Param("futureTime") LocalDateTime futureTime);
    
    // Count flights by status
    @Query("SELECT COUNT(f) FROM Flight f WHERE f.status = :status")
    Long countByStatus(@Param("status") Flight.FlightStatus status);
    
    // Find flights by flight number containing (search functionality)
    List<Flight> findByFlightNumberContainingIgnoreCase(String flightNumber);
    
    // Find cheap flights (below specified price)
    List<Flight> findByPriceLessThanEqual(BigDecimal maxPrice);
    
    // Find flights with specific minimum available seats
    List<Flight> findByAvailableSeatsGreaterThanEqual(Integer minSeats);
    
    // Complex search query for flight search functionality
    @Query("SELECT f FROM Flight f WHERE " +
           "(:departureAirportID IS NULL OR f.departureAirport.airportID = :departureAirportID) " +
           "AND (:arrivalAirportID IS NULL OR f.arrivalAirport.airportID = :arrivalAirportID) " +
           "AND (:departureDate IS NULL OR DATE(f.departureTime) = DATE(:departureDate)) " +
           "AND (:minPrice IS NULL OR f.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR f.price <= :maxPrice) " +
           "AND (:minSeats IS NULL OR f.availableSeats >= :minSeats) " +
           "AND f.status NOT IN ('CANCELLED') " +
           "AND f.departureTime > CURRENT_TIMESTAMP " +
           "ORDER BY f.price ASC, f.departureTime ASC")
    List<Flight> searchFlights(@Param("departureAirportID") Long departureAirportID,
                              @Param("arrivalAirportID") Long arrivalAirportID,
                              @Param("departureDate") LocalDateTime departureDate,
                              @Param("minPrice") BigDecimal minPrice,
                              @Param("maxPrice") BigDecimal maxPrice,
                              @Param("minSeats") Integer minSeats);
}