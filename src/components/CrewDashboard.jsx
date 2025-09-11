import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Users,
  Bell,
  Search,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Loader2,
  LogOut,
  User,
  MapPin,
} from "lucide-react";

// Mock API functions
const mockAPI = {
  async getCrewFlights(userId) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [
      {
        flightId: "FL123",
        airline: "MY TRIP AIR",
        origin: "JED",
        destination: "DXB",
        departureTime: "2025-09-20T14:30:00Z",
        arrivalTime: "2025-09-20T16:45:00Z",
        status: "Scheduled",
        passengerCount: 150,
      },
      {
        flightId: "FL456",
        airline: "MY TRIP AIR",
        origin: "JED",
        destination: "CAI",
        departureTime: "2025-09-22T12:00:00Z",
        arrivalTime: "2025-09-22T14:30:00Z",
        status: "Delayed",
        passengerCount: 120,
      },
      {
        flightId: "FL789",
        airline: "MY TRIP AIR",
        origin: "DXB",
        destination: "LHR",
        departureTime: "2025-09-23T22:00:00Z",
        arrivalTime: "2025-09-24T04:30:00Z",
        status: "Scheduled",
        passengerCount: 180,
      },
    ];
  },

  async getFlightPassengers(flightId) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const passengerData = {
      FL123: [
        { passengerId: 201, name: "Ahmed Ali", seatNumber: "12A", ticketId: "TCK12345" },
        { passengerId: 202, name: "Sara Ahmed", seatNumber: "14C", ticketId: "TCK12346" },
        { passengerId: 203, name: "Mohammed Hassan", seatNumber: "16B", ticketId: "TCK12347" },
        { passengerId: 204, name: "Fatima Omar", seatNumber: "18D", ticketId: "TCK12348" },
        { passengerId: 205, name: "Omar Khalid", seatNumber: "20A", ticketId: "TCK12349" },
      ],
      FL456: [
        { passengerId: 206, name: "Layla Ibrahim", seatNumber: "10B", ticketId: "TCK12350" },
        { passengerId: 207, name: "Hassan Mahmoud", seatNumber: "12C", ticketId: "TCK12351" },
        { passengerId: 208, name: "Aisha Saleh", seatNumber: "14A", ticketId: "TCK12352" },
      ],
      FL789: [
        { passengerId: 209, name: "Khalid Rahman", seatNumber: "8A", ticketId: "TCK12353" },
        { passengerId: 210, name: "Noura Al-Zahra", seatNumber: "10C", ticketId: "TCK12354" },
        { passengerId: 211, name: "Tariq Hassan", seatNumber: "12B", ticketId: "TCK12355" },
        { passengerId: 212, name: "Zahra Mahmoud", seatNumber: "14D", ticketId: "TCK12356" },
      ],
    };
    return passengerData[flightId] || [];
  },

  async getNotifications(userId) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      {
        id: "NTF890",
        message: "You have been assigned to flight FL123 departing JED to DXB.",
        timestamp: "2025-09-11T10:06:00Z",
        read: false,
      },
      {
        id: "NTF891",
        message: "Flight FL456 is delayed by 30 minutes due to weather conditions.",
        timestamp: "2025-09-12T08:15:00Z",
        read: false,
      },
      {
        id: "NTF892",
        message: "Safety briefing for flight FL123 is now available.",
        timestamp: "2025-09-13T14:30:00Z",
        read: true,
      },
      {
        id: "NTF893",
        message: "New crew assignment: Flight FL789 to London.",
        timestamp: "2025-09-14T09:00:00Z",
        read: true,
      },
    ];
  },
};

const CrewDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flights");
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passengerSearch, setPassengerSearch] = useState("");

  // Mock user data
  const crewMember = {
    name: "Captain Ahmed Hassan",
    userId: 301,
  };

  // Load initial data
  useEffect(() => {
    loadFlights();
    loadNotifications();
  }, []);

  const loadFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const flightData = await mockAPI.getCrewFlights(crewMember.userId);
      setFlights(flightData);
    } catch (err) {
      setError("Failed to load flights");
    } finally {
      setLoading(false);
    }
  };

  const loadPassengers = async (flightId) => {
    setLoading(true);
    setError(null);
    try {
      const passengerData = await mockAPI.getFlightPassengers(flightId);
      setPassengers(passengerData);
    } catch (err) {
      setError("Failed to load passengers");
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationData = await mockAPI.getNotifications(crewMember.userId);
      setNotifications(notificationData);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    setActiveTab("passengers");
    loadPassengers(flight.flightId);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-100 text-green-800";
      case "Delayed":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Scheduled":
        return <CheckCircle className="h-4 w-4" />;
      case "Delayed":
        return <AlertTriangle className="h-4 w-4" />;
      case "Cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredPassengers = passengers.filter(
    (passenger) =>
      passenger.name.toLowerCase().includes(passengerSearch.toLowerCase()) ||
      passenger.seatNumber.toLowerCase().includes(passengerSearch.toLowerCase())
  );

  const upcomingFlights = flights.filter(
    (flight) => new Date(flight.departureTime) > new Date()
  );

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
                  MY TRIP Crew
                </h1>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Welcome, {crewMember.name}
                </p>
                <p className="text-xs text-gray-500">Flight Crew</p>
              </div>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to log out?")) {
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

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {crewMember.name.split(" ")[0]}
              </h2>
              <p className="text-blue-100 mb-4">
                Ready for your next flight? Here's your dashboard overview.
              </p>
            </div>
            <div className="hidden md:flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{flights.length}</div>
                <div className="text-sm text-blue-100">Assigned Flights</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{upcomingFlights.length}</div>
                <div className="text-sm text-blue-100">Upcoming Flights</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("flights")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "flights"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Plane className="h-4 w-4 inline mr-2" />
              My Flights
            </button>
            <button
              onClick={() => setActiveTab("passengers")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "passengers"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Passengers
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "notifications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Bell className="h-4 w-4 inline mr-2" />
              Notifications
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
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

        {/* Flights Tab */}
        {activeTab === "flights" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  My Assigned Flights
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
                    <p className="text-gray-500">No assigned flights</p>
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
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passengers
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
                            <div className="flex items-center text-sm text-gray-900">
                              <MapPin className="h-4 w-4 mr-1" />
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
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                flight.status
                              )}`}
                            >
                              {getStatusIcon(flight.status)}
                              <span className="ml-1">{flight.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Users className="h-4 w-4 mr-1" />
                              {flight.passengerCount}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleFlightSelect(flight)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                            >
                              View Passengers
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

        {/* Passengers Tab */}
        {activeTab === "passengers" && (
          <div className="space-y-6">
            {selectedFlight && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Plane className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedFlight.flightId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedFlight.origin} → {selectedFlight.destination}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedFlight.status
                    )}`}
                  >
                    {getStatusIcon(selectedFlight.status)}
                    <span className="ml-1">{selectedFlight.status}</span>
                  </span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Passenger List
                  </h3>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or seat..."
                      value={passengerSearch}
                      onChange={(e) => setPassengerSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">
                      Loading passengers...
                    </span>
                  </div>
                ) : passengers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {selectedFlight
                        ? "No passengers found for this flight"
                        : "Select a flight to view passengers"}
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Passenger
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seat Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket ID
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPassengers.map((passenger) => (
                        <tr key={passenger.passengerId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="h-5 w-5 text-gray-400 mr-2" />
                              <div className="text-sm font-medium text-gray-900">
                                {passenger.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {passenger.seatNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {passenger.ticketId}
                            </div>
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
      </div>
    </div>
  );
};

export default CrewDashboard;
