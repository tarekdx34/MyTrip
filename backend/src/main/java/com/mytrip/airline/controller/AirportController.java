package com.mytrip.airline.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mytrip.airline.dto.AirportDto;
import com.mytrip.airline.service.AirportService;

@RestController
@RequestMapping("/api/airports")
@CrossOrigin(origins = "*")
public class AirportController {

    @Autowired
    private AirportService airportService;

    // Create new airport
    @PostMapping
    public ResponseEntity<?> createAirport(@RequestBody AirportDto request) {
        try {
            AirportDto airport = airportService.createAirport(request);
            return ResponseEntity.ok(airport);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all airports
    @GetMapping
    public ResponseEntity<List<AirportDto>> getAllAirports() {
        List<AirportDto> airports = airportService.getAllAirports();
        return ResponseEntity.ok(airports);
    }

    // Get airport by ID
    @GetMapping("/{id}")
    public ResponseEntity<AirportDto> getAirportById(@PathVariable Long id) {
        Optional<AirportDto> airport = airportService.getAirportById(id);
        return airport.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get airport by code
    @GetMapping("/code/{airportCode}")
    public ResponseEntity<AirportDto> getAirportByCode(@PathVariable String airportCode) {
        Optional<AirportDto> airport = airportService.getAirportByCode(airportCode);
        return airport.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get airports by city
    @GetMapping("/city/{city}")
    public ResponseEntity<List<AirportDto>> getAirportsByCity(@PathVariable String city) {
        List<AirportDto> airports = airportService.getAirportsByCity(city);
        return ResponseEntity.ok(airports);
    }

    // Get airports by country
    @GetMapping("/country/{country}")
    public ResponseEntity<List<AirportDto>> getAirportsByCountry(@PathVariable String country) {
        List<AirportDto> airports = airportService.getAirportsByCountry(country);
        return ResponseEntity.ok(airports);
    }

    // Search airports by name
    @GetMapping("/search/name")
    public ResponseEntity<List<AirportDto>> searchAirportsByName(@RequestParam String name) {
        List<AirportDto> airports = airportService.searchAirportsByName(name);
        return ResponseEntity.ok(airports);
    }

    // Search airports by city
    @GetMapping("/search/city")
    public ResponseEntity<List<AirportDto>> searchAirportsByCity(@RequestParam String city) {
        List<AirportDto> airports = airportService.searchAirportsByCity(city);
        return ResponseEntity.ok(airports);
    }

    // Update airport
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAirport(@PathVariable Long id, @RequestBody AirportDto request) {
        try {
            AirportDto airport = airportService.updateAirport(id, request);
            return ResponseEntity.ok(airport);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete airport
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAirport(@PathVariable Long id) {
        try {
            airportService.deleteAirport(id);
            return ResponseEntity.ok().body("Airport deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get airports with most aircraft
    @GetMapping("/with-most-aircraft")
    public ResponseEntity<List<AirportDto>> getAirportsWithMostAircraft() {
        List<AirportDto> airports = airportService.getAirportsWithMostAircraft();
        return ResponseEntity.ok(airports);
    }

    // Find airports for booking
    @GetMapping("/booking")
    public ResponseEntity<List<AirportDto>> findAirportsForBooking(
            @RequestParam String city,
            @RequestParam(required = false) String country) {
        List<AirportDto> airports = airportService.findAirportsForBooking(city, country);
        return ResponseEntity.ok(airports);
    }
}