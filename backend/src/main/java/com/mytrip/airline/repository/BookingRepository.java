package com.mytrip.airline.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mytrip.airline.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings by passenger ID
    List<Booking> findByPassenger_PassengerID(Long passengerID);

    // Find bookings by flight ID
    List<Booking> findByFlight_FlightID(Long flightID);

    // Find bookings by passenger ID and status
    List<Booking> findByPassenger_PassengerIDAndStatus(Long passengerID, Booking.BookingStatus status);

    // Find bookings by flight ID and status
    List<Booking> findByFlight_FlightIDAndStatus(Long flightID, Booking.BookingStatus status);

    // Find all bookings with passenger and flight details
    @Query("SELECT b FROM Booking b JOIN FETCH b.passenger p JOIN FETCH p.user JOIN FETCH b.flight")
    List<Booking> findAllWithDetails();
}
