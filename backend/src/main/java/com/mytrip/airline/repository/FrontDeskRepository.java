package com.mytrip.airline.repository;

import com.mytrip.airline.entity.FrontDesk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FrontDeskRepository extends JpaRepository<FrontDesk, Long> {
    
    // Find by user ID - using proper JPA naming convention
    @Query("SELECT fd FROM FrontDesk fd WHERE fd.user.userID = :userID")
    Optional<FrontDesk> findByUserId(@Param("userID") Long userID);
    
    // Find by employee number
    Optional<FrontDesk> findByEmployeeNumber(String employeeNumber);
    
    // Check if employee number exists
    boolean existsByEmployeeNumber(String employeeNumber);
    
    // Find by department
    List<FrontDesk> findByDepartment(String department);
    
    // Count by department
    long countByDepartment(String department);
    
    // Find by department containing search term (case insensitive)
    List<FrontDesk> findByDepartmentContainingIgnoreCase(String departmentTerm);
    
    // Search by employee number or department containing search term
    List<FrontDesk> findByEmployeeNumberContainingOrDepartmentContaining(
        String employeeTerm, String departmentTerm);
    
    // Find all unique departments
    @Query("SELECT DISTINCT fd.department FROM FrontDesk fd WHERE fd.department IS NOT NULL ORDER BY fd.department")
    List<String> findAllDepartments();
    
    // Find employees by department list
    List<FrontDesk> findByDepartmentIn(List<String> departments);
    
    // Custom query to find front desk employees by user name
    @Query("SELECT fd FROM FrontDesk fd JOIN fd.user u WHERE u.name LIKE %:name%")
    List<FrontDesk> findByUserNameContaining(@Param("name") String name);
    
    // Custom query to find front desk employees by user email
    @Query("SELECT fd FROM FrontDesk fd JOIN fd.user u WHERE u.email = :email")
    Optional<FrontDesk> findByUserEmail(@Param("email") String email);
    
    // Custom query to search across multiple fields
    @Query("SELECT fd FROM FrontDesk fd JOIN fd.user u WHERE " +
           "fd.employeeNumber LIKE %:searchTerm% OR " +
           "fd.department LIKE %:searchTerm% OR " +
           "u.name LIKE %:searchTerm% OR " +
           "u.email LIKE %:searchTerm%")
    List<FrontDesk> searchFrontDeskEmployees(@Param("searchTerm") String searchTerm);
    
    // Find employees without department assigned
    List<FrontDesk> findByDepartmentIsNull();
    
    // Find employees with department assigned
    List<FrontDesk> findByDepartmentIsNotNull();
}