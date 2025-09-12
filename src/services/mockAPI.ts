const LOCAL_STORAGE_KEYS = {
  flights: "mytrip_flights",
  users: "mytrip_users",
  demandReports: "mytrip_demandReports",
  aircrafts: "mytrip_aircrafts",
  airports: "mytrip_airports",
  payments: "mytrip_payments",
  flightStats: "mytrip_flightStats",
  userActivity: "mytrip_userActivity",
  revenueReports: "mytrip_revenueReports",
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

const defaultAircrafts = [
  {
    aircraftId: "AC001",
    model: "Boeing 737-800",
    capacity: 180,
    status: "Active",
    registration: "MYT-001",
  },
  {
    aircraftId: "AC002",
    model: "Airbus A320",
    capacity: 150,
    status: "Active",
    registration: "MYT-002",
  },
  {
    aircraftId: "AC003",
    model: "Boeing 777-300",
    capacity: 350,
    status: "Maintenance",
    registration: "MYT-003",
  },
];

const defaultAirports = [
  {
    code: "JED",
    name: "King Abdulaziz International Airport",
    city: "Jeddah",
    country: "Saudi Arabia",
  },
  {
    code: "RUH",
    name: "King Khalid International Airport",
    city: "Riyadh",
    country: "Saudi Arabia",
  },
  {
    code: "DXB",
    name: "Dubai International Airport",
    city: "Dubai",
    country: "UAE",
  },
  {
    code: "CAI",
    name: "Cairo International Airport",
    city: "Cairo",
    country: "Egypt",
  },
  {
    code: "LHR",
    name: "London Heathrow Airport",
    city: "London",
    country: "UK",
  },
];

const defaultPayments = [
  {
    paymentId: "PAY001",
    bookingId: "BK001",
    amount: 1250.0,
    status: "Success",
    method: "CreditCard",
    date: "2025-09-15T10:30:00Z",
  },
  {
    paymentId: "PAY002",
    bookingId: "BK002",
    amount: 890.5,
    status: "Pending",
    method: "PayPal",
    date: "2025-09-16T14:20:00Z",
  },
  {
    paymentId: "PAY003",
    bookingId: "BK003",
    amount: 2100.0,
    status: "Failed",
    method: "CreditCard",
    date: "2025-09-17T09:15:00Z",
  },
];

const defaultFlightStats = [
  { month: "Jan", flights: 120, onTime: 85, loadFactor: 78 },
  { month: "Feb", flights: 135, onTime: 88, loadFactor: 82 },
  { month: "Mar", flights: 110, onTime: 82, loadFactor: 75 },
  { month: "Apr", flights: 145, onTime: 90, loadFactor: 85 },
  { month: "May", flights: 160, onTime: 87, loadFactor: 88 },
  { month: "Jun", flights: 175, onTime: 91, loadFactor: 92 },
];

const defaultUserActivity = [
  {
    userId: 101,
    action: "Login",
    details: "User logged in",
    timestamp: "2025-09-15T10:30:00Z",
  },
  {
    userId: 102,
    action: "Booking",
    details: "Booked flight FL123",
    timestamp: "2025-09-15T11:15:00Z",
  },
  {
    userId: 103,
    action: "Login",
    details: "User logged in",
    timestamp: "2025-09-15T12:45:00Z",
  },
  {
    userId: 104,
    action: "Booking",
    details: "Booked flight FL456",
    timestamp: "2025-09-15T14:20:00Z",
  },
  {
    userId: 101,
    action: "Payment",
    details: "Payment processed for booking BK001",
    timestamp: "2025-09-15T15:30:00Z",
  },
  {
    userId: 102,
    action: "Login",
    details: "User logged in",
    timestamp: "2025-09-15T16:45:00Z",
  },
  {
    userId: 103,
    action: "Booking",
    details: "Booked flight FL789",
    timestamp: "2025-09-15T17:20:00Z",
  },
  {
    userId: 104,
    action: "Login",
    details: "User logged in",
    timestamp: "2025-09-15T18:10:00Z",
  },
];

const defaultRevenueReports = [
  { month: "Jan", revenue: 125000, ticketSales: 95000, ancillary: 30000 },
  { month: "Feb", revenue: 142000, ticketSales: 108000, ancillary: 34000 },
  { month: "Mar", revenue: 118000, ticketSales: 89000, ancillary: 29000 },
  { month: "Apr", revenue: 168000, ticketSales: 128000, ancillary: 40000 },
  { month: "May", revenue: 195000, ticketSales: 148000, ancillary: 47000 },
  { month: "Jun", revenue: 210000, ticketSales: 160000, ancillary: 50000 },
];

const mockAPI = {
  async getFlights() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.flights);
    const flights = stored ? JSON.parse(stored) : defaultFlights;
    return flights;
  },

  async restoreUser(userId: number) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.users);
    const users = stored ? JSON.parse(stored) : defaultUsers;
    const index = users.findIndex((u: any) => u.userId === userId);
    if (index !== -1) {
      users[index].status = "active";
      localStorage.setItem(LOCAL_STORAGE_KEYS.users, JSON.stringify(users));
      return { status: "Restored" };
    }
    return { status: "Not Found" };
  },

  async createFlight(flightData: any) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.flights);
    const flights = stored ? JSON.parse(stored) : defaultFlights;
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

  async updateFlight(flightId: string, flightData: any) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.flights);
    const flights = stored ? JSON.parse(stored) : defaultFlights;
    const index = flights.findIndex((f: any) => f.flightId === flightId);
    if (index !== -1) {
      flights[index] = { ...flights[index], ...flightData };
      localStorage.setItem(LOCAL_STORAGE_KEYS.flights, JSON.stringify(flights));
      return { status: "Updated" };
    }
    return { status: "Not Found" };
  },

  async deleteFlight(flightId: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.flights);
    let flights = stored ? JSON.parse(stored) : defaultFlights;
    flights = flights.filter((f: any) => f.flightId !== flightId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.flights, JSON.stringify(flights));
    return { status: "Cancelled" };
  },

  async getUsers() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.users);
    const users = stored ? JSON.parse(stored) : defaultUsers;
    return users;
  },

  async createUser(userData: any) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.users);
    const users = stored ? JSON.parse(stored) : defaultUsers;
    const newUserId =
      users.length > 0 ? Math.max(...users.map((u: any) => u.userId)) + 1 : 101;
    const newUser = {
      userId: newUserId,
      status: "active",
      ...userData,
    };
    users.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_KEYS.users, JSON.stringify(users));
    return { userId: newUserId, status: "Created" };
  },

  async suspendUser(userId: number) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.users);
    const users = stored ? JSON.parse(stored) : defaultUsers;
    const index = users.findIndex((u: any) => u.userId === userId);
    if (index !== -1) {
      users[index].status = "suspended";
      localStorage.setItem(LOCAL_STORAGE_KEYS.users, JSON.stringify(users));
      return { status: "Suspended" };
    }
    return { status: "Not Found" };
  },

  async deleteUser(userId: number) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.users);
    let users = stored ? JSON.parse(stored) : defaultUsers;
    users = users.filter((u: any) => u.userId !== userId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.users, JSON.stringify(users));
    return { status: "Deleted" };
  },

  async assignCrew(flightId: string, crew: string[]) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.flights);
    const flights = stored ? JSON.parse(stored) : defaultFlights;
    const index = flights.findIndex((f: any) => f.flightId === flightId);
    if (index !== -1) {
      flights[index].crew = crew;
      localStorage.setItem(LOCAL_STORAGE_KEYS.flights, JSON.stringify(flights));
      return { status: "Crew Assigned" };
    }
    return { status: "Not Found" };
  },

  async getDemandReports() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.demandReports);
    const reports = stored ? JSON.parse(stored) : defaultDemandReports;
    return reports;
  },

  async getAircrafts() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.aircrafts);
    const aircrafts = stored ? JSON.parse(stored) : defaultAircrafts;
    return aircrafts;
  },

  async getAirports() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.airports);
    const airports = stored ? JSON.parse(stored) : defaultAirports;
    return airports;
  },

  async getPayments() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.payments);
    const payments = stored ? JSON.parse(stored) : defaultPayments;
    return payments;
  },

  async getFlightStats() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.flightStats);
    const stats = stored ? JSON.parse(stored) : defaultFlightStats;
    return stats;
  },

  async getUserActivity() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.userActivity);
    const activity = stored ? JSON.parse(stored) : defaultUserActivity;
    return activity;
  },

  async getRevenueReports() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.revenueReports);
    const reports = stored ? JSON.parse(stored) : defaultRevenueReports;
    return reports;
  },
};

export default mockAPI;
