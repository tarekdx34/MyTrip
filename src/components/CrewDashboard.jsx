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
} from "../services/api";

// Additional crew-specific API calls that might not be in the main api.ts
const crewSpecificAPI = {
  async getCrewSchedule(crewId) {
    const response = await fetch(
      `${
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api"
      }/crew/${crewId}/schedule`
    );
    if (!response.ok) throw new Error("Failed to fetch crew schedule");
    return await response.json();
  },

  async getCrewAssignments(crewId) {
    const response = await fetch(
      `${
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api"
      }/crew/${crewId}/assignments`
    );
    if (!response.ok) throw new Error("Failed to fetch crew assignments");
    return await response.json();
  },

  async getCrewFlightPassengers(crewId, flightId) {
    const response = await fetch(
      `${
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api"
      }/crew/${crewId}/passengers?flightId=${flightId}`
    );
    if (!response.ok) throw new Error("Failed to fetch flight passengers");
    return await response.json();
  },

  async submitFlightReport(crewId, flightReport) {
    const response = await fetch(
      `${
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api"
      }/crew/${crewId}/flight-report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flightReport),
      }
    );
    if (!response.ok) throw new Error("Failed to submit flight report");
    return await response.json();
  },

  async getAvailableCrew(position, startDate, endDate) {
    const params = new URLSearchParams();
    if (position) params.append("position", position);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await fetch(
      `${
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api"
      }/crew/available?${params}`
    );
    if (!response.ok) throw new Error("Failed to fetch available crew");
    return await response.json();
  },

  async getCrewStats() {
    const response = await fetch(
      `${
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api"
      }/crew/stats`
    );
    if (!response.ok) throw new Error("Failed to fetch crew stats");
    return await response.json();
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
  const [crewMember, setCrewMember] = useState(null);
  const [crewAssignments, setCrewAssignments] = useState([]);

  // Load initial data
  useEffect(() => {
    loadCrewMemberData();
  }, []);

  // Load crew member data from localStorage or context
  const loadCrewMemberData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user ID from localStorage (stored directly as userId)
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      if (!userId) {
        throw new Error(
          "No user ID found in localStorage. Please log in again."
        );
      }

      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Convert userId to number
      const userIdNum = parseInt(userId);

      if (!userIdNum) {
        throw new Error(
          "Invalid user ID found in localStorage. Please log in again."
        );
      }

      // Verify the role is crew
      if (role !== "ROLE_CREW") {
        throw new Error(`User is not a crew member. Role: ${role}`);
      }

      // First, verify the user exists
      const user = await userAPI.getUserById(userIdNum);

      // Fetch crew member details
      const crew = await crewAPI.getCrewByUserId(userIdNum);

      const crewMemberData = {
        ...crew,
        name: user.name,
        email: user.email,
        userId: userIdNum,
        userType: user.userType,
      };

      setCrewMember(crewMemberData);

      // Load flights and assignments for this crew member
      await loadCrewFlights(crew.crewID);

      await loadCrewAssignments(crew.crewID);
    } catch (err) {
      setError("Failed to load crew member data: " + err.message);

      // If the error is about authentication or user not found, redirect to login
      if (
        err.message.includes("not a crew member") ||
        err.message.includes("Please log in again")
      ) {
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };
  const loadCrewFlights = async (crewId) => {
    console.log("=== LOADING CREW FLIGHTS ===");
    console.log("Crew ID:", crewId);

    if (!crewId) {
      console.error("No crew ID provided");
      setFlights([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get all assignments and filter for this crew member
      console.log(
        "Fetching all assignments and filtering for crew ID:",
        crewId
      );
      const allAssignments = await crewAssignmentAPI.getAllAssignments();
      console.log("All assignments fetched:", allAssignments.length);

      const crewAssignments = allAssignments.filter(
        (assignment) =>
          parseInt(assignment.crewId || assignment.crewID) === parseInt(crewId)
      );
      console.log("Filtered crew assignments:", crewAssignments);

      if (crewAssignments.length === 0) {
        console.log("No assignments found for this crew member");
        setFlights([]);
        setError("No flight assignments found for your account.");
        return;
      }

      // Load flight details for each assignment
      console.log("Loading flight details for assignments...");
      const flightPromises = crewAssignments.map(async (assignment) => {
        try {
          console.log(`Loading flight ${assignment.flightId}...`);
          const flight = await flightAPI.getFlightById(assignment.flightId);
          console.log(`Flight ${assignment.flightId} loaded:`, flight);

          return {
            ...flight,
            // Add assignment-specific data
            assignmentStatus: assignment.status,
            assignmentDate: assignment.assignmentDate,
            assignedBy: assignment.assignedBy,
            assignmentID: assignment.assignmentID,
          };
        } catch (err) {
          console.error(`Failed to load flight ${assignment.flightID}:`, err);
          // Return a placeholder with error info instead of null
          return {
            flightID: assignment.flightID,
            flightNumber: `Flight ${assignment.flightID}`,
            departureAirport: { airportCode: "N/A", name: "Unknown" },
            arrivalAirport: { airportCode: "N/A", name: "Unknown" },
            departureTime: assignment.assignmentDate,
            arrivalTime: assignment.assignmentDate,
            duration: 0,
            price: 0,
            availableSeats: 0,
            status: "unknown",
            aircraft: { aircraftModel: "N/A" },
            assignmentStatus: assignment.status,
            assignmentDate: assignment.assignmentDate,
            assignedBy: assignment.assignedBy,
            assignmentID: assignment.assignmentID,
            _error: `Could not load flight details: ${err.message}`,
          };
        }
      });

      const flightData = await Promise.all(flightPromises);
      console.log("Final flight data:", flightData);
      setFlights(flightData);
    } catch (err) {
      console.error("Error in loadCrewFlights:", err);
      setError("Failed to load crew flights: " + err.message);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };
  const debugFlightLoading = async () => {
    console.log("=== DEBUG FLIGHT LOADING ===");

    try {
      console.log("Testing flightAPI.getAllFlights()...");
      const allFlights = await flightAPI.getAllFlights();
      console.log(
        "All flights:",
        allFlights.map((f) => ({ id: f.flightID, number: f.flightNumber }))
      );

      console.log("Testing specific flight IDs from assignments...");
      const testFlightIds = [2, 4, 5, 6]; // Based on your API response

      for (const flightId of testFlightIds) {
        try {
          console.log(`Testing flight ID ${flightId}...`);
          const flight = await flightAPI.getFlightById(flightId);
          console.log(`✓ Flight ${flightId}:`, {
            flightNumber: flight.flightNumber,
            status: flight.status,
            departureAirport: flight.departureAirport?.airportCode,
          });
        } catch (err) {
          console.error(`✗ Flight ${flightId} failed:`, err.message);
        }
      }
    } catch (err) {
      console.error("Debug error:", err);
    }
  };
  const loadCrewAssignments = async (crewId) => {
    try {
      console.log("Loading assignments for crew ID:", crewId);

      // Get all assignments and filter for this crew member
      const allAssignments = await crewAssignmentAPI.getAllAssignments();
      console.log("All assignments fetched:", allAssignments.length);

      const assignments = allAssignments.filter(
        (assignment) => parseInt(assignment.crewID) === parseInt(crewId)
      );

      console.log("Crew assignments found:", assignments.length);
      setCrewAssignments(assignments);
    } catch (err) {
      console.error("Failed to load crew assignments:", err);
      // Set empty array instead of mock data
      setCrewAssignments([]);
    }
  };
  const debugAssignments = async (crewId) => {
    try {
      console.log("=== DEBUGGING ASSIGNMENTS ===");
      console.log("Looking for crew ID:", crewId, "Type:", typeof crewId);

      const allAssignments = await crewAssignmentAPI.getAllAssignments();
      console.log("Total assignments fetched:", allAssignments.length);
      console.log("First few assignments:", allAssignments.slice(0, 3));

      // Check field names in the assignments
      if (allAssignments.length > 0) {
        console.log("Assignment object keys:", Object.keys(allAssignments[0]));
        console.log("Sample assignment:", allAssignments[0]);
      }

      // Try different field name variations
      const crewAssignments1 = allAssignments.filter(
        (assignment) => parseInt(assignment.crewID) === parseInt(crewId)
      );
      console.log("Filtering by crewID:", crewAssignments1.length);

      const crewAssignments2 = allAssignments.filter(
        (assignment) => parseInt(assignment.crewId) === parseInt(crewId)
      );
      console.log("Filtering by crewId:", crewAssignments2.length);

      // Show all unique crew IDs in the data
      const uniqueCrewIds = [
        ...new Set(allAssignments.map((a) => a.crewID || a.crewId)),
      ];
      console.log("All crew IDs found in assignments:", uniqueCrewIds);

      // Show assignments for crew ID 4 specifically
      const crew4Assignments = allAssignments.filter(
        (assignment) =>
          assignment.crewID === 4 ||
          assignment.crewId === 4 ||
          assignment.crewID === "4" ||
          assignment.crewId === "4"
      );
      console.log("Assignments for crew ID 4 (any format):", crew4Assignments);
    } catch (err) {
      console.error("Debug error:", err);
    }
  };

  const loadPassengers = async (flightId) => {
    setLoading(true);
    setError(null);
    try {
      // First try the crew-specific passenger endpoint if crew member is available
      if (crewMember) {
        try {
          const passengers = await crewSpecificAPI.getCrewFlightPassengers(
            crewMember.crewID,
            flightId
          );

          if (
            typeof passengers === "string" &&
            passengers.includes("implement")
          ) {
            throw new Error("Endpoint not implemented yet");
          }

          setPassengers(passengers);
          return;
        } catch (crewEndpointErr) {
          console.log(
            "Crew passenger endpoint not implemented, using fallback"
          );
        }
      }

      // Fallback method: Get all bookings for this flight and fetch passenger details
      const allBookings = await bookingAPI.getAllBookings();
      const flightBookings = allBookings.filter(
        (booking) => booking.flightID === flightId
      );

      if (flightBookings.length === 0) {
        setPassengers([]);
        return;
      }

      // Get passenger details for each booking
      const passengerPromises = flightBookings.map(async (booking) => {
        try {
          const passenger = await passengerAPI.getPassengerById(
            booking.passengerID
          );
          const user = await userAPI.getUserById(passenger.userID);

          return {
            passengerId: passenger.passengerID,
            name: user.name,
            email: user.email,
            seatNumber: booking.seatNumber || "Not assigned",
            ticketId: `TCK${booking.bookingID}`,
            bookingStatus: booking.status,
            totalAmount: booking.totalAmount,
            bookingDate: booking.bookingDate,
            passportNumber: passenger.passportNumber,
            nationality: passenger.nationality,
            dateOfBirth: passenger.dateOfBirth,
          };
        } catch (err) {
          console.error(
            `Failed to load passenger ${booking.passengerID}:`,
            err
          );
          return null;
        }
      });

      const passengerData = await Promise.all(passengerPromises);
      const validPassengers = passengerData.filter(
        (passenger) => passenger !== null
      );

      setPassengers(validPassengers);
    } catch (err) {
      setError("Failed to load passengers: " + err.message);
      setPassengers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    // Since there's no notifications API endpoint, we'll create notifications based on crew assignments
    try {
      if (!crewMember) return;

      let notifications = [];

      try {
        // Try to use crew assignment endpoint from controller
        const response = await fetch(
          `${API_BASE_URL}/crew/${crewMember.crewID}/assignments`
        );
        if (response.ok) {
          const assignments = await response.json();
          // If successful, create notifications from assignments
          const notificationPromises = assignments.map(async (assignment) => {
            try {
              const flight = await flightAPI.getFlightById(assignment.flightID);
              const departureAirport = flight.departureAirport;
              const arrivalAirport = flight.arrivalAirport;

              return {
                id: `NTF${assignment.assignmentID}`,
                message: `You have been assigned to flight ${flight.flightNumber} from ${departureAirport.airportCode} to ${arrivalAirport.airportCode}.`,
                timestamp: assignment.assignmentDate,
                read: assignment.status === "completed",
                type: "assignment",
                flightId: flight.flightID,
              };
            } catch (err) {
              console.error(
                `Failed to create notification for assignment ${assignment.assignmentID}:`,
                err
              );
              return null;
            }
          });

          const validNotifications = (
            await Promise.all(notificationPromises)
          ).filter((n) => n !== null);
          notifications = validNotifications;
        } else {
          // Fallback: create generic notifications
          notifications = [
            {
              id: "NTF1",
              message:
                "Welcome to the crew dashboard. Your flight assignments will appear here.",
              timestamp: new Date().toISOString(),
              read: false,
              type: "welcome",
            },
          ];
        }
      } catch (err) {
        console.log("Using fallback notifications due to API limitations");
        // Create fallback notifications based on available flights
        const availableFlights = await flightAPI.getAvailableFlights();
        if (availableFlights.length > 0) {
          const flight = availableFlights[0];
          notifications = [
            {
              id: `NTF_${flight.flightID}`,
              message: `Flight ${flight.flightNumber} from ${flight.departureAirport?.airportCode} to ${flight.arrivalAirport?.airportCode} is available for assignment.`,
              timestamp: new Date().toISOString(),
              read: false,
              type: "flight_available",
              flightId: flight.flightID,
            },
          ];
        } else {
          notifications = [
            {
              id: "NTF_WELCOME",
              message:
                "Welcome to the MY TRIP AIR crew dashboard. Stay tuned for flight assignments.",
              timestamp: new Date().toISOString(),
              read: false,
              type: "welcome",
            },
          ];
        }
      }

      setNotifications(notifications);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      // Set default welcome notification
      setNotifications([
        {
          id: "NTF_ERROR",
          message:
            "Welcome to the crew dashboard. Please contact admin if you don't see your assignments.",
          timestamp: new Date().toISOString(),
          read: false,
          type: "error",
        },
      ]);
    }
  };

  // Load notifications when crew member data is available
  useEffect(() => {
    if (crewMember) {
      loadNotifications();
    }
  }, [crewMember]);

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    setActiveTab("passengers");
    loadPassengers(flight.flightID);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
      case "Scheduled":
        return "bg-green-100 text-green-800";
      case "delayed":
      case "Delayed":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "boarding":
      case "Boarding":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
      case "Scheduled":
        return <CheckCircle className="h-4 w-4" />;
      case "delayed":
      case "Delayed":
        return <AlertTriangle className="h-4 w-4" />;
      case "cancelled":
      case "Cancelled":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredPassengers = passengers.filter(
    (passenger) =>
      passenger.name.toLowerCase().includes(passengerSearch.toLowerCase()) ||
      passenger.seatNumber
        .toLowerCase()
        .includes(passengerSearch.toLowerCase()) ||
      passenger.ticketId.toLowerCase().includes(passengerSearch.toLowerCase())
  );

  const upcomingFlights = flights.filter(
    (flight) => new Date(flight.departureTime) > new Date()
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleFlightReportSubmission = async (flightId, reportData) => {
    if (!crewMember) return;

    try {
      await crewSpecificAPI.submitFlightReport(crewMember.crewID, {
        flightId: flightId,
        ...reportData,
      });

      // Refresh data after successful submission
      await loadCrewFlights(crewMember.crewID);
      await loadNotifications();

      // Could add a success notification here
    } catch (err) {
      console.error("Failed to submit flight report:", err);
      setError("Failed to submit flight report: " + err.message);
    }
  };

  if (loading && !crewMember) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">
            Loading crew dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error && !crewMember) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error Loading Dashboard</span>
          </div>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Plane className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">MY TRIP AIR</h1>
                <p className="text-sm text-gray-500">Crew Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setActiveTab("notifications")}
                  className="relative p-2 text-gray-400 hover:text-gray-500"
                >
                  <Bell className="h-6 w-6" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {crewMember?.name || "Loading..."}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Plane className="h-12 w-12 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Flights
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {flights.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="h-12 w-12 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {upcomingFlights.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Bell className="h-12 w-12 text-yellow-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {notifications.filter((n) => !n.read).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("flights")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "flights"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Plane className="h-4 w-4" />
                  <span>My Flights</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "notifications"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Flights Tab */}
            {activeTab === "flights" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Flight Assignments
                  </h2>
                  <button
                    onClick={() => loadCrewFlights(crewMember?.crewID)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plane className="h-4 w-4" />
                    )}
                    <span>Refresh</span>
                  </button>
                </div>

                {loading && flights.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {flights.length === 0 ? (
                      <div className="text-center py-12">
                        <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No flights assigned yet</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Contact your administrator to get flight assignments
                        </p>
                      </div>
                    ) : (
                      flights.map((flight) => (
                        <div
                          key={`${flight.flightID}-${
                            flight.assignmentID || Math.random()
                          }`}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {flight.flightNumber}
                                </h3>

                                {/* Flight Status */}
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(
                                    flight.status
                                  )}`}
                                >
                                  {getStatusIcon(flight.status)}
                                  <span>{flight.status}</span>
                                </div>

                                {/* Assignment Status */}
                                {flight.assignmentStatus && (
                                  <div
                                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                                      flight.assignmentStatus === "assigned"
                                        ? "bg-blue-100 text-blue-800"
                                        : flight.assignmentStatus ===
                                          "completed"
                                        ? "bg-green-100 text-green-800"
                                        : flight.assignmentStatus ===
                                          "cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    <span>
                                      Assignment: {flight.assignmentStatus}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {flight.departureAirport?.airportCode ||
                                      "N/A"}{" "}
                                    →{" "}
                                    {flight.arrivalAirport?.airportCode ||
                                      "N/A"}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {formatDateTime(flight.departureTime)}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {flight.availableSeats} seats available
                                  </span>
                                </div>
                              </div>

                              {/* Assignment Information */}
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                                  {flight.assignmentDate && (
                                    <div>
                                      <span className="font-medium">
                                        Assignment Date:{" "}
                                      </span>
                                      {formatDateTime(flight.assignmentDate)}
                                    </div>
                                  )}
                                  {flight.assignmentID && (
                                    <div>
                                      <span className="font-medium">
                                        Assignment ID:{" "}
                                      </span>
                                      {flight.assignmentID}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Show error if flight details couldn't be loaded */}
                              {flight._error && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                  <div className="flex items-center space-x-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span>{flight._error}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-500">Aircraft</p>
                              <p className="font-medium">
                                {flight.aircraft?.aircraftModel || "N/A"}
                              </p>
                              {flight.aircraft?.registration && (
                                <p className="text-xs text-gray-400">
                                  {flight.aircraft.registration}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Error</span>
                    </div>
                    <p className="mt-1 text-red-600">{error}</p>
                    <button
                      onClick={() => loadCrewFlights(crewMember?.crewID)}
                      className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Passengers Tab */}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Notifications
                  </h2>
                  <button
                    onClick={loadNotifications}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border ${
                          notification.read
                            ? "bg-white border-gray-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {notification.read ? (
                              <CheckCircle className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Bell className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1">
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
                              {formatDateTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrewDashboard;
