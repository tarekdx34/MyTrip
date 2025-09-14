package com.mytrip.airline.controller;

import com.mytrip.airline.entity.Crew;
import com.mytrip.airline.service.CrewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            // This will be implemented when CrewAssignmentService is available
            return ResponseEntity.ok("Crew schedule endpoint - implement with CrewAssignmentService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew schedule: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/assignments")
    // @PreAuthorize("hasRole('ADMIN') or @crewService.isCurrentCrew(#id)")
    public ResponseEntity<?> getCrewAssignments(@PathVariable Long id) {
        try {
            // This will be implemented when CrewAssignmentService is available
            return ResponseEntity.ok("Crew assignments endpoint - implement with CrewAssignmentService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew assignments: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/passengers")
    // @PreAuthorize("hasRole('ADMIN') or @crewService.isCurrentCrew(#id)")
    public ResponseEntity<?> checkPassengers(@PathVariable Long id, @RequestParam Long flightId) {
        try {
            // This will be implemented when FlightService and BookingService are available
            return ResponseEntity.ok("Check passengers endpoint - implement with FlightService and BookingService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error checking passengers: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/flight-report")
    // @PreAuthorize("hasRole('ADMIN') or @crewService.isCurrentCrew(#id)")
    public ResponseEntity<?> reportFlight(@PathVariable Long id, @RequestBody Object flightReport) {
        try {
            // This will be implemented when FlightReportService is available
            return ResponseEntity.ok("Flight report endpoint - implement with FlightReportService");
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
            // This will be implemented when CrewAssignmentService is available
            return ResponseEntity.ok("Available crew endpoint - implement with CrewAssignmentService");
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
            // This will return counts of crew members by position
            return ResponseEntity.ok("Crew stats by position - implement specific counting logic");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving crew position stats: " + e.getMessage());
        }
    }
}