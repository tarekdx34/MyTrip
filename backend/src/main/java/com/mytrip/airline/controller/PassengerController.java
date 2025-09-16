package com.mytrip.airline.controller;

import com.mytrip.airline.entity.Passenger;
import com.mytrip.airline.entity.Booking;
import com.mytrip.airline.service.PassengerService;
import com.mytrip.airline.service.BookingService;
import com.mytrip.airline.service.CheckinService;
import com.mytrip.airline.service.PaymentService;
import com.mytrip.airline.dto.BookingRequest;
import com.mytrip.airline.dto.BookingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// Comment out PreAuthorize for development
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private CheckinService checkinService;

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> getPassengerById(@PathVariable Long id) {
        try {
            Optional<Passenger> passenger = passengerService.findById(id);
            if (passenger.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(passenger.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @userService.isCurrentUser(#userId)")
    public ResponseEntity<?> getPassengerByUserId(@PathVariable Long userId) {
        try {
            Optional<Passenger> passenger = passengerService.findByUserId(userId);
            if (passenger.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(passenger.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger: " + e.getMessage());
        }
    }

    @GetMapping("/passport/{passportNumber}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK')")
    public ResponseEntity<?> getPassengerByPassport(@PathVariable String passportNumber) {
        try {
            Optional<Passenger> passenger = passengerService.findByPassportNumber(passportNumber);
            if (passenger.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(passenger.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger: " + e.getMessage());
        }
    }

    @GetMapping("/nationality/{nationality}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK')")
    public ResponseEntity<?> getPassengersByNationality(@PathVariable String nationality) {
        try {
            List<Passenger> passengers = passengerService.findByNationality(nationality);
            return ResponseEntity.ok(passengers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passengers: " + e.getMessage());
        }
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK')")
    public ResponseEntity<?> getAllPassengers() {
        try {
            List<Passenger> passengers = passengerService.findAll();
            return ResponseEntity.ok(passengers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passengers: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> updatePassenger(@PathVariable Long id, @RequestBody Passenger updatedPassenger) {
        try {
            Optional<Passenger> existingPassenger = passengerService.findById(id);
            if (existingPassenger.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Passenger passenger = existingPassenger.get();
            passenger.setPassportNumber(updatedPassenger.getPassportNumber());
            passenger.setNationality(updatedPassenger.getNationality());
            passenger.setDateOfBirth(updatedPassenger.getDateOfBirth());
            
            Passenger savedPassenger = passengerService.updatePassenger(passenger);
            return ResponseEntity.ok(savedPassenger);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating passenger: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePassenger(@PathVariable Long id) {
        try {
            Optional<Passenger> passenger = passengerService.findById(id);
            if (passenger.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            passengerService.deletePassenger(id);
            return ResponseEntity.ok("Passenger deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting passenger: " + e.getMessage());
        }
    }

    // Updated booking endpoints to use actual BookingService methods
    @GetMapping("/{id}/bookings")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> getPassengerBookings(@PathVariable Long id) {
        try {
            List<BookingResponse> bookings = bookingService.getBookingsByPassenger(id);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger bookings: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/bookings/status")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> getPassengerBookingsByStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Booking.BookingStatus bookingStatus;
            try {
                bookingStatus = Booking.BookingStatus.valueOf(status.toLowerCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                    .body("Invalid status: " + status + ". Valid values are: pending, confirmed, cancelled, refunded");
            }
            
            List<BookingResponse> bookings = bookingService.getBookingsByPassengerAndStatus(id, bookingStatus);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger bookings by status: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/bookings")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> makeBooking(@PathVariable Long id, @RequestBody BookingRequest bookingRequest) {
        try {
            // Ensure the passenger ID in the request matches the path parameter
            bookingRequest.setPassengerID(id);
            
            BookingResponse booking = bookingService.createBooking(bookingRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error making booking: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/bookings/{bookingId}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, @PathVariable Long bookingId) {
        try {
            // Verify the booking belongs to this passenger first
            Optional<BookingResponse> bookingOpt = bookingService.getBookingById(bookingId);
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
            }
            
            BookingResponse bookingResponse = bookingOpt.get();
            if (!bookingResponse.getPassengerID().equals(id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Booking does not belong to this passenger");
            }
            
            BookingResponse cancelledBooking = bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok(cancelledBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error cancelling booking: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/bookings/{bookingId}/confirm")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK')")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id, @PathVariable Long bookingId) {
        try {
            // Verify the booking belongs to this passenger first
            Optional<BookingResponse> bookingOpt = bookingService.getBookingById(bookingId);
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
            }
            
            BookingResponse bookingResponse = bookingOpt.get();
            if (!bookingResponse.getPassengerID().equals(id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Booking does not belong to this passenger");
            }
            
            BookingResponse confirmedBooking = bookingService.confirmBooking(bookingId);
            return ResponseEntity.ok(confirmedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error confirming booking: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/bookings/{bookingId}/refund")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK')")
    public ResponseEntity<?> refundBooking(@PathVariable Long id, @PathVariable Long bookingId) {
        try {
            // Verify the booking belongs to this passenger first
            Optional<BookingResponse> bookingOpt = bookingService.getBookingById(bookingId);
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
            }
            
            BookingResponse bookingResponse = bookingOpt.get();
            if (!bookingResponse.getPassengerID().equals(id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Booking does not belong to this passenger");
            }
            
            BookingResponse refundedBooking = bookingService.refundBooking(bookingId);
            return ResponseEntity.ok(refundedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing refund: " + e.getMessage());
        }
    }

    // Check-in endpoints (keeping placeholder implementations for now)
    @PostMapping("/{id}/checkin/{bookingId}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> checkIn(@PathVariable Long id, @PathVariable Long bookingId) {
        try {
            Object checkinResult = checkinService.checkIn(id, bookingId);
            return ResponseEntity.ok(checkinResult);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error during check-in: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/checkin/{bookingId}/status")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> getCheckinStatus(@PathVariable Long id, @PathVariable Long bookingId) {
        try {
            Object status = checkinService.getCheckinStatus(bookingId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving check-in status: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/checkin/{bookingId}/seat")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> updateSeatSelection(@PathVariable Long id, @PathVariable Long bookingId, 
                                                @RequestParam String newSeatNumber) {
        try {
            Object result = checkinService.updateSeatSelection(bookingId, newSeatNumber);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating seat selection: " + e.getMessage());
        }
    }

    // Payment endpoints (keeping placeholder implementations for now)
    @PostMapping("/{id}/payments")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> makePayment(@PathVariable Long id, @RequestParam Long bookingId, 
                                        @RequestBody Object paymentData) {
        try {
            Object payment = paymentService.makePayment(id, bookingId, paymentData);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing payment: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/payments")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> getPaymentHistory(@PathVariable Long id) {
        try {
            Object paymentHistory = paymentService.getPaymentHistory(id);
            return ResponseEntity.ok(paymentHistory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving payment history: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/payments/{paymentId}/status")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('FRONT_DESK') or @passengerService.isCurrentPassenger(#id)")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long id, @PathVariable Long paymentId) {
        try {
            Object status = paymentService.getPaymentStatus(paymentId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving payment status: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPassengerStats() {
        try {
            long totalPassengers = passengerService.countAllPassengers();
            return ResponseEntity.ok("Total passengers: " + totalPassengers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving passenger stats: " + e.getMessage());
        }
    }
}