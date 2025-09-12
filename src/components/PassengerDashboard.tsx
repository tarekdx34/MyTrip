import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Search,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Trash2,
  LogOut,
  Ticket,
  User,
  CreditCard,
} from "lucide-react";

// Mock API interfaces
interface Flight {
  flightId: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  price: {
    currency: string;
    economy: number;
    business: number;
  };
  status: string;
}

interface Booking {
  bookingId: string;
  flightId: string;
  seatClass: string;
  seatNumber: string;
  status: string;
  ticketId: string;
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

interface Ticket {
  ticketId: string;
  bookingId: string;
  flightId: string;
  seatClass: string;
  seatNumber: string;
  status: string;
  boardingPass?: string;
}

interface CheckInFlight {
  flightId: string;
  departureTime: string;
  origin: string;
  destination: string;
  checkedIn: boolean;
}

interface Profile {
  userId: number;
  name: string;
  email: string;
  preferences: {
    seatPreference: string;
    mealPreference: string;
    frequentFlyerNumber: string;
  };
}

interface RefundRequest {
  refundId: string;
  bookingId: string;
  amount: number;
  status: string;
  reason: string;
}

// Mock API functions
const mockAPI = {
  async getFlights(searchParams?: {
    origin?: string;
    destination?: string;
    date?: string;
  }): Promise<Flight[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const allFlights: Flight[] = [
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
      {
        flightId: "FL789",
        airline: "MY TRIP AIR",
        origin: "DXB",
        destination: "LHR",
        departureTime: "2025-09-22T22:00:00Z",
        arrivalTime: "2025-09-23T04:30:00Z",
        availableSeats: 28,
        price: { currency: "USD", economy: 420, business: 1200 },
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

  async createBooking(
    userId: number,
    flightId: string,
    seatClass: string
  ): Promise<{ bookingId: string; status: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const bookingId = `BK${Date.now()}`;
    return { bookingId, status: "Confirmed" };
  },

  async getBookings(userId: number): Promise<Booking[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // Retrieve bookings from localStorage keyed by userId
    const allBookings = JSON.parse(
      localStorage.getItem("userBookings") || "{}"
    );
    return allBookings[userId] || [];
  },

  async cancelBooking(
    bookingId: string
  ): Promise<{ status: string; refundEligible: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { status: "Cancelled", refundEligible: true };
  },

  async getNotifications(userId: number): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Retrieve notifications from localStorage keyed by userId
    const allNotifications = JSON.parse(
      localStorage.getItem("userNotifications") || "{}"
    );
    return allNotifications[userId] || [];
  },

  async createPayment(
    userId: number,
    bookingId: string,
    amount: number,
    method: string
  ): Promise<{ paymentId: string; status: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const isSuccess = Math.random() > 0.2; // 80% success rate
    if (isSuccess) {
      // Update booking status to Confirmed for the user
      const allBookings = JSON.parse(
        localStorage.getItem("userBookings") || "{}"
      );
      const userBookings = allBookings[userId] || [];
      const updatedBookings = userBookings.map((booking: Booking) =>
        booking.bookingId === bookingId
          ? { ...booking, status: "Confirmed", ticketId: `TCK${Date.now()}` }
          : booking
      );
      allBookings[userId] = updatedBookings;
      localStorage.setItem("userBookings", JSON.stringify(allBookings));

      // Add notification for the user
      const allNotifications = JSON.parse(
        localStorage.getItem("userNotifications") || "{}"
      );
      const userNotifications = allNotifications[userId] || [];
      const notification = {
        id: `NTF${Date.now()}`,
        message: `Booking ${bookingId} confirmed after payment.`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      userNotifications.unshift(notification);
      allNotifications[userId] = userNotifications;
      localStorage.setItem(
        "userNotifications",
        JSON.stringify(allNotifications)
      );

      return {
        paymentId: `PMT${Date.now()}`,
        status: "Success",
        message: "Payment successful",
      };
    } else {
      return {
        paymentId: "",
        status: "Failed",
        message: "Insufficient funds",
      };
    }
  },

  async getTickets(userId: number): Promise<Ticket[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const bookings = await mockAPI.getBookings(userId);
    return bookings.map((booking) => ({
      ticketId: booking.ticketId,
      bookingId: booking.bookingId,
      flightId: booking.flightId,
      seatClass: booking.seatClass,
      seatNumber: booking.seatNumber,
      status: booking.status === "Confirmed" ? "CheckedIn" : booking.status,
      boardingPass:
        booking.status === "Confirmed" ? `BP${booking.ticketId}` : undefined,
    }));
  },

  async modifyTicket(
    ticketId: string,
    updates: { seatNumber: string }
  ): Promise<{ status: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Mock modification
    return { status: "Success", message: "Ticket modified successfully" };
  },

  async getCheckInEligibleFlights(userId: number): Promise<CheckInFlight[]> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const bookings = await mockAPI.getBookings(userId);
    return bookings
      .filter((booking) => booking.status === "Confirmed")
      .map((booking) => ({
        flightId: booking.flightId,
        departureTime: "2025-09-20T14:30:00Z", // Mock
        origin: "JED",
        destination: "DXB",
        checkedIn: booking.status === "CheckedIn",
      }));
  },

  async checkIn(
    bookingId: string,
    seatNumber: string
  ): Promise<{ status: string; boardingPass: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const boardingPass = `BP${Date.now()}`;
    return {
      status: "CheckedIn",
      boardingPass,
      message: "Check-in successful",
    };
  },

  async getBoardingPass(ticketId: string): Promise<{
    boardingPass: string;
    flightId: string;
    seatNumber: string;
    departureTime: string;
    gate: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      boardingPass: `BP${ticketId}`,
      flightId: "FL123",
      seatNumber: "12A",
      departureTime: "2025-09-20T14:30:00Z",
      gate: "A1",
    };
  },

  async getProfile(userId: number): Promise<Profile> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      userId,
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      preferences: {
        seatPreference: "Window",
        mealPreference: "Vegetarian",
        frequentFlyerNumber: "FF123456",
      },
    };
  },

