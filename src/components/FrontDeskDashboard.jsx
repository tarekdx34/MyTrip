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

// Mock API functions for Front Desk operations
const mockAPI = {
  async getFlights(searchParams) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // This should call backend API in real app
    // For now, return mock data similar to PassengerDashboard
    const allFlights = [
      {
        flightId: "FL123",
        airline: "MY TRIP AIR",
        origin: "JED",
        destination: "DXB",
        departureTime: "2025-09-20T14:30:00Z",
        arrivalTime: "2025-09-20T16:45:00Z",
        availableSeats: 62,
        price: { currency: "USD", economy: 250, business: 600 },
        status: "Scheduled",
      },
      {
        flightId: "FL456",
        airline: "MY TRIP AIR",
        origin: "RUH",
        destination: "CAI",
        departureTime: "2025-09-21T09:15:00Z",
        arrivalTime: "2025-09-21T11:30:00Z",
        availableSeats: 45,
        price: { currency: "USD", economy: 180, business: 450 },
        status: "Scheduled",
      },
    ];
    if (searchParams?.origin || searchParams?.destination) {
      return allFlights.filter(
        (flight) =>
          (!searchParams.origin ||
            flight.origin
              .toLowerCase()
              .includes(searchParams.origin.toLowerCase())) &&
          (!searchParams.destination ||
            flight.destination
              .toLowerCase()
              .includes(searchParams.destination.toLowerCase()))
      );
    }
    return allFlights;
  },

  async getBookings() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // Return mock bookings
    return [
      {
        bookingId: "BK123",
        flightId: "FL123",
        userId: 101,
        seat: "12A",
        status: "Confirmed",
      },
      {
        bookingId: "BK456",
        flightId: "FL456",
        userId: 102,
        seat: "14B",
        status: "Pending",
      },
    ];
  },

  async modifyBooking(bookingId, updates) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // Mock success
    return { status: "Success", message: "Booking updated" };
  },

  async cancelBooking(bookingId) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { status: "Cancelled", message: "Booking cancelled" };
  },

  async checkIn(bookingId, seatNumber) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { status: "CheckedIn", boardingPass: `BP-${bookingId}` };
  },

  async resolvePayment(bookingId) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { status: "Resolved", message: "Payment resolved" };
  },

  async getPayments(bookingId) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [
      {
        paymentId: "PMT123",
        bookingId,
        amount: 250,
        status: "Pending",
      },
    ];
  },
};

const FrontDeskDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("flights");
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Flight search states
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    date: "",
  });

  // Booking modification states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modifySeat, setModifySeat] = useState("");

  // Check-in states
  const [checkInBooking, setCheckInBooking] = useState(null);
  const [checkInSeat, setCheckInSeat] = useState("");

  // Payment states
  const [selectedPaymentBooking, setSelectedPaymentBooking] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    loadFlights();
    loadBookings();
  }, []);

  const loadFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockAPI.getFlights(searchParams);
      setFlights(data);
    } catch (err) {
      setError("Failed to load flights");
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockAPI.getBookings();
      setBookings(data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    loadFlights();
  };

  const handleModifyBooking = async () => {
    if (!selectedBooking) return;
    setLoading(true);
    try {
      await mockAPI.modifyBooking(selectedBooking.bookingId, {
        seat: modifySeat,
      });
      alert("Booking modified successfully");
      setSelectedBooking(null);
      setModifySeat("");
      loadBookings();
    } catch {
      alert("Failed to modify booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    setLoading(true);
    try {
      await mockAPI.cancelBooking(bookingId);
      alert("Booking cancelled");
      loadBookings();
    } catch {
      alert("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!checkInBooking) return;
    setLoading(true);
    try {
      const result = await mockAPI.checkIn(
        checkInBooking.bookingId,
        checkInSeat
      );
      alert(`Checked in successfully. Boarding Pass: ${result.boardingPass}`);
      setCheckInBooking(null);
      setCheckInSeat("");
    } catch {
      alert("Failed to check in");
    } finally {
      setLoading(false);
    }
  };

  const handleResolvePayment = async (bookingId) => {
    setLoading(true);
    try {
      const result = await mockAPI.resolvePayment(bookingId);
      alert(result.message);
      loadBookings();
    } catch {
      alert("Failed to resolve payment");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Plane className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                MY TRIP Front Desk
              </h1>
            </button>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveSection("flights")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeSection === "flights"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Search className="h-5 w-5" />
            <span>Flights</span>
          </button>
          <button
            onClick={() => setActiveSection("bookings")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeSection === "bookings"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span>Bookings</span>
          </button>
          <button
            onClick={() => setActiveSection("checkin")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeSection === "checkin"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Check-in</span>
          </button>
          <button
            onClick={() => setActiveSection("payments")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeSection === "payments"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Payments</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeSection === "flights" && "Flight Search & Booking"}
            {activeSection === "bookings" && "Customer Ticket Management"}
            {activeSection === "checkin" && "Check-in Assistance"}
            {activeSection === "payments" && "Payment Management"}
          </h2>
        </div>

        {/* Flights Section */}
        {activeSection === "flights" && (
          <div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Origin (e.g., JED)"
                value={searchParams.origin}
                onChange={(e) => handleSearchChange("origin", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Destination (e.g., DXB)"
                value={searchParams.destination}
                onChange={(e) =>
                  handleSearchChange("destination", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="date"
                value={searchParams.date}
                onChange={(e) => handleSearchChange("date", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Searching...
                  </div>
                ) : (
                  "Search"
                )}
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
              {flights.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No flights found
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flight
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Arrival
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {flights.map((flight) => (
                      <tr key={flight.flightId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Plane className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {flight.flightId}
                              </div>
                              <div className="text-sm text-gray-500">
                                {flight.airline}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {flight.origin} → {flight.destination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(flight.departureTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(flight.arrivalTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              flight.availableSeats > 20
                                ? "bg-green-100 text-green-800"
                                : flight.availableSeats > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {flight.availableSeats} available
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() =>
                              alert("Booking functionality to be implemented")
                            }
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Book
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {activeSection === "bookings" && (
          <div>
            {bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No bookings found
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Booking #{booking.bookingId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Flight: {booking.flightId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Seat: {booking.seat}
                        </div>
                        <div className="text-sm text-gray-500">
                          Status: {booking.status}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setModifySeat(booking.seat);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.bookingId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    {selectedBooking &&
                      selectedBooking.bookingId === booking.bookingId && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={modifySeat}
                            onChange={(e) => setModifySeat(e.target.value)}
                            placeholder="New Seat Number"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={handleModifyBooking}
                            disabled={loading}
                            className="ml-2 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setSelectedBooking(null)}
                            className="ml-2 text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Check-in Section */}
        {activeSection === "checkin" && (
          <div>
            {bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No bookings found
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Booking #{booking.bookingId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Flight: {booking.flightId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Seat: {booking.seat}
                        </div>
                        <div className="text-sm text-gray-500">
                          Status: {booking.status}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCheckInBooking(booking);
                          setCheckInSeat(booking.seat);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                      >
                        Check-in
                      </button>
                    </div>
                    {checkInBooking &&
                      checkInBooking.bookingId === booking.bookingId && (
                        <div className="mt-2 flex items-center space-x-2">
                          <input
                            type="text"
                            value={checkInSeat}
                            onChange={(e) => setCheckInSeat(e.target.value)}
                            placeholder="Seat Number"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={handleCheckIn}
                            disabled={loading}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {loading ? "Checking in..." : "Confirm Check-in"}
                          </button>
                          <button
                            onClick={() => setCheckInBooking(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payments Section */}
        {activeSection === "payments" && (
          <div>
            {bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No bookings found
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Booking #{booking.bookingId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Flight: {booking.flightId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Status: {booking.status}
                        </div>
                      </div>
                      <button
                        onClick={() => handleResolvePayment(booking.bookingId)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                      >
                        Resolve Payment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FrontDeskDashboard;
