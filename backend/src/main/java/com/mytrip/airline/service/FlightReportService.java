package com.mytrip.airline.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class FlightReportService {

    public Object reportFlight(Long crewId, Object flightReport) {
        Map<String, Object> response = new HashMap<>();
        response.put("reportId", System.currentTimeMillis());
        response.put("crewId", crewId);
        response.put("flightReport", flightReport);
        response.put("status", "submitted");
        response.put("submittedAt", LocalDateTime.now());
        return response;
    }

    public List<Object> getFlightReports(Long flightId) {
        return List.of(
            Map.of(
                "reportId", 2001L,
                "flightId", flightId,
                "crewId", 301L,
                "reportType", "incident",
                "description", "Minor turbulence encountered",
                "submittedAt", LocalDateTime.now().minusHours(2)
            ),
            Map.of(
                "reportId", 2002L,
                "flightId", flightId,
                "crewId", 302L,
                "reportType", "maintenance",
                "description", "Cabin light malfunction in row 15",
                "submittedAt", LocalDateTime.now().minusHours(1)
            )
        );
    }

    public Object updateFlightReport(Long reportId, Object updatedReport) {
        Map<String, Object> response = new HashMap<>();
        response.put("reportId", reportId);
        response.put("updatedReport", updatedReport);
        response.put("status", "updated");
        response.put("updatedAt", LocalDateTime.now());
        return response;
    }

    public Object getReportById(Long reportId) {
        Map<String, Object> report = new HashMap<>();
        report.put("reportId", reportId);
        report.put("flightId", 101L);
        report.put("crewId", 301L);
        report.put("reportType", "routine");
        report.put("description", "Flight completed without incidents");
        report.put("submittedAt", LocalDateTime.now().minusHours(3));
        return report;
    }
}