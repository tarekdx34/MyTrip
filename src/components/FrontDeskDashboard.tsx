import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Search,
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Trash2,
} from "lucide-react";
import {
  flightAPI,
  userAPI,
  aircraftAPI,
  airportAPI,
  bookingAPI,
  passengerAPI,
  adminAPI,
  crewAPI,
  frontDeskAPI,
  authAPI,
  crewAssignmentAPI,
  paymentsAPI,
  ticketsAPI,
  Flight,
  BookingResponse,
  Airport,
  User,
  Passenger,
} from "../services/api";

const FrontDeskDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("flights");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Flight search states
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    date: "",
  });
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);

  // Booking modification states
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);
  const [modifySeat, setModifySeat] = useState("");

  // Check-in states
  const [checkInBooking, setCheckInBooking] = useState<BookingResponse | null>(
    null
  );
  const [checkInSeat, setCheckInSeat] = useState("");

  // Payment states
  const [selectedPaymentBooking, setSelectedPaymentBooking] =
    useState<BookingResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load airports first as they're needed for flight search
      await loadAirports();

      // Then load other data in parallel
      await Promise.all([
        loadFlights(),
        loadBookings(),
        loadUsers(),
        loadPassengers(),
      ]);
    } catch (err) {
      console.error("Error loading initial data:", err);
    }
  };

  const loadFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always get all flights and filter on frontend
      const flightsData = await flightAPI.getAllFlights();
      setAllFlights(flightsData);
      setFilteredFlights(flightsData); // Initially show all flights
    } catch (err) {
      setError(
        "Failed to load flights: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      console.error("Flight loading error:", err);
      setAllFlights([]);
      setFilteredFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all bookings for front desk view
      const bookingsData = await bookingAPI.getAllBookings();
      setBookings(bookingsData);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setError(
        "Failed to load bookings: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      setBookings([]); // Set empty array to prevent undefined errors
    } finally {
      setLoading(false);
    }
  };

  const loadAirports = async () => {
    try {
      const airportsData = await airportAPI.getAllAirports();
      setAirports(airportsData);
    } catch (err) {
      console.error("Failed to load airports:", err);
      // Set empty array to prevent undefined errors
      setAirports([]);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await userAPI.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    }
  };

  const loadPassengers = async () => {
    try {
      const passengersData = await passengerAPI.getAllPassengers();
      setPassengers(passengersData);
    } catch (err) {
      console.error("Failed to load passengers:", err);
      setPassengers([]);
    }
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  const filterFlights = () => {
    let filtered = [...allFlights];

    // Filter by origin (airport code, name, or city)
    if (searchParams.origin.trim()) {
      const originTerm = searchParams.origin.toLowerCase().trim();
      filtered = filtered.filter((flight) => {
        const depAirport = flight.departureAirport;
        return (
          depAirport.airportCode.toLowerCase().includes(originTerm) ||
          depAirport.name.toLowerCase().includes(originTerm) ||
          depAirport.city.toLowerCase().includes(originTerm)
        );
      });
    }

    // Filter by destination (airport code, name, or city)
    if (searchParams.destination.trim()) {
      const destTerm = searchParams.destination.toLowerCase().trim();
      filtered = filtered.filter((flight) => {
        const arrAirport = flight.arrivalAirport;
        return (
          arrAirport.airportCode.toLowerCase().includes(destTerm) ||
          arrAirport.name.toLowerCase().includes(destTerm) ||
          arrAirport.city.toLowerCase().includes(destTerm)
        );
      });
    }

    // Filter by date
    if (searchParams.date.trim()) {
      const searchDate = new Date(searchParams.date);
      filtered = filtered.filter((flight) => {
        const flightDate = new Date(flight.departureTime);
        return (
          flightDate.getFullYear() === searchDate.getFullYear() &&
          flightDate.getMonth() === searchDate.getMonth() &&
          flightDate.getDate() === searchDate.getDate()
        );
      });
    }

    // Filter out flights with no available seats
    filtered = filtered.filter((flight) => flight.availableSeats > 0);

    setFilteredFlights(filtered);
  };

  const handleSearch = () => {
    filterFlights();
  };

  const clearSearch = () => {
    setSearchParams({
      origin: "",
      destination: "",
      date: "",
    });
    setFilteredFlights(allFlights);
  };

  const handleModifyBooking = async () => {
    if (!selectedBooking) return;
    setLoading(true);
    try {
      // Note: The booking API doesn't have a direct modify endpoint
      // This would need to be implemented on the backend
      // For now, we'll show an alert that this feature needs backend implementation
      alert(
        "Booking modification feature requires backend implementation for seat updates"
      );
      setSelectedBooking(null);
      setModifySeat("");
      // loadBookings(); // Uncomment when backend is ready
    } catch (err) {
      alert(
        "Failed to modify booking: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    setLoading(true);
    try {
      await bookingAPI.cancelBooking(bookingId);
      alert("Booking cancelled successfully");
      loadBookings();
    } catch (err) {
      alert(
        "Failed to cancel booking: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!checkInBooking) return;
    setLoading(true);
    try {
      // First confirm the booking if it's not already confirmed
      if (checkInBooking.status !== "confirmed") {
        await bookingAPI.confirmBooking(checkInBooking.bookingID);
      }

      // Generate boarding pass using tickets API
      const passenger = passengers.find(
        (p) => p.passengerID === checkInBooking.passengerID
      );
      if (passenger) {
        const tickets = await ticketsAPI.getTicketsByPassenger(
          passenger.passengerID
        );
        const ticket = tickets.find(
          (t) => t.bookingId === checkInBooking.bookingID
        );

        if (ticket && checkInSeat) {
          await ticketsAPI.modifyTicket(ticket.ticketId, {
            seatNumber: checkInSeat,
          });
        }

        alert(
          `Checked in successfully. Boarding Pass: ${
            ticket?.boardingPass || `BP-${checkInBooking.bookingID}`
          }`
        );
      }

      setCheckInBooking(null);
      setCheckInSeat("");
      loadBookings();
    } catch (err) {
      alert(
        "Failed to check in: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResolvePayment = async (bookingId: number) => {
    setLoading(true);
    try {
      const booking = bookings.find((b) => b.bookingID === bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      // Find the passenger's user ID
      const passenger = passengers.find(
        (p) => p.passengerID === booking.passengerID
      );
      if (!passenger) {
        throw new Error("Passenger not found");
      }

      // Create a payment for this booking
      const paymentResult = await paymentsAPI.createPayment({
        userId: passenger.userID,
        bookingId: bookingId,
        amount: booking.totalAmount,
        method: "cash", // Front desk payment method
      });

      if (paymentResult.status === "Success") {
        alert("Payment resolved successfully");
        loadBookings();
      } else {
        alert("Payment failed: " + paymentResult.message);
      }
    } catch (err) {
      alert(
        "Failed to resolve payment: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefundBooking = async (bookingId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to process a refund for this booking?"
      )
    )
      return;

    setLoading(true);
    try {
      await bookingAPI.refundBooking(bookingId);
      alert("Refund processed successfully");
      loadBookings();
    } catch (err) {
      alert(
        "Failed to process refund: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPassengerName = (passengerID: number) => {
    const passenger = passengers.find((p) => p.passengerID === passengerID);
    if (!passenger) return "Unknown Passenger";

    const user = users.find((u) => u.userID === passenger.userID);
    return user?.name || "Unknown Passenger";
  };

  const getFlightDetails = (flightID: number) => {
    return flights.find((f) => f.flightID === flightID);
  };

  const getAirportName = (airportID: number) => {
    const airport = airports.find((a) => a.airportID === airportID);
    return airport
      ? `${airport.name} (${airport.airportCode})`
      : "Unknown Airport";
  };

  // Rest of the component JSX would go here...
  // This includes the render method with all the UI components
  // The structure would be similar to the original but using the real API data

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Plane className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Front Desk Dashboard
              </h1>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            {[
              { id: "flights", label: "Flight Search", icon: Search },
              { id: "bookings", label: "Booking Management", icon: Calendar },
              { id: "checkin", label: "Check-in Services", icon: CheckCircle },
              { id: "payments", label: "Payment Issues", icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeSection === id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {/* Flight Search Section */}
          {activeSection === "flights" && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Search Flights</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Origin
                    </label>
                    <input
                      type="text"
                      value={searchParams.origin}
                      onChange={(e) =>
                        handleSearchChange("origin", e.target.value)
                      }
                      placeholder="City or Airport Code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      value={searchParams.destination}
                      onChange={(e) =>
                        handleSearchChange("destination", e.target.value)
                      }
                      placeholder="City or Airport Code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={searchParams.date}
                      onChange={(e) =>
                        handleSearchChange("date", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </>
                      )}
                    </button>
                    <button
                      onClick={clearSearch}
                      disabled={loading}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {searchParams.origin ||
                    searchParams.destination ||
                    searchParams.date
                      ? `Filtered Flights (${filteredFlights.length} of ${allFlights.length})`
                      : `Available Flights (${filteredFlights.length})`}
                  </h3>
                  <button
                    onClick={loadFlights}
                    disabled={loading}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 text-sm"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Refresh"
                    )}
                  </button>
                </div>

                {loading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                )}

                {!loading &&
                  filteredFlights.length === 0 &&
                  allFlights.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Plane className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No flights available</p>
                      <p className="text-sm">Please check back later</p>
                    </div>
                  )}

                {!loading &&
                  filteredFlights.length === 0 &&
                  allFlights.length > 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No flights found matching your search criteria</p>
                      <p className="text-sm">
                        Try adjusting your search parameters or
                      </p>
                      <button
                        onClick={clearSearch}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Show All Flights
                      </button>
                    </div>
                  )}

                {!loading &&
                  filteredFlights.map((flight) => (
                    <div
                      key={flight.flightID}
                      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {flight.flightNumber}
                          </h4>
                          <div className="text-gray-600 space-y-1">
                            <p className="flex items-center">
                              <span className="font-medium">
                                {flight.departureAirport.airportCode}
                              </span>
                              <span className="mx-2">→</span>
                              <span className="font-medium">
                                {flight.arrivalAirport.airportCode}
                              </span>
                            </p>
                            <p className="text-sm">
                              {flight.departureAirport.name} →{" "}
                              {flight.arrivalAirport.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {flight.departureAirport.city},{" "}
                              {flight.departureAirport.country} →{" "}
                              {flight.arrivalAirport.city},{" "}
                              {flight.arrivalAirport.country}
                            </p>
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">
                              <strong>Departure:</strong>{" "}
                              {formatDateTime(flight.departureTime)}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Arrival:</strong>{" "}
                              {formatDateTime(flight.arrivalTime)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Duration: {Math.floor(flight.duration / 60)}h{" "}
                              {flight.duration % 60}m
                            </p>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <p className="text-2xl font-bold text-blue-600">
                            ${flight.price}
                          </p>
                          <p className="text-sm text-gray-500 mb-2">
                            {flight.availableSeats} seats available
                          </p>
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                              flight.status.toLowerCase() === "scheduled"
                                ? "bg-green-100 text-green-800"
                                : flight.status.toLowerCase() === "delayed"
                                ? "bg-yellow-100 text-yellow-800"
                                : flight.status.toLowerCase() === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {flight.status}
                          </span>
                          {flight.aircraft && (
                            <p className="text-xs text-gray-500 mt-1">
                              {flight.aircraft.aircraftModel}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Booking Management Section */}
          {activeSection === "bookings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">All Bookings</h3>
                <button
                  onClick={loadBookings}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Refresh"
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingID}
                    className="bg-white border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">
                          Booking #{booking.bookingNumber}
                        </h4>
                        <p className="text-gray-600">
                          Passenger: {getPassengerName(booking.passengerID)}
                        </p>
                        <p className="text-gray-600">
                          Flight: {booking.flightNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Booking Date: {formatDateTime(booking.bookingDate)}
                        </p>
                        {booking.seatNumber && (
                          <p className="text-sm text-gray-500">
                            Seat: {booking.seatNumber}
                          </p>
                        )}
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-xl font-bold">
                          ${booking.totalAmount}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                          >
                            Modify
                          </button>
                          <button
                            onClick={() =>
                              handleCancelBooking(booking.bookingID)
                            }
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                          >
                            Cancel
                          </button>
                          {booking.status === "confirmed" && (
                            <button
                              onClick={() =>
                                handleRefundBooking(booking.bookingID)
                              }
                              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                            >
                              Refund
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modify Booking Modal */}
              {selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Modify Booking</h3>
                      <button
                        onClick={() => {
                          setSelectedBooking(null);
                          setModifySeat("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Seat Number
                        </label>
                        <input
                          type="text"
                          value={modifySeat}
                          onChange={(e) => setModifySeat(e.target.value)}
                          placeholder="e.g., 12A"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleModifyBooking}
                          disabled={loading || !modifySeat}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                          ) : (
                            "Update"
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(null);
                            setModifySeat("");
                          }}
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Check-in Services Section */}
          {activeSection === "checkin" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Check-in Services</h3>
              <div className="space-y-4">
                {bookings
                  .filter(
                    (b) => b.status === "confirmed" || b.status === "pending"
                  )
                  .map((booking) => (
                    <div
                      key={booking.bookingID}
                      className="bg-white border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            Booking #{booking.bookingNumber}
                          </h4>
                          <p className="text-gray-600">
                            Passenger: {getPassengerName(booking.passengerID)}
                          </p>
                          <p className="text-gray-600">
                            Flight: {booking.flightNumber}
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => setCheckInBooking(booking)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Check In
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Check-in Modal */}
              {checkInBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Check In Passenger
                      </h3>
                      <button
                        onClick={() => {
                          setCheckInBooking(null);
                          setCheckInSeat("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p>
                          <strong>Passenger:</strong>{" "}
                          {getPassengerName(checkInBooking.passengerID)}
                        </p>
                        <p>
                          <strong>Flight:</strong> {checkInBooking.flightNumber}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Seat Assignment
                        </label>
                        <input
                          type="text"
                          value={checkInSeat}
                          onChange={(e) => setCheckInSeat(e.target.value)}
                          placeholder={checkInBooking.seatNumber || "e.g., 12A"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleCheckIn}
                          disabled={loading}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                          ) : (
                            "Check In"
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setCheckInBooking(null);
                            setCheckInSeat("");
                          }}
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Issues Section */}
          {activeSection === "payments" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Payment Issues</h3>
              <div className="space-y-4">
                {bookings
                  .filter((b) => b.status === "pending")
                  .map((booking) => (
                    <div
                      key={booking.bookingID}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold flex items-center">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                            Payment Pending - Booking #{booking.bookingNumber}
                          </h4>
                          <p className="text-gray-600">
                            Passenger: {getPassengerName(booking.passengerID)}
                          </p>
                          <p className="text-gray-600">
                            Flight: {booking.flightNumber}
                          </p>
                          <p className="text-gray-600">
                            Amount: ${booking.totalAmount}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() =>
                              handleResolvePayment(booking.bookingID)
                            }
                            disabled={loading}
                            className="block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Resolve Payment"
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleCancelBooking(booking.bookingID)
                            }
                            className="block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                {bookings.filter((b) => b.status === "pending").length ===
                  0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No payment issues at the moment</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrontDeskDashboard;
