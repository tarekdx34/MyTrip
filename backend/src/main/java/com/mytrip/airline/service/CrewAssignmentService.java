package com.mytrip.airline.service;

import com.mytrip.airline.dto.CrewAssignmentRequest;
import com.mytrip.airline.dto.CrewAssignmentResponse;
import com.mytrip.airline.entity.Crew;
import com.mytrip.airline.entity.CrewAssignment;
import com.mytrip.airline.repository.CrewAssignmentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.mytrip.airline.entity.Crew;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CrewAssignmentService {

    @Autowired
    private CrewAssignmentRepository crewAssignmentRepository;

    @Autowired
    private CrewService crewService;

    @Autowired
    private FlightService flightService;

    @Autowired
    private ObjectMapper objectMapper;

    public CrewAssignmentResponse assignCrew(Object assignmentData) {
        try {
            // Convert Object to CrewAssignmentRequest
            CrewAssignmentRequest request = objectMapper.convertValue(assignmentData, CrewAssignmentRequest.class);

            // Validate that flight and crew exist
            if (!flightService.existsById(request.getFlightId())) {
                throw new IllegalArgumentException("Flight not found with ID: " + request.getFlightId());
            }

            if (!crewService.existsById(request.getCrewId())) {
                throw new IllegalArgumentException("Crew member not found with ID: " + request.getCrewId());
            }

            // Create and save crew assignment
            CrewAssignment assignment = new CrewAssignment(
                    request.getFlightId(),
                    request.getCrewId(),
                    request.getAssignedBy());

            CrewAssignment savedAssignment = crewAssignmentRepository.save(assignment);

            return new CrewAssignmentResponse(savedAssignment);

        } catch (Exception e) {
            throw new RuntimeException("Failed to assign crew: " + e.getMessage(), e);
        }
    }

    public List<CrewAssignmentResponse> getAdminAssignments(Long adminId) {
        List<CrewAssignment> assignments = crewAssignmentRepository.findAdminAssignments(adminId);
        return assignments.stream()
                .map(CrewAssignmentResponse::new)
                .collect(Collectors.toList());
    }

    public List<CrewAssignmentResponse> getCrewAssignments(Long crewId) {
        List<CrewAssignment> assignments = crewAssignmentRepository.findByCrewId(crewId);
        return assignments.stream()
                .map(CrewAssignmentResponse::new)
                .collect(Collectors.toList());
    }

    public Object getCrewSchedule(Long crewId) {
        Map<String, Object> schedule = new HashMap<>();
        schedule.put("crewId", crewId);
        schedule.put("upcomingFlights", List.of(
                Map.of("flightId", 101L, "flightNumber", "AA123", "date", LocalDateTime.now().plusDays(1)),
                Map.of("flightId", 102L, "flightNumber", "AA124", "date", LocalDateTime.now().plusDays(3))));
        return schedule;
    }

    public List<Crew> getAvailableCrew(String position, String startDate, String endDate) {
        // Convert position string to enum if needed and filter available crew
        if (position != null) {
            return crewService.findByPosition(position);
        }
        return crewService.findAll();
    }

    public List<CrewAssignmentResponse> getFlightAssignments(Long flightId) {
        List<CrewAssignment> assignments = crewAssignmentRepository.findByFlightId(flightId);
        return assignments.stream()
                .map(CrewAssignmentResponse::new)
                .collect(Collectors.toList());
    }

    public List<CrewAssignmentResponse> getAllAssignments() {
        List<CrewAssignment> assignments = crewAssignmentRepository.findAll();
        return assignments.stream()
                .map(CrewAssignmentResponse::new)
                .collect(Collectors.toList());
    }
}