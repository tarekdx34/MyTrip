package com.mytrip.airline.mapper;

import java.time.LocalDateTime;
import java.util.UUID;

import com.mytrip.airline.dto.BookingRequest;
import com.mytrip.airline.dto.BookingResponse;
import com.mytrip.airline.entity.Booking;
import com.mytrip.airline.entity.Flight;
import com.mytrip.airline.entity.Passenger;

public class BookingMapper {

    public static Booking toEntity(BookingRequest request, Passenger passenger, Flight flight) {
        if (request == null || passenger == null || flight == null) {
            return null;
        }
        
        try {
            Booking booking = new Booking();
            booking.setBookingNumber(generateBookingNumber());
            booking.setPassenger(passenger);
            booking.setFlight(flight);
            booking.setBookingDate(LocalDateTime.now());
            booking.setSeatNumber(request.getSeatNumber());
            booking.setStatus(Booking.BookingStatus.pending);
            booking.setTotalAmount(request.getTotalAmount());
            
            return booking;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create booking entity: " + e.getMessage(), e);
        }
    }

    public static BookingResponse toResponse(Booking booking) {
        if (booking == null) {
            return null;
        }
        
        try {
            BookingResponse response = new BookingResponse();
            response.setBookingID(booking.getBookingID());
            response.setBookingNumber(booking.getBookingNumber());
            
            // Safe passenger information extraction
            if (booking.getPassenger() != null) {
                response.setPassengerID(booking.getPassenger().getPassengerID());
                
                // Safe user name extraction
                if (booking.getPassenger().getUser() != null) {
                    response.setPassengerName(booking.getPassenger().getUser().getName());
                } else {
                    response.setPassengerName("Unknown Passenger");
                }
            }
            
            // Safe flight information extraction
            if (booking.getFlight() != null) {
                response.setFlightID(booking.getFlight().getFlightID());
                response.setFlightNumber(booking.getFlight().getFlightNumber());
            }
            
            response.setBookingDate(booking.getBookingDate());
            response.setSeatNumber(booking.getSeatNumber());
            response.setStatus(booking.getStatus());
            response.setTotalAmount(booking.getTotalAmount());
            
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert booking to response: " + e.getMessage(), e);
        }
    }

    private static String generateBookingNumber() {
        try {
            // Generate a unique booking number with current timestamp for uniqueness
            String uuid = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
            long timestamp = System.currentTimeMillis() % 10000; // Last 4 digits of timestamp
            return "BK" + timestamp + uuid;
        } catch (Exception e) {
            // Fallback booking number generation
            return "BK" + System.currentTimeMillis();
        }
    }
}