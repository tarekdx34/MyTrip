package com.mytrip.airline.service;

import com.mytrip.airline.entity.FrontDesk;
import com.mytrip.airline.entity.User;
import com.mytrip.airline.repository.FrontDeskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FrontDeskService {

    @Autowired
    private FrontDeskRepository frontDeskRepository;

    // Uncomment when UserService is available
    // @Autowired
    // private UserService userService;

    // Basic CRUD operations
    public Optional<FrontDesk> findById(Long id) {
        return frontDeskRepository.findById(id);
    }

    public Optional<FrontDesk> findByUserId(Long userId) {
        return frontDeskRepository.findByUserId(userId);
    }

    public Optional<FrontDesk> findByEmployeeNumber(String employeeNumber) {
        return frontDeskRepository.findByEmployeeNumber(employeeNumber);
    }

    public List<FrontDesk> findByDepartment(String department) {
        return frontDeskRepository.findByDepartment(department);
    }

    public List<FrontDesk> findAll() {
        return frontDeskRepository.findAll();
    }

    public FrontDesk save(FrontDesk frontDesk) {
        return frontDeskRepository.save(frontDesk);
    }

    public FrontDesk updateFrontDeskEmployee(FrontDesk frontDesk) {
        return frontDeskRepository.save(frontDesk);
    }

    @Transactional
    public void deleteFrontDeskEmployee(Long id) {
        frontDeskRepository.deleteById(id);
    }

    // Business logic methods
    public boolean isCurrentFrontDeskEmployee(Long frontDeskId) {
        // Uncomment when UserService is available
        // User currentUser = userService.getCurrentUser();
        // if (currentUser == null) {
        //     return false;
        // }
        // 
        // Optional<FrontDesk> frontDesk = findById(frontDeskId);
        // return frontDesk.isPresent() && 
        //        frontDesk.get().getUser().getUserID().equals(currentUser.getUserID());
        
        // For now, return false until UserService is implemented
        return false;
    }

    public boolean employeeNumberExists(String employeeNumber) {
        return frontDeskRepository.existsByEmployeeNumber(employeeNumber);
    }

    public long countAllFrontDeskEmployees() {
        return frontDeskRepository.count();
    }

    public long countByDepartment(String department) {
        return frontDeskRepository.countByDepartment(department);
    }

    public List<String> getAllDepartments() {
        return frontDeskRepository.findAllDepartments();
    }

    // Search and filter methods
    public List<FrontDesk> searchFrontDeskEmployees(String searchTerm) {
        return frontDeskRepository.searchFrontDeskEmployees(searchTerm);
    }

    public List<FrontDesk> findByDepartmentContaining(String departmentTerm) {
        return frontDeskRepository.findByDepartmentContainingIgnoreCase(departmentTerm);
    }

    public List<FrontDesk> findByUserName(String name) {
        return frontDeskRepository.findByUserNameContaining(name);
    }

    public Optional<FrontDesk> findByUserEmail(String email) {
        return frontDeskRepository.findByUserEmail(email);
    }

    public List<FrontDesk> findByDepartmentIn(List<String> departments) {
        return frontDeskRepository.findByDepartmentIn(departments);
    }

    public List<FrontDesk> findEmployeesWithoutDepartment() {
        return frontDeskRepository.findByDepartmentIsNull();
    }

    public List<FrontDesk> findEmployeesWithDepartment() {
        return frontDeskRepository.findByDepartmentIsNotNull();
    }

    // Validation methods
    public boolean isValidEmployeeNumber(String employeeNumber) {
        // Basic employee number validation based on your database sample (FD001 format)
        return employeeNumber != null && 
               employeeNumber.trim().length() >= 3 && 
               employeeNumber.trim().length() <= 50 &&
               employeeNumber.matches("^[A-Z0-9]+$"); // Only uppercase letters and numbers
    }

    public boolean isValidDepartment(String department) {
        // Basic department validation
        return department != null && 
               department.trim().length() >= 2 && 
               department.trim().length() <= 100;
    }

    // Front desk specific business methods (placeholders for future implementation)
    public Object processBookingRequest(Long frontDeskId, Object bookingData) {
        // This will be implemented when BookingService is available
        return "Process booking request - implement with BookingService";
    }

    public Object handleCustomerInquiry(Long frontDeskId, Object inquiryData) {
        // This will be implemented when appropriate services are available
        return "Handle customer inquiry - implement with appropriate services";
    }

    public Object processRefundRequest(Long frontDeskId, Long bookingId) {
        // This will be implemented when PaymentService and BookingService are available
        return "Process refund request - implement with PaymentService";
    }

    public Object generateCustomerReport(Long frontDeskId, Object reportCriteria) {
        // This will be implemented when ReportingService is available
        return "Generate customer report - implement with ReportingService";
    }

    public Object processCheckIn(Long frontDeskId, Long bookingId) {
        // This will be implemented when CheckinService is available
        return "Process check-in - implement with CheckinService";
    }

    public Object handleBaggageIssue(Long frontDeskId, Object baggageData) {
        // This will be implemented when BaggageService is available
        return "Handle baggage issue - implement with BaggageService";
    }

    public Object processFlightChange(Long frontDeskId, Long bookingId, Object changeData) {
        // This will be implemented when BookingService and FlightService are available
        return "Process flight change - implement with BookingService and FlightService";
    }

    public List<Object> getCustomerBookingHistory(Long frontDeskId, Long passengerId) {
        // This will be implemented when BookingService is available
        return List.of("Customer booking history - implement with BookingService");
    }

    // Department management methods
    public List<FrontDesk> getEmployeesByDepartment(String department) {
        return findByDepartment(department);
    }

    public boolean transferEmployeeToDepartment(Long frontDeskId, String newDepartment) {
        try {
            Optional<FrontDesk> frontDeskOpt = findById(frontDeskId);
            if (frontDeskOpt.isPresent()) {
                FrontDesk frontDesk = frontDeskOpt.get();
                frontDesk.setDepartment(newDepartment);
                save(frontDesk);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    // Performance and analytics methods (placeholders for future implementation)
    public Object getEmployeePerformanceMetrics(Long frontDeskId) {
        return "Employee performance metrics - implement with analytics service";
    }

    public Object getDepartmentStatistics(String department) {
        return "Department statistics - implement with analytics service";
    }

    public List<Object> getRecentActivities(Long frontDeskId, int days) {
        return List.of("Recent activities - implement with activity tracking service");
    }
}