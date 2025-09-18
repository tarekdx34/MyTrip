package com.mytrip.airline.service;

import com.mytrip.airline.entity.Crew;
import com.mytrip.airline.entity.User;
import com.mytrip.airline.repository.CrewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CrewService {

    @Autowired
    private CrewRepository crewRepository;

    @Autowired
    private UserService userService;

    public boolean existsById(Long crewId) {
        return crewRepository.existsById(crewId);
    }

    // Basic CRUD operations
    public Optional<Crew> findById(Long id) {
        return crewRepository.findById(id);
    }

    public Optional<Crew> findByUserId(Long userId) {
        return crewRepository.findByUserUserID(userId); // Updated to match entity field name
    }

    public Optional<Crew> findByEmployeeNumber(String employeeNumber) {
        return crewRepository.findByEmployeeNumber(employeeNumber);
    }

    public Optional<Crew> findByLicenseNumber(String licenseNumber) {
        return crewRepository.findByLicenseNumber(licenseNumber);
    }

    public List<Crew> findByPosition(String position) {
        try {
            Crew.Position pos = Crew.Position.fromValue(position);
            return crewRepository.findByPosition(pos);
        } catch (IllegalArgumentException e) {
            return List.of(); // Return empty list for invalid position
        }
    }

    public List<Crew> findAll() {
        return crewRepository.findAll();
    }

    public Crew save(Crew crew) {
        return crewRepository.save(crew);
    }

    public Crew updateCrew(Crew crew) {
        return crewRepository.save(crew);
    }

    public Crew updateCrewByAdmin(Long crewId, Crew updatedCrew) {
        Optional<Crew> existingCrew = findById(crewId);
        if (existingCrew.isEmpty()) {
            throw new IllegalArgumentException("Crew member not found with ID: " + crewId);
        }

        Crew crew = existingCrew.get();

        if (updatedCrew.getEmployeeNumber() != null) {
            crew.setEmployeeNumber(updatedCrew.getEmployeeNumber());
        }

        if (updatedCrew.getPosition() != null) {
            crew.setPosition(updatedCrew.getPosition());
        }

        if (updatedCrew.getLicenseNumber() != null) {
            crew.setLicenseNumber(updatedCrew.getLicenseNumber());
        }

        return crewRepository.save(crew);
    }

    @Transactional
    public void deleteCrewByAdmin(Long crewId) {
        if (!crewRepository.existsById(crewId)) {
            throw new IllegalArgumentException("Crew member not found with ID: " + crewId);
        }
        crewRepository.deleteById(crewId);
    }

    @Transactional
    public void deleteCrew(Long id) {
        crewRepository.deleteById(id);
    }

    // Business logic methods
    public boolean isCurrentCrew(Long crewId) {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            return false;
        }

        Optional<Crew> crew = findById(crewId);
        return crew.isPresent() &&
                crew.get().getUser().getUserID().equals(currentUser.getUserID());
    }

    public boolean employeeNumberExists(String employeeNumber) {
        return crewRepository.existsByEmployeeNumber(employeeNumber);
    }

    public boolean licenseNumberExists(String licenseNumber) {
        return crewRepository.existsByLicenseNumber(licenseNumber);
    }

    public long countAllCrew() {
        return crewRepository.count();
    }

    public long countByPosition(Crew.Position position) {
        return crewRepository.countByPosition(position);
    }

    // Crew-specific business methods
    public Object viewSchedule(Long crewId) {
        // This will be implemented when CrewAssignmentService is available
        if (!isCurrentCrew(crewId)) {
            throw new SecurityException("Access denied: Not current crew member");
        }
        return "Crew schedule - implement with CrewAssignmentService";
    }

    public List<Object> getCrewAssignments(Long crewId) {
        // This will be implemented when CrewAssignmentService is available
        return List.of("Crew assignments - implement with CrewAssignmentService");
    }

    public Object checkPassengers(Long crewId, Long flightId) {
        // This will be implemented when FlightService and BookingService are available
        if (!isCurrentCrew(crewId)) {
            throw new SecurityException("Access denied: Not current crew member");
        }
        return "Check passengers - implement with FlightService and BookingService";
    }

    public Object reportFlight(Long crewId, Object flightReport) {
        // This will be implemented when FlightReportService is available
        if (!isCurrentCrew(crewId)) {
            throw new SecurityException("Access denied: Not current crew member");
        }
        return "Flight report - implement with FlightReportService";
    }

    public List<Crew> getAvailableCrew(String position, LocalDateTime startTime, LocalDateTime endTime) {
        // This will be implemented when CrewAssignmentService is available
        // For now, return all crew of the specified position
        if (position != null) {
            return findByPosition(position);
        }
        return findAll();
    }

    public boolean isCrewAvailable(Long crewId, LocalDateTime startTime, LocalDateTime endTime) {
        // This will be implemented when CrewAssignmentService is available
        // Check if crew member has conflicting assignments
        return true; // Placeholder
    }

    // Validation methods
    public boolean isValidPosition(String position) {
        try {
            Crew.Position.fromValue(position);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isValidLicenseNumber(String licenseNumber, Crew.Position position) {
        if (licenseNumber == null || licenseNumber.trim().isEmpty()) {
            // License required for pilots, optional for others
            return position != Crew.Position.PILOT && position != Crew.Position.CO_PILOT;
        }

        return licenseNumber.trim().length() >= 5 &&
                licenseNumber.trim().length() <= 100;
    }

    public boolean isValidEmployeeNumber(String employeeNumber) {
        return employeeNumber != null &&
                employeeNumber.trim().length() >= 3 &&
                employeeNumber.trim().length() <= 50;
    }

    public boolean requiresLicense(Crew.Position position) {
        return position == Crew.Position.PILOT || position == Crew.Position.CO_PILOT;
    }

    // Search and filter methods
    public List<Crew> searchCrew(String searchTerm) {
        return crewRepository.findByEmployeeNumberContainingOrLicenseNumberContaining(
                searchTerm, searchTerm);
    }

    public List<Crew> getPilots() {
        return crewRepository.findByPosition(Crew.Position.PILOT);
    }

    public List<Crew> getCoPilots() {
        return crewRepository.findByPosition(Crew.Position.CO_PILOT);
    }

    public List<Crew> getFlightAttendants() {
        return crewRepository.findByPosition(Crew.Position.FLIGHT_ATTENDANT);
    }

    public List<Crew> getCabinCrew() {
        return crewRepository.findByPosition(Crew.Position.CABIN_CREW);
    }

    public List<Crew> getCrewByLicenseExpiry(LocalDate beforeDate) {
        // This would require adding license expiry date to the Crew entity
        // For now, return empty list
        return List.of();
    }

    // Statistics methods
    public Object getCrewStatsByPosition() {
        return new Object() {
            public final long pilots = countByPosition(Crew.Position.PILOT);
            public final long coPilots = countByPosition(Crew.Position.CO_PILOT);
            public final long flightAttendants = countByPosition(Crew.Position.FLIGHT_ATTENDANT);
            public final long cabinCrew = countByPosition(Crew.Position.CABIN_CREW);
        };
    }

    public long getTotalFlightCrew() {
        return countByPosition(Crew.Position.PILOT) +
                countByPosition(Crew.Position.CO_PILOT);
    }

    public long getTotalCabinCrew() {
        return countByPosition(Crew.Position.FLIGHT_ATTENDANT) +
                countByPosition(Crew.Position.CABIN_CREW);
    }

    // Crew assignment helpers (to be expanded when CrewAssignmentService is
    // available)
    public boolean canBeAssignedToFlight(Long crewId, Long flightId) {
        // Check crew availability, qualifications, etc.
        Optional<Crew> crew = findById(crewId);
        if (crew.isEmpty()) {
            return false;
        }

        // For pilots and co-pilots, ensure they have valid licenses
        if (requiresLicense(crew.get().getPosition())) {
            return crew.get().getLicenseNumber() != null &&
                    !crew.get().getLicenseNumber().trim().isEmpty();
        }

        return true;
    }

    public int getMinimumCrewRequired(String aircraftType) {
        // This would be based on aircraft capacity and regulations
        // Basic minimum: 1 pilot, 1 co-pilot, 2 flight attendants
        return 4;
    }
}