package com.mytrip.airline.repository;

import com.mytrip.airline.entity.CrewAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrewAssignmentRepository extends JpaRepository<CrewAssignment, Long> {
    
    List<CrewAssignment> findByAssignedBy(Long adminId);
    
    List<CrewAssignment> findByCrewId(Long crewId);
    
    List<CrewAssignment> findByFlightId(Long flightId);
    
    @Query("SELECT ca FROM CrewAssignment ca WHERE ca.assignedBy = :adminId ORDER BY ca.assignmentDate DESC")
    List<CrewAssignment> findAdminAssignments(@Param("adminId") Long adminId);
}