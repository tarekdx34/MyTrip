package com.mytrip.airline.service;

import com.mytrip.airline.entity.Admin;
import com.mytrip.airline.entity.User;
import com.mytrip.airline.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserService userService;

    // Basic CRUD operations
    public Optional<Admin> findById(Long id) {
        return adminRepository.findById(id);
    }

    public Optional<Admin> findByUserId(Long userId) {
        return adminRepository.findByUserUserID(userId);  // Updated to match entity field name
    }

    public Optional<Admin> findByEmployeeNumber(String employeeNumber) {
        return adminRepository.findByEmployeeNumber(employeeNumber);
    }

    public List<Admin> findByAccessLevel(String accessLevel) {
        return adminRepository.findByAccessLevel(accessLevel);
    }

    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Transactional
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    // Business logic methods
    public boolean isCurrentAdmin(Long adminId) {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            return false;
        }
        
        Optional<Admin> admin = findById(adminId);
        return admin.isPresent() && 
               admin.get().getUser().getUserID().equals(currentUser.getUserID());
    }

    public boolean hasAccessLevel(Long adminId, String requiredAccessLevel) {
        Optional<Admin> admin = findById(adminId);
        if (admin.isEmpty()) {
            return false;
        }
        
        try {
            int currentLevel = Integer.parseInt(admin.get().getAccessLevel());
            int requiredLevel = Integer.parseInt(requiredAccessLevel);
            return currentLevel >= requiredLevel;
        } catch (NumberFormatException e) {
            return admin.get().getAccessLevel().equals(requiredAccessLevel);
        }
    }

    public boolean employeeNumberExists(String employeeNumber) {
        return adminRepository.existsByEmployeeNumber(employeeNumber);
    }

    public long countAllAdmins() {
        return adminRepository.count();
    }

    public long countByAccessLevel(String accessLevel) {
        return adminRepository.countByAccessLevel(accessLevel);
    }

    // Admin-specific business methods
    public Object addFlight(Long adminId, Object flightData) {
        // This will be implemented when FlightService is available
        // Verify admin has permission first
        if (!hasAccessLevel(adminId, "3")) {
            throw new SecurityException("Insufficient access level for flight management");
        }
        return "Add flight - implement with FlightService";
    }

    public Object removeFlight(Long adminId, Long flightId) {
        // This will be implemented when FlightService is available
        if (!hasAccessLevel(adminId, "4")) {
            throw new SecurityException("Insufficient access level for flight removal");
        }
        return "Remove flight - implement with FlightService";
    }

    public Object manageFlight(Long adminId, Long flightId, Object flightData) {
        // This will be implemented when FlightService is available
        if (!hasAccessLevel(adminId, "3")) {
            throw new SecurityException("Insufficient access level for flight management");
        }
        return "Manage flight - implement with FlightService";
    }

    public Object assignCrew(Long adminId, Object assignmentData) {
        // This will be implemented when CrewAssignmentService is available
        if (!hasAccessLevel(adminId, "2")) {
            throw new SecurityException("Insufficient access level for crew assignment");
        }
        return "Assign crew - implement with CrewAssignmentService";
    }

    public Object viewReports(Long adminId, String reportType) {
        // This will be implemented when ReportService is available
        if (!hasAccessLevel(adminId, "1")) {
            throw new SecurityException("Insufficient access level for reports");
        }
        return "View reports - implement with ReportService";
    }

    public Object getDemandReport(Long adminId) {
        // This will be implemented when ReportService is available
        if (!hasAccessLevel(adminId, "2")) {
            throw new SecurityException("Insufficient access level for demand reports");
        }
        return "Demand report - implement with ReportService";
    }

    public Object getBookingSummary(Long adminId) {
        // This will be implemented when ReportService is available
        if (!hasAccessLevel(adminId, "1")) {
            throw new SecurityException("Insufficient access level for booking summary");
        }
        return "Booking summary - implement with ReportService";
    }

    public Object getFlightDetails(Long adminId) {
        // This will be implemented when ReportService is available
        if (!hasAccessLevel(adminId, "1")) {
            throw new SecurityException("Insufficient access level for flight details");
        }
        return "Flight details - implement with ReportService";
    }

    public List<Object> getAdminAssignments(Long adminId) {
        // This will be implemented when CrewAssignmentService is available
        return List.of("Admin assignments - implement with CrewAssignmentService");
    }

    // Validation methods
    public boolean isValidAccessLevel(String accessLevel) {
        if (accessLevel == null) {
            return false;
        }
        
        try {
            int level = Integer.parseInt(accessLevel);
            return level >= 1 && level <= 5; // Access levels 1-5
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public boolean isValidEmployeeNumber(String employeeNumber) {
        return employeeNumber != null && 
               employeeNumber.trim().length() >= 3 && 
               employeeNumber.trim().length() <= 50;
    }

    // Search and filter methods
    public List<Admin> searchAdmins(String searchTerm) {
        return adminRepository.findByEmployeeNumberContaining(searchTerm);
    }

    public List<Admin> getHighAccessLevelAdmins() {
        return adminRepository.findByAccessLevelGreaterThanEqual("4");
    }

    public List<Admin> getAdminsWithCrewAssignments() {
        // This will be implemented when CrewAssignmentService is available
        return List.of();
    }

    // Utility methods for admin operations
    public boolean canPerformOperation(Long adminId, String operation) {
        Optional<Admin> admin = findById(adminId);
        if (admin.isEmpty()) {
            return false;
        }

        // Define required access levels for different operations
        switch (operation.toLowerCase()) {
            case "view_reports":
                return hasAccessLevel(adminId, "1");
            case "assign_crew":
                return hasAccessLevel(adminId, "2");
            case "manage_flights":
                return hasAccessLevel(adminId, "3");
            case "remove_flights":
            case "system_admin":
                return hasAccessLevel(adminId, "4");
            case "super_admin":
                return hasAccessLevel(adminId, "5");
            default:
                return false;
        }
    }
}