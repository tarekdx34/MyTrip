package com.mytrip.airline.controller;

import com.mytrip.airline.entity.Crew;
import com.mytrip.airline.service.CrewService;
import com.mytrip.airline.service.CrewAssignmentService;
import com.mytrip.airline.service.FlightReportService;
import com.mytrip.airline.service.BookingService;
import com.mytrip.airline.dto.BookingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.mytrip.airline.dto.CrewAssignmentResponse;
// Comment out PreAuthorize for development
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/crew")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
public class CrewController {

    @Autowired
    private CrewService crewService;

    @Autowired
    private CrewAssignmentService crewAssignmentService;

    @Autowired
    private FlightReportService flightReportService;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('CREW')")
    public ResponseEntity<?> getCrewById(@PathVariable Long id) {
        try {
            Optional<Crew> crew = crewService.findById(id);
            if (crew.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(crew.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew member: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    // @PreAuthorize("hasRole('ADMIN') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<?> getCrewByUserId(@PathVariable Long userId) {
        try {
            Optional<Crew> crew = crewService.findByUserId(userId);
            if (crew.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(crew.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew member: " + e.getMessage());
        }
    }

    @GetMapping("/employee/{employeeNumber}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCrewByEmployeeNumber(@PathVariable String employeeNumber) {
        try {
            Optional<Crew> crew = crewService.findByEmployeeNumber(employeeNumber);
            if (crew.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(crew.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew member: " + e.getMessage());
        }
    }

    @GetMapping("/position/{position}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCrewByPosition(@PathVariable String position) {
        try {
            List<Crew> crewMembers = crewService.findByPosition(position);
            return ResponseEntity.ok(crewMembers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew members: " + e.getMessage());
        }
    }

    @GetMapping("/license/{licenseNumber}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCrewByLicenseNumber(@PathVariable String licenseNumber) {
        try {
            Optional<Crew> crew = crewService.findByLicenseNumber(licenseNumber);
            if (crew.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(crew.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew member: " + e.getMessage());
        }
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllCrew() {
        try {
            List<Crew> crewMembers = crewService.findAll();
            return ResponseEntity.ok(crewMembers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew members: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or @crewService.isCurrentCrew(#id)")
    public ResponseEntity<?> updateCrew(@PathVariable Long id, @RequestBody Crew updatedCrew) {
        try {
            Optional<Crew> existingCrew = crewService.findById(id);
            if (existingCrew.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Crew crew = existingCrew.get();
            crew.setEmployeeNumber(updatedCrew.getEmployeeNumber());
            crew.setPosition(updatedCrew.getPosition());
            crew.setLicenseNumber(updatedCrew.getLicenseNumber());
            
            Crew savedCrew = crewService.updateCrew(crew);
            return ResponseEntity.ok(savedCrew);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating crew member: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCrew(@PathVariable Long id) {
        try {
            Optional<Crew> crew = crewService.findById(id);
            if (crew.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            crewService.deleteCrew(id);
            return ResponseEntity.ok("Crew member deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting crew member: " + e.getMessage());
        }
    }

    // Crew-specific functionality endpoints
    @GetMapping("/{id}/schedule")
    // @PreAuthorize("hasRole('ADMIN') or @crewService.isCurrentCrew(#id)")
    public ResponseEntity<?> viewCrewSchedule(@PathVariable Long id) {
        try {
            Object schedule = crewAssignmentService.getCrewSchedule(id);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew schedule: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/assignments")
    // @PreAuthorize("hasRole('ADMIN') or @crewService.isCurrentCrew(#id)")
    public ResponseEntity<?> getCrewAssignments(@PathVariable Long id) {
        try {
            List<CrewAssignmentResponse> assignments = crewAssignmentService.getCrewAssignments(id);
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew assignments: " + e.getMessage());
        }
    }

    // Updated to use actual BookingService methods
    @GetMapping("/{id}/flight/{flightId}/passengers")
    // @PreAuthorize("hasRole('ADMIN') or @crewService.isCurrentCrew(#id)")
    public ResponseEntity<?> checkFlightPassengers(@PathVariable Long id, @PathVariable Long flightId) {
        try {
            // Use the actual BookingService method to get bookings by flight
            List<BookingResponse> bookings = bookingService.getBookingsByFlight(flightId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error checking flight passengers: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/flight-report")
    // @PreAuthorize("hasRole('ADMIN') or @crewService.isCurrentCrew(#id)")
    public ResponseEntity<?> reportFlight(@PathVariable Long id, @RequestBody Object flightReport) {
        try {
            Object report = flightReportService.reportFlight(id, flightReport);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error submitting flight report: " + e.getMessage());
        }
    }

    // Available crew for assignment
    @GetMapping("/available")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAvailableCrew(@RequestParam(required = false) String position,
                                              @RequestParam(required = false) String startDate,
                                              @RequestParam(required = false) String endDate) {
        try {
            List<Crew> availableCrew = crewAssignmentService.getAvailableCrew(position, startDate, endDate);
            return ResponseEntity.ok(availableCrew);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving available crew: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCrewStats() {
        try {
            long totalCrew = crewService.countAllCrew();
            return ResponseEntity.ok("Total crew members: " + totalCrew);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew stats: " + e.getMessage());
        }
    }

    @GetMapping("/stats/position")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCrewStatsByPosition() {
        try {
            Object stats = crewService.getCrewStatsByPosition();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew position stats: " + e.getMessage());
        }
    }
}