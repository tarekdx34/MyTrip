package com.mytrip.airline.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mytrip.airline.dto.BookingRequest;
import com.mytrip.airline.dto.BookingResponse;
import com.mytrip.airline.entity.Booking;
import com.mytrip.airline.entity.Flight;
import com.mytrip.airline.entity.Passenger;
import com.mytrip.airline.mapper.BookingMapper;
import com.mytrip.airline.repository.BookingRepository;
import com.mytrip.airline.repository.FlightRepository;
import com.mytrip.airline.repository.PassengerRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // Find passenger with user details
        Optional<Passenger> passengerOptional = passengerRepository.findById(request.getPassengerID());
        if (passengerOptional.isEmpty()) {
            throw new RuntimeException("Passenger not found with ID: " + request.getPassengerID());
        }
        
        // Find flight with airport details
        Optional<Flight> flightOptional = flightRepository.findById(request.getFlightID());
        if (flightOptional.isEmpty()) {
            throw new RuntimeException("Flight not found with ID: " + request.getFlightID());
        }
        
        Flight flight = flightOptional.get();
        if (flight.getAvailableSeats() <= 0) {
            throw new RuntimeException("No available seats on flight " + flight.getFlightNumber());
        }
        
        Passenger passenger = passengerOptional.get();
        Booking booking = BookingMapper.toEntity(request, passenger, flight);
        
        if (booking == null) {
            throw new RuntimeException("Failed to create booking entity");
        }
        
        Booking savedBooking = bookingRepository.save(booking);
        return BookingMapper.toResponse(savedBooking);
    }

    @Transactional
    public BookingResponse confirmBooking(Long bookingID) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingID);
        if (bookingOptional.isEmpty()) {
            throw new RuntimeException("Booking not found with ID: " + bookingID);
        }
        
        Booking booking = bookingOptional.get();
        if (booking.getStatus() != Booking.BookingStatus.pending) {
            throw new RuntimeException("Booking " + booking.getBookingNumber() + " is not in pending status. Current status: " + booking.getStatus());
        }
        
        // Check if flight still has available seats
        Flight flight = booking.getFlight();
        if (flight.getAvailableSeats() <= 0) {
            throw new RuntimeException("No available seats remaining on flight " + flight.getFlightNumber());
        }
        
        booking.setStatus(Booking.BookingStatus.confirmed);
        Booking updatedBooking = bookingRepository.save(booking);
        
        return BookingMapper.toResponse(updatedBooking);
    }

    public List<BookingResponse> getBookingsByPassenger(Long passengerID) {
        if (passengerID == null) {
            throw new RuntimeException("Passenger ID cannot be null");
        }
        
        List<Booking> bookings = bookingRepository.findByPassenger_PassengerID(passengerID);
        return bookings.stream()
                      .map(BookingMapper::toResponse)
                      .filter(response -> response != null)
                      .toList();
    }

    public Optional<BookingResponse> getBookingById(Long bookingID) {
        if (bookingID == null) {
            throw new RuntimeException("Booking ID cannot be null");
        }
        
        return bookingRepository.findById(bookingID)
                               .map(BookingMapper::toResponse);
    }

    public List<BookingResponse> getBookingsByFlight(Long flightID) {
        if (flightID == null) {
            throw new RuntimeException("Flight ID cannot be null");
        }
        
        List<Booking> bookings = bookingRepository.findByFlight_FlightID(flightID);
        return bookings.stream()
                      .map(BookingMapper::toResponse)
                      .filter(response -> response != null)
                      .toList();
    }

    public List<BookingResponse> getBookingsByPassengerAndStatus(Long passengerID, Booking.BookingStatus status) {
        if (passengerID == null) {
            throw new RuntimeException("Passenger ID cannot be null");
        }
        if (status == null) {
            throw new RuntimeException("Booking status cannot be null");
        }
        
        List<Booking> bookings = bookingRepository.findByPassenger_PassengerIDAndStatus(passengerID, status);
        return bookings.stream()
                      .map(BookingMapper::toResponse)
                      .filter(response -> response != null)
                      .toList();
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingID) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingID);
        if (bookingOptional.isEmpty()) {
            throw new RuntimeException("Booking not found with ID: " + bookingID);
        }
        
        Booking booking = bookingOptional.get();
        if (booking.getStatus() == Booking.BookingStatus.cancelled || 
            booking.getStatus() == Booking.BookingStatus.refunded) {
            throw new RuntimeException("Booking " + booking.getBookingNumber() + " is already cancelled or refunded");
        }
        
        booking.setStatus(Booking.BookingStatus.cancelled);
        Booking updatedBooking = bookingRepository.save(booking);
        
        return BookingMapper.toResponse(updatedBooking);
    }

    @Transactional
    public BookingResponse refundBooking(Long bookingID) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingID);
        if (bookingOptional.isEmpty()) {
            throw new RuntimeException("Booking not found with ID: " + bookingID);
        }

        Booking booking = bookingOptional.get();
        if (booking.getStatus() != Booking.BookingStatus.cancelled) {
            throw new RuntimeException("Booking " + booking.getBookingNumber() + " must be cancelled before refund. Current status: " + booking.getStatus());
        }

        booking.setStatus(Booking.BookingStatus.refunded);
        Booking updatedBooking = bookingRepository.save(booking);

        return BookingMapper.toResponse(updatedBooking);
    }

    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAllWithDetails();
        return bookings.stream()
                      .map(BookingMapper::toResponse)
                      .filter(response -> response != null)
                      .toList();
    }
}