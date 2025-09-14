package com.mytrip.airline.repository;

import com.mytrip.airline.entity.Crew;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CrewRepository extends JpaRepository<Crew, Long> {
    
    // Find by user ID - matching your User entity field name
    Optional<Crew> findByUserUserID(Long userID);
    
    // Find by employee number
    Optional<Crew> findByEmployeeNumber(String employeeNumber);
    
    // Find by license number
    Optional<Crew> findByLicenseNumber(String licenseNumber);
    
    // Find by position
    List<Crew> findByPosition(Crew.Position position);
    
    // Check if employee number exists
    boolean existsByEmployeeNumber(String employeeNumber);
    
    // Check if license number exists
    boolean existsByLicenseNumber(String licenseNumber);
    
    // Count by position
    long countByPosition(Crew.Position position);
    
    // Search by employee number or license number containing search term
    List<Crew> findByEmployeeNumberContainingOrLicenseNumberContaining(
        String employeeTerm, String licenseTerm);
}