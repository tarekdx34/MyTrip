package com.mytrip.airline.repository;

import com.mytrip.airline.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    
    // Find by user ID - updated to match your User entity field name
    Optional<Passenger> findByUserUserID(Long userID);
    
    // Find by passport number
    Optional<Passenger> findByPassportNumber(String passportNumber);
    
    // Check if passport number exists
    boolean existsByPassportNumber(String passportNumber);
    
    // Find by nationality
    List<Passenger> findByNationality(String nationality);
    
    // Count by nationality
    long countByNationality(String nationality);
    
    // Find by date of birth range
    List<Passenger> findByDateOfBirthBetween(LocalDate startDate, LocalDate endDate);
    
    // Search by passport number or nationality containing search term
    List<Passenger> findByPassportNumberContainingOrNationalityContaining(
        String passportTerm, String nationalityTerm);
    
    // Find passengers born before a certain date
    List<Passenger> findByDateOfBirthBefore(LocalDate date);
    
    // Find passengers born after a certain date
    List<Passenger> findByDateOfBirthAfter(LocalDate date);
    
    // Custom query to find passengers by nationality list
    List<Passenger> findByNationalityIn(List<String> nationalities);
    
    // Simple method - returns all passengers for now (will be enhanced later)
    @Query("SELECT p FROM Passenger p")
    List<Passenger> findRecentRegistrations(@Param("cutoffDate") LocalDate cutoffDate);
}