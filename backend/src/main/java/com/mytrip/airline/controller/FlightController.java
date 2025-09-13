package com.mytrip.airline.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mytrip.airline.dto.FlightRequest;
import com.mytrip.airline.dto.FlightResponse;
import com.mytrip.airline.entity.Flight;
import com.mytrip.airline.service.FlightService;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired
    private FlightService flightService;

    // Create new flight
    @PostMapping
    public ResponseEntity<?> createFlight(@RequestBody FlightRequest request) {
        try {
            FlightResponse flight = flightService.createFlight(request);
            return new ResponseEntity<>(flight, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all flights
    @GetMapping
    public ResponseEntity<List<FlightResponse>> getAllFlights() {
        List<FlightResponse> flights = flightService.getAllFlights();
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Get flight by ID
    @GetMapping("/{id}")
    public ResponseEntity<FlightResponse> getFlightById(@PathVariable Long id) {
        Optional<FlightResponse> flight = flightService.getFlightById(id);
        return flight.map(f -> new ResponseEntity<>(f, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get flight by flight number
    @GetMapping("/number/{flightNumber}")
    public ResponseEntity<FlightResponse> getFlightByNumber(@PathVariable String flightNumber) {
        Optional<FlightResponse> flight = flightService.getFlightByNumber(flightNumber);
        return flight.map(f -> new ResponseEntity<>(f, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get flights by departure airport
    @GetMapping("/departure/{airportId}")
    public ResponseEntity<List<FlightResponse>> getFlightsByDepartureAirport(@PathVariable Long airportId) {
        List<FlightResponse> flights = flightService.getFlightsByDepartureAirport(airportId);
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Get flights by arrival airport
    @GetMapping("/arrival/{airportId}")
    public ResponseEntity<List<FlightResponse>> getFlightsByArrivalAirport(@PathVariable Long airportId) {
        List<FlightResponse> flights = flightService.getFlightsByArrivalAirport(airportId);
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Get flights by aircraft
    @GetMapping("/aircraft/{aircraftId}")
    public ResponseEntity<List<FlightResponse>> getFlightsByAircraft(@PathVariable Long aircraftId) {
        List<FlightResponse> flights = flightService.getFlightsByAircraft(aircraftId);
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Get flights by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<FlightResponse>> getFlightsByStatus(@PathVariable Flight.FlightStatus status) {
        List<FlightResponse> flights = flightService.getFlightsByStatus(status);
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Search flights by route and date
    @GetMapping("/search")
    public ResponseEntity<List<FlightResponse>> searchFlights(
            @RequestParam Long departureAirportId,
            @RequestParam Long arrivalAirportId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureDate) {
        List<FlightResponse> flights = flightService.searchFlights(departureAirportId, arrivalAirportId, departureDate);
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Get available flights
    @GetMapping("/available")
    public ResponseEntity<List<FlightResponse>> getAvailableFlights() {
        List<FlightResponse> flights = flightService.getAvailableFlights();
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Advanced flight search
    @GetMapping("/search/advanced")
    public ResponseEntity<List<FlightResponse>> searchFlightsAdvanced(
            @RequestParam(required = false) Long departureAirportId,
            @RequestParam(required = false) Long arrivalAirportId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureDate,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minSeats) {
        List<FlightResponse> flights = flightService.searchFlights(
                departureAirportId, arrivalAirportId, departureDate, minPrice, maxPrice, minSeats
        );
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Get flights by price range
    @GetMapping("/price-range")
    public ResponseEntity<List<FlightResponse>> getFlightsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<FlightResponse> flights = flightService.getFlightsByPriceRange(minPrice, maxPrice);
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Get flights by departure date
    @GetMapping("/departure-date")
    public ResponseEntity<List<FlightResponse>> getFlightsByDepartureDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<FlightResponse> flights = flightService.getFlightsByDepartureDate(date);
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Get upcoming flights
    @GetMapping("/upcoming")
    public ResponseEntity<List<FlightResponse>> getUpcomingFlights(@RequestParam(defaultValue = "24") int hoursAhead) {
        List<FlightResponse> flights = flightService.getUpcomingFlights(hoursAhead);
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Update flight
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFlight(@PathVariable Long id, @RequestBody FlightRequest request) {
        try {
            FlightResponse flight = flightService.updateFlight(id, request);
            return new ResponseEntity<>(flight, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update flight status
    @PutMapping("/{id}/status")
    public ResponseEntity<FlightResponse> updateFlightStatus(
            @PathVariable Long id,
            @RequestParam Flight.FlightStatus status) {
        try {
            FlightResponse flight = flightService.updateFlightStatus(id, status);
            return new ResponseEntity<>(flight, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Cancel flight
    @PutMapping("/{id}/cancel")
    public ResponseEntity<FlightResponse> cancelFlight(@PathVariable Long id) {
        try {
            FlightResponse flight = flightService.cancelFlight(id);
            return new ResponseEntity<>(flight, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Delete flight
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        try {
            flightService.deleteFlight(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Update available seats
    @PutMapping("/{id}/seats")
    public ResponseEntity<?> updateAvailableSeats(
            @PathVariable Long id,
            @RequestParam Integer availableSeats) {
        try {
            FlightResponse flight = flightService.updateAvailableSeats(id, availableSeats);
            return new ResponseEntity<>(flight, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Book seats
    @PutMapping("/{id}/book")
    public ResponseEntity<?> bookSeats(
            @PathVariable Long id,
            @RequestParam Integer seatsToBook) {
        try {
            FlightResponse flight = flightService.bookSeats(id, seatsToBook);
            return new ResponseEntity<>(flight, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Release seats
    @PutMapping("/{id}/release")
    public ResponseEntity<?> releaseSeats(
            @PathVariable Long id,
            @RequestParam Integer seatsToRelease) {
        try {
            FlightResponse flight = flightService.releaseSeats(id, seatsToRelease);
            return new ResponseEntity<>(flight, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Search flights by flight number containing
    @GetMapping("/search/number")
    public ResponseEntity<List<FlightResponse>> searchFlightsByNumber(@RequestParam String flightNumber) {
        List<FlightResponse> flights = flightService.searchFlightsByNumber(flightNumber);
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Get delayed flights
    @GetMapping("/delayed")
    public ResponseEntity<List<FlightResponse>> getDelayedFlights() {
        List<FlightResponse> flights = flightService.getDelayedFlights();
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // Get flight count by status
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> getFlightCountByStatus(@PathVariable Flight.FlightStatus status) {
        Long count = flightService.getFlightCountByStatus(status);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    // Get flights by route
    @GetMapping("/route")
    public ResponseEntity<List<FlightResponse>> getFlightsByRoute(
            @RequestParam Long departureAirportId,
            @RequestParam Long arrivalAirportId) {
        List<FlightResponse> flights = flightService.getFlightsByRoute(departureAirportId, arrivalAirportId);
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }
}