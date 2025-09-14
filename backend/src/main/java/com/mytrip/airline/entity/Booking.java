package com.mytrip.airline.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookingID")
    private Long bookingID;

    @Column(name = "bookingNumber", nullable = false, unique = true, length = 20)
    private String bookingNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "passengerID", nullable = false)
    private Passenger passenger;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flightID", nullable = false)
    private Flight flight;

    @Column(name = "bookingDate", nullable = false)
    private LocalDateTime bookingDate = LocalDateTime.now();

    @Column(name = "seatNumber", length = 10)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status = BookingStatus.pending;

    @Column(name = "totalAmount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    // Updated enum to match database values exactly
    public enum BookingStatus {
        pending, 
        confirmed, 
        cancelled, 
        refunded;
        
        // Keep the old method for compatibility but update implementation
        public String getValue() {
            return this.name().toLowerCase();
        }
        
        // Add method to convert from string (case-insensitive)
        public static BookingStatus fromString(String status) {
            if (status == null) {
                return pending;
            }
            try {
                return BookingStatus.valueOf(status.toLowerCase());
            } catch (IllegalArgumentException e) {
                return pending; // default fallback
            }
        }
    }

    // Constructors
    public Booking() {}

    public Booking(String bookingNumber, Passenger passenger, Flight flight, BigDecimal totalAmount) {
        this.bookingNumber = bookingNumber;
        this.passenger = passenger;
        this.flight = flight;
        this.bookingDate = LocalDateTime.now();
        this.status = BookingStatus.pending;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
    public Long getBookingID() { 
        return bookingID; 
    }
    
    public void setBookingID(Long bookingID) { 
        this.bookingID = bookingID; 
    }

    public String getBookingNumber() { 
        return bookingNumber; 
    }
    
    public void setBookingNumber(String bookingNumber) { 
        this.bookingNumber = bookingNumber; 
    }

    public Passenger getPassenger() { 
        return passenger; 
    }
    
    public void setPassenger(Passenger passenger) { 
        this.passenger = passenger; 
    }

    public Flight getFlight() { 
        return flight; 
    }
    
    public void setFlight(Flight flight) { 
        this.flight = flight; 
    }

    public LocalDateTime getBookingDate() { 
        return bookingDate; 
    }
    
    public void setBookingDate(LocalDateTime bookingDate) { 
        this.bookingDate = bookingDate; 
    }

    public String getSeatNumber() { 
        return seatNumber; 
    }
    
    public void setSeatNumber(String seatNumber) { 
        this.seatNumber = seatNumber; 
    }

    public BookingStatus getStatus() { 
        return status; 
    }
    
    public void setStatus(BookingStatus status) { 
        this.status = status; 
    }

    public BigDecimal getTotalAmount() { 
        return totalAmount; 
    }
    
    public void setTotalAmount(BigDecimal totalAmount) { 
        this.totalAmount = totalAmount; 
    }

    @Override
    public String toString() {
        return "Booking{" +
                "bookingID=" + bookingID +
                ", bookingNumber='" + bookingNumber + '\'' +
                ", passenger=" + (passenger != null ? passenger.getPassengerID() : null) +
                ", flight=" + (flight != null ? flight.getFlightNumber() : null) +
                ", bookingDate=" + bookingDate +
                ", seatNumber='" + seatNumber + '\'' +
                ", status=" + status +
                ", totalAmount=" + totalAmount +
                '}';
    }
}