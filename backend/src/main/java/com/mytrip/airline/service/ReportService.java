package com.mytrip.airline.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class ReportService {

    @Autowired
    private FlightService flightService;

    @Autowired
    private PassengerService passengerService;

    @Autowired
    private CrewService crewService;

    public Object viewDemandReports() {
        Map<String, Object> demandReport = new HashMap<>();
        demandReport.put("reportType", "demand");
        demandReport.put("generatedAt", LocalDateTime.now());
        demandReport.put("totalFlights", flightService.getAllFlights().size());
        demandReport.put("totalPassengers", passengerService.countAllPassengers());
        demandReport.put("popularRoutes", List.of(
            Map.of("route", "NYC-LAX", "demand", 85),
            Map.of("route", "NYC-MIA", "demand", 72),
            Map.of("route", "LAX-CHI", "demand", 68)
        ));
        demandReport.put("demandTrends", List.of(
            Map.of("month", "January", "bookings", 1250),
            Map.of("month", "February", "bookings", 1180),
            Map.of("month", "March", "bookings", 1420)
        ));
        return demandReport;
    }

    public Object viewBookingSummary() {
        Map<String, Object> bookingSummary = new HashMap<>();
        bookingSummary.put("reportType", "booking_summary");
        bookingSummary.put("generatedAt", LocalDateTime.now());
        bookingSummary.put("totalBookings", 2850);
        bookingSummary.put("confirmedBookings", 2650);
        bookingSummary.put("cancelledBookings", 200);
        bookingSummary.put("pendingBookings", 0);
        bookingSummary.put("revenue", Map.of(
            "total", 425000.00,
            "thisMonth", 142000.00,
            "lastMonth", 135000.00
        ));
        bookingSummary.put("bookingsByStatus", List.of(
            Map.of("status", "confirmed", "count", 2650),
            Map.of("status", "cancelled", "count", 200)
        ));
        return bookingSummary;
    }

    public Object viewFlightDetails() {
        Map<String, Object> flightDetails = new HashMap<>();
        flightDetails.put("reportType", "flight_details");
        flightDetails.put("generatedAt", LocalDateTime.now());
        flightDetails.put("totalFlights", flightService.getAllFlights().size());
        flightDetails.put("flightsByStatus", Map.of(
            "scheduled", 45,
            "departed", 23,
            "arrived", 18,
            "cancelled", 2,
            "delayed", 5
        ));
        flightDetails.put("aircraftUtilization", List.of(
            Map.of("aircraftId", 1, "flightsToday", 3, "utilizationRate", 85.5),
            Map.of("aircraftId", 2, "flightsToday", 2, "utilizationRate", 67.2)
        ));
        flightDetails.put("onTimePerformance", Map.of(
            "percentage", 92.5,
            "onTimeFlights", 87,
            "delayedFlights", 7,
            "cancelledFlights", 0
        ));
        return flightDetails;
    }

    public Object generateCustomReport(String reportType, Map<String, Object> parameters) {
        Map<String, Object> customReport = new HashMap<>();
        customReport.put("reportType", reportType);
        customReport.put("generatedAt", LocalDateTime.now());
        customReport.put("parameters", parameters);
        
        switch (reportType.toLowerCase()) {
            case "crew_utilization":
                customReport.put("totalCrew", crewService.countAllCrew());
                customReport.put("crewStats", crewService.getCrewStatsByPosition());
                break;
            case "passenger_demographics":
                customReport.put("totalPassengers", passengerService.countAllPassengers());
                break;
            default:
                customReport.put("data", "Report type not implemented yet");
        }
        
        return customReport;
    }
}