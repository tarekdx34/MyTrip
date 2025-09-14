package com.mytrip.airline.controller;

import com.mytrip.airline.entity.Passenger;
import com.mytrip.airline.service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// Comment out PreAuthorize for development
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> getPassengerById(@PathVariable Long id) {
        try {
            Optional<Passenger> passenger = passengerService.findById(id);
            if (passenger.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(passenger.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<?> getPassengerByUserId(@PathVariable Long userId) {
        try {
            Optional<Passenger> passenger = passengerService.findByUserId(userId);
            if (passenger.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(passenger.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger: " + e.getMessage());
        }
    }

    @GetMapping("/passport/{passportNumber}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK')")
    public ResponseEntity<?> getPassengerByPassport(@PathVariable String passportNumber) {
        try {
            Optional<Passenger> passenger = passengerService.findByPassportNumber(passportNumber);
            if (passenger.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(passenger.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger: " + e.getMessage());
        }
    }

    @GetMapping("/nationality/{nationality}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK')")
    public ResponseEntity<?> getPassengersByNationality(@PathVariable String nationality) {
        try {
            List<Passenger> passengers = passengerService.findByNationality(nationality);
            return ResponseEntity.ok(passengers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passengers: " + e.getMessage());
        }
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK')")
    public ResponseEntity<?> getAllPassengers() {
        try {
            List<Passenger> passengers = passengerService.findAll();
            return ResponseEntity.ok(passengers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passengers: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> updatePassenger(@PathVariable Long id, @RequestBody Passenger updatedPassenger) {
        try {
            Optional<Passenger> existingPassenger = passengerService.findById(id);
            if (existingPassenger.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Passenger passenger = existingPassenger.get();
            passenger.setPassportNumber(updatedPassenger.getPassportNumber());
            passenger.setNationality(updatedPassenger.getNationality());
            passenger.setDateOfBirth(updatedPassenger.getDateOfBirth());
            
            Passenger savedPassenger = passengerService.updatePassenger(passenger);
            return ResponseEntity.ok(savedPassenger);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating passenger: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePassenger(@PathVariable Long id) {
        try {
            Optional<Passenger> passenger = passengerService.findById(id);
            if (passenger.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            passengerService.deletePassenger(id);
            return ResponseEntity.ok("Passenger deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting passenger: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/bookings")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> getPassengerBookings(@PathVariable Long id) {
        try {
            // This will be implemented when BookingService is available
            return ResponseEntity.ok("Passenger bookings endpoint - implement with BookingService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger bookings: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPassengerStats() {
        try {
            long totalPassengers = passengerService.countAllPassengers();
            return ResponseEntity.ok("Total passengers: " + totalPassengers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger stats: " + e.getMessage());
        }
    }
}