package com.mytrip.airline.service;

import com.mytrip.airline.entity.Passenger;
import com.mytrip.airline.entity.User;
import com.mytrip.airline.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private UserService userService;

    // Basic CRUD operations
    public Optional<Passenger> findById(Long id) {
        return passengerRepository.findById(id);
    }

    public Optional<Passenger> findByUserId(Long userId) {
        return passengerRepository.findByUserUserID(userId);  // Updated to match entity field name
    }

    public Optional<Passenger> findByPassportNumber(String passportNumber) {
        return passengerRepository.findByPassportNumber(passportNumber);
    }

    public List<Passenger> findByNationality(String nationality) {
        return passengerRepository.findByNationality(nationality);
    }

    public List<Passenger> findAll() {
        return passengerRepository.findAll();
    }

    public Passenger save(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

    public Passenger updatePassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

    @Transactional
    public void deletePassenger(Long id) {
        passengerRepository.deleteById(id);
    }

    // Business logic methods
    public boolean isCurrentPassenger(Long passengerId) {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            return false;
        }
        
        Optional<Passenger> passenger = findById(passengerId);
        return passenger.isPresent() && 
               passenger.get().getUser().getUserID().equals(currentUser.getUserID());
    }

    public boolean passportExists(String passportNumber) {
        return passengerRepository.existsByPassportNumber(passportNumber);
    }

    public List<Passenger> findByDateOfBirthBetween(LocalDate startDate, LocalDate endDate) {
        return passengerRepository.findByDateOfBirthBetween(startDate, endDate);
    }

    public long countAllPassengers() {
        return passengerRepository.count();
    }

    public long countByNationality(String nationality) {
        return passengerRepository.countByNationality(nationality);
    }

    // Validation methods
    public boolean isValidPassportNumber(String passportNumber) {
        // Basic passport number validation
        return passportNumber != null && 
               passportNumber.trim().length() >= 6 && 
               passportNumber.trim().length() <= 50;
    }

    public boolean isValidDateOfBirth(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return false;
        }
        
        LocalDate now = LocalDate.now();
        LocalDate minDate = now.minusYears(120); // Maximum age 120 years
        LocalDate maxDate = now.minusYears(16);  // Minimum age 16 years
        
        return dateOfBirth.isAfter(minDate) && dateOfBirth.isBefore(maxDate);
    }

    // Search and filter methods
    public List<Passenger> searchPassengers(String searchTerm) {
        return passengerRepository.findByPassportNumberContainingOrNationalityContaining(
            searchTerm, searchTerm);
    }

    public List<Passenger> getRecentRegistrations(int days) {
        LocalDate cutoffDate = LocalDate.now().minusDays(days);
        return passengerRepository.findRecentRegistrations(cutoffDate);
    }
}