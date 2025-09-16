package com.mytrip.airline.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mytrip.airline.dto.FlightRequest;
import com.mytrip.airline.dto.FlightResponse;
import com.mytrip.airline.entity.Aircraft;
import com.mytrip.airline.entity.Airport;
import com.mytrip.airline.entity.Flight;
import com.mytrip.airline.mapper.FlightMapper;
import com.mytrip.airline.repository.AircraftRepository;
import com.mytrip.airline.repository.AirportRepository;
import com.mytrip.airline.repository.FlightRepository;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AircraftRepository aircraftRepository;

    @Autowired
    private AirportRepository airportRepository;

    public boolean existsById(Long flightId) {
        return flightRepository.existsById(flightId);
    }

    // Create new flight - accepts a DTO and returns a DTO
    public FlightResponse createFlight(FlightRequest request) {
        if (flightRepository.existsByFlightNumber(request.getFlightNumber())) {
            throw new RuntimeException("Flight number already exists");
        }

        Optional<Aircraft> aircraftOptional = aircraftRepository.findById(request.getAircraftID());
        if (aircraftOptional.isEmpty()) {
            throw new RuntimeException("Aircraft not found");
        }

        Optional<Airport> departureAirportOptional = airportRepository.findById(request.getDepartureAirportID());
        if (departureAirportOptional.isEmpty()) {
            throw new RuntimeException("Departure airport not found");
        }

        Optional<Airport> arrivalAirportOptional = airportRepository.findById(request.getArrivalAirportID());
        if (arrivalAirportOptional.isEmpty()) {
            throw new RuntimeException("Arrival airport not found");
        }

        if (request.getDepartureTime().isAfter(request.getArrivalTime())) {
            throw new RuntimeException("Departure time cannot be after arrival time");
        }

        if (request.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Departure time cannot be in the past");
        }

        Aircraft aircraft = aircraftOptional.get();
        Airport departureAirport = departureAirportOptional.get();
        Airport arrivalAirport = arrivalAirportOptional.get();

        Integer availableSeats = aircraft.getCapacity();

        Flight flight = new Flight(
                request.getFlightNumber(), aircraft, departureAirport, arrivalAirport,
                request.getDepartureTime(), request.getArrivalTime(), request.getPrice(), availableSeats);

        Flight savedFlight = flightRepository.save(flight);
        return FlightMapper.toResponse(savedFlight);
    }

    // Get all flights - returns a List of DTOs
    public List<FlightResponse> getAllFlights() {
        List<Flight> flights = flightRepository.findAll();
        return FlightMapper.toResponseList(flights);
    }

    // Get flight by ID - returns an Optional DTO
    public Optional<FlightResponse> getFlightById(Long id) {
        return flightRepository.findById(id).map(FlightMapper::toResponse);
    }

    // Get flight by flight number - returns an Optional DTO
    public Optional<FlightResponse> getFlightByNumber(String flightNumber) {
        return flightRepository.findByFlightNumber(flightNumber).map(FlightMapper::toResponse);
    }

    // Get flights by departure airport - returns a List of DTOs
    public List<FlightResponse> getFlightsByDepartureAirport(Long airportId) {
        List<Flight> flights = flightRepository.findByDepartureAirport_AirportID(airportId);
        return FlightMapper.toResponseList(flights);
    }

    // Get flights by arrival airport - returns a List of DTOs
    public List<FlightResponse> getFlightsByArrivalAirport(Long airportId) {
        List<Flight> flights = flightRepository.findByArrivalAirport_AirportID(airportId);
        return FlightMapper.toResponseList(flights);
    }

    // Get flights by aircraft - returns a List of DTOs
    public List<FlightResponse> getFlightsByAircraft(Long aircraftId) {
        List<Flight> flights = flightRepository.findByAircraft_AircraftID(aircraftId);
        return FlightMapper.toResponseList(flights);
    }

    // Get flights by status - returns a List of DTOs
    public List<FlightResponse> getFlightsByStatus(Flight.FlightStatus status) {
        List<Flight> flights = flightRepository.findByStatus(status);
        return FlightMapper.toResponseList(flights);
    }

    // Search flights by route and date - returns a List of DTOs
    public List<FlightResponse> searchFlights(Long departureAirportId, Long arrivalAirportId,
            LocalDateTime departureDate) {
        List<Flight> flights = flightRepository.findByRouteAndDate(departureAirportId, arrivalAirportId, departureDate);
        return FlightMapper.toResponseList(flights);
    }

    // Get available flights - returns a List of DTOs
    public List<FlightResponse> getAvailableFlights() {
        List<Flight> flights = flightRepository.findAvailableFlights(LocalDateTime.now());
        return FlightMapper.toResponseList(flights);
    }

    // Advanced flight search - returns a List of DTOs
    public List<FlightResponse> searchFlights(Long departureAirportId, Long arrivalAirportId,
            LocalDateTime departureDate, BigDecimal minPrice,
            BigDecimal maxPrice, Integer minSeats) {
        List<Flight> flights = flightRepository.searchFlights(departureAirportId, arrivalAirportId,
                departureDate, minPrice, maxPrice, minSeats);
        return FlightMapper.toResponseList(flights);
    }

    // Get flights by price range - returns a List of DTOs
    public List<FlightResponse> getFlightsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<Flight> flights = flightRepository.findByPriceBetween(minPrice, maxPrice);
        return FlightMapper.toResponseList(flights);
    }

    // Get flights departing on specific date - returns a List of DTOs
    public List<FlightResponse> getFlightsByDepartureDate(LocalDateTime date) {
        List<Flight> flights = flightRepository.findByDepartureDate(date);
        return FlightMapper.toResponseList(flights);
    }

    // Get upcoming flights - returns a List of DTOs
    public List<FlightResponse> getUpcomingFlights(int hoursAhead) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime futureTime = now.plusHours(hoursAhead);
        List<Flight> flights = flightRepository.findUpcomingFlights(now, futureTime);
        return FlightMapper.toResponseList(flights);
    }

    // Update flight - accepts DTOs and returns a DTO
    public FlightResponse updateFlight(Long flightId, FlightRequest request) {
        Optional<Flight> flightOptional = flightRepository.findById(flightId);

        if (flightOptional.isEmpty()) {
            throw new RuntimeException("Flight not found");
        }

        Flight flight = flightOptional.get();

        if (!flight.getFlightNumber().equals(request.getFlightNumber()) &&
                flightRepository.existsByFlightNumber(request.getFlightNumber())) {
            throw new RuntimeException("Flight number already exists");
        }

        if (request.getDepartureTime().isAfter(request.getArrivalTime())) {
            throw new RuntimeException("Departure time cannot be after arrival time");
        }

        // Update fields from request DTO
        flight.setFlightNumber(request.getFlightNumber());
        flight.setDepartureTime(request.getDepartureTime());
        flight.setArrivalTime(request.getArrivalTime());
        flight.setPrice(request.getPrice());
        flight.setAvailableSeats(request.getAvailableSeats());
        flight.setStatus(request.getStatus());

        // Update relationships if IDs are provided
        if (request.getAircraftID() != null && !flight.getAircraft().getAircraftID().equals(request.getAircraftID())) {
            Optional<Aircraft> aircraftOptional = aircraftRepository.findById(request.getAircraftID());
            if (aircraftOptional.isEmpty())
                throw new RuntimeException("Aircraft not found");
            flight.setAircraft(aircraftOptional.get());
        }

        if (request.getDepartureAirportID() != null
                && !flight.getDepartureAirport().getAirportID().equals(request.getDepartureAirportID())) {
            Optional<Airport> departureAirportOptional = airportRepository.findById(request.getDepartureAirportID());
            if (departureAirportOptional.isEmpty())
                throw new RuntimeException("Departure airport not found");
            flight.setDepartureAirport(departureAirportOptional.get());
        }

        if (request.getArrivalAirportID() != null
                && !flight.getArrivalAirport().getAirportID().equals(request.getArrivalAirportID())) {
            Optional<Airport> arrivalAirportOptional = airportRepository.findById(request.getArrivalAirportID());
            if (arrivalAirportOptional.isEmpty())
                throw new RuntimeException("Arrival airport not found");
            flight.setArrivalAirport(arrivalAirportOptional.get());
        }

        Flight updatedFlight = flightRepository.save(flight);
        return FlightMapper.toResponse(updatedFlight);
    }

    // Update flight status - returns a DTO
    public FlightResponse updateFlightStatus(Long flightId, Flight.FlightStatus status) {
        Optional<Flight> flightOptional = flightRepository.findById(flightId);

        if (flightOptional.isEmpty()) {
            throw new RuntimeException("Flight not found");
        }

        Flight flight = flightOptional.get();
        flight.setStatus(status);

        Flight updatedFlight = flightRepository.save(flight);
        return FlightMapper.toResponse(updatedFlight);
    }

    // Cancel flight - returns a DTO
    public FlightResponse cancelFlight(Long flightId) {
        return updateFlightStatus(flightId, Flight.FlightStatus.CANCELLED);
    }

    // Delete flight
    public void deleteFlight(Long flightId) {
        if (!flightRepository.existsById(flightId)) {
            throw new RuntimeException("Flight not found");
        }
        flightRepository.deleteById(flightId);
    }

    // Update available seats (used when booking/cancelling) - returns a DTO
    public FlightResponse updateAvailableSeats(Long flightId, Integer newAvailableSeats) {
        Optional<Flight> flightOptional = flightRepository.findById(flightId);

        if (flightOptional.isEmpty()) {
            throw new RuntimeException("Flight not found");
        }

        Flight flight = flightOptional.get();

        if (newAvailableSeats < 0) {
            throw new RuntimeException("Available seats cannot be negative");
        }

        if (newAvailableSeats > flight.getAircraft().getCapacity()) {
            throw new RuntimeException("Available seats cannot exceed aircraft capacity");
        }

        flight.setAvailableSeats(newAvailableSeats);

        Flight updatedFlight = flightRepository.save(flight);
        return FlightMapper.toResponse(updatedFlight);
    }

    // Book seats (reduce available seats) - returns a DTO
    public FlightResponse bookSeats(Long flightId, Integer seatsToBook) {
        Optional<Flight> flightOptional = flightRepository.findById(flightId);

        if (flightOptional.isEmpty()) {
            throw new RuntimeException("Flight not found");
        }

        Flight flight = flightOptional.get();

        if (flight.getAvailableSeats() < seatsToBook) {
            throw new RuntimeException("Not enough available seats");
        }

        int newAvailableSeats = flight.getAvailableSeats() - seatsToBook;
        flight.setAvailableSeats(newAvailableSeats);

        Flight updatedFlight = flightRepository.save(flight);
        return FlightMapper.toResponse(updatedFlight);
    }

    // Release seats (increase available seats - for cancellations) - returns a DTO
    public FlightResponse releaseSeats(Long flightId, Integer seatsToRelease) {
        Optional<Flight> flightOptional = flightRepository.findById(flightId);

        if (flightOptional.isEmpty()) {
            throw new RuntimeException("Flight not found");
        }

        Flight flight = flightOptional.get();

        int newAvailableSeats = flight.getAvailableSeats() + seatsToRelease;

        if (newAvailableSeats > flight.getAircraft().getCapacity()) {
            newAvailableSeats = flight.getAircraft().getCapacity();
        }

        flight.setAvailableSeats(newAvailableSeats);

        Flight updatedFlight = flightRepository.save(flight);
        return FlightMapper.toResponse(updatedFlight);
    }

    // Search flights by flight number containing - returns a List of DTOs
    public List<FlightResponse> searchFlightsByNumber(String flightNumber) {
        List<Flight> flights = flightRepository.findByFlightNumberContainingIgnoreCase(flightNumber);
        return FlightMapper.toResponseList(flights);
    }

    // Get delayed flights - returns a List of DTOs
    public List<FlightResponse> getDelayedFlights() {
        List<Flight> flights = flightRepository.findDelayedFlights();
        return FlightMapper.toResponseList(flights);
    }

    // Get flight count by status
    public Long getFlightCountByStatus(Flight.FlightStatus status) {
        return flightRepository.countByStatus(status);
    }

    // Get flights by route - returns a List of DTOs
    public List<FlightResponse> getFlightsByRoute(Long departureAirportId, Long arrivalAirportId) {
        List<Flight> flights = flightRepository.findByRoute(departureAirportId, arrivalAirportId);
        return FlightMapper.toResponseList(flights);
    }
}