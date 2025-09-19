import React, { useState } from "react";
import { Search, RotateCcw } from "lucide-react";

const FlightSearch = ({
  flights = [],
  onFilterChange,
  searchTerm = "",
  setSearchTerm,
  statusFilter = "",
  setStatusFilter,
}) => {
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    departureCity: "",
    arrivalCity: "",
    minPrice: "",
    maxPrice: "",
    dateFrom: "",
    dateTo: "",
    aircraftType: "",
  });

  // Format date/time for searching
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  // Basic search filter
  const getFilteredFlights = () => {
    return flights.filter((flight) => {
      // Search term matching - check multiple fields
      const matchesSearch =
        !searchTerm ||
        [
          flight.flightNumber,
          flight.departureAirport?.name,
          flight.departureAirport?.airportCode,
          flight.departureAirport?.city,
          flight.arrivalAirport?.name,
          flight.arrivalAirport?.airportCode,
          flight.arrivalAirport?.city,
          flight.aircraft?.aircraftModel,
          flight.aircraft?.manufacturer,
          flight.aircraft?.registration,
          flight.status,
          flight.price?.toString(),
          flight.duration?.toString(),
          formatDateTime(flight.departureTime),
          formatDateTime(flight.arrivalTime),
        ].some(
          (field) =>
            field &&
            field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filtering
      const matchesStatus = !statusFilter || flight.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  // Advanced search filter
  const getAdvancedFilteredFlights = () => {
    return flights.filter((flight) => {
      // Basic search term
      const matchesSearch =
        !searchTerm ||
        [
          flight.flightNumber,
          flight.departureAirport?.name,
          flight.departureAirport?.airportCode,
          flight.departureAirport?.city,
          flight.arrivalAirport?.name,
          flight.arrivalAirport?.airportCode,
          flight.arrivalAirport?.city,
          flight.aircraft?.aircraftModel,
          flight.aircraft?.manufacturer,
          flight.status,
        ].some(
          (field) =>
            field &&
            field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const matchesStatus = !statusFilter || flight.status === statusFilter;

      // Departure city filter
      const matchesDepartureCity =
        !searchCriteria.departureCity ||
        flight.departureAirport?.city
          ?.toLowerCase()
          .includes(searchCriteria.departureCity.toLowerCase());

      // Arrival city filter
      const matchesArrivalCity =
        !searchCriteria.arrivalCity ||
        flight.arrivalAirport?.city
          ?.toLowerCase()
          .includes(searchCriteria.arrivalCity.toLowerCase());

      // Price range filter
      const matchesPrice =
        (!searchCriteria.minPrice ||
          flight.price >= parseFloat(searchCriteria.minPrice)) &&
        (!searchCriteria.maxPrice ||
          flight.price <= parseFloat(searchCriteria.maxPrice));

      // Date range filter
      const flightDate = new Date(flight.departureTime);
      const matchesDateRange =
        (!searchCriteria.dateFrom ||
          flightDate >= new Date(searchCriteria.dateFrom)) &&
        (!searchCriteria.dateTo ||
          flightDate <= new Date(searchCriteria.dateTo));

      // Aircraft type filter
      const matchesAircraftType =
        !searchCriteria.aircraftType ||
        flight.aircraft?.aircraftModel
          ?.toLowerCase()
          .includes(searchCriteria.aircraftType.toLowerCase());

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartureCity &&
        matchesArrivalCity &&
        matchesPrice &&
        matchesDateRange &&
        matchesAircraftType
      );
    });
  };

  // Get filtered results and notify parent
  const filteredFlights = advancedSearch
    ? getAdvancedFilteredFlights()
    : getFilteredFlights();

  // Notify parent component when filters change
  React.useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filteredFlights);
    }
  }, [
    searchTerm,
    statusFilter,
    searchCriteria,
    advancedSearch,
    flights.length,
  ]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSearchCriteria({
      departureCity: "",
      arrivalCity: "",
      minPrice: "",
      maxPrice: "",
      dateFrom: "",
      dateTo: "",
      aircraftType: "",
    });
  };

  const handleQuickStatusFilter = (status) => {
    setStatusFilter(statusFilter === status ? "" : status);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      {/* Basic Search Row */}
      <div className="flex space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search flights by number, airport, city, aircraft..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="boarding">Boarding</option>
          <option value="departed">Departed</option>
          <option value="arrived">Arrived</option>
          <option value="cancelled">Cancelled</option>
          <option value="delayed">Delayed</option>
        </select>

        <button
          onClick={() => setAdvancedSearch(!advancedSearch)}
          className={`px-4 py-2 border rounded-lg transition-colors ${
            advancedSearch
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {advancedSearch ? "Basic" : "Advanced"}
        </button>

        <button
          onClick={clearAllFilters}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Clear</span>
        </button>
      </div>

      {/* Advanced Search Filters */}
      {advancedSearch && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Departure City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure City
              </label>
              <input
                type="text"
                placeholder="e.g. New York"
                value={searchCriteria.departureCity}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    departureCity: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Arrival City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arrival City
              </label>
              <input
                type="text"
                placeholder="e.g. Los Angeles"
                value={searchCriteria.arrivalCity}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    arrivalCity: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range ($)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={searchCriteria.minPrice}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      minPrice: e.target.value,
                    })
                  }
                  className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={searchCriteria.maxPrice}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      maxPrice: e.target.value,
                    })
                  }
                  className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Aircraft Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aircraft Type
              </label>
              <input
                type="text"
                placeholder="e.g. Boeing 737"
                value={searchCriteria.aircraftType}
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    aircraftType: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Date Range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={searchCriteria.dateFrom}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      dateFrom: e.target.value,
                    })
                  }
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <input
                  type="date"
                  value={searchCriteria.dateTo}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      dateTo: e.target.value,
                    })
                  }
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Found {filteredFlights.length} flight
            {filteredFlights.length !== 1 ? "s" : ""}
            {flights.length !== filteredFlights.length &&
              ` out of ${flights.length} total`}
          </div>
        </div>
      )}

      {/* Quick Search Shortcuts */}
      {!advancedSearch && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-sm text-gray-500">Quick filters:</span>
          {["scheduled", "boarding", "delayed"].map((status) => (
            <button
              key={status}
              onClick={() => handleQuickStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                statusFilter === status
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() +
                status.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
