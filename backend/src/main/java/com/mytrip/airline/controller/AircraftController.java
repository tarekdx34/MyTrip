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

import com.mytrip.airline.dto.AircraftRequest;
import com.mytrip.airline.dto.AircraftResponse;
import com.mytrip.airline.service.AircraftService;

@RestController
@RequestMapping("/api/aircraft")
@CrossOrigin(origins = "*")
public class AircraftController {

    @Autowired
    private AircraftService aircraftService;

    // Create new aircraft
    @PostMapping
    public ResponseEntity<?> createAircraft(@RequestBody AircraftRequest request) {
        try {
            AircraftResponse aircraft = aircraftService.createAircraft(request);
            return ResponseEntity.ok(aircraft);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all aircraft
    @GetMapping
    public ResponseEntity<List<AircraftResponse>> getAllAircraft() {
        List<AircraftResponse> aircraft = aircraftService.getAllAircraft();
        return ResponseEntity.ok(aircraft);
    }

    // Get aircraft by ID
    @GetMapping("/{id}")
    public ResponseEntity<AircraftResponse> getAircraftById(@PathVariable Long id) {
        Optional<AircraftResponse> aircraft = aircraftService.getAircraftById(id);
        return aircraft.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get aircraft by registration
    @GetMapping("/registration/{registration}")
    public ResponseEntity<AircraftResponse> getAircraftByRegistration(@PathVariable String registration) {
        Optional<AircraftResponse> aircraft = aircraftService.getAircraftByRegistration(registration);
        return aircraft.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Get aircraft by manufacturer
    @GetMapping("/manufacturer/{manufacturer}")
    public ResponseEntity<List<AircraftResponse>> getAircraftByManufacturer(@PathVariable String manufacturer) {
        List<AircraftResponse> aircraft = aircraftService.getAircraftByManufacturer(manufacturer);
        return ResponseEntity.ok(aircraft);
    }

    // Get aircraft by model
    @GetMapping("/model/{aircraftModel}")
    public ResponseEntity<List<AircraftResponse>> getAircraftByModel(@PathVariable String aircraftModel) {
        List<AircraftResponse> aircraft = aircraftService.getAircraftByModel(aircraftModel);
        return ResponseEntity.ok(aircraft);
    }

    // Get aircraft at specific airport
    @GetMapping("/airport/{airportId}")
    public ResponseEntity<List<AircraftResponse>> getAircraftAtAirport(@PathVariable Long airportId) {
        List<AircraftResponse> aircraft = aircraftService.getAircraftAtAirport(airportId);
        return ResponseEntity.ok(aircraft);
    }

    // Get aircraft by capacity range
    @GetMapping("/capacity")
    public ResponseEntity<List<AircraftResponse>> getAircraftByCapacityRange(
            @RequestParam Integer minCapacity,
            @RequestParam Integer maxCapacity) {
        List<AircraftResponse> aircraft = aircraftService.getAircraftByCapacityRange(minCapacity, maxCapacity);
        return ResponseEntity.ok(aircraft);
    }

    // Get large aircraft
    @GetMapping("/large/{minCapacity}")
    public ResponseEntity<List<AircraftResponse>> getLargeAircraft(@PathVariable Integer minCapacity) {
        List<AircraftResponse> aircraft = aircraftService.getLargeAircraft(minCapacity);
        return ResponseEntity.ok(aircraft);
    }

    // Get available aircraft
    @GetMapping("/available")
    public ResponseEntity<List<AircraftResponse>> getAvailableAircraft() {
        List<AircraftResponse> aircraft = aircraftService.getAvailableAircraft();
        return ResponseEntity.ok(aircraft);
    }

    // Search aircraft by model
    @GetMapping("/search")
    public ResponseEntity<List<AircraftResponse>> searchAircraftByModel(@RequestParam String model) {
        List<AircraftResponse> aircraft = aircraftService.searchAircraftByModel(model);
        return ResponseEntity.ok(aircraft);
    }

    // Get aircraft count by manufacturer
    @GetMapping("/count/manufacturer/{manufacturer}")
    public ResponseEntity<Long> getAircraftCountByManufacturer(@PathVariable String manufacturer) {
        Long count = aircraftService.getAircraftCountByManufacturer(manufacturer);
        return ResponseEntity.ok(count);
    }

    // Update aircraft
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAircraft(@PathVariable Long id, @RequestBody AircraftRequest request) {
        try {
            AircraftResponse aircraft = aircraftService.updateAircraft(id, request);
            return ResponseEntity.ok(aircraft);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete aircraft
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAircraft(@PathVariable Long id) {
        try {
            aircraftService.deleteAircraft(id);
            return ResponseEntity.ok().body("Aircraft deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Assign aircraft to airport
    @PutMapping("/{aircraftId}/assign-airport/{airportId}")
    public ResponseEntity<?> assignAircraftToAirport(
            @PathVariable Long aircraftId,
            @PathVariable Long airportId) {
        try {
            AircraftResponse aircraft = aircraftService.assignAircraftToAirport(aircraftId, airportId);
            return ResponseEntity.ok(aircraft);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}