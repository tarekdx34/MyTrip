package com.mytrip.airline.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mytrip.airline.dto.BookingRequest;
import com.mytrip.airline.dto.BookingResponse;
import com.mytrip.airline.entity.Booking;
import com.mytrip.airline.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingService;

    // Test endpoint to verify API is working
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Booking API is working");
    }

    // Create a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request) {
        try {
            logger.info("Creating booking for passenger: {}, flight: {}", 
                       request.getPassengerID(), request.getFlightID());
            
            if (request.getPassengerID() == null) {
                return new ResponseEntity<>("Passenger ID is required", HttpStatus.BAD_REQUEST);
            }
            if (request.getFlightID() == null) {
                return new ResponseEntity<>("Flight ID is required", HttpStatus.BAD_REQUEST);
            }
            if (request.getTotalAmount() == null) {
                return new ResponseEntity<>("Total amount is required", HttpStatus.BAD_REQUEST);
            }
            
            BookingResponse booking = bookingService.createBooking(request);
            logger.info("Successfully created booking: {}", booking.getBookingNumber());
            
            return new ResponseEntity<>(booking, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            logger.error("Error creating booking: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error creating booking", e);
            return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Confirm a pending booking
    @PutMapping("/{bookingID}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long bookingID) {
        try {
            logger.info("Confirming booking: {}", bookingID);
            
            if (bookingID == null) {
                return new ResponseEntity<>("Booking ID is required", HttpStatus.BAD_REQUEST);
            }
            
            BookingResponse booking = bookingService.confirmBooking(bookingID);
            logger.info("Successfully confirmed booking: {}", booking.getBookingNumber());
            
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (RuntimeException e) {
            logger.error("Error confirming booking {}: {}", bookingID, e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error confirming booking {}", bookingID, e);
            return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all bookings for a passenger
    @GetMapping("/passenger/{passengerID}")
    public ResponseEntity<?> getBookingsByPassenger(@PathVariable Long passengerID) {
        try {
            logger.info("Getting bookings for passenger: {}", passengerID);
            
            if (passengerID == null) {
                return new ResponseEntity<>("Passenger ID is required", HttpStatus.BAD_REQUEST);
            }
            
            List<BookingResponse> bookings = bookingService.getBookingsByPassenger(passengerID);
            logger.info("Found {} bookings for passenger {}", bookings.size(), passengerID);
            
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (RuntimeException e) {
            logger.error("Error getting bookings for passenger {}: {}", passengerID, e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error getting bookings for passenger {}", passengerID, e);
            return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get bookings for a passenger by status
    @GetMapping("/passenger/{passengerID}/status")
    public ResponseEntity<?> getBookingsByPassengerAndStatus(
            @PathVariable Long passengerID,
            @RequestParam String status) {
        try {
            logger.info("Getting bookings for passenger: {} with status: {}", passengerID, status);
            
            if (passengerID == null) {
                return new ResponseEntity<>("Passenger ID is required", HttpStatus.BAD_REQUEST);
            }
            if (status == null || status.trim().isEmpty()) {
                return new ResponseEntity<>("Status is required", HttpStatus.BAD_REQUEST);
            }
            
            Booking.BookingStatus bookingStatus;
            try {
                bookingStatus = Booking.BookingStatus.valueOf(status.toLowerCase());
            } catch (IllegalArgumentException e) {
                return new ResponseEntity<>("Invalid status: " + status + ". Valid values are: pending, confirmed, cancelled, refunded", HttpStatus.BAD_REQUEST);
            }
            
            List<BookingResponse> bookings = bookingService.getBookingsByPassengerAndStatus(passengerID, bookingStatus);
            logger.info("Found {} bookings for passenger {} with status {}", bookings.size(), passengerID, status);
            
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (RuntimeException e) {
            logger.error("Error getting bookings for passenger {} with status {}: {}", passengerID, status, e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error getting bookings for passenger {} with status {}", passengerID, status, e);
            return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all bookings for a flight
    @GetMapping("/flight/{flightID}")
    public ResponseEntity<?> getBookingsByFlight(@PathVariable Long flightID) {
        try {
            logger.info("Getting bookings for flight: {}", flightID);
            
            if (flightID == null) {
                return new ResponseEntity<>("Flight ID is required", HttpStatus.BAD_REQUEST);
            }
            
            List<BookingResponse> bookings = bookingService.getBookingsByFlight(flightID);
            logger.info("Found {} bookings for flight {}", bookings.size(), flightID);
            
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (RuntimeException e) {
            logger.error("Error getting bookings for flight {}: {}", flightID, e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error getting bookings for flight {}", flightID, e);
            return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get booking by ID
    @GetMapping("/{bookingID}")
    public ResponseEntity<?> getBookingById(@PathVariable Long bookingID) {
        try {
            logger.info("Getting booking: {}", bookingID);
            
            if (bookingID == null) {
                return new ResponseEntity<>("Booking ID is required", HttpStatus.BAD_REQUEST);
            }
            
            Optional<BookingResponse> booking = bookingService.getBookingById(bookingID);
            if (booking.isPresent()) {
                logger.info("Found booking: {}", booking.get().getBookingNumber());
                return new ResponseEntity<>(booking.get(), HttpStatus.OK);
            } else {
                logger.info("Booking not found: {}", bookingID);
                return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
            }
        } catch (RuntimeException e) {
            logger.error("Error getting booking {}: {}", bookingID, e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error getting booking {}", bookingID, e);
            return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Cancel booking
    @DeleteMapping("/{bookingID}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingID) {
        try {
            logger.info("Cancelling booking: {}", bookingID);
            
            if (bookingID == null) {
                return new ResponseEntity<>("Booking ID is required", HttpStatus.BAD_REQUEST);
            }
            
            BookingResponse booking = bookingService.cancelBooking(bookingID);
            logger.info("Successfully cancelled booking: {}", booking.getBookingNumber());
            
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (RuntimeException e) {
            logger.error("Error cancelling booking {}: {}", bookingID, e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error cancelling booking {}", bookingID, e);
            return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Process refund for cancelled booking
    @PutMapping("/{bookingID}/refund")
    public ResponseEntity<?> refundBooking(@PathVariable Long bookingID) {
        try {
            logger.info("Processing refund for booking: {}", bookingID);
            
            if (bookingID == null) {
                return new ResponseEntity<>("Booking ID is required", HttpStatus.BAD_REQUEST);
            }
            
            BookingResponse booking = bookingService.refundBooking(bookingID);
            logger.info("Successfully processed refund for booking: {}", booking.getBookingNumber());
            
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (RuntimeException e) {
            logger.error("Error processing refund for booking {}: {}", bookingID, e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error processing refund for booking {}", bookingID, e);
            return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all bookings (for admin)
    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        try {
            logger.info("Getting all bookings");
            
            List<BookingResponse> bookings = bookingService.getAllBookings();
            logger.info("Found {} total bookings", bookings.size());
            
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (RuntimeException e) {
            logger.error("Error getting all bookings: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unexpected error getting all bookings", e);
            return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}