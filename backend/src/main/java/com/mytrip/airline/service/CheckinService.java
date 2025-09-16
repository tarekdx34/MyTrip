package com.mytrip.airline.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@Service
public class CheckinService {

    public Object checkIn(Long passengerId, Long bookingId) {
        Map<String, Object> checkinResponse = new HashMap<>();
        checkinResponse.put("checkinId", System.currentTimeMillis());
        checkinResponse.put("passengerId", passengerId);
        checkinResponse.put("bookingId", bookingId);
        checkinResponse.put("status", "checked_in");
        checkinResponse.put("checkinTime", LocalDateTime.now());
        checkinResponse.put("boardingPass", Map.of(
            "seatNumber", "12A",
            "gate", "A15",
            "boardingGroup", "Group 2",
            "boardingTime", LocalDateTime.now().plusHours(2)
        ));
        return checkinResponse;
    }

    public Object getCheckinStatus(Long bookingId) {
        Map<String, Object> status = new HashMap<>();
        status.put("bookingId", bookingId);
        status.put("checkedIn", true);
        status.put("checkinTime", LocalDateTime.now().minusHours(2));
        status.put("seatNumber", "12A");
        return status;
    }

    public Object updateSeatSelection(Long bookingId, String newSeatNumber) {
        Map<String, Object> response = new HashMap<>();
        response.put("bookingId", bookingId);
        response.put("oldSeat", "12A");
        response.put("newSeat", newSeatNumber);
        response.put("status", "seat_updated");
        response.put("updatedAt", LocalDateTime.now());
        return response;
    }
}