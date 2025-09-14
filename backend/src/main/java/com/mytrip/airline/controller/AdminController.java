package com.mytrip.airline.controller;
import com.mytrip.airline.entity.Admin;
import com.mytrip.airline.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// Comment out PreAuthorize for development
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        try {
            Optional<Admin> admin = adminService.findById(id);
            if (admin.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(admin.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving admin: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminByUserId(@PathVariable Long userId) {
        try {
            Optional<Admin> admin = adminService.findByUserId(userId);
            if (admin.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(admin.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving admin: " + e.getMessage());
        }
    }

    @GetMapping("/employee/{employeeNumber}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminByEmployeeNumber(@PathVariable String employeeNumber) {
        try {
            Optional<Admin> admin = adminService.findByEmployeeNumber(employeeNumber);
            if (admin.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(admin.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving admin: " + e.getMessage());
        }
    }

    @GetMapping("/access-level/{accessLevel}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminsByAccessLevel(@PathVariable String accessLevel) {
        try {
            List<Admin> admins = adminService.findByAccessLevel(accessLevel);
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving admins: " + e.getMessage());
        }
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllAdmins() {
        try {
            List<Admin> admins = adminService.findAll();
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving admins: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Admin updatedAdmin) {
        try {
            Optional<Admin> existingAdmin = adminService.findById(id);
            if (existingAdmin.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Admin admin = existingAdmin.get();
            admin.setEmployeeNumber(updatedAdmin.getEmployeeNumber());
            admin.setAccessLevel(updatedAdmin.getAccessLevel());
            
            Admin savedAdmin = adminService.updateAdmin(admin);
            return ResponseEntity.ok(savedAdmin);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating admin: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        try {
            Optional<Admin> admin = adminService.findById(id);
            if (admin.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            adminService.deleteAdmin(id);
            return ResponseEntity.ok("Admin deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting admin: " + e.getMessage());
        }
    }

    // Flight management endpoints
    @PostMapping("/flights")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addFlight(@RequestBody Object flightData) {
        try {
            // This will be implemented when FlightService is available
            return ResponseEntity.ok("Add flight endpoint - implement with FlightService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error adding flight: " + e.getMessage());
        }
    }

    @DeleteMapping("/flights/{flightId}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeFlight(@PathVariable Long flightId) {
        try {
            // This will be implemented when FlightService is available
            return ResponseEntity.ok("Remove flight endpoint - implement with FlightService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error removing flight: " + e.getMessage());
        }
    }

    @PutMapping("/flights/{flightId}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> manageFlight(@PathVariable Long flightId, @RequestBody Object flightData) {
        try {
            // This will be implemented when FlightService is available
            return ResponseEntity.ok("Manage flight endpoint - implement with FlightService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error managing flight: " + e.getMessage());
        }
    }

    // Crew assignment endpoints
    @PostMapping("/crew-assignments")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignCrew(@RequestBody Object assignmentData) {
        try {
            // This will be implemented when CrewAssignmentService is available
            return ResponseEntity.ok("Assign crew endpoint - implement with CrewAssignmentService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error assigning crew: " + e.getMessage());
        }
    }

    @GetMapping("/{adminId}/assignments")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminAssignments(@PathVariable Long adminId) {
        try {
            // This will be implemented when CrewAssignmentService is available
            return ResponseEntity.ok("Admin assignments endpoint - implement with CrewAssignmentService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving admin assignments: " + e.getMessage());
        }
    }

    // Reports endpoints
    @GetMapping("/reports/demand")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> viewDemandReports() {
        try {
            // This will be implemented when ReportService is available
            return ResponseEntity.ok("Demand reports endpoint - implement with ReportService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving demand reports: " + e.getMessage());
        }
    }

    @GetMapping("/reports/booking-summary")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> viewBookingSummary() {
        try {
            // This will be implemented when ReportService is available
            return ResponseEntity.ok("Booking summary reports endpoint - implement with ReportService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving booking summary: " + e.getMessage());
        }
    }

    @GetMapping("/reports/flight-details")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> viewFlightDetails() {
        try {
            // This will be implemented when ReportService is available
            return ResponseEntity.ok("Flight details reports endpoint - implement with ReportService");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving flight details: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminStats() {
        try {
            long totalAdmins = adminService.countAllAdmins();
            return ResponseEntity.ok("Total admins: " + totalAdmins);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving admin stats: " + e.getMessage());
        }
    }
}