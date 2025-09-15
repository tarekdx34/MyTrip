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
import {
  flightAPI,
  airportAPI,
  Airport,
  bookingAPI,
  ticketsAPI,
  paymentsAPI,
  userAPI,
  passengerAPI,
  BookingResponse,
  Flight,
  User as UserType,
  Passenger,
  Booking,
  BookingRequest,
} from "../services/api";

// Local interfaces for UI-specific data
interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

interface CheckInFlight {
  flightId: string;
  departureTime: string;
  origin: string;
  destination: string;
  checkedIn: boolean;
  bookingId?: number;
  ticketId?: string;
  seatNumber?: string;
  flightNumber?: string;
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
  paymentId?: string;
  requestDate?: string;
  processedDate?: string;
}

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
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [checkInFlights, setCheckInFlights] = useState<CheckInFlight[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentPassengerId, setCurrentPassengerId] = useState<number | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(
    null
  );

  // Search states
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    date: "",
  });
  const [selectedOriginAirport, setSelectedOriginAirport] =
    useState<Airport | null>(null);
  const [selectedDestinationAirport, setSelectedDestinationAirport] =
    useState<Airport | null>(null);

  // Booking modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedSeatClass, setSelectedSeatClass] = useState<
    "economy" | "business"
  >("economy");

  // Load initial data
  useEffect(() => {
    loadUserProfile();
    loadFlights();
    loadAirports();
  }, []);

  // Load user-specific data after userId is set
  useEffect(() => {
    if (currentUserId && currentPassengerId) {
      loadBookings();
    }
  }, [currentUserId, currentPassengerId]);

  // Load notifications after bookings are loaded
  useEffect(() => {
    if (bookings.length > 0 && currentPassengerId) {
      loadNotifications();
    }
  }, [bookings, currentPassengerId]);

  // Load data for specific tabs when they are activated
  useEffect(() => {
    if (activeTab === "tickets" && tickets.length === 0 && currentPassengerId) {
      loadTickets();
    }
  }, [activeTab, tickets.length, currentPassengerId]);

  useEffect(() => {
    if (
      activeTab === "checkin" &&
      checkInFlights.length === 0 &&
      currentPassengerId
    ) {
      loadCheckInFlights();
    }
  }, [activeTab, checkInFlights.length, currentPassengerId]);

  useEffect(() => {
    if (activeTab === "profile" && !profile && currentUserId) {
      loadProfile();
    }
  }, [activeTab, profile, currentUserId]);

  // Refresh bookings and notifications when returning from payment
  useEffect(() => {
    const handleFocus = () => {
      // Refresh data when user returns to the page (e.g., from payment)
      if (currentPassengerId) {
        loadBookings();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [currentPassengerId]);

  const loadUserProfile = async () => {
    try {
      // Get current user from localStorage or context
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      const userProfile = await userAPI.getUserById(Number(userId));
      setCurrentUserId(userProfile.userID);
      setCurrentUser(userProfile);

      // Get passenger profile
      try {
        const passenger = await passengerAPI.getPassengerByUserId(
          userProfile.userID
        );
        setCurrentPassengerId(passenger.passengerID);
        setCurrentPassenger(passenger);
      } catch (err) {
        console.error("Failed to load passenger profile:", err);
        // If user is not a passenger, that's okay for profile display
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
      // Don't redirect immediately, try to load flights anyway
      setError("Failed to load user profile, but you can still search flights");
    }
  };

  const loadFlights = async (params?: typeof searchParams) => {
    setLoading(true);
    setError(null);
    try {
      let flightData: Flight[];

      if (params?.origin || params?.destination || params?.date) {
        // Build search parameters
        const searchFilters: any = {};

        if (params.origin) {
          try {
            const originAirport = await airportAPI.getAirportByCode(
              params.origin.toUpperCase()
            );
            searchFilters.departureAirportId = originAirport.airportID;
          } catch (err) {
            console.error("Invalid origin airport code:", err);
            // Continue with search even if airport code is invalid
          }
        }

        if (params.destination) {
          try {
            const destAirport = await airportAPI.getAirportByCode(
              params.destination.toUpperCase()
            );
            searchFilters.arrivalAirportId = destAirport.airportID;
          } catch (err) {
            console.error("Invalid destination airport code:", err);
            // Continue with search even if airport code is invalid
          }
        }

        if (params.date) {
          searchFilters.departureDate = params.date;
        }

        // Only search with filters if we have valid parameters
        if (Object.keys(searchFilters).length > 0) {
          flightData = await flightAPI.searchFlights(searchFilters);
        } else {
          flightData = await flightAPI.getAllFlights();
        }
      } else {
        // Load all available flights if no search parameters
        try {
          flightData = await flightAPI.getAvailableFlights();
        } catch (err) {
          console.warn(
            "Available flights endpoint failed, trying all flights:",
            err
          );
          flightData = await flightAPI.getAllFlights();
        }
      }

      setFlights(flightData);
      if (flightData.length === 0) {
        setError("No flights found matching your search criteria");
      }
    } catch (err) {
      setError("Failed to load flights. Please try again later.");
      console.error("Flight loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    if (!currentPassengerId) return;

    try {
      const bookingData = await bookingAPI.getBookingsByPassenger(
        currentPassengerId
      );
      setBookings(bookingData);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const loadNotifications = async () => {
    if (!currentPassengerId) return;

    try {
      const notificationData: Notification[] = [];

      // Get all bookings to create relevant notifications
      const allBookings = await bookingAPI.getBookingsByPassenger(
        currentPassengerId
      );

      // Create notifications for booking confirmations
      allBookings.forEach((booking) => {
        if (booking.status === "confirmed") {
          notificationData.push({
            id: `booking-confirmed-${booking.bookingID}`,
            message: `Booking ${
              booking.bookingNumber
            } has been confirmed! Flight ${
              booking.flightNumber
            } - Total amount: ${formatPrice(booking.totalAmount)}`,
            timestamp: booking.bookingDate,
            read: false,
          });
        }

        if (booking.status === "cancelled") {
          notificationData.push({
            id: `booking-cancelled-${booking.bookingID}`,
            message: `Booking ${booking.bookingNumber} has been cancelled. Flight ${booking.flightNumber}`,
            timestamp: booking.bookingDate,
            read: false,
          });
        }
      });

      // Check for flight status updates (delays/cancellations)
      for (const booking of allBookings) {
        if (booking.status === "confirmed") {
          try {
            const flight = await flightAPI.getFlightById(booking.flightID);

            if (flight.status === "Delayed") {
              notificationData.push({
                id: `flight-delayed-${flight.flightID}`,
                message: `Flight ${
                  flight.flightNumber
                } is delayed. New departure: ${formatDateTime(
                  flight.departureTime
                )}`,
                timestamp: new Date().toISOString(),
                read: false,
              });
            }

            if (flight.status === "Cancelled") {
              notificationData.push({
                id: `flight-cancelled-${flight.flightID}`,
                message: `Flight ${flight.flightNumber} has been cancelled. Please contact customer service for rebooking.`,
                timestamp: new Date().toISOString(),
                read: false,
              });
            }

            if (flight.status === "Boarding") {
              const departureTime = new Date(flight.departureTime);
              const now = new Date();
              const timeDiff = departureTime.getTime() - now.getTime();
              const hoursUntilDeparture = Math.floor(
                timeDiff / (1000 * 60 * 60)
              );

              if (hoursUntilDeparture <= 2 && hoursUntilDeparture > 0) {
                notificationData.push({
                  id: `flight-boarding-${flight.flightID}`,
                  message: `Flight ${flight.flightNumber} is now boarding! Departure in ${hoursUntilDeparture} hours.`,
                  timestamp: new Date().toISOString(),
                  read: false,
                });
              }
            }
          } catch (err) {
            console.error(
              `Failed to check flight status for flight ${booking.flightID}:`,
              err
            );
          }
        }
      }

      // Sort notifications by timestamp (newest first)
      notificationData.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(notificationData);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const loadTickets = async () => {
    if (!currentPassengerId) return;

    try {
      const ticketData = await ticketsAPI.getTicketsByPassenger(
        currentPassengerId
      );
      setTickets(ticketData);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    }
  };

  const loadCheckInFlights = async () => {
    if (!currentPassengerId) return;

    try {
      // Get confirmed bookings for the passenger
      const confirmedBookings =
        await bookingAPI.getBookingsByPassengerAndStatus(
          currentPassengerId,
          "confirmed"
        );

      // Get all scheduled flights
      const scheduledFlights = await flightAPI.getFlightsByStatus("Scheduled");

      // Create a map of scheduled flights for quick lookup
      const scheduledFlightMap = new Map(
        scheduledFlights.map((flight) => [flight.flightID, flight])
      );

      const checkInData: CheckInFlight[] = [];

      for (const booking of confirmedBookings) {
        const flight = scheduledFlightMap.get(booking.flightID);

        if (flight) {
          // Check if flight is eligible for check-in (within 24 hours of departure)
          const departureTime = new Date(flight.departureTime);
          const now = new Date();
          const hoursUntilDeparture =
            (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);

          // Allow check-in 24 hours before departure and up to 2 hours before
          if (hoursUntilDeparture <= 24 && hoursUntilDeparture >= 2) {
            // Get passenger tickets to check if already checked in
            const tickets = await ticketsAPI.getTicketsByPassenger(
              currentPassengerId
            );
            const flightTicket = tickets.find(
              (ticket) =>
                ticket.flightId === booking.flightID &&
                ticket.bookingId === booking.bookingID
            );

            checkInData.push({
              flightId: booking.flightID.toString(),
              departureTime: flight.departureTime,
              origin: flight.departureAirport.airportCode,
              destination: flight.arrivalAirport.airportCode,
              checkedIn: flightTicket?.status === "CheckedIn" || false,
              bookingId: booking.bookingID,
              ticketId: flightTicket?.ticketId,
              seatNumber: booking.seatNumber,
              flightNumber: flight.flightNumber,
            });
          }
        }
      }

      setCheckInFlights(checkInData);
    } catch (err) {
      console.error("Failed to load check-in flights:", err);
      setError("Failed to load eligible flights for check-in");
    }
  };

  const loadProfile = async () => {
    if (!currentUserId || !currentUser) return;

    try {
      // Use the already loaded user data
      setProfile({
        userId: currentUser.userID,
        name: currentUser.name,
        email: currentUser.email,
        preferences: {
          seatPreference: "Window",
          mealPreference: "Regular",
          frequentFlyerNumber: "",
        },
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const loadRefunds = async () => {
    if (!currentPassengerId) return;

    try {
      setLoading(true);
      const refundData: RefundRequest[] = [];

      // Get all bookings for the passenger
      const allBookings = await bookingAPI.getBookingsByPassenger(
        currentPassengerId
      );

      // For each booking, check if there are any refunded payments
      for (const booking of allBookings) {
        try {
          // Note: This assumes your payments API has a way to get payments by booking ID
          // You might need to adjust this based on your actual API structure
          const paymentStatus = await paymentsAPI.getPaymentStatus(
            `PMT${booking.bookingID}`
          );

          if (
            paymentStatus.status === "Refunded" ||
            paymentStatus.message.includes("refund")
          ) {
            refundData.push({
              refundId: `RF${booking.bookingID}`,
              bookingId: booking.bookingNumber,
              amount: booking.totalAmount,
              status:
                paymentStatus.status === "Refunded" ? "Completed" : "Pending",
              reason: "Flight cancellation", // Default reason
              paymentId: `PMT${booking.bookingID}`,
              requestDate: booking.bookingDate,
              processedDate:
                paymentStatus.status === "Refunded"
                  ? new Date().toISOString()
                  : undefined,
            });
          }
        } catch (paymentError) {
          // If payment API fails, check if booking was cancelled (might indicate refund)
          if (booking.status === "cancelled") {
            refundData.push({
              refundId: `RF${booking.bookingID}`,
              bookingId: booking.bookingNumber,
              amount: booking.totalAmount,
              status: "Pending",
              reason: "Booking cancellation",
              paymentId: `PMT${booking.bookingID}`,
              requestDate: booking.bookingDate,
            });
          }
        }
      }

      // Sort refunds by request date (newest first)
      refundData.sort(
        (a, b) =>
          new Date(b.requestDate || 0).getTime() -
          new Date(a.requestDate || 0).getTime()
      );

      setRefunds(refundData);
    } catch (err) {
      console.error("Failed to load refunds:", err);
      setError("Failed to load refund information");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRefund = async (bookingId: number, reason: string) => {
    try {
      setLoading(true);

      // Use the booking API to process refund
      const refundResult = await bookingAPI.refundBooking(bookingId);

      if (refundResult) {
        // Create notification for refund request
        createNotification(
          "refund-requested",
          `Refund requested for booking ${
            refundResult.bookingNumber
          }. Amount: ${formatPrice(refundResult.totalAmount)}`,
          bookingId
        );

        alert(
          "Refund request submitted successfully. You will receive confirmation via email."
        );

        // Refresh refunds and bookings
        await loadRefunds();
        await loadBookings();
      }
    } catch (err) {
      console.error("Failed to request refund:", err);
      alert(
        "Failed to process refund request. Please contact customer service."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAirports = async () => {
    try {
      const airportData = await airportAPI.getAllAirports();
      setAirports(airportData);
    } catch (err) {
      console.error("Failed to load airports:", err);
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
    if (!selectedFlight || !currentPassengerId) return;

    setLoading(true);
    try {
      const bookingRequest: BookingRequest = {
        passengerID: currentPassengerId,
        flightID: selectedFlight.flightID,
        totalAmount: selectedFlight.price,
      };

      const result = await bookingAPI.createBooking(bookingRequest);

      setShowBookingModal(false);
      setSelectedFlight(null);

      // Redirect to PaymentPage with booking info
      navigate("/payment", {
        state: {
          bookingId: result.bookingID,
          flightId: selectedFlight.flightID,
          seatClass: selectedSeatClass,
          amount: selectedFlight.price,
        },
      });
    } catch (err) {
      alert("Failed to create booking");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new notification
  const createNotification = (
    type: string,
    message: string,
    bookingId?: number,
    flightId?: number
  ) => {
    const notification: Notification = {
      id: `${type}-${bookingId || flightId || Date.now()}`,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev]);
  };

  // Function to refresh notifications manually
  const refreshNotifications = async () => {
    await loadNotifications();
  };

  // Function to mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Function to mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await bookingAPI.cancelBooking(bookingId);
      alert("Booking cancelled successfully");
      loadBookings(); // Refresh bookings
    } catch (err) {
      alert("Failed to cancel booking");
      console.error("Cancel booking error:", err);
    }
  };

  const handleCheckIn = async (checkInFlight: CheckInFlight) => {
    if (!checkInFlight.bookingId || !checkInFlight.ticketId) {
      alert("Unable to check in: Missing booking or ticket information");
      return;
    }

    try {
      setLoading(true);

      // Try to check in via ticket API first
      try {
        const ticketResult = await ticketsAPI.modifyTicket(
          checkInFlight.ticketId,
          { seatNumber: checkInFlight.seatNumber || "Auto-assigned" }
        );

        if (ticketResult.status === "Success") {
          // If ticket check-in succeeds, also confirm the booking
          await bookingAPI.confirmBooking(checkInFlight.bookingId);

          // Create check-in notification
          createNotification(
            "checkin-success",
            `Successfully checked in for flight ${
              checkInFlight.flightNumber
            }. Seat: ${checkInFlight.seatNumber || "Auto-assigned"}`,
            checkInFlight.bookingId,
            Number(checkInFlight.flightId)
          );

          alert("Check-in successful! You're all set for your flight.");
        } else {
          throw new Error(ticketResult.message || "Check-in failed");
        }
      } catch (ticketError) {
        console.warn(
          "Ticket API check-in failed, trying booking confirmation:",
          ticketError
        );

        // Fallback to booking confirmation if ticket API fails
        await bookingAPI.confirmBooking(checkInFlight.bookingId);

        createNotification(
          "checkin-success",
          `Checked in for flight ${checkInFlight.flightNumber}. Please visit the counter for seat assignment.`,
          checkInFlight.bookingId,
          Number(checkInFlight.flightId)
        );

        alert(
          "Check-in completed! Please visit the check-in counter for seat assignment."
        );
      }

      // Refresh the check-in flights list
      await loadCheckInFlights();
    } catch (err) {
      console.error("Check-in failed:", err);
      alert("Check-in failed. Please try again or contact customer service.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile || !currentUserId) return;

    try {
      const updateData = {
        name: profile.name,
        email: profile.email,
      };

      await userAPI.updateUser(currentUserId, updateData);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
      console.error("Profile update error:", err);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price: number, currency: string = "SAR") => {
    return `${currency} ${price}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Rest of your component JSX would go here
  // The render logic remains the same, just replace the mock data with the state variables

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Plane className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MY TRIP</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setActiveTab("notifications")}
                  className="p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <Bell className="h-6 w-6" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>
              </div>

              {/* User Welcome Section */}
              {currentUser && (
                <div className="flex items-center space-x-2 text-gray-700 border-r border-gray-200 pr-4">
                  <User className="h-6 w-6 text-gray-600" />
                  <span className="hidden sm:block">
                    Welcome, {currentUser.name}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {[
                  { id: "search", label: "Search Flights", icon: Search },
                  { id: "bookings", label: "My Bookings", icon: BookOpen },
                  { id: "tickets", label: "My Tickets", icon: Ticket },
                  { id: "checkin", label: "Check-in", icon: CheckCircle },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "profile", label: "Profile", icon: User },
                  { id: "refunds", label: "Refunds", icon: CreditCard },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Search Flights Tab */}
            {activeTab === "search" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Search Flights
                </h2>

                {/* Search Form */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From
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
                      placeholder="Airport code (e.g., JED)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To
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
                      placeholder="Airport code (e.g., DXB)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        setSearchParams({
                          ...searchParams,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      <span className="ml-2">Search</span>
                    </button>
                  </div>
                </div>

                {/* Flight Results */}
                <div className="space-y-4">
                  {flights.map((flight) => (
                    <div
                      key={flight.flightID}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {flight.flightNumber}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                flight.status === "Scheduled"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {flight.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {flight.departureAirport.airportCode} →{" "}
                                {flight.arrivalAirport.airportCode}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatDateTime(flight.departureTime)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {flight.availableSeats} seats available
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatPrice(flight.price)}
                          </div>
                          <button
                            onClick={() => handleBookFlight(flight)}
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Bookings
                </h2>

                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.bookingID}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Booking #{booking.bookingNumber}
                          </h3>
                          <p className="text-gray-600">
                            Flight: {booking.flightNumber}
                          </p>
                          <p className="text-gray-600">
                            Passenger: {booking.passengerName}
                          </p>
                          <p className="text-gray-600">
                            Date: {formatDateTime(booking.bookingDate)}
                          </p>
                          {booking.seatNumber && (
                            <p className="text-gray-600">
                              Seat: {booking.seatNumber}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                          <div className="text-lg font-bold text-gray-900 mt-2">
                            {formatPrice(booking.totalAmount)}
                          </div>
                          {booking.status === "pending" && (
                            <button
                              onClick={() =>
                                handleCancelBooking(booking.bookingID)
                              }
                              className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm flex items-center space-x-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Check-in Tab */}
            {activeTab === "checkin" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Flight Check-in
                </h2>

                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800 text-sm">
                    <strong>Check-in Information:</strong> You can check in 24
                    hours before departure and up to 2 hours before your flight.
                    Only confirmed bookings for scheduled flights are eligible.
                  </p>
                </div>

                <div className="space-y-4">
                  {checkInFlights.length > 0 ? (
                    checkInFlights.map((flight) => {
                      const departureTime = new Date(flight.departureTime);
                      const now = new Date();
                      const hoursUntilDeparture = Math.floor(
                        (departureTime.getTime() - now.getTime()) /
                          (1000 * 60 * 60)
                      );

                      return (
                        <div
                          key={flight.flightId}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Plane className="h-5 w-5 text-blue-500" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Flight{" "}
                                  {flight.flightNumber || flight.flightId}
                                </h3>
                                {flight.checkedIn && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    ✓ Checked In
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>
                                    {flight.origin} → {flight.destination}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {formatDateTime(flight.departureTime)}
                                  </span>
                                </div>
                                {flight.seatNumber && (
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4" />
                                    <span>Seat: {flight.seatNumber}</span>
                                  </div>
                                )}
                              </div>

                              <div className="mt-2 text-sm">
                                <span
                                  className={`${
                                    hoursUntilDeparture > 24
                                      ? "text-gray-500"
                                      : hoursUntilDeparture < 2
                                      ? "text-red-500"
                                      : "text-green-600"
                                  }`}
                                >
                                  {hoursUntilDeparture > 24
                                    ? `Check-in opens in ${
                                        hoursUntilDeparture - 24
                                      } hours`
                                    : hoursUntilDeparture < 2
                                    ? `Check-in closes in ${hoursUntilDeparture} hours`
                                    : `${hoursUntilDeparture} hours until departure`}
                                </span>
                              </div>
                            </div>

                            <div className="ml-4">
                              {flight.checkedIn ? (
                                <div className="text-center">
                                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                  <p className="text-sm text-green-600 font-medium">
                                    Checked In
                                  </p>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleCheckIn(flight)}
                                  disabled={
                                    loading ||
                                    hoursUntilDeparture > 24 ||
                                    hoursUntilDeparture < 2
                                  }
                                  className={`px-4 py-2 rounded-md text-white font-medium ${
                                    hoursUntilDeparture > 24 ||
                                    hoursUntilDeparture < 2
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                                >
                                  {loading ? (
                                    <div className="flex items-center space-x-2">
                                      <Loader2 className="animate-spin h-4 w-4" />
                                      <span>Checking In...</span>
                                    </div>
                                  ) : (
                                    "Check In"
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Plane className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No flights available for check-in
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Confirmed bookings will appear here 24 hours before
                        departure.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Refunds Tab */}
            {activeTab === "refunds" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Refunds
                </h2>

                <div className="space-y-4">
                  {refunds.length > 0 ? (
                    refunds.map((refund) => (
                      <div
                        key={refund.refundId}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CreditCard className="h-5 w-5 text-blue-500" />
                              <h3 className="text-lg font-semibold text-gray-900">
                                Refund #{refund.refundId}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  refund.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : refund.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {refund.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p>
                                  <strong>Booking:</strong> {refund.bookingId}
                                </p>
                                <p>
                                  <strong>Amount:</strong>{" "}
                                  {formatPrice(refund.amount)}
                                </p>
                                <p>
                                  <strong>Reason:</strong> {refund.reason}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>Requested:</strong>{" "}
                                  {refund.requestDate
                                    ? formatDateTime(refund.requestDate)
                                    : "N/A"}
                                </p>
                                {refund.processedDate && (
                                  <p>
                                    <strong>Processed:</strong>{" "}
                                    {formatDateTime(refund.processedDate)}
                                  </p>
                                )}
                                {refund.paymentId && (
                                  <p>
                                    <strong>Payment ID:</strong>{" "}
                                    {refund.paymentId}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="ml-4 text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(refund.amount)}
                            </div>
                            {refund.status === "Completed" && (
                              <div className="text-sm text-green-600 mt-1">
                                ✓ Processed
                              </div>
                            )}
                            {refund.status === "Pending" && (
                              <div className="text-sm text-yellow-600 mt-1">
                                ⏳ Processing...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No refunds found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Refund requests and completed refunds will appear here.
                      </p>
                    </div>
                  )}
                </div>

                {/* Add a section for requesting refunds from existing bookings */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Request Refund
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    To request a refund for a booking, please cancel your
                    booking from the "My Bookings" section. Eligible refunds
                    will appear here automatically.
                  </p>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    View My Bookings
                  </button>
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === "tickets" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Tickets
                </h2>

                <div className="space-y-4">
                  {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <div
                        key={ticket.ticketId}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Ticket className="h-5 w-5 text-blue-500" />
                              <h3 className="text-lg font-semibold text-gray-900">
                                Ticket {ticket.ticketId}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  ticket.status === "CheckedIn"
                                    ? "bg-green-100 text-green-800"
                                    : ticket.status === "confirmed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {ticket.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <p>
                                  <strong>Booking:</strong> {ticket.bookingId}
                                </p>
                                <p>
                                  <strong>Flight:</strong> {ticket.flightId}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>Class:</strong> {ticket.seatClass}
                                </p>
                                <p>
                                  <strong>Seat:</strong> {ticket.seatNumber}
                                </p>
                              </div>
                              <div>
                                {ticket.boardingPass && (
                                  <p>
                                    <strong>Boarding Pass:</strong>{" "}
                                    {ticket.boardingPass}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Ticket className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No tickets found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Your confirmed tickets will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Notifications
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={refreshNotifications}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm flex items-center space-x-1"
                    >
                      <Bell className="h-4 w-4" />
                      <span>Refresh</span>
                    </button>
                    {notifications.some((n) => !n.read) && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 text-sm"
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          notification.read
                            ? "border-gray-200 bg-gray-50"
                            : "border-blue-200 bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {notification.id.includes("confirmed") && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                              {notification.id.includes("cancelled") && (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                              {notification.id.includes("delayed") && (
                                <Clock className="h-5 w-5 text-yellow-500" />
                              )}
                              {notification.id.includes("boarding") && (
                                <Plane className="h-5 w-5 text-blue-500" />
                              )}
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p
                              className={`text-sm ${
                                notification.read
                                  ? "text-gray-600"
                                  : "text-gray-900 font-medium"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                notification.timestamp
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No notifications
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You'll see booking confirmations and flight updates
                        here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Settings
                </h2>

                {profile ? (
                  <div className="space-y-6">
                    {/* User Information */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Additional user details if available */}
                      {currentUser && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              User Type
                            </label>
                            <input
                              type="text"
                              value={currentUser.userType}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              User ID
                            </label>
                            <input
                              type="text"
                              value={currentUser.userID}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Passenger specific details */}
                      {currentPassenger && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          {currentPassenger.passportNumber && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Passport Number
                              </label>
                              <input
                                type="text"
                                value={currentPassenger.passportNumber}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                              />
                            </div>
                          )}
                          {currentPassenger.nationality && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nationality
                              </label>
                              <input
                                type="text"
                                value={currentPassenger.nationality}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                              />
                            </div>
                          )}
                          {currentPassenger.dateOfBirth && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                              </label>
                              <input
                                type="text"
                                value={new Date(
                                  currentPassenger.dateOfBirth
                                ).toLocaleDateString()}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Preferences */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Travel Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Regular">Regular</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Halal">Halal</option>
                            <option value="Kosher">Kosher</option>
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
                            placeholder="Enter FF number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="pb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Account Information
                      </h3>
                      {currentUser && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Profile Created
                            </label>
                            <input
                              type="text"
                              value={new Date(
                                currentUser.createProfile
                              ).toLocaleDateString()}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Updated
                            </label>
                            <input
                              type="text"
                              value={new Date(
                                currentUser.updateProfile
                              ).toLocaleDateString()}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={handleUpdateProfile}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Update Profile</span>
                      </button>
                      <button
                        onClick={() => setProfile(null)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                      >
                        Reset Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No profile data
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Loading your profile information...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Book Flight</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p>
                <strong>Flight:</strong> {selectedFlight.flightNumber}
              </p>
              <p>
                <strong>Route:</strong>{" "}
                {selectedFlight.departureAirport.airportCode} →{" "}
                {selectedFlight.arrivalAirport.airportCode}
              </p>
              <p>
                <strong>Departure:</strong>{" "}
                {formatDateTime(selectedFlight.departureTime)}
              </p>
              <p>
                <strong>Price:</strong> {formatPrice(selectedFlight.price)}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seat Class
              </label>
              <select
                value={selectedSeatClass}
                onChange={(e) =>
                  setSelectedSeatClass(e.target.value as "economy" | "business")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;