  async updateProfile(
    userId: number,
    updates: Partial<Profile>
  ): Promise<{ status: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { status: "Success", message: "Profile updated successfully" };
  },

  async requestRefund(
    bookingId: string,
    reason: string
  ): Promise<{ refundId: string; status: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const refundId = `RF${Date.now()}`;
    return {
      refundId,
      status: "Requested",
      message: "Refund request submitted",
    };
  },

  async getRefundStatus(userId: number): Promise<RefundRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return [
      {
        refundId: "RF123",
        bookingId: "BK123",
        amount: 250,
        status: "Approved",
        reason: "Flight cancelled",
      },
    ];
  },
};

const PassengerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    | "search"
    | "bookings"
    | "notifications"
    | "tickets"
    | "checkin"
    | "profile"
    | "refunds"
  >("search");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [checkInFlights, setCheckInFlights] = useState<CheckInFlight[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search states
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    date: "",
  });

  // Booking modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedSeatClass, setSelectedSeatClass] = useState<
    "economy" | "business"
  >("economy");

  // Load initial data
  useEffect(() => {
    loadFlights();
    loadBookings();
    loadNotifications();
  }, []);

  // Refresh bookings and notifications when returning from payment
  useEffect(() => {
    const handleStorageChange = () => {
      loadBookings();
      loadNotifications();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Load data for specific tabs when they are activated
  useEffect(() => {
    if (activeTab === "tickets" && tickets.length === 0) {
      loadTickets();
    }
  }, [activeTab, tickets.length]);

  useEffect(() => {
    if (activeTab === "checkin" && checkInFlights.length === 0) {
      loadCheckInFlights();
    }
  }, [activeTab, checkInFlights.length]);

  useEffect(() => {
    if (activeTab === "profile" && !profile) {
      loadProfile();
    }
  }, [activeTab, profile]);

  useEffect(() => {
    if (activeTab === "refunds" && refunds.length === 0) {
      loadRefunds();
    }
  }, [activeTab, refunds.length]);

  const loadFlights = async (params?: typeof searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const flightData = await mockAPI.getFlights(params);
      setFlights(flightData);
    } catch (err) {
      setError("Failed to load flights");
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const bookingData = await mockAPI.getBookings(101); // Mock user ID
      setBookings(bookingData);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationData = await mockAPI.getNotifications(101); // Mock user ID
      setNotifications(notificationData);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleSearch = () => {
    loadFlights(searchParams);
  };

  const handleBookFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedFlight) return;

    setLoading(true);
    try {
      const result = await mockAPI.createBooking(
        101,
        selectedFlight.flightId,
        selectedSeatClass
      );
      setShowBookingModal(false);
      setSelectedFlight(null);
      // Redirect to PaymentPage with booking info and amount
      navigate("/payment", {
        state: {
          bookingId: result.bookingId,
          flightId: selectedFlight.flightId,
          seatClass: selectedSeatClass,
          amount:
            selectedSeatClass === "economy"
              ? selectedFlight.price.economy
              : selectedFlight.price.business,
        },
      });
    } catch (err) {
      alert("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const result = await mockAPI.cancelBooking(bookingId);
      alert(`Booking cancelled. Refund eligible: ${result.refundEligible}`);
      loadBookings(); // Refresh bookings
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price}`;
  };

  const handleCheckIn = async (flightId: string) => {
    try {
      // Find the booking for this flight
      const booking = bookings.find((b) => b.flightId === flightId);
      if (!booking) {
        alert("Booking not found for this flight");
        return;
      }

      const result = await mockAPI.checkIn(
        booking.bookingId,
        booking.seatNumber
      );
      alert(result.message);

      // Refresh bookings and check-in flights
      loadBookings();
      loadCheckInFlights();
    } catch (err) {
      alert("Failed to check in");
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      const result = await mockAPI.updateProfile(101, profile);
      alert(result.message);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const loadCheckInFlights = async () => {
    try {
      const checkInData = await mockAPI.getCheckInEligibleFlights(101);
      setCheckInFlights(checkInData);
    } catch (err) {
      console.error("Failed to load check-in flights:", err);
    }
  };

  const loadTickets = async () => {
    try {
      const ticketData = await mockAPI.getTickets(101);
      setTickets(ticketData);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    }
  };

  const loadProfile = async () => {
    try {
      const profileData = await mockAPI.getProfile(101);
      setProfile(profileData);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const loadRefunds = async () => {
    try {
      const refundData = await mockAPI.getRefundStatus(101);
      setRefunds(refundData);
    } catch (err) {
      console.error("Failed to load refunds:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
              >
                <Plane className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  MY TRIP Dashboard
                </h1>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Welcome, Ahmed Ali
                </p>
                <p className="text-xs text-gray-500">Passenger</p>
              </div>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to log out?")) {
                    // In a real app, you would clear authentication tokens here
                    navigate("/");
                  }
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("search")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "search"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Search Flights
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "bookings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "notifications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Bell className="h-4 w-4 inline mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "tickets"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Ticket className="h-4 w-4 inline mr-2" />
              My Tickets
            </button>
            <button
              onClick={() => setActiveTab("checkin")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "checkin"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <CheckCircle className="h-4 w-4 inline mr-2" />
              Check-In
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("refunds")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "refunds"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <CreditCard className="h-4 w-4 inline mr-2" />
              Refunds
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setActiveTab("search")}
            className="bg-blue-600 text-white p-6 rounded-2xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <Search className="h-8 w-8" />
              <div className="text-left">
                <h3 className="text-xl font-semibold">Flight Dashboard</h3>
                <p className="text-blue-100">
                  Search flights & manage bookings
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className="bg-green-600 text-white p-6 rounded-2xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8" />
              <div className="text-left">
                <h3 className="text-xl font-semibold">Manage Trips</h3>
                <p className="text-green-100">View and modify bookings</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className="bg-purple-600 text-white p-6 rounded-2xl hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <Bell className="h-8 w-8" />
              <div className="text-left">
                <h3 className="text-xl font-semibold">Notifications</h3>
                <p className="text-purple-100">Flight updates & alerts</p>
              </div>
            </div>
          </button>
        </div>

        {/* Search Flights Tab */}
        {activeTab === "search" && (
          <div className="space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Search Flights
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origin
                  </label>
                  <input
                    type="text"
                    value={searchParams.origin}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        origin: e.target.value,
                      })
                    }
                    placeholder="e.g., JED"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={searchParams.destination}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        destination: e.target.value,
                      })
                    }
                    placeholder="e.g., DXB"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={searchParams.date}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>
            </div>

            {/* Flight Results */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Available Flights
                </h3>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">
                      Loading flights...
                    </span>
                  </div>
                ) : flights.length === 0 ? (
                  <div className="text-center py-12">
                    <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No flights found</p>
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
                          Price
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
                            <div className="flex items-center">
                              <Plane className="h-5 w-5 text-blue-600 mr-2" />
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {flight.origin} → {flight.destination}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(flight.departureTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(flight.arrivalTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div>
                                Economy:{" "}
                                {formatPrice(
                                  flight.price.economy,
                                  flight.price.currency
                                )}
                              </div>
                              <div>
                                Business:{" "}
                                {formatPrice(
                                  flight.price.business,
                                  flight.price.currency
                                )}
                              </div>
                            </div>
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
                              onClick={() => handleBookFlight(flight)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                            >
                              Book Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* My Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                My Bookings
              </h2>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.bookingId}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Plane className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Booking #{booking.bookingId}
                            </div>
                            <div className="text-sm text-gray-500">
                              Flight {booking.flightId}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                          {booking.status === "Confirmed" && (
                            <button
                              onClick={() =>
                                handleCancelBooking(booking.bookingId)
                              }
                              className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                              title="Cancel booking"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Seat Class:</span>
                          <span className="ml-2 font-medium">
                            {booking.seatClass}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Seat Number:</span>
                          <span className="ml-2 font-medium">
                            {booking.seatNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Ticket ID:</span>
                          <span className="ml-2 font-medium">
                            {booking.ticketId}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notifications
              </h2>
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read
                          ? "bg-gray-50 border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              notification.read
                                ? "text-gray-700"
                                : "text-gray-900 font-medium"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDateTime(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="ml-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                My Tickets
              </h2>
              {tickets.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tickets found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.ticketId}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Ticket className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Ticket #{ticket.ticketId}
                            </div>
                            <div className="text-sm text-gray-500">
                              Flight {ticket.flightId}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              ticket.status === "CheckedIn"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Seat Class:</span>
                          <span className="ml-2 font-medium">
                            {ticket.seatClass}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Seat Number:</span>
                          <span className="ml-2 font-medium">
                            {ticket.seatNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Boarding Pass:</span>
                          <span className="ml-2 font-medium">
                            {ticket.boardingPass || "Not available"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Check-In Tab */}
        {activeTab === "checkin" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Check-In
              </h2>
              {checkInFlights.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No flights available for check-in
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {checkInFlights.map((flight) => (
                    <div
                      key={flight.flightId}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Plane className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Flight {flight.flightId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {flight.origin} → {flight.destination}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              flight.checkedIn
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {flight.checkedIn
                              ? "Checked In"
                              : "Ready for Check-In"}
                          </span>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Departure:</span>
                          <span className="ml-2 font-medium">
                            {formatDateTime(flight.departureTime)}
                          </span>
                        </div>
                        <div>
                          {!flight.checkedIn && (
                            <button
                              onClick={() => handleCheckIn(flight.flightId)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Check In
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                My Profile
              </h2>
              {profile ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seat Preference
                      </label>
                      <select
                        value={profile.preferences.seatPreference}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              seatPreference: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Window">Window</option>
                        <option value="Aisle">Aisle</option>
                        <option value="Middle">Middle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meal Preference
                      </label>
                      <select
                        value={profile.preferences.mealPreference}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              mealPreference: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequent Flyer Number
                      </label>
                      <input
                        type="text"
                        value={profile.preferences.frequentFlyerNumber}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              frequentFlyerNumber: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleUpdateProfile}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Loading profile...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Refunds Tab */}
        {activeTab === "refunds" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Refund Requests
              </h2>
              {refunds.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No refund requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {refunds.map((refund) => (
                    <div
                      key={refund.refundId}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Refund #{refund.refundId}
                            </div>
                            <div className="text-sm text-gray-500">
                              Booking {refund.bookingId}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              refund.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : refund.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {refund.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <span className="ml-2 font-medium">
                            USD {refund.amount}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Reason:</span>
                          <span className="ml-2 font-medium">
                            {refund.reason}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Book Flight
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Plane className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{selectedFlight.flightId}</span>
                  <span className="text-sm text-gray-500">
                    {selectedFlight.airline}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>
                    {selectedFlight.origin} → {selectedFlight.destination}
                  </div>
                  <div>
                    Departure: {formatDateTime(selectedFlight.departureTime)}
                  </div>
                  <div>
                    Arrival: {formatDateTime(selectedFlight.arrivalTime)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seat Class
                </label>
                <select
                  value={selectedSeatClass}
                  onChange={(e) =>
                    setSelectedSeatClass(
                      e.target.value as "economy" | "business"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="economy">
                    Economy -{" "}
                    {formatPrice(
                      selectedFlight.price.economy,
                      selectedFlight.price.currency
                    )}
                  </option>
                  <option value="business">
                    Business -{" "}
                    {formatPrice(
                      selectedFlight.price.business,
                      selectedFlight.price.currency
                    )}
                  </option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Booking...
                    </div>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;
