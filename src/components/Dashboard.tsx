import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  LogOut,
  Search,
  Calendar,
  Users,
  BarChart3,
  Settings,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Bell,
} from "lucide-react";
import { authAPI, mockData, User } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      try {
        const userData = await authAPI.getUser(parseInt(userId));
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user data:", error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderPassengerDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/passenger-dashboard")}
          className="bg-blue-600 text-white p-6 rounded-2xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <Search className="h-8 w-8" />
            <div className="text-left">
              <h3 className="text-xl font-semibold">Flight Dashboard</h3>
              <p className="text-blue-100">Search flights & manage bookings</p>
            </div>
          </div>
        </button>

        <button className="bg-green-600 text-white p-6 rounded-2xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8" />
            <div className="text-left">
              <h3 className="text-xl font-semibold">Manage Trips</h3>
              <p className="text-green-100">View and modify bookings</p>
            </div>
          </div>
        </button>

        <button className="bg-purple-600 text-white p-6 rounded-2xl hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
          <div className="flex items-center space-x-4">
            <Bell className="h-8 w-8" />
            <div className="text-left">
              <h3 className="text-xl font-semibold">Notifications</h3>
              <p className="text-purple-100">Flight updates & alerts</p>
            </div>
          </div>
        </button>
      </div>

      {/* My Bookings */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
        <div className="space-y-4">
          {mockData.passengerBookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Plane className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    {booking.flightNumber}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  #{booking.bookingId}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>
                    {booking.from} → {booking.to}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    {booking.date} at {booking.time}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Seat:</span>
                  <span className="font-medium">{booking.seat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Admin Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Flights</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockData.adminReports.totalFlights}
              </p>
            </div>
            <Plane className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Passengers</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockData.adminReports.totalPassengers.toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockData.adminReports.revenue}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Growth</p>
              <p className="text-3xl font-bold text-gray-900">+12%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button className="bg-blue-600 text-white p-6 rounded-2xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
          <div className="flex items-center space-x-4">
            <Settings className="h-8 w-8" />
            <div className="text-left">
              <h3 className="text-xl font-semibold">Manage Flights</h3>
              <p className="text-blue-100">Add, edit, or remove flights</p>
            </div>
          </div>
        </button>

        <button className="bg-green-600 text-white p-6 rounded-2xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8" />
            <div className="text-left">
              <h3 className="text-xl font-semibold">User Management</h3>
              <p className="text-green-100">Manage user accounts</p>
            </div>
          </div>
        </button>

        <button className="bg-purple-600 text-white p-6 rounded-2xl hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8" />
            <div className="text-left">
              <h3 className="text-xl font-semibold">Analytics</h3>
              <p className="text-purple-100">View detailed reports</p>
            </div>
          </div>
        </button>
      </div>

      {/* Top Destinations */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Top Destinations
        </h2>
        <div className="grid md:grid-cols-5 gap-4">
          {mockData.adminReports.topDestinations.map((destination, index) => (
            <div
              key={destination}
              className="text-center p-4 bg-gray-50 rounded-xl"
            >
              <div className="text-2xl font-bold text-blue-600">
                #{index + 1}
              </div>
              <div className="text-gray-900 font-medium">{destination}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCrewDashboard = () => (
    <div className="space-y-6">
      {/* Crew Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Assigned Flights</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockData.crewFlights.length}
              </p>
            </div>
            <Plane className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Flight Hours</p>
              <p className="text-3xl font-bold text-gray-900">156</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <p className="text-xl font-bold text-green-600">Active</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* My Assigned Flights */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          My Assigned Flights
        </h2>
        <div className="space-y-4">
          {mockData.crewFlights.map((flight, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Plane className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    {flight.flightNumber}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {flight.role}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{flight.aircraft}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{flight.route}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    {flight.date} at {flight.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDashboardContent = () => {
    switch (user.role) {
      case "Passenger":
        return renderPassengerDashboard();
      case "Admin":
        return renderAdminDashboard();
      case "Crew":
        return renderCrewDashboard();
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navbar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MY TRIP</span>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === "Passenger" && "Ready for your next adventure?"}
            {user.role === "Admin" && "Here's your system overview"}
            {user.role === "Crew" && "Your flight assignments and schedule"}
          </p>
        </div>

        {/* Role-based Dashboard Content */}
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default Dashboard;
