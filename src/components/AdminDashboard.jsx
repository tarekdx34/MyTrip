import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  authAPI, // Added missing import
  crewAssignmentAPI,
} from "../services/api";
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
import FlightSearch from "./FlightSearch"; // adjust path as needed
import Reports from "./Reports";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("flights");
  const [flights, setFlights] = useState([]);
  const [users, setUsers] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [crew, setCrew] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [frontDesk, setFrontDesk] = useState([]);
  const [crewAssignments, setCrewAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filteredFlights, setFilteredFlights] = useState([]);

  // Modal states
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [showEditFlightModal, setShowEditFlightModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showAddAircraftModal, setShowAddAircraftModal] = useState(false);
  const [showEditAircraftModal, setShowEditAircraftModal] = useState(false);
  const [showAddAirportModal, setShowAddAirportModal] = useState(false);
  const [showEditAirportModal, setShowEditAirportModal] = useState(false);
  const [showCrewAssignmentModal, setShowCrewAssignmentModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [selectedAirport, setSelectedAirport] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Form states
  const [flightForm, setFlightForm] = useState({
    flightNumber: "",
    aircraftID: "",
    departureAirportId: "",
    arrivalAirportId: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    price: "",
    availableSeats: "",
    status: "scheduled",
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "defaultpass123",
    userType: "passenger",
    passportNumber: "",
    nationality: "",
    dateOfBirth: "",
    employeeNumber: "",
    accessLevel: "",
    position: "",
    licenseNumber: "",
    department: "",
  });

  const [aircraftForm, setAircraftForm] = useState({
    aircraftModel: "",
    manufacturer: "",
    registration: "",
    capacity: "",
    airportId: "",
  });

  const [airportForm, setAirportForm] = useState({
    airportCode: "",
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
        aircraftsData,
        airportsData,
        bookingsData,
        passengersData,
        crewData,
        adminsData,
        frontDeskData,
        crewAssignmentsData, // Load actual crew assignments
      ] = await Promise.all([
        flightAPI.getAllFlights().catch(() => []),
        userAPI.getAllUsers().catch(() => []),
        aircraftAPI.getAllAircraft().catch(() => []),
        airportAPI.getAllAirports().catch(() => []),
        bookingAPI.getAllBookings().catch(() => []),
        passengerAPI.getAllPassengers().catch(() => []),
        crewAPI.getAllCrew().catch(() => []),
        adminAPI.getAllAdmins().catch(() => []),
        frontDeskAPI.getAllFrontDesk().catch(() => []),
        crewAssignmentAPI.getAllAssignments().catch(() => []), // Use actual API
      ]);

      setFlights(flightsData);
      setUsers(usersData);
      setAircrafts(aircraftsData);
      setAirports(airportsData);
      setBookings(bookingsData);
      setPassengers(passengersData);
      setCrew(crewData);
      setAdmins(adminsData);
      setFrontDesk(frontDeskData);
      setCrewAssignments(crewAssignmentsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      showAlert("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };
  console.log(
    "Flight statuses:",
    flights.map((f) => ({
      flightNumber: f.flightNumber,
      status: f.status,
    }))
  );
  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Flight Management
  const handleAddFlight = async () => {
    if (
      !flightForm.flightNumber ||
      !flightForm.aircraftID ||
      !flightForm.departureAirportId ||
      !flightForm.arrivalAirportId ||
      !flightForm.departureTime ||
      !flightForm.arrivalTime
    ) {
      showAlert("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const selectedAircraft = aircrafts.find(
        (a) => a.aircraftID === parseInt(flightForm.aircraftID)
      );
      const departureAirport = airports.find(
        (a) => a.airportID === parseInt(flightForm.departureAirportId)
      );
      const arrivalAirport = airports.find(
        (a) => a.airportID === parseInt(flightForm.arrivalAirportId)
      );

      const newFlight = {
        flightNumber: flightForm.flightNumber,
        aircraft: selectedAircraft,
        departureAirport: departureAirport,
        arrivalAirport: arrivalAirport,
        departureTime: flightForm.departureTime,
        arrivalTime: flightForm.arrivalTime,
        duration: parseInt(flightForm.duration) || 120,
        price: parseFloat(flightForm.price) || 500,
        availableSeats:
          parseInt(flightForm.availableSeats) ||
          selectedAircraft?.capacity ||
          150,
        status: flightForm.status,
      };

      const result = await flightAPI.createFlight(newFlight);
      showAlert(`Flight ${result.flightNumber} created successfully`);
      setShowAddFlightModal(false);
      resetFlightForm();
      loadAllData();
    } catch (error) {
      console.error("Failed to create flight:", error);
      showAlert(error.message || "Failed to create flight", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFlight = async () => {
    if (!selectedFlight) return;
    setLoading(true);
    try {
      const updatedFlight = {
        flightNumber: flightForm.flightNumber,
        departureTime: flightForm.departureTime,
        arrivalTime: flightForm.arrivalTime,
        duration: parseInt(flightForm.duration),
        price: parseFloat(flightForm.price),
        availableSeats: parseInt(flightForm.availableSeats),
        status: flightForm.status, // Don't convert to uppercase
        aircraftID: selectedFlight.aircraft?.aircraftID,
        departureAirportID: selectedFlight.departureAirport?.airportID,
        arrivalAirportID: selectedFlight.arrivalAirport?.airportID,
      };

      await flightAPI.updateFlight(selectedFlight.flightID, updatedFlight);
      showAlert("Flight updated successfully");
      setShowEditFlightModal(false);
      setSelectedFlight(null);
      resetFlightForm();
      loadAllData();
    } catch (error) {
      console.error("Failed to update flight:", error);
      showAlert(error.message || "Failed to update flight", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlight = async (flightId) => {
    if (!confirm("Are you sure you want to delete this flight?")) return;

    setLoading(true);
    try {
      await flightAPI.deleteFlight(flightId);
      showAlert("Flight deleted successfully");
      loadAllData();
    } catch (error) {
      console.error("Failed to delete flight:", error);
      showAlert(error.message || "Failed to delete flight", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFlightStatus = async (flightId, newStatus) => {
    setLoading(true);
    try {
      await flightAPI.updateFlightStatus(flightId, newStatus);
      showAlert(`Flight status updated to ${newStatus}`);
      loadAllData();
    } catch (error) {
      console.error("Failed to update flight status:", error);
      showAlert(error.message || "Failed to update flight status", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditFlightModal = (flight) => {
    setSelectedFlight(flight);
    setFlightForm({
      flightNumber: flight.flightNumber,
      aircraftID: flight.aircraft?.aircraftID || "",
      departureAirportId: flight.departureAirport?.airportID || "",
      arrivalAirportId: flight.arrivalAirport?.airportID || "",
      departureTime: flight.departureTime
        ? new Date(flight.departureTime).toISOString().slice(0, 16)
        : "",
      arrivalTime: flight.arrivalTime
        ? new Date(flight.arrivalTime).toISOString().slice(0, 16)
        : "",
      duration: flight.duration || "",
      price: flight.price || "",
      availableSeats: flight.availableSeats || "",
      status: flight.status?.toUpperCase() || "SCHEDULED",
    });
    setShowEditFlightModal(true);
  };

  const resetFlightForm = () => {
    setFlightForm({
      flightNumber: "",
      aircraftID: "",
      departureAirportId: "",
      arrivalAirportId: "",
      departureTime: "",
      arrivalTime: "",
      duration: "",
      price: "",
      availableSeats: "",
      status: "scheduled",
    });
  };

  // User Management
  const handleCreateUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.userType) {
      showAlert("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      // Check email availability first
      const isEmailAvailable = await userAPI.checkEmailAvailable(
        userForm.email
      );
      if (!isEmailAvailable) {
        showAlert("Email address is already in use", "error");
        setLoading(false);
        return;
      }

      const signupData = {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        userType: userForm.userType,
      };

      // Add type-specific fields
      if (userForm.userType === "passenger") {
        if (userForm.passportNumber)
          signupData.passportNumber = userForm.passportNumber;
        if (userForm.nationality) signupData.nationality = userForm.nationality;
        if (userForm.dateOfBirth) signupData.dateOfBirth = userForm.dateOfBirth;
      } else if (userForm.userType === "admin") {
        if (userForm.employeeNumber)
          signupData.employeeNumber = userForm.employeeNumber;
        if (userForm.accessLevel) signupData.accessLevel = userForm.accessLevel;
      } else if (userForm.userType === "crew") {
        if (userForm.employeeNumber)
          signupData.employeeNumber = userForm.employeeNumber;
        if (userForm.position) signupData.position = userForm.position;
        if (userForm.licenseNumber)
          signupData.licenseNumber = userForm.licenseNumber;
      } else if (userForm.userType === "front_desk") {
        if (userForm.employeeNumber)
          signupData.employeeNumber = userForm.employeeNumber;
        if (userForm.department) signupData.department = userForm.department;
      }

      await authAPI.signup(signupData);
      showAlert("User created successfully");
      setShowCreateUserModal(false);
      resetUserForm();
      loadAllData();
    } catch (error) {
      console.error("Failed to create user:", error);
      showAlert(error.message || "Failed to create user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      await userAPI.deleteUser(userId);
      showAlert("User deleted successfully");
      loadAllData();
    } catch (error) {
      console.error("Failed to delete user:", error);
      showAlert(error.message || "Failed to delete user", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetUserForm = () => {
    setUserForm({
      name: "",
      email: "",
      password: "defaultpass123",
      userType: "passenger",
      passportNumber: "",
      nationality: "",
      dateOfBirth: "",
      employeeNumber: "",
      accessLevel: "",
      position: "",
      licenseNumber: "",
      department: "",
    });
  };

  // Aircraft Management
  const handleAddAircraft = async () => {
    if (
      !aircraftForm.aircraftModel ||
      !aircraftForm.manufacturer ||
      !aircraftForm.registration ||
      !aircraftForm.capacity
    ) {
      showAlert("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const newAircraft = {
        aircraftModel: aircraftForm.aircraftModel,
        manufacturer: aircraftForm.manufacturer,
        registration: aircraftForm.registration,
        capacity: parseInt(aircraftForm.capacity),
        airport: aircraftForm.airportId
          ? airports.find(
              (a) => a.airportID === parseInt(aircraftForm.airportId)
            )
          : null,
      };

      const result = await aircraftAPI.createAircraft(newAircraft);
      showAlert(`Aircraft ${result.registration} added successfully`);
      setShowAddAircraftModal(false);
      resetAircraftForm();
      loadAllData();
    } catch (error) {
      console.error("Failed to add aircraft:", error);
      showAlert(error.message || "Failed to add aircraft", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAircraft = async () => {
    if (!selectedAircraft) return;

    setLoading(true);
    try {
      const updatedAircraft = {
        aircraftModel: aircraftForm.aircraftModel,
        manufacturer: aircraftForm.manufacturer,
        registration: aircraftForm.registration,
        capacity: parseInt(aircraftForm.capacity),
      };

      await aircraftAPI.updateAircraft(
        selectedAircraft.aircraftID,
        updatedAircraft
      );

      // If airport assignment changed, handle separately
      if (
        aircraftForm.airportId &&
        aircraftForm.airportId !== selectedAircraft.airport?.airportID
      ) {
        await aircraftAPI.assignAircraftToAirport(
          selectedAircraft.aircraftID,
          parseInt(aircraftForm.airportId)
        );
      }

      showAlert("Aircraft updated successfully");
      setShowEditAircraftModal(false);
      setSelectedAircraft(null);
      resetAircraftForm();
      loadAllData();
    } catch (error) {
      console.error("Failed to update aircraft:", error);
      showAlert(error.message || "Failed to update aircraft", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAircraft = async (aircraftId) => {
    if (!confirm("Are you sure you want to delete this aircraft?")) return;

    setLoading(true);
    try {
      await aircraftAPI.deleteAircraft(aircraftId);
      showAlert("Aircraft deleted successfully");
      loadAllData();
    } catch (error) {
      console.error("Failed to delete aircraft:", error);
      showAlert(error.message || "Failed to delete aircraft", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditAircraftModal = (aircraft) => {
    setSelectedAircraft(aircraft);
    setAircraftForm({
      aircraftModel: aircraft.aircraftModel,
      manufacturer: aircraft.manufacturer,
      registration: aircraft.registration,
      capacity: aircraft.capacity.toString(),
      airportId: aircraft.airport?.airportID || "",
    });
    setShowEditAircraftModal(true);
  };

  const resetAircraftForm = () => {
    setAircraftForm({
      aircraftModel: "",
      manufacturer: "",
      registration: "",
      capacity: "",
      airportId: "",
    });
  };

  // Airport Management
  const handleAddAirport = async () => {
    if (
      !airportForm.airportCode ||
      !airportForm.name ||
      !airportForm.city ||
      !airportForm.country
    ) {
      showAlert("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const newAirport = {
        airportCode: airportForm.airportCode.toUpperCase(),
        name: airportForm.name,
        city: airportForm.city,
        country: airportForm.country,
      };

      const result = await airportAPI.createAirport(newAirport);
      showAlert(`Airport ${result.airportCode} created successfully`);
      setShowAddAirportModal(false);
      resetAirportForm();
      loadAllData();
    } catch (error) {
      console.error("Failed to create airport:", error);
      showAlert(error.message || "Failed to create airport", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAirport = async () => {
    if (!selectedAirport) return;

    setLoading(true);
    try {
      const updatedAirport = {
        name: airportForm.name,
        city: airportForm.city,
        country: airportForm.country,
      };

      await airportAPI.updateAirport(selectedAirport.airportID, updatedAirport);
      showAlert("Airport updated successfully");
      setShowEditAirportModal(false);
      setSelectedAirport(null);
      resetAirportForm();
      loadAllData();
    } catch (error) {
      console.error("Failed to update airport:", error);
      showAlert(error.message || "Failed to update airport", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAirport = async (airportId) => {
    if (!confirm("Are you sure you want to delete this airport?")) return;

    setLoading(true);
    try {
      await airportAPI.deleteAirport(airportId);
      showAlert("Airport deleted successfully");
      loadAllData();
    } catch (error) {
      console.error("Failed to delete airport:", error);
      showAlert(error.message || "Failed to delete airport", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditAirportModal = (airport) => {
    setSelectedAirport(airport);
    setAirportForm({
      airportCode: airport.airportCode,
      name: airport.name,
      city: airport.city,
      country: airport.country,
    });
    setShowEditAirportModal(true);
  };

  const resetAirportForm = () => {
    setAirportForm({
      airportCode: "",
      name: "",
      city: "",
      country: "",
    });
  };

  // Crew Assignment Management

  // 1. Fetch crew data with user information when opening assignment modal

  // Get crew data for display in assignment modal
  const getAvailableCrewForAssignment = () => {
    // Use the nested user data structure from the crew API response
    return crew
      .map((crewMember) => {
        // The user data is nested within the crew record
        const userData = crewMember.user;

        return {
          crewID: crewMember.crewID, // This is what we'll send to API
          userID: userData?.userID || crewMember.userID,
          position: crewMember.position,
          employeeNumber: crewMember.employeeNumber,
          licenseNumber: crewMember.licenseNumber,
          // User data for display (from nested user object)
          name: userData?.name || `Crew Member ${crewMember.crewID}`,
          email: userData?.email || "Email not available",
          hasValidUserData: !!userData,
        };
      })
      .filter((crew) => crew.hasValidUserData); // Only show crew with valid user data
  };

  const handleAssignCrew = async () => {
    setLoading(true);
    try {
      const currentUserId = localStorage.getItem("userId");
      let assignedByAdminId = null;

      // Get admin ID if available
      if (currentUserId) {
        try {
          const currentAdmin = await adminAPI.getAdminByUserId(
            parseInt(currentUserId)
          );
          assignedByAdminId = currentAdmin.adminID;
        } catch (error) {
          console.warn("Could not find admin record");
        }
      }

      // Create assignments using crewID and flightID
      const assignmentPromises = crewAssignmentForm.crewMembers.map(
        async (crewId) => {
          const assignmentData = {
            flightID: parseInt(crewAssignmentForm.flightId), // From flight table
            crewID: parseInt(crewId), // From crew table - this is what API expects
            assignmentDate: new Date().toISOString(),
            assignedBy: assignedByAdminId,
            status: "assigned",
          };

          return await crewAssignmentAPI.createAssignment(assignmentData);
        }
      );

      const savedAssignments = await Promise.all(assignmentPromises);

      // Update local state with new assignments
      setCrewAssignments((prev) => [...prev, ...savedAssignments]);

      showAlert(
        `Successfully assigned ${savedAssignments.length} crew member(s) to flight`
      );
      setShowCrewAssignmentModal(false);
      resetCrewAssignmentForm();
    } catch (error) {
      console.error("Failed to assign crew:", error);
      showAlert(error?.message || "Failed to assign crew", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCrewAssignment = async (assignmentId) => {
    if (!assignmentId) {
      showAlert("Invalid assignment ID", "error");
      return;
    }

    if (!confirm("Are you sure you want to remove this crew assignment?"))
      return;

    setLoading(true);
    try {
      await crewAssignmentAPI.deleteAssignment(assignmentId);

      // Remove from local state - check for both field name formats
      setCrewAssignments((prev) =>
        prev.filter((assignment) => {
          const currentAssignmentId =
            assignment.assignmentId || assignment.assignmentID;
          return currentAssignmentId !== assignmentId;
        })
      );

      showAlert("Crew assignment removed successfully");
    } catch (error) {
      console.error("Failed to remove crew assignment:", error);
      showAlert(error?.message || "Failed to remove crew assignment", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleCompleteAssignment = async (assignmentId) => {
    // Make sure we have a valid assignment ID
    if (!assignmentId) {
      console.error("No assignment ID provided!");
      showAlert("Invalid assignment ID", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await crewAssignmentAPI.updateAssignment(assignmentId, {
        status: "completed",
      });

      // Update local state - check for both field name formats
      setCrewAssignments((prev) =>
        prev.map((assignment) => {
          const currentAssignmentId =
            assignment.assignmentId || assignment.assignmentID;
          if (currentAssignmentId === assignmentId) {
            return { ...assignment, status: "completed" };
          }
          return assignment;
        })
      );

      showAlert("Assignment marked as completed");
    } catch (error) {
      console.error("Failed to complete assignment:", error);
      showAlert(error?.message || "Failed to complete assignment", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleCancelAssignment = async (assignmentId) => {
    if (!assignmentId) {
      console.error("No assignment ID provided!");
      showAlert("Invalid assignment ID", "error");
      return;
    }

    if (!confirm("Are you sure you want to cancel this assignment?")) return;

    setLoading(true);
    try {
      await crewAssignmentAPI.updateAssignment(assignmentId, {
        status: "cancelled",
      });

      // Update local state - check for both field name formats
      setCrewAssignments((prev) =>
        prev.map((assignment) => {
          const currentAssignmentId =
            assignment.assignmentId || assignment.assignmentID;
          if (currentAssignmentId === assignmentId) {
            return { ...assignment, status: "cancelled" };
          }
          return assignment;
        })
      );

      showAlert("Assignment cancelled");
    } catch (error) {
      console.error("Failed to cancel assignment:", error);
      showAlert(error?.message || "Failed to cancel assignment", "error");
    } finally {
      setLoading(false);
    }
  };
  const getCrewAssignmentsForFlight = (flightId) => {
    return crewAssignments
      .filter(
        (assignment) =>
          assignment.flightID === flightId && assignment.status !== "cancelled"
      )
      .map((assignment) => {
        const crewMember = crew.find((c) => c.crewID === assignment.crewID);
        // Use nested user data from crew record
        const userData = crewMember?.user;

        return {
          assignmentID: assignment.assignmentID,
          crewID: assignment.crewID,
          name: userData?.name || "Unknown",
          position: crewMember?.position || "crew",
          status: assignment.status,
        };
      });
  };

  // Check if crew is already assigned to flight (prevent duplicates)

  // Helper function to get crew data for assignment
  const getCrewForAssignment = (crewID) => {
    const crewRecord = crew.find((c) => c.crewID === crewID);
    // Use the nested user data from the crew record
    const user = crewRecord?.user;

    return {
      crewRecord,
      user,
      name: user?.name || "Unknown User",
      position: crewRecord?.position || "crew",
      email: user?.email || "No email",
      employeeNumber: crewRecord?.employeeNumber || null,
      licenseNumber: crewRecord?.licenseNumber || null,
    };
  };
  const getFilteredAssignments = () => {
    const displayData = getCrewAssignmentDisplayData();

    return displayData.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.flight.flightNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignmentID.toString().includes(searchTerm);

      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const isCrewAssignedToFlight = (crewId, flightId) => {
    return crewAssignments.some(
      (assignment) =>
        assignment.crewID === crewId &&
        assignment.flightID === flightId &&
        assignment.status === "assigned"
    );
  };
  // Updated crew assignment form validation
  const validateCrewAssignment = () => {
    if (!crewAssignmentForm.flightId) {
      showAlert("Please select a flight", "error");
      return false;
    }

    if (crewAssignmentForm.crewMembers.length === 0) {
      showAlert("Please select at least one crew member", "error");
      return false;
    }

    // Check for duplicate assignments
    const duplicates = crewAssignmentForm.crewMembers.filter((crewId) =>
      isCrewAssignedToFlight(
        parseInt(crewId),
        parseInt(crewAssignmentForm.flightId)
      )
    );

    if (duplicates.length > 0) {
      showAlert(
        "Some selected crew members are already assigned to this flight",
        "error"
      );
      return false;
    }

    return true;
  };

  // Update the handleAssignCrew to use validation
  const handleAssignCrewWithValidation = async () => {
    if (!validateCrewAssignment()) {
      return;
    }
    await handleAssignCrew();
  };
  const getCrewWithUserData = () => {
    return crew.map((crewMember) => {
      const user = users.find((u) => u.userID === crewMember.userID);
      return {
        ...crewMember,
        user: user || null,
        name: user?.name || "Unknown User",
        email: user?.email || "No email",
        hasUserData: !!user,
      };
    });
  };

  // Search and filter functions

  // Updated crew assignment form state - use userID instead of crewID
  const [crewAssignmentForm, setCrewAssignmentForm] = useState({
    flightId: "",
    crewMembers: [], // Store crewIDs, not userIDs
  });
  const resetCrewAssignmentForm = () => {
    setCrewAssignmentForm({
      flightId: "",
      crewMembers: [],
    });
  };
  const handleCrewMemberToggle = (crewId) => {
    const crewIdStr = crewId.toString();

    if (crewAssignmentForm.crewMembers.includes(crewIdStr)) {
      // Remove from selection
      setCrewAssignmentForm({
        ...crewAssignmentForm,
        crewMembers: crewAssignmentForm.crewMembers.filter(
          (id) => id !== crewIdStr
        ),
      });
    } else {
      // Add to selection
      setCrewAssignmentForm({
        ...crewAssignmentForm,
        crewMembers: [...crewAssignmentForm.crewMembers, crewIdStr],
      });
    }
  };
  const getCrewAssignmentDisplayData = () => {
    return crewAssignments.map((assignment) => {
      // FIXED: Your backend returns lowercase field names, so check for those first
      const assignmentId =
        assignment.assignmentId ||
        assignment.assignmentID ||
        assignment.id ||
        assignment.assignment_id;
      const flightId =
        assignment.flightId || assignment.flightID || assignment.flight_id;
      const crewId =
        assignment.crewId || assignment.crewID || assignment.crew_id;
      const assignmentDate =
        assignment.assignmentDate ||
        assignment.assignment_date ||
        assignment.createdAt;
      const status = assignment.status;

      // Get flight data
      const flight = flights.find(
        (f) =>
          f.flightID === flightId ||
          f.flight_id === flightId ||
          f.id === flightId
      );

      // Get crew data by crewID
      const crewMember = crew.find(
        (c) => c.crewID === crewId || c.crew_id === crewId || c.id === crewId
      );

      // Use the nested user data from crew record
      const userData = crewMember?.user;

      const result = {
        assignmentID: assignmentId, // IMPORTANT: Store as assignmentID for frontend consistency
        assignmentDate: assignmentDate,
        status: status,
        // Flight information
        flight: {
          flightID: flightId,
          flightNumber: flight?.flightNumber || `Flight ${flightId}`,
          departureTime: flight?.departureTime,
          arrivalTime: flight?.arrivalTime,
          departureAirport:
            flight?.departureAirport?.name ||
            flight?.departureAirport?.airportCode ||
            "Unknown",
          arrivalAirport:
            flight?.arrivalAirport?.name ||
            flight?.arrivalAirport?.airportCode ||
            "Unknown",
        },
        // Crew information
        crew: {
          crewID: crewId,
          name: userData?.name || `Crew ${crewId}`,
          email: userData?.email || "No email",
          position: crewMember?.position || "crew",
          employeeNumber: crewMember?.employeeNumber,
          licenseNumber: crewMember?.licenseNumber,
        },
      };

      return result;
    });
  };

  const filterUsers = () => {
    return users.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !statusFilter || user.userType === statusFilter;

      return matchesSearch && matchesType;
    });
  };

  // Calculate statistics for dashboard
  const stats = {
    totalFlights: flights.length,
    activeFlights: flights.filter(
      (f) => f.status === "In-Flight" || f.status === "Scheduled"
    ).length,
    totalUsers: users.length,
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || 0),
      0
    ),
    totalAircraft: aircrafts.length,
    totalAirports: airports.length,
  };

  // Chart data
  const flightStatusData = [
    {
      name: "Scheduled",
      value: flights.filter((f) => f.status === "Scheduled").length,
    },
    {
      name: "In-Flight",
      value: flights.filter((f) => f.status === "In-Flight").length,
    },
    {
      name: "Completed",
      value: flights.filter((f) => f.status === "Completed").length,
    },
    {
      name: "Cancelled",
      value: flights.filter((f) => f.status === "Cancelled").length,
    },
    {
      name: "Delayed",
      value: flights.filter((f) => f.status === "Delayed").length,
    },
  ];

  const userTypeData = [
    {
      name: "Passengers",
      value: users.filter((u) => u.userType === "passenger").length,
    },
    { name: "Crew", value: users.filter((u) => u.userType === "crew").length },
    {
      name: "Admin",
      value: users.filter((u) => u.userType === "admin").length,
    },
    {
      name: "Front Desk",
      value: users.filter((u) => u.userType === "front_desk").length,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            alert.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white flex items-center space-x-2`}
        >
          {alert.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)}>
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">
              Admin Panel
            </h1>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === "dashboard"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveSection("flights")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === "flights"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Plane className="h-5 w-5 mr-3" />
                Flights
              </button>

              <button
                onClick={() => setActiveSection("users")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === "users"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                Users
              </button>

              <button
                onClick={() => setActiveSection("aircraft")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === "aircraft"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Plane className="h-5 w-5 mr-3" />
                Aircraft
              </button>

              <button
                onClick={() => setActiveSection("airports")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === "airports"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Building className="h-5 w-5 mr-3" />
                Airports
              </button>

              <button
                onClick={() => setActiveSection("bookings")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === "bookings"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <CreditCard className="h-5 w-5 mr-3" />
                Bookings
              </button>
              <button
                onClick={() => setActiveSection("crew-assignments")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === "crew-assignments"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <UserCheck className="h-5 w-5 mr-3" />
                Crew Assignments
              </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeSection === "dashboard" && <Reports />}

          {activeSection === "flights" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Flight Management
                </h2>
                <button
                  onClick={() => setShowAddFlightModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Flight
                </button>
              </div>

              {/* Search and Filter */}
              <FlightSearch
                flights={flights}
                onFilterChange={setFilteredFlights}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />

              {/* Flights Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flight Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available Seats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFlights.map((flight) => (
                      <tr key={flight.flightID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {flight.flightNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {flight.departureAirport?.airportCode} →{" "}
                          {flight.arrivalAirport?.airportCode}
                          <div className="text-xs text-gray-500">
                            {flight.departureAirport?.city} →{" "}
                            {flight.arrivalAirport?.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(flight.departureTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              flight.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : flight.status === "boarding"
                                ? "bg-yellow-100 text-yellow-800"
                                : flight.status === "departed"
                                ? "bg-green-100 text-green-800"
                                : flight.status === "arrived"
                                ? "bg-gray-100 text-gray-800"
                                : flight.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {flight.status.charAt(0).toUpperCase() +
                              flight.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(flight.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {flight.availableSeats}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditFlightModal(flight)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteFlight(flight.flightID)
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            {flight.status === "Scheduled" && (
                              <button
                                onClick={() =>
                                  handleUpdateFlightStatus(
                                    flight.flightID,
                                    "Cancelled"
                                  )
                                }
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  User Management
                </h2>
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </button>
              </div>

              {/* Search and Filter */}
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="passenger">Passenger</option>
                    <option value="admin">Admin</option>
                    <option value="crew">Crew</option>
                    <option value="front_desk">Front Desk</option>
                  </select>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("");
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filterUsers().map((user) => (
                      <tr key={user.userID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.userType === "admin"
                                ? "bg-red-100 text-red-800"
                                : user.userType === "crew"
                                ? "bg-blue-100 text-blue-800"
                                : user.userType === "front_desk"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.userType.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(user.createProfile)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user.userID)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "aircraft" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Aircraft Management
                </h2>
                <button
                  onClick={() => setShowAddAircraftModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Aircraft
                </button>
              </div>

              {/* Aircraft Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manufacturer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {aircrafts.map((aircraft) => (
                      <tr key={aircraft.aircraftID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {aircraft.registration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {aircraft.aircraftModel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {aircraft.manufacturer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {aircraft.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {aircraft.airport
                            ? `${aircraft.airport.airportCode} - ${aircraft.airport.name}`
                            : "Not assigned"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditAircraftModal(aircraft)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteAircraft(aircraft.aircraftID)
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "airports" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Airport Management
                </h2>
                <button
                  onClick={() => setShowAddAirportModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Airport
                </button>
              </div>

              {/* Airports Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
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
                      <tr key={airport.airportID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {airport.airportCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {airport.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {airport.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {airport.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditAirportModal(airport)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteAirport(airport.airportID)
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "bookings" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Booking Management
              </h2>

              {/* Bookings Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Passenger
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flight
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seat
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.bookingID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.bookingNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.passengerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.flightNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(booking.bookingDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(booking.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.seatNumber || "Not assigned"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeSection === "crew-assignments" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Crew Assignment Management
                </h2>
                <button
                  onClick={() => setShowCrewAssignmentModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Crew
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">
                        Total Assignments
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {crewAssignments.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">
                        Active
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {
                          crewAssignments.filter((a) => a.status === "assigned")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">
                        Completed
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {
                          crewAssignments.filter(
                            (a) => a.status === "completed"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <X className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">
                        Cancelled
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {
                          crewAssignments.filter(
                            (a) => a.status === "cancelled"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Crew Assignments Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      All Crew Assignments
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search assignments..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">All Status</option>
                        <option value="assigned">Assigned</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

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
                        Crew Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment Date
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
                    {getFilteredAssignments().map((assignmentData) => (
                      <tr
                        key={assignmentData.assignmentID}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {assignmentData.flight.flightNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assignmentData.flight.departureTime
                              ? formatDateTime(
                                  assignmentData.flight.departureTime
                                )
                              : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assignmentData.flight.departureAirport} →{" "}
                          {assignmentData.flight.arrivalAirport}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {assignmentData.crew.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assignmentData.crew.employeeNumber
                              ? `ID: ${assignmentData.crew.employeeNumber}`
                              : "No Employee ID"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              assignmentData.crew.position === "pilot"
                                ? "bg-blue-100 text-blue-800"
                                : assignmentData.crew.position === "co_pilot"
                                ? "bg-purple-100 text-purple-800"
                                : assignmentData.crew.position ===
                                  "flight_attendant"
                                ? "bg-green-100 text-green-800"
                                : assignmentData.crew.position === "cabin_crew"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {assignmentData.crew.position
                              ? assignmentData.crew.position
                                  .replace("_", " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())
                              : "Crew"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(assignmentData.assignmentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              assignmentData.status === "assigned"
                                ? "bg-green-100 text-green-800"
                                : assignmentData.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : assignmentData.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {assignmentData.status?.charAt(0).toUpperCase() +
                              assignmentData.status?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {assignmentData.status === "assigned" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleCompleteAssignment(
                                      assignmentData.assignmentID
                                    )
                                  }
                                  className="text-green-600 hover:text-green-900"
                                  title="Mark as completed"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleCancelAssignment(
                                      assignmentData.assignmentID
                                    )
                                  }
                                  className="text-yellow-600 hover:text-yellow-900"
                                  title="Cancel assignment"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() =>
                                handleRemoveCrewAssignment(
                                  assignmentData.assignmentID
                                )
                              }
                              className="text-red-600 hover:text-red-900"
                              title="Delete assignment"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {crewAssignments.length === 0 && (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <Users className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No assignments
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Get started by assigning crew members to flights.
                          </p>
                          <div className="mt-6">
                            <button
                              onClick={() => setShowCrewAssignmentModal(true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              <Plus className="-ml-1 mr-2 h-4 w-4" />
                              Assign Crew
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {crewAssignments.length > 0 &&
                      getFilteredAssignments().length === 0 && (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No assignments match your search criteria
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>

              {/* Assignments by Flight Section */}
              <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Assignments by Flight
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {flights
                    .filter((flight) =>
                      crewAssignments.some(
                        (assignment) =>
                          assignment.flightID === flight.flightID &&
                          assignment.status !== "cancelled"
                      )
                    )
                    .map((flight) => {
                      const flightAssignments = getCrewAssignmentsForFlight(
                        flight.flightID
                      );

                      return (
                        <div key={flight.flightID} className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">
                                {flight.flightNumber}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {flight.departureAirport?.name} →{" "}
                                {flight.arrivalAirport?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDateTime(flight.departureTime)}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {flightAssignments.length} crew member
                              {flightAssignments.length !== 1 ? "s" : ""}{" "}
                              assigned
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {flightAssignments.map((assignment) => (
                              <div
                                key={assignment.assignmentID}
                                className="bg-gray-50 rounded-lg p-3"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm text-gray-900">
                                      {assignment.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Crew ID: {assignment.crewID}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        assignment.position === "pilot"
                                          ? "bg-blue-100 text-blue-800"
                                          : assignment.position === "co_pilot"
                                          ? "bg-purple-100 text-purple-800"
                                          : assignment.position ===
                                            "flight_attendant"
                                          ? "bg-green-100 text-green-800"
                                          : assignment.position === "cabin_crew"
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {assignment.position
                                        ?.replace("_", " ")
                                        .replace(/\b\w/g, (l) =>
                                          l.toUpperCase()
                                        ) || "Crew"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  {flights.filter((flight) =>
                    crewAssignments.some(
                      (assignment) =>
                        assignment.flightID === flight.flightID &&
                        assignment.status !== "cancelled"
                    )
                  ).length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                      No flights have crew assignments yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Flight Modal */}
      {showAddFlightModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Add New Flight
              </h3>
              <button
                onClick={() => {
                  setShowAddFlightModal(false);
                  resetFlightForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Flight Number
                </label>
                <input
                  type="text"
                  value={flightForm.flightNumber}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      flightNumber: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., AA123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Aircraft
                </label>
                <select
                  value={flightForm.aircraftID}
                  onChange={(e) =>
                    setFlightForm({ ...flightForm, aircraftID: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Aircraft</option>
                  {aircrafts.map((aircraft) => (
                    <option
                      key={aircraft.aircraftID}
                      value={aircraft.aircraftID}
                    >
                      {aircraft.registration} - {aircraft.aircraftModel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Departure Airport
                </label>
                <select
                  value={flightForm.departureAirportId}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      departureAirportId: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Departure Airport</option>
                  {airports.map((airport) => (
                    <option key={airport.airportID} value={airport.airportID}>
                      {airport.airportCode} - {airport.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={flightForm.duration}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, duration: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={flightForm.price}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, price: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="500.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Seats
                </label>
                <input
                  type="number"
                  value={flightForm.availableSeats}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      availableSeats: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={flightForm.status}
                  onChange={(e) =>
                    setFlightForm({ ...flightForm, status: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="boarding">Boarding</option>
                  <option value="departed">Departed</option>
                  <option value="arrived">Arrived</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddFlightModal(false);
                    resetFlightForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFlight}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                      Adding...
                    </>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Flight</h3>
              <button
                onClick={() => {
                  setShowEditFlightModal(false);
                  setSelectedFlight(null);
                  resetFlightForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Flight Number
                </label>
                <input
                  type="text"
                  value={flightForm.flightNumber}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      flightNumber: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={flightForm.duration}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, duration: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={flightForm.price}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, price: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Seats
                </label>
                <input
                  type="number"
                  value={flightForm.availableSeats}
                  onChange={(e) =>
                    setFlightForm({
                      ...flightForm,
                      availableSeats: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={flightForm.status}
                  onChange={(e) =>
                    setFlightForm({ ...flightForm, status: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="boarding">Boarding</option>
                  <option value="departed">Departed</option>
                  <option value="arrived">Arrived</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditFlightModal(false);
                    setSelectedFlight(null);
                    resetFlightForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFlight}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    "Update Flight"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Create New User
              </h3>
              <button
                onClick={() => {
                  setShowCreateUserModal(false);
                  resetUserForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User Type *
                </label>
                <select
                  value={userForm.userType}
                  onChange={(e) =>
                    setUserForm({ ...userForm, userType: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="passenger">Passenger</option>
                  <option value="admin">Admin</option>
                  <option value="crew">Crew</option>
                  <option value="front_desk">Front Desk</option>
                </select>
              </div>

              {/* Conditional fields based on user type */}
              {userForm.userType === "passenger" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Passport Number
                    </label>
                    <input
                      type="text"
                      value={userForm.passportNumber}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          passportNumber: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={userForm.nationality}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          nationality: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={userForm.dateOfBirth}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </>
              )}

              {userForm.userType === "admin" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Employee Number
                    </label>
                    <input
                      type="text"
                      value={userForm.employeeNumber}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          employeeNumber: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Access Level
                    </label>
                    <input
                      type="text"
                      value={userForm.accessLevel}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          accessLevel: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1-5"
                    />
                  </div>
                </>
              )}

              {userForm.userType === "crew" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Employee Number
                    </label>
                    <input
                      type="text"
                      value={userForm.employeeNumber}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          employeeNumber: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <input
                      type="text"
                      value={userForm.position}
                      onChange={(e) =>
                        setUserForm({ ...userForm, position: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Pilot, Flight Attendant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={userForm.licenseNumber}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          licenseNumber: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </>
              )}

              {userForm.userType === "front_desk" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Employee Number
                    </label>
                    <input
                      type="text"
                      value={userForm.employeeNumber}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          employeeNumber: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <input
                      type="text"
                      value={userForm.department}
                      onChange={(e) =>
                        setUserForm({ ...userForm, department: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Check-in, Customer Service"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowCreateUserModal(false);
                    resetUserForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                      Creating...
                    </>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Add New Aircraft
              </h3>
              <button
                onClick={() => {
                  setShowAddAircraftModal(false);
                  resetAircraftForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registration *
                </label>
                <input
                  type="text"
                  value={aircraftForm.registration}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      registration: e.target.value.toUpperCase(),
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., N123AB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Aircraft Model *
                </label>
                <input
                  type="text"
                  value={aircraftForm.aircraftModel}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      aircraftModel: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Boeing 737-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  value={aircraftForm.manufacturer}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      manufacturer: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Boeing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity *
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="180"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Airport
                </label>
                <select
                  value={aircraftForm.airportId}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      airportId: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Airport (Optional)</option>
                  {airports.map((airport) => (
                    <option key={airport.airportID} value={airport.airportID}>
                      {airport.airportCode} - {airport.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddAircraftModal(false);
                    resetAircraftForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAircraft}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                      Adding...
                    </>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Aircraft</h3>
              <button
                onClick={() => {
                  setShowEditAircraftModal(false);
                  setSelectedAircraft(null);
                  resetAircraftForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registration
                </label>
                <input
                  type="text"
                  value={aircraftForm.registration}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      registration: e.target.value.toUpperCase(),
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Aircraft Model
                </label>
                <input
                  type="text"
                  value={aircraftForm.aircraftModel}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      aircraftModel: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={aircraftForm.manufacturer}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      manufacturer: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Airport
                </label>
                <select
                  value={aircraftForm.airportId}
                  onChange={(e) =>
                    setAircraftForm({
                      ...aircraftForm,
                      airportId: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Airport (Optional)</option>
                  {airports.map((airport) => (
                    <option key={airport.airportID} value={airport.airportID}>
                      {airport.airportCode} - {airport.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditAircraftModal(false);
                    setSelectedAircraft(null);
                    resetAircraftForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAircraft}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                      Updating...
                    </>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Add New Airport
              </h3>
              <button
                onClick={() => {
                  setShowAddAirportModal(false);
                  resetAirportForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Airport Code *
                </label>
                <input
                  type="text"
                  value={airportForm.airportCode}
                  onChange={(e) =>
                    setAirportForm({
                      ...airportForm,
                      airportCode: e.target.value.toUpperCase(),
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., JFK"
                  maxLength="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Airport Name *
                </label>
                <input
                  type="text"
                  value={airportForm.name}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, name: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., John F. Kennedy International Airport"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  value={airportForm.city}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, city: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country *
                </label>
                <input
                  type="text"
                  value={airportForm.country}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, country: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., United States"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddAirportModal(false);
                    resetAirportForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAirport}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                      Adding...
                    </>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Airport</h3>
              <button
                onClick={() => {
                  setShowEditAirportModal(false);
                  setSelectedAirport(null);
                  resetAirportForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Airport Code
                </label>
                <input
                  type="text"
                  value={airportForm.airportCode}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Airport code cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Airport Name
                </label>
                <input
                  type="text"
                  value={airportForm.name}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, name: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={airportForm.city}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, city: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  value={airportForm.country}
                  onChange={(e) =>
                    setAirportForm({ ...airportForm, country: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditAirportModal(false);
                    setSelectedAirport(null);
                    resetAirportForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAirport}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    "Update Airport"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCrewAssignmentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[700px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Assign Crew to Flight
              </h3>
              <button
                onClick={() => {
                  setShowCrewAssignmentModal(false);
                  resetCrewAssignmentForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Flight Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Flight *
                </label>
                <select
                  value={crewAssignmentForm.flightId}
                  onChange={(e) =>
                    setCrewAssignmentForm({
                      ...crewAssignmentForm,
                      flightId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Choose a flight...</option>
                  {flights
                    .filter((flight) => flight.status === "scheduled")
                    .map((flight) => (
                      <option key={flight.flightID} value={flight.flightID}>
                        {flight.flightNumber} -{" "}
                        {flight.departureAirport?.airportCode} →{" "}
                        {flight.arrivalAirport?.airportCode} (
                        {formatDateTime(flight.departureTime)})
                      </option>
                    ))}
                </select>
                {flights.filter((f) => f.status === "scheduled").length ===
                  0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    No scheduled flights available for crew assignment
                  </p>
                )}
              </div>

              {/* Crew Members Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Crew Members *
                  <span className="text-gray-500 text-xs ml-1">
                    ({crewAssignmentForm.crewMembers.length} selected)
                  </span>
                </label>

                <div className="border border-gray-300 rounded-md p-4 max-h-64 overflow-y-auto">
                  {(() => {
                    const availableCrew = getAvailableCrewForAssignment();

                    if (availableCrew.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <Users className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="text-gray-500 mt-2">
                            No crew members available
                          </p>
                          <p className="text-gray-400 text-sm">
                            Add crew members first to assign them to flights
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        {availableCrew.map((crewMember) => {
                          const isAlreadyAssigned =
                            crewAssignmentForm.flightId &&
                            isCrewAssignedToFlight(
                              crewMember.crewID,
                              parseInt(crewAssignmentForm.flightId)
                            );
                          const isDisabled = isAlreadyAssigned;

                          return (
                            <div
                              key={crewMember.crewID}
                              className={`flex items-center space-x-3 p-3 rounded-md border transition-colors ${
                                isDisabled
                                  ? "bg-gray-50 border-gray-200 opacity-60"
                                  : crewAssignmentForm.crewMembers.includes(
                                      crewMember.crewID.toString()
                                    )
                                  ? "bg-indigo-50 border-indigo-200"
                                  : "bg-white border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={`crew-${crewMember.crewID}`}
                                checked={crewAssignmentForm.crewMembers.includes(
                                  crewMember.crewID.toString()
                                )}
                                disabled={isDisabled}
                                onChange={() =>
                                  handleCrewMemberToggle(crewMember.crewID)
                                }
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                              />

                              <label
                                htmlFor={`crew-${crewMember.crewID}`}
                                className={`flex-1 flex items-center justify-between ${
                                  isDisabled
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900">
                                      {crewMember.name}
                                    </span>
                                    {crewMember.employeeNumber && (
                                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                        #{crewMember.employeeNumber}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-gray-500 text-sm">
                                      {crewMember.email}
                                    </span>
                                    {crewMember.licenseNumber && (
                                      <span className="text-gray-400 text-xs">
                                        License: {crewMember.licenseNumber}
                                      </span>
                                    )}
                                  </div>

                                  {isAlreadyAssigned && (
                                    <div className="mt-1">
                                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Already Assigned to This Flight
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <span
                                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ml-4 ${
                                    crewMember.position === "pilot"
                                      ? "bg-blue-100 text-blue-800"
                                      : crewMember.position === "co_pilot"
                                      ? "bg-purple-100 text-purple-800"
                                      : crewMember.position ===
                                        "flight_attendant"
                                      ? "bg-green-100 text-green-800"
                                      : crewMember.position === "cabin_crew"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {crewMember.position
                                    ? crewMember.position
                                        .replace("_", " ")
                                        .replace(/\b\w/g, (l) =>
                                          l.toUpperCase()
                                        )
                                    : "Crew"}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {crewAssignmentForm.crewMembers.length > 0 && (
                  <div className="mt-3 p-3 bg-indigo-50 rounded-md border border-indigo-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-indigo-900">
                        Selected Crew Members (
                        {crewAssignmentForm.crewMembers.length})
                      </span>
                      <button
                        onClick={() =>
                          setCrewAssignmentForm({
                            ...crewAssignmentForm,
                            crewMembers: [],
                          })
                        }
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {crewAssignmentForm.crewMembers.map((crewId) => {
                        const crewMember = getAvailableCrewForAssignment().find(
                          (c) => c.crewID === parseInt(crewId)
                        );
                        return (
                          <span
                            key={crewId}
                            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                              crewMember?.position === "pilot"
                                ? "bg-blue-100 text-blue-800"
                                : crewMember?.position === "co_pilot"
                                ? "bg-purple-100 text-purple-800"
                                : crewMember?.position === "flight_attendant"
                                ? "bg-green-100 text-green-800"
                                : crewMember?.position === "cabin_crew"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                            title={`${crewMember?.name} (${crewMember?.email})`}
                          >
                            {crewMember?.name || "Unknown"}
                            <button
                              onClick={() =>
                                handleCrewMemberToggle(parseInt(crewId))
                              }
                              className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Flight Details Preview */}
              {crewAssignmentForm.flightId && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Plane className="w-4 h-4 mr-2" />
                    Flight Details
                  </h4>
                  {(() => {
                    const selectedFlight = flights.find(
                      (f) =>
                        f.flightID === parseInt(crewAssignmentForm.flightId)
                    );
                    const currentAssignments = getCrewAssignmentsForFlight(
                      parseInt(crewAssignmentForm.flightId)
                    );

                    return selectedFlight ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600 space-y-1">
                              <p>
                                <strong>Flight:</strong>{" "}
                                {selectedFlight.flightNumber}
                              </p>
                              <p>
                                <strong>Route:</strong>{" "}
                                {selectedFlight.departureAirport?.name} →{" "}
                                {selectedFlight.arrivalAirport?.name}
                              </p>
                              <p>
                                <strong>Aircraft:</strong>{" "}
                                {selectedFlight.aircraft?.aircraftModel} (
                                {selectedFlight.aircraft?.registration})
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 space-y-1">
                              <p>
                                <strong>Departure:</strong>{" "}
                                {formatDateTime(selectedFlight.departureTime)}
                              </p>
                              <p>
                                <strong>Arrival:</strong>{" "}
                                {formatDateTime(selectedFlight.arrivalTime)}
                              </p>
                              <p>
                                <strong>Status:</strong>
                                <span className="ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  {selectedFlight.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {currentAssignments.length > 0 && (
                          <div className="pt-3 border-t border-gray-200">
                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              Currently Assigned Crew (
                              {currentAssignments.length})
                            </h5>
                            <div className="grid grid-cols-1 gap-2">
                              {currentAssignments.map((assignment) => {
                                const crewData = getCrewForAssignment(
                                  assignment.crewID
                                );
                                return (
                                  <div
                                    key={assignment.assignmentID}
                                    className="flex items-center justify-between p-2 bg-white rounded border"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-sm">
                                        {crewData.name}
                                      </span>
                                      <span
                                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                          crewData.position === "pilot"
                                            ? "bg-blue-100 text-blue-800"
                                            : crewData.position === "co_pilot"
                                            ? "bg-purple-100 text-purple-800"
                                            : crewData.position ===
                                              "flight_attendant"
                                            ? "bg-green-100 text-green-800"
                                            : crewData.position === "cabin_crew"
                                            ? "bg-orange-100 text-orange-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {crewData.position?.replace("_", " ") ||
                                          "Crew"}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                          assignment.status === "assigned"
                                            ? "bg-green-100 text-green-800"
                                            : assignment.status === "completed"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {assignment.status}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleRemoveCrewAssignment(
                                            assignment.assignmentID
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                        title="Remove assignment"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowCrewAssignmentModal(false);
                    resetCrewAssignmentForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignCrewWithValidation}
                  disabled={
                    loading ||
                    !crewAssignmentForm.flightId ||
                    crewAssignmentForm.crewMembers.length === 0
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Assign {crewAssignmentForm.crewMembers.length} Crew Member
                      {crewAssignmentForm.crewMembers.length !== 1 ? "s" : ""}
                    </>
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
