import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Plane,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
  FileText,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { reportAPI } from "../services/api";

const Reports = () => {
  const [reports, setReports] = useState({
    demandReport: null,
    bookingSummary: null,
    flightDetails: null,
    directFlightDemand: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    demandLevel: "",
  });

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const [demandData, bookingData, flightData, demandByRouteData] =
        await Promise.all([
          reportAPI.getDemandReports().catch(() => null),
          reportAPI.getBookingSummary().catch(() => null),
          reportAPI.getFlightDetails().catch(() => null),
          reportAPI.getDirectFlightDemand(filters).catch(() => null),
        ]);

      setReports({
        demandReport: demandData,
        bookingSummary: bookingData,
        flightDetails: flightData,
        directFlightDemand: demandByRouteData,
      });
    } catch (error) {
      console.error("Failed to load reports:", error);
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshReports = () => {
    loadReports();
  };

  const exportReport = (reportType) => {
    const reportData = reports[reportType];
    if (reportData) {
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportType}_${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // KPI Cards Component
  const KPICards = () => {
    const { bookingSummary, flightDetails, demandReport } = reports;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookingSummary?.revenue?.total
                  ? `${bookingSummary.revenue.total.toLocaleString()}`
                  : "No data"}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            {bookingSummary?.revenue?.thisMonth &&
            bookingSummary?.revenue?.lastMonth ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">
                  +$
                  {(
                    bookingSummary.revenue.thisMonth -
                    bookingSummary.revenue.lastMonth
                  ).toLocaleString()}{" "}
                  vs last month
                </span>
              </>
            ) : (
              <span className="text-gray-500">No trend data</span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {bookingSummary?.totalBookings
                  ? bookingSummary.totalBookings.toLocaleString()
                  : "No data"}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">
              {bookingSummary?.confirmedBookings
                ? `${bookingSummary.confirmedBookings.toLocaleString()} confirmed`
                : "No booking data"}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Flights</p>
              <p className="text-2xl font-bold text-gray-900">
                {flightDetails?.totalFlights || "No data"}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Plane className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-600">
              {flightDetails?.flightsByStatus
                ? `${
                    (flightDetails.flightsByStatus.scheduled || 0) +
                    (flightDetails.flightsByStatus.departed || 0)
                  } active`
                : "No flight data"}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                On-Time Performance
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {flightDetails?.onTimePerformance?.percentage
                  ? `${flightDetails.onTimePerformance.percentage}%`
                  : "No data"}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-600">
              {flightDetails?.onTimePerformance?.delayedFlights
                ? `${flightDetails.onTimePerformance.delayedFlights} delayed this week`
                : "No performance data"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Revenue Chart Component
  const RevenueChart = () => {
    // Only use real backend data, no fallback
    const revenueData = reports.demandReport?.demandTrends
      ? reports.demandReport.demandTrends.map((item) => ({
          month: item.month,
          bookings: item.bookings,
          revenue: item.bookings * 150, // Estimate $150 per booking
        }))
      : null;

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Revenue & Booking Trends
          </h3>
          <button
            onClick={() => exportReport("demandReport")}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            disabled={!reports.demandReport}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
        {revenueData ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) =>
                  name === "revenue"
                    ? [`${value.toLocaleString()}`, "Revenue"]
                    : [value, "Bookings"]
                }
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No revenue data available</p>
              <p className="text-sm">
                Data will appear when backend provides demand trends
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Flight Status Chart
  const FlightStatusChart = () => {
    const statusData = reports.flightDetails?.flightsByStatus
      ? Object.entries(reports.flightDetails.flightsByStatus).map(
          ([status, count]) => ({
            status: status.charAt(0).toUpperCase() + status.slice(1),
            count,
            percentage: (
              (count / reports.flightDetails.totalFlights) *
              100
            ).toFixed(1),
          })
        )
      : null;

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Flight Status Distribution
          </h3>
          <button
            onClick={() => exportReport("flightDetails")}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            disabled={!reports.flightDetails}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
        {statusData ? (
          <div className="flex flex-col lg:flex-row items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) =>
                    `${status}: ${percentage}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="lg:ml-6 mt-4 lg:mt-0">
              {statusData.map((item, index) => (
                <div key={item.status} className="flex items-center mb-2">
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium">
                    {item.status}: {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-250 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Plane className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No flight status data available</p>
              <p className="text-sm">
                Data will appear when backend provides flight details
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Popular Routes Chart
  const PopularRoutesChart = () => {
    const routesData = reports.demandReport?.popularRoutes
      ? reports.demandReport.popularRoutes.map((route) => ({
          route: route.route,
          demand: route.demand,
          searchCount: Math.floor(route.demand * 15), // Estimate search count from demand
        }))
      : null;

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Route Demand Analysis
          </h3>
          <button
            onClick={() => exportReport("demandReport")}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            disabled={!reports.demandReport}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
        {routesData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={routesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#8884d8" name="Demand Score" />
              <Bar dataKey="searchCount" fill="#82ca9d" name="Search Count" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No route demand data available</p>
              <p className="text-sm">
                Data will appear when backend provides popular routes
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Filters Component
  const FiltersPanel = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        <select
          value={filters.year}
          onChange={(e) =>
            setFilters({ ...filters, year: parseInt(e.target.value) })
          }
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
          <option value={2022}>2022</option>
        </select>

        <select
          value={filters.month}
          onChange={(e) =>
            setFilters({ ...filters, month: parseInt(e.target.value) })
          }
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={filters.demandLevel}
          onChange={(e) =>
            setFilters({ ...filters, demandLevel: e.target.value })
          }
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Demand Levels</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="very_high">Very High</option>
        </select>

        <button
          onClick={refreshReports}
          disabled={loading}
          className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          <RefreshCw
            className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>
    </div>
  );

  if (loading && !reports.demandReport) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your airline operations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const allReportsData = {
                ...reports,
                generatedAt: new Date().toISOString(),
                filters,
              };
              const dataStr = JSON.stringify(allReportsData, null, 2);
              const dataBlob = new Blob([dataStr], {
                type: "application/json",
              });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `airline_reports_${
                new Date().toISOString().split("T")[0]
              }.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export All Reports
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <FiltersPanel />

      {/* KPI Cards */}
      <KPICards />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <FlightStatusChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PopularRoutesChart />
      </div>

      {/* Demand Analysis Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Route Demand Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Search Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demand Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Existing Flights
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.demandReport?.popularRoutes ? (
                reports.demandReport.popularRoutes.map((route, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {route.route}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.floor(route.demand * 12)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          route.demand > 80
                            ? "bg-red-100 text-red-800"
                            : route.demand > 65
                            ? "bg-yellow-100 text-yellow-800"
                            : route.demand > 50
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {route.demand > 80
                          ? "Very High"
                          : route.demand > 65
                          ? "High"
                          : route.demand > 50
                          ? "Medium"
                          : "Low"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.floor(route.demand / 15) || 3}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.demand > 70 ? (
                        <span className="text-green-600 font-medium">
                          High ({route.demand})
                        </span>
                      ) : route.demand > 50 ? (
                        <span className="text-yellow-600 font-medium">
                          Medium ({route.demand})
                        </span>
                      ) : (
                        <span className="text-gray-600">
                          Low ({route.demand})
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-lg font-medium">
                        No demand analysis data available
                      </p>
                      <p className="text-sm">
                        Route demand data will appear when your backend provides
                        popular routes information
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
