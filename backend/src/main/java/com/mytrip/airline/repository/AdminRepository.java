package com.mytrip.airline.repository;

import com.mytrip.airline.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    // Find by user ID
    Optional<Admin> findByUserUserID(Long userId);
    
    // Find by employee number
    Optional<Admin> findByEmployeeNumber(String employeeNumber);
    
    // Check if employee number exists
    boolean existsByEmployeeNumber(String employeeNumber);
    
    // Find by access level
    List<Admin> findByAccessLevel(String accessLevel);
    
    // Count by access level
    long countByAccessLevel(String accessLevel);
    
    // Search by employee number containing search term
    List<Admin> findByEmployeeNumberContaining(String searchTerm);
    
    // Find admins with access level greater than or equal to specified level
    List<Admin> findByAccessLevelGreaterThanEqual(String accessLevel);
    
    // Custom query to find admins by access level range
    @Query("SELECT a FROM Admin a WHERE CAST(a.accessLevel AS int) >= :minLevel")
    List<Admin> findByAccessLevelGreaterThanEqualNumeric(@Param("minLevel") int minLevel);
    
    // Custom query to find admins by access level range
    @Query("SELECT a FROM Admin a WHERE CAST(a.accessLevel AS int) BETWEEN :minLevel AND :maxLevel")
    List<Admin> findByAccessLevelBetween(@Param("minLevel") int minLevel, @Param("maxLevel") int maxLevel);
}