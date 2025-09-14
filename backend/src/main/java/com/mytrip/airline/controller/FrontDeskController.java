package com.mytrip.airline.controller;

import com.mytrip.airline.entity.FrontDesk;
import com.mytrip.airline.service.FrontDeskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// Comment out PreAuthorize for development
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/frontdesk")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
public class FrontDeskController {

    @Autowired
    private FrontDeskService frontDeskService;

    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or @frontDeskService.isCurrentFrontDeskEmployee(#id)")
    public ResponseEntity<?> getFrontDeskById(@PathVariable Long id) {
        try {
            Optional<FrontDesk> frontDesk = frontDeskService.findById(id);
            if (frontDesk.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(frontDesk.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving front desk employee: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    // @PreAuthorize("hasRole('ADMIN') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<?> getFrontDeskByUserId(@PathVariable Long userId) {
        try {
            Optional<FrontDesk> frontDesk = frontDeskService.findByUserId(userId);
            if (frontDesk.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(frontDesk.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving front desk employee: " + e.getMessage());
        }
    }

    @GetMapping("/employee/{employeeNumber}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getFrontDeskByEmployeeNumber(@PathVariable String employeeNumber) {
        try {
            Optional<FrontDesk> frontDesk = frontDeskService.findByEmployeeNumber(employeeNumber);
            if (frontDesk.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(frontDesk.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving front desk employee: " + e.getMessage());
        }
    }

    @GetMapping("/department/{department}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getFrontDeskByDepartment(@PathVariable String department) {
        try {
            List<FrontDesk> frontDeskEmployees = frontDeskService.findByDepartment(department);
            return ResponseEntity.ok(frontDeskEmployees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving front desk employees: " + e.getMessage());
        }
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllFrontDeskEmployees() {
        try {
            List<FrontDesk> frontDeskEmployees = frontDeskService.findAll();
            return ResponseEntity.ok(frontDeskEmployees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving front desk employees: " + e.getMessage());
        }
    }

    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createFrontDeskEmployee(@RequestBody FrontDesk frontDesk) {
        try {
            // Validate employee number uniqueness if provided
            if (frontDesk.getEmployeeNumber() != null && 
                frontDeskService.employeeNumberExists(frontDesk.getEmployeeNumber())) {
                return ResponseEntity.badRequest()
                    .body("Employee number already exists");
            }
            
            FrontDesk savedFrontDesk = frontDeskService.save(frontDesk);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFrontDesk);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating front desk employee: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or @frontDeskService.isCurrentFrontDeskEmployee(#id)")
    public ResponseEntity<?> updateFrontDeskEmployee(@PathVariable Long id, @RequestBody FrontDesk updatedFrontDesk) {
        try {
            Optional<FrontDesk> existingFrontDesk = frontDeskService.findById(id);
            if (existingFrontDesk.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            FrontDesk frontDesk = existingFrontDesk.get();
            
            // Check if employee number is being changed and if it already exists
            if (updatedFrontDesk.getEmployeeNumber() != null && 
                !updatedFrontDesk.getEmployeeNumber().equals(frontDesk.getEmployeeNumber()) &&
                frontDeskService.employeeNumberExists(updatedFrontDesk.getEmployeeNumber())) {
                return ResponseEntity.badRequest()
                    .body("Employee number already exists");
            }
            
            frontDesk.setEmployeeNumber(updatedFrontDesk.getEmployeeNumber());
            frontDesk.setDepartment(updatedFrontDesk.getDepartment());
            
            FrontDesk savedFrontDesk = frontDeskService.updateFrontDeskEmployee(frontDesk);
            return ResponseEntity.ok(savedFrontDesk);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating front desk employee: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFrontDeskEmployee(@PathVariable Long id) {
        try {
            Optional<FrontDesk> frontDesk = frontDeskService.findById(id);
            if (frontDesk.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            frontDeskService.deleteFrontDeskEmployee(id);
            return ResponseEntity.ok("Front desk employee deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting front desk employee: " + e.getMessage());
        }
    }

    @GetMapping("/departments")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllDepartments() {
        try {
            List<String> departments = frontDeskService.getAllDepartments();
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving departments: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getFrontDeskStats() {
        try {
            long totalEmployees = frontDeskService.countAllFrontDeskEmployees();
            return ResponseEntity.ok("Total front desk employees: " + totalEmployees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving front desk stats: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> searchFrontDeskEmployees(@RequestParam String searchTerm) {
        try {
            List<FrontDesk> employees = frontDeskService.searchFrontDeskEmployees(searchTerm);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error searching front desk employees: " + e.getMessage());
        }
    }

    // Additional endpoints for operational tasks
    @PostMapping("/{id}/booking")
    // @PreAuthorize("hasRole('FRONT_DESK') and @frontDeskService.isCurrentFrontDeskEmployee(#id)")
    public ResponseEntity<?> processBooking(@PathVariable Long id, @RequestBody Object bookingData) {
        try {
            Object result = frontDeskService.processBookingRequest(id, bookingData);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing booking: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/checkin/{bookingId}")
    // @PreAuthorize("hasRole('FRONT_DESK') and @frontDeskService.isCurrentFrontDeskEmployee(#id)")
    public ResponseEntity<?> processCheckIn(@PathVariable Long id, @PathVariable Long bookingId) {
        try {
            Object result = frontDeskService.processCheckIn(id, bookingId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing check-in: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/refund/{bookingId}")
    // @PreAuthorize("hasRole('FRONT_DESK') and @frontDeskService.isCurrentFrontDeskEmployee(#id)")
    public ResponseEntity<?> processRefund(@PathVariable Long id, @PathVariable Long bookingId) {
        try {
            Object result = frontDeskService.processRefundRequest(id, bookingId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing refund: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/department")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> transferDepartment(@PathVariable Long id, @RequestParam String newDepartment) {
        try {
            boolean success = frontDeskService.transferEmployeeToDepartment(id, newDepartment);
            if (success) {
                return ResponseEntity.ok("Employee successfully transferred to " + newDepartment);
            } else {
                return ResponseEntity.badRequest().body("Failed to transfer employee");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error transferring employee: " + e.getMessage());
        }
    }
}