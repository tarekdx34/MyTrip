import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mockAPI from "../services/mockAPI";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Plane,
  Users,
  UserCheck,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Search,
  Calendar,
  Clock,
  RotateCcw,
  Building,
  CreditCard,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("flights");
  const [flights, setFlights] = useState([]);
  const [users, setUsers] = useState([]);
  const [demandReports, setDemandReports] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);
  const [payments, setPayments] = useState([]);
  const [flightStats, setFlightStats] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [revenueReports, setRevenueReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Modal states
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [showEditFlightModal, setShowEditFlightModal] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showAddAircraftModal, setShowAddAircraftModal] = useState(false);
  const [showEditAircraftModal, setShowEditAircraftModal] = useState(false);
  const [showAddAirportModal, setShowAddAirportModal] = useState(false);
  const [showEditAirportModal, setShowEditAirportModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [selectedAirport, setSelectedAirport] = useState(null);

  // Form states
  const [flightForm, setFlightForm] = useState({
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
  });
  const [crewForm, setCrewForm] = useState({
    flightId: "",
    crew: "",
  });
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [aircraftForm, setAircraftForm] = useState({
    aircraftId: "",
    model: "",
    capacity: "",
  });
  const [airportForm, setAirportForm] = useState({
    code: "",
    name: "",
    city: "",
    country: "",
  });

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        flightsData,
        usersData,
        reportsData,
        aircraftsData,
        airportsData,
        paymentsData,
        flightStatsData,
        userActivityData,
        revenueReportsData,
      ] = await Promise.all([
        mockAPI.getFlights(),
        mockAPI.getUsers(),
        mockAPI.getDemandReports(),
        mockAPI.getAircrafts(),
        mockAPI.getAirports(),
        mockAPI.getPayments(),
        mockAPI.getFlightStats(),
        mockAPI.getUserActivity(),
        mockAPI.getRevenueReports(),
      ]);
      setFlights(flightsData);
      setUsers(usersData);
      setDemandReports(reportsData);
      setAircrafts(aircraftsData);
      setAirports(airportsData);
      setPayments(paymentsData);
      setFlightStats(flightStatsData);
      setUserActivity(userActivityData);
      setRevenueReports(revenueReportsData);
    } catch (error) {
      showAlert("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Flight Management
  const handleAddFlight = async () => {
    if (
      !flightForm.origin ||
      !flightForm.destination ||
      !flightForm.departureTime ||
      !flightForm.arrivalTime
    ) {
      showAlert("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await mockAPI.createFlight(flightForm);
      showAlert(`Flight ${result.flightId} created successfully`);
      setShowAddFlightModal(false);
      setFlightForm({
        origin: "",
        destination: "",
        departureTime: "",
        arrivalTime: "",
      });
      loadAllData();
    } catch (error) {
      showAlert("Failed to create flight", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFlight = async () => {
    if (!selectedFlight) return;

    setLoading(true);
    try {
      await mockAPI.updateFlight(selectedFlight.flightId, flightForm);
      showAlert("Flight updated successfully");
      setShowEditFlightModal(false);
      setSelectedFlight(null);
      setFlightForm({
        origin: "",
        destination: "",
        departureTime: "",
        arrivalTime: "",
      });
      loadAllData();
    } catch (error) {
      showAlert("Failed to update flight", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlight = async (flightId) => {
    if (!confirm("Are you sure you want to cancel this flight?")) return;

    setLoading(true);
    try {
      await mockAPI.deleteFlight(flightId);
      showAlert("Flight cancelled successfully");
      loadAllData();
    } catch (error) {
      showAlert("Failed to cancel flight", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (flight) => {
    setSelectedFlight(flight);
    setFlightForm({
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime.slice(0, 16),
      arrivalTime: flight.arrivalTime.slice(0, 16),
    });
    setShowEditFlightModal(true);
  };

  // User Management
  const handleCreateUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.role) {
      showAlert("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await mockAPI.createUser(userForm);
      showAlert(`User ${result.userId} created successfully`);
      setShowCreateUserModal(false);
      setUserForm({
        name: "",
        email: "",
        role: "",
      });
      loadAllData();
    } catch (error) {
      showAlert("Failed to create user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    if (!confirm("Are you sure you want to suspend this user?")) return;

    setLoading(true);
    try {
      await mockAPI.suspendUser(userId);
      showAlert("User suspended successfully");
      loadAllData();
    } catch (error) {
      showAlert("Failed to suspend user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      await mockAPI.deleteUser(userId);
      showAlert("User deleted successfully");
      loadAllData();
    } catch (error) {
      showAlert("Failed to delete user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreUser = async (userId) => {
    if (!confirm("Are you sure you want to restore this user?")) return;

    setLoading(true);
    try {
      await mockAPI.restoreUser(userId);
      showAlert("User restored successfully");
      loadAllData();
    } catch (error) {
      showAlert("Failed to restore user", "error");
    } finally {
      setLoading(false);
    }
  };

  // Crew Assignment
  const handleAssignCrew = async () => {
    if (!crewForm.flightId || !crewForm.crew) {
      showAlert("Please select a flight and enter crew names", "error");
      return;
    }

    const crewArray = crewForm.crew.split(",").map((name) => name.trim());
    setLoading(true);
    try {
      await mockAPI.assignCrew(crewForm.flightId, crewArray);
      showAlert("Crew assigned successfully");
      setShowCrewModal(false);
      setCrewForm({ flightId: "", crew: "" });
      loadAllData();
    } catch (error) {
      showAlert("Failed to assign crew", "error");
    } finally {
      setLoading(false);
    }
  };

  // Aircraft Management
  const handleAddAircraft = () => {
    if (
      !aircraftForm.aircraftId ||
      !aircraftForm.model ||
      !aircraftForm.capacity
    ) {
      showAlert("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      // Get existing aircrafts from localStorage
      const storedAircrafts =
        JSON.parse(localStorage.getItem("aircrafts")) || [];
      // Add new aircraft
      const newAircraft = {
        aircraftId: aircraftForm.aircraftId,
        model: aircraftForm.model,
        capacity: aircraftForm.capacity,
        status: "Active",
      };
      const updatedAircrafts = [...storedAircrafts, newAircraft];
      // Save back to localStorage
      localStorage.setItem("aircrafts", JSON.stringify(updatedAircrafts));
      // Update state
      setAircrafts(updatedAircrafts);
      showAlert(`Aircraft ${newAircraft.aircraftId} added successfully`);
      setShowAddAircraftModal(false);
      setAircraftForm({
        aircraftId: "",
        model: "",
        capacity: "",
      });
    } catch (error) {
      showAlert("Failed to add aircraft", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAircraft = () => {
    if (!selectedAircraft) return;

    setLoading(true);
    try {
      // Get existing aircrafts from localStorage
      const storedAircrafts =
        JSON.parse(localStorage.getItem("aircrafts")) || [];
      // Update the selected aircraft
      const updatedAircrafts = storedAircrafts.map((aircraft) =>
        aircraft.aircraftId === selectedAircraft.aircraftId
          ? {
              ...aircraft,
              model: aircraftForm.model,
              capacity: aircraftForm.capacity,
            }
          : aircraft
      );
      // Save back to localStorage
      localStorage.setItem("aircrafts", JSON.stringify(updatedAircrafts));
      // Update state
      setAircrafts(updatedAircrafts);
      showAlert("Aircraft updated successfully");
      setShowEditAircraftModal(false);
      setSelectedAircraft(null);
      setAircraftForm({
        aircraftId: "",
        model: "",
        capacity: "",
      });
    } catch (error) {
      showAlert("Failed to update aircraft", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAircraft = (aircraftId) => {
    if (!confirm("Are you sure you want to delete this aircraft?")) return;

    setLoading(true);
    try {
      // Get existing aircrafts from localStorage
      const storedAircrafts =
        JSON.parse(localStorage.getItem("aircrafts")) || [];
      // Remove the aircraft
      const updatedAircrafts = storedAircrafts.filter(
        (aircraft) => aircraft.aircraftId !== aircraftId
      );
      // Save back to localStorage
      localStorage.setItem("aircrafts", JSON.stringify(updatedAircrafts));
      // Update state
      setAircrafts(updatedAircrafts);
      showAlert("Aircraft deleted successfully");
    } catch (error) {
      showAlert("Failed to delete aircraft", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditAircraftModal = (aircraft) => {
    setSelectedAircraft(aircraft);
    setAircraftForm({
      aircraftId: aircraft.aircraftId,
      model: aircraft.model,
      capacity: aircraft.capacity,
    });
    setShowEditAircraftModal(true);
  };

  // Airport Management
  const handleAddAirport = async () => {
    if (
      !airportForm.code ||
      !airportForm.name ||
      !airportForm.city ||
      !airportForm.country
    ) {
      showAlert("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await mockAPI.createAirport(airportForm);
      showAlert(`Airport ${result.code} created successfully`);
      setShowAddAirportModal(false);
      setAirportForm({
        code: "",
        name: "",
        city: "",
        country: "",
      });
      loadAllData();
    } catch (error) {
      showAlert("Failed to create airport", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAirport = () => {
    if (!selectedAirport) return;

    setLoading(true);
    try {
      // Get existing airports from localStorage
      const storedAirports = JSON.parse(localStorage.getItem("airports")) || [];
      // Update the selected airport
      const updatedAirports = storedAirports.map((airport) =>
        airport.code === selectedAirport.code
          ? {
              ...airport,
              name: airportForm.name,
              city: airportForm.city,
              country: airportForm.country,
            }
          : airport
      );
      // Save back to localStorage
      localStorage.setItem("airports", JSON.stringify(updatedAirports));
      // Update state
      setAirports(updatedAirports);
      showAlert("Airport updated successfully");
      setShowEditAirportModal(false);
      setSelectedAirport(null);
      setAirportForm({
        code: "",
        name: "",
        city: "",
        country: "",
      });
    } catch (error) {
      showAlert("Failed to update airport", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAirport = (airportCode) => {
    if (!confirm("Are you sure you want to delete this airport?")) return;

    setLoading(true);
    try {
      // Get existing airports from localStorage
      const storedAirports = JSON.parse(localStorage.getItem("airports")) || [];
      // Remove the airport
      const updatedAirports = storedAirports.filter(
        (airport) => airport.code !== airportCode
      );
      // Save back to localStorage
      localStorage.setItem("airports", JSON.stringify(updatedAirports));
      // Update state
      setAirports(updatedAirports);
      showAlert("Airport deleted successfully");
    } catch (error) {
      showAlert("Failed to delete airport", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditAirportModal = (airport) => {
    setSelectedAirport(airport);
    setAirportForm({
      code: airport.code,
      name: airport.name,
      city: airport.city,
      country: airport.country,
    });
    setShowEditAirportModal(true);
  };

  const getDemandLevelColor = (level) => {
    switch (level) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Plane className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">MY TRIP Admin</h1>
            </button>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveSection("flights")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "flights"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Plane className="h-5 w-5" />
              <span>Manage Flights</span>
            </button>

            <button
              onClick={() => setActiveSection("users")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "users"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </button>

            <button
              onClick={() => setActiveSection("crew")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "crew"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <UserCheck className="h-5 w-5" />
              <span>Crew Assignment</span>
            </button>

            <button
              onClick={() => setActiveSection("reports")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "reports"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveSection("aircrafts")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "aircrafts"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Plane className="h-5 w-5" />
              <span>Manage Aircrafts</span>
            </button>

            <button
              onClick={() => setActiveSection("airports")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "airports"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Building className="h-5 w-5" />
              <span>Manage Airports</span>
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
              <span>Payment Management</span>
            </button>

            <button
              onClick={() => setActiveSection("statistics")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "statistics"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Flight Statistics</span>
            </button>

            <button
              onClick={() => setActiveSection("activity")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "activity"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>User Activity</span>
            </button>

            <button
              onClick={() => setActiveSection("revenue")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "revenue"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Revenue Reports</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeSection === "flights" && "Flight Management"}
              {activeSection === "users" && "User Management"}
              {activeSection === "crew" && "Crew Assignment"}
              {activeSection === "reports" && "Demand Reports"}
              {activeSection === "aircrafts" && "Aircraft Management"}
              {activeSection === "airports" && "Airport Management"}
              {activeSection === "payments" && "Payment Management"}
              {activeSection === "statistics" && "Flight Statistics"}
              {activeSection === "activity" && "User Activity"}
              {activeSection === "revenue" && "Revenue Reports"}
            </h2>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to log out?")) {
                  navigate("/");
                }
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mx-6 mt-4">
            <div
              className={`p-4 rounded-lg flex items-center space-x-2 ${
                alert.type === "error"
                  ? "bg-red-50 border border-red-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              {alert.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <span
                className={
                  alert.type === "error" ? "text-red-700" : "text-green-700"
                }
              >
                {alert.message}
              </span>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Flights
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {flights.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Crew Assignments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {flights.reduce(
                    (total, flight) => total + flight.crew.length,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6">
          {/* Flights Section */}
          {activeSection === "flights" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Flight Management
                </h3>
                <button
                  onClick={() => setShowAddFlightModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Flight</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">
                        Loading flights...
                      </span>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Flight ID
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
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {flights.map((flight) => (
                          <tr
                            key={flight.flightId}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {flight.flightId}
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
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {flight.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => openEditModal(flight)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteFlight(flight.flightId)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
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

          {/* Users Section */}
          {activeSection === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Management
                </h3>
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create User</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">
                        Loading users...
                      </span>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.userId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {user.userId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {user.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {user.role}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              {user.status === "active" ? (
                                <button
                                  onClick={() => handleSuspendUser(user.userId)}
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRestoreUser(user.userId)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(user.userId)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
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

          {/* Crew Assignment Section */}
          {activeSection === "crew" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Crew Assignment
                </h3>
                <button
                  onClick={() => setShowCrewModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Assign Crew</span>
                </button>
              </div>

              <div className="grid gap-6">
                {flights.map((flight) => (
                  <div
                    key={flight.flightId}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Plane className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {flight.flightId}
                          </div>
                          <div className="text-sm text-gray-500">
                            {flight.origin} → {flight.destination}
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {flight.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Assigned Crew:
                      </h4>
                      {flight.crew.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {flight.crew.map((crewMember, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                            >
                              {crewMember}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No crew assigned
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Section */}
          {activeSection === "reports" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Demand Reports
              </h3>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">
                        Loading reports...
                      </span>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Route
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Demand Level
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Searches Without Direct Flight
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {demandReports.map((report, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {report.route}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDemandLevelColor(
                                  report.demandLevel
                                )}`}
                              >
                                {report.demandLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {report.searchesWithoutDirectFlight}
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

          {/* Aircrafts Section */}
          {activeSection === "aircrafts" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Aircraft Management
                </h3>
                <button
                  onClick={() => setShowAddAircraftModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Aircraft</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">
                        Loading aircrafts...
                      </span>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aircraft ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Model
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Capacity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {aircrafts.map((aircraft) => (
                          <tr
                            key={aircraft.aircraftId}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {aircraft.aircraftId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {aircraft.model}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {aircraft.capacity}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {aircraft.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => openEditAircraftModal(aircraft)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteAircraft(aircraft.aircraftId)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
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

          {/* Airports Section */}
          {activeSection === "airports" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Airport Management
                </h3>
                <button
                  onClick={() => setShowAddAirportModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Airport</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">
                        Loading airports...
                      </span>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Airport Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            City
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Country
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {airports.map((airport) => (
                          <tr key={airport.code} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {airport.code}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {airport.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {airport.city}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {airport.country}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => openEditAirportModal(airport)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteAirport(airport.code)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
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

          {/* Payments Section */}
          {activeSection === "payments" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Management
              </h3>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">
                        Loading payments...
                      </span>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Booking ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment) => (
                          <tr
                            key={payment.paymentId}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {payment.paymentId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {payment.bookingId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                ${payment.amount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {payment.method}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {payment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDateTime(payment.date)}
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

          {/* Statistics Section */}
          {activeSection === "statistics" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Flight Statistics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Flight Performance
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={flightStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="flights" fill="#3B82F6" />
                      <Bar dataKey="onTime" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Passenger Load Factor
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={flightStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="loadFactor"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Activity Section */}
          {activeSection === "activity" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                User Activity
              </h3>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">
                        Loading activity...
                      </span>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userActivity.map((activity, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {activity.userId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {activity.action}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {activity.details}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDateTime(activity.timestamp)}
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

          {/* Revenue Section */}
          {activeSection === "revenue" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Reports
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Monthly Revenue
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueReports}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10B981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Revenue Breakdown
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueReports}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="ticketSales" fill="#3B82F6" />
                      <Bar dataKey="ancillary" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Flight Modal */}
      {showAddFlightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Flight
              </h3>
              <button
                onClick={() => setShowAddFlightModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin
                </label>
                <input
                  type="text"
                  value={flightForm.origin}
                  onChange={(e) =>
                    setFlightForm({ ...flightForm, origin: e.target.value })
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
                  value={flightForm.destination}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      destination: e.target.value,
                    })
                  }
                  placeholder="e.g., DXB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  value={flightForm.departureTime}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      departureTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Time
                </label>
                <input
                  type="datetime-local"
                  value={flightForm.arrivalTime}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      arrivalTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddFlightModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFlight}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </div>
                  ) : (
                    "Add Flight"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Flight Modal */}
      {showEditFlightModal && selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Flight
              </h3>
              <button
                onClick={() => setShowEditFlightModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin
                </label>
                <input
                  type="text"
                  value={flightForm.origin}
                  onChange={(e) =>
                    setFlightForm({ ...flightForm, origin: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={flightForm.destination}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      destination: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  value={flightForm.departureTime}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      departureTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Time
                </label>
                <input
                  type="datetime-local"
                  value={flightForm.arrivalTime}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      arrivalTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditFlightModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFlight}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </div>
                  ) : (
                    "Update Flight"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crew Assignment Modal */}
      {showCrewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Assign Crew
              </h3>
              <button
                onClick={() => setShowCrewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Flight
                </label>
                <select
                  value={crewForm.flightId}
                  onChange={(e) =>
                    setCrewForm({ ...crewForm, flightId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a flight...</option>
                  {flights.map((flight) => (
                    <option key={flight.flightId} value={flight.flightId}>
                      {flight.flightId} - {flight.origin} → {flight.destination}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crew Members
                </label>
                <textarea
                  value={crewForm.crew}
                  onChange={(e) =>
                    setCrewForm({ ...crewForm, crew: e.target.value })
                  }
                  placeholder="Enter crew names separated by commas (e.g., Pilot John, Co-Pilot Jane, Attendant Bob)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCrewModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignCrew}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Assigning...
                    </div>
                  ) : (
                    "Assign Crew"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New User
              </h3>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  placeholder="e.g., john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select role...</option>
                  <option value="Passenger">Passenger</option>
                  <option value="Crew">Crew</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateUserModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </div>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Aircraft Modal */}
      {showAddAircraftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Aircraft
              </h3>
              <button
                onClick={() => setShowAddAircraftModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aircraft ID
                </label>
                <input
                  type="text"
                  value={aircraftForm.aircraftId}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      aircraftId: e.target.value,
                    })
                  }
                  placeholder="e.g., AC001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={aircraftForm.model}
                  onChange={(e) =>
                    setAircraftForm({ ...aircraftForm, model: e.target.value })
                  }
                  placeholder="e.g., Boeing 737"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  value={aircraftForm.capacity}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      capacity: e.target.value,
                    })
                  }
                  placeholder="e.g., 150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddAircraftModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAircraft}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </div>
                  ) : (
                    "Add Aircraft"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Aircraft Modal */}
      {showEditAircraftModal && selectedAircraft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Aircraft
              </h3>
              <button
                onClick={() => setShowEditAircraftModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aircraft ID
                </label>
                <input
                  type="text"
                  value={aircraftForm.aircraftId}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      aircraftId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={aircraftForm.model}
                  onChange={(e) =>
                    setAircraftForm({ ...aircraftForm, model: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  value={aircraftForm.capacity}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      capacity: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditAircraftModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditAircraft}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </div>
                  ) : (
                    "Update Aircraft"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Airport Modal */}
      {showAddAirportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Airport
              </h3>
              <button
                onClick={() => setShowAddAirportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Airport Code
                </label>
                <input
                  type="text"
                  value={airportForm.code}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, code: e.target.value })
                  }
                  placeholder="e.g., JED"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={airportForm.name}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, name: e.target.value })
                  }
                  placeholder="e.g., King Abdulaziz International Airport"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={airportForm.city}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, city: e.target.value })
                  }
                  placeholder="e.g., Jeddah"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={airportForm.country}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, country: e.target.value })
                  }
                  placeholder="e.g., Saudi Arabia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddAirportModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAirport}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </div>
                  ) : (
                    "Add Airport"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Airport Modal */}
      {showEditAirportModal && selectedAirport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Airport
              </h3>
              <button
                onClick={() => setShowEditAirportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Airport Code
                </label>
                <input
                  type="text"
                  value={airportForm.code}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, code: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={airportForm.name}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={airportForm.city}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={airportForm.country}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditAirportModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditAirport}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </div>
                  ) : (
                    "Update Airport"
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

export default AdminDashboard;
