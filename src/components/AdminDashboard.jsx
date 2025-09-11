import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

const LOCAL_STORAGE_KEYS = {
  flights: "mytrip_flights",
  users: "mytrip_users",
  demandReports: "mytrip_demandReports",
};

const defaultFlights = [
  {
    flightId: "FL123",
    airline: "MY TRIP AIR",
    origin: "JED",
    destination: "DXB",
    departureTime: "2025-09-20T14:30:00Z",
    arrivalTime: "2025-09-20T16:45:00Z",
    status: "Scheduled",
    crew: ["Pilot A", "Co-Pilot B"],
  },
  {
    flightId: "FL456",
    airline: "MY TRIP AIR",
    origin: "RUH",
    destination: "CAI",
    departureTime: "2025-09-21T09:15:00Z",
    arrivalTime: "2025-09-21T11:30:00Z",
    status: "Scheduled",
    crew: ["Pilot C", "Attendant D"],
  },
  {
    flightId: "FL789",
    airline: "MY TRIP AIR",
    origin: "DXB",
    destination: "LHR",
    departureTime: "2025-09-22T22:00:00Z",
    arrivalTime: "2025-09-23T04:30:00Z",
    status: "Scheduled",
    crew: ["Pilot E", "Co-Pilot F", "Attendant G"],
  },
];

const defaultUsers = [
  {
    userId: 101,
    name: "Ahmed Ali",
    email: "ahmed@example.com",
    role: "Passenger",
    status: "active",
  },
  {
    userId: 102,
    name: "Sara Ahmed",
    email: "sara@example.com",
    role: "Crew",
    status: "active",
  },
  {
    userId: 103,
    name: "Mohammed Hassan",
    email: "mohammed@example.com",
    role: "Passenger",
    status: "suspended",
  },
  {
    userId: 104,
    name: "Fatima Omar",
    email: "fatima@example.com",
    role: "Admin",
    status: "active",
  },
];

const defaultDemandReports = [
  {
    route: "JED → LHR",
    demandLevel: "High",
    searchesWithoutDirectFlight: 348,
  },
  {
    route: "JED → DXB",
    demandLevel: "Medium",
    searchesWithoutDirectFlight: 120,
  },
  {
    route: "RUH → CAI",
    demandLevel: "Low",
    searchesWithoutDirectFlight: 45,
  },
  {
    route: "DXB → IST",
    demandLevel: "High",
    searchesWithoutDirectFlight: 267,
  },
];

const mockAPI = {
  async getFlights() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const flights =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.flights)) ||
      defaultFlights;
    return flights;
  },

  async createFlight(flightData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const flights =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.flights)) ||
      defaultFlights;
    const newFlight = {
      flightId: `FL${Date.now()}`,
      airline: "MY TRIP AIR",
      ...flightData,
      status: "Scheduled",
      crew: [],
    };
    flights.push(newFlight);
    localStorage.setItem(LOCAL_STORAGE_KEYS.flights, JSON.stringify(flights));
    return { flightId: newFlight.flightId, status: "Created" };
  },

  async updateFlight(flightId, flightData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const flights =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.flights)) ||
      defaultFlights;
    const index = flights.findIndex((f) => f.flightId === flightId);
    if (index !== -1) {
      flights[index] = { ...flights[index], ...flightData };
      localStorage.setItem(LOCAL_STORAGE_KEYS.flights, JSON.stringify(flights));
      return { status: "Updated" };
    }
    return { status: "Not Found" };
  },

  async deleteFlight(flightId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let flights =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.flights)) ||
      defaultFlights;
    flights = flights.filter((f) => f.flightId !== flightId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.flights, JSON.stringify(flights));
    return { status: "Cancelled" };
  },

  async getUsers() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.users)) ||
      defaultUsers;
    return users;
  },

  async createUser(userData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.users)) ||
      defaultUsers;
    const newUserId =
      users.length > 0 ? Math.max(...users.map((u) => u.userId)) + 1 : 101;
    const newUser = {
      userId: newUserId,
      status: "active",
      ...userData,
    };
    users.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_KEYS.users, JSON.stringify(users));
    return { userId: newUserId, status: "Created" };
  },

  async suspendUser(userId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.users)) ||
      defaultUsers;
    const index = users.findIndex((u) => u.userId === userId);
    if (index !== -1) {
      users[index].status = "suspended";
      localStorage.setItem(LOCAL_STORAGE_KEYS.users, JSON.stringify(users));
      return { status: "Suspended" };
    }
    return { status: "Not Found" };
  },

  async deleteUser(userId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let users =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.users)) ||
      defaultUsers;
    users = users.filter((u) => u.userId !== userId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.users, JSON.stringify(users));
    return { status: "Deleted" };
  },

  async assignCrew(flightId, crew) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const flights =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.flights)) ||
      defaultFlights;
    const index = flights.findIndex((f) => f.flightId === flightId);
    if (index !== -1) {
      flights[index].crew = crew;
      localStorage.setItem(LOCAL_STORAGE_KEYS.flights, JSON.stringify(flights));
      return { status: "Crew Assigned" };
    }
    return { status: "Not Found" };
  },

  async getDemandReports() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const reports =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.demandReports)) ||
      defaultDemandReports;
    return reports;
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("flights");
  const [flights, setFlights] = useState([]);
  const [users, setUsers] = useState([]);
  const [demandReports, setDemandReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Modal states
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [showEditFlightModal, setShowEditFlightModal] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

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

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [flightsData, usersData, reportsData] = await Promise.all([
        mockAPI.getFlights(),
        mockAPI.getUsers(),
        mockAPI.getDemandReports(),
      ]);
      setFlights(flightsData);
      setUsers(usersData);
      setDemandReports(reportsData);
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
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to log out?")) {
                navigate("/");
              }
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeSection === "flights" && "Flight Management"}
              {activeSection === "users" && "User Management"}
              {activeSection === "crew" && "Crew Assignment"}
              {activeSection === "reports" && "Demand Reports"}
            </h2>
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
                              {user.status === "active" && (
                                <button
                                  onClick={() => handleSuspendUser(user.userId)}
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  Suspend
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
    </div>
  );
};

export default AdminDashboard;
