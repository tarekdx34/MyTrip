/* registry worked but login dont */
// // API service for MY TRIP authentication with backend
// const API_BASE_URL = 'http://localhost:8080/api/auth';

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface SignupRequest {
//   name: string;
//   email: string;
//   password: string;
//   userType: 'passenger' | 'admin' | 'crew' | 'front_desk';
//   passportNumber?: string;
//   nationality?: string;
//   dateOfBirth?: string;
//   employeeNumber?: string;
//   accessLevel?: string;
//   position?: string;
//   licenseNumber?: string;
//   department?: string;
// }

// export interface LoginResponse {
//   token: string;
//   userId: number;
//   role: string;
// }

// export interface SignupResponse {
//   message: string;
// }

// export interface User {
//   userId: number;
//   role: string;
//   name: string;
//   email: string;
// }

// export const authAPI = {
//   async login(credentials: LoginRequest): Promise<LoginResponse> {
//     const response = await fetch(`${API_BASE_URL}/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Login failed');
//     }

//     return await response.json();
//   },

//   async signup(userData: SignupRequest): Promise<SignupResponse> {
//     const response = await fetch(`${API_BASE_URL}/register`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Signup failed');
//     }

//     // The backend returns a plain string, not JSON
//     const data = await response.text();
//     return { message: data };
//   },

//   async getUser(userId: number): Promise<User> {
//     // This might need a backend endpoint, for now return mock
//     throw new Error('Not implemented');
//   }
// };

// // Mock data for dashboard
// export const mockData = {
//   passengerBookings: [
//     {
//       bookingId: 'BK001',
//       flightNumber: 'SV123',
//       from: 'Riyadh (RUH)',
//       to: 'Dubai (DXB)',
//       date: '2025-02-15',
//       time: '14:30',
//       status: 'Confirmed',
//       seat: '12A'
//     },
//     {
//       bookingId: 'BK002',
//       flightNumber: 'MS456',
//       from: 'Jeddah (JED)',
//       to: 'Cairo (CAI)',
//       date: '2025-03-20',
//       time: '09:15',
//       status: 'Pending',
//       seat: '8C'
//     }
//   ],

//   adminReports: {
//     totalFlights: 1247,
//     totalPassengers: 45632,
//     revenue: '$2,450,000',
//     topDestinations: ['Dubai', 'Cairo', 'London', 'Paris', 'New York']
//   },

//   crewFlights: [
//     {
//       flightNumber: 'SV789',
//       route: 'Riyadh → London',
//       date: '2025-02-10',
//       time: '22:45',
//       aircraft: 'Boeing 777',
//       role: 'Captain'
//     },
//     {
//       flightNumber: 'SV234',
//       route: 'Dubai → Paris',
//       date: '2025-02-12',
//       time: '06:30',
//       aircraft: 'Airbus A350',
//       role: 'First Officer'
//     }
//   ]
// };

// API service for MY TRIP authentication with backend
const API_BASE_URL = "http://localhost:8081/api/auth";
const API_BASE_URL_GENERAL = "http://localhost:8081/api";

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to get userId
const getUserId = (): number | null => {
  const userId = localStorage.getItem("userId");
  return userId ? parseInt(userId) : null;
};

// Helper function to make authenticated requests
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    return await response.text();
  }
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  userType: "passenger" | "admin" | "crew" | "front_desk";
  passportNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  employeeNumber?: string;
  accessLevel?: string;
  position?: string;
  licenseNumber?: string;
  department?: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  role: string;
}

export interface SignupResponse {
  message: string;
}

export interface User {
  userId: number;
  role: string;
  name: string;
  email: string;
}

export const authAPI = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      // Backend returns plain string for errors, not JSON
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Login failed");
    }

    return await response.json();
  },

  async signup(userData: SignupRequest): Promise<SignupResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }

    // The backend returns a plain string, not JSON
    const data = await response.text();
    return { message: data };
  },

  async getUser(userId: number): Promise<User> {
    // This might need a backend endpoint, for now return mock
    throw new Error("Not implemented");
  },
};

// Dashboard API functions
export const dashboardAPI = {
  // Flights
  async getFlights(searchParams?: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    returnDate?: string;
  }) {
    const params = new URLSearchParams();
    if (searchParams?.origin) params.append("origin", searchParams.origin);
    if (searchParams?.destination)
      params.append("destination", searchParams.destination);
    if (searchParams?.departureDate)
      params.append("departureDate", searchParams.departureDate);
    if (searchParams?.returnDate)
      params.append("returnDate", searchParams.returnDate);

    const url = `${API_BASE_URL_GENERAL}/flights${
      params.toString() ? "?" + params.toString() : ""
    }`;
    return authenticatedFetch(url);
  },

  // Bookings
  async getBookings(userId?: number) {
    const userIdParam = userId || getUserId();
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/bookings?userId=${userIdParam}`
    );
  },

  async cancelBooking(bookingId: string) {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/bookings/cancel`, {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    });
  },

  async modifyBooking(bookingId: string, updates: any) {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/bookings/modify`, {
      method: "PUT",
      body: JSON.stringify({ bookingId, updates }),
    });
  },

  // Tickets
  async getTickets(userId?: number) {
    const userIdParam = userId || getUserId();
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/tickets?userId=${userIdParam}`
    );
  },

  async modifyTicket(ticketId: string, updates: any) {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/tickets/modify`, {
      method: "PUT",
      body: JSON.stringify({ ticketId, updates }),
    });
  },

  // Check-in
  async getCheckInEligibleFlights(userId?: number) {
    const userIdParam = userId || getUserId();
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/checkin-eligible?userId=${userIdParam}`
    );
  },

  async checkIn(bookingId: string, seatNumber: string) {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/checkin`, {
      method: "POST",
      body: JSON.stringify({ bookingId, seatNumber }),
    });
  },

  async getBoardingPass(ticketId: string) {
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/boarding-pass?ticketId=${ticketId}`
    );
  },

  // Profile
  async getProfile(userId?: number) {
    const userIdParam = userId || getUserId();
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/profile?userId=${userIdParam}`
    );
  },

  async updateProfile(userId: number, profileData: any) {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/profile`, {
      method: "PUT",
      body: JSON.stringify({ userId, ...profileData }),
    });
  },

  // Refunds
  async requestRefund(bookingId: string, reason: string) {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/refunds`, {
      method: "POST",
      body: JSON.stringify({ bookingId, reason }),
    });
  },

  async getRefundStatus(userId?: number) {
    const userIdParam = userId || getUserId();
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/refunds?userId=${userIdParam}`
    );
  },

  // Notifications
  async getNotifications(userId?: number) {
    const userIdParam = userId || getUserId();
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/notifications?userId=${userIdParam}`
    );
  },

  // Admin APIs
  async getUsers() {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/users`);
  },

  async getDemandReports(route?: string) {
    const params = route ? `?route=${route}` : "";
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/reports/demand${params}`
    );
  },

  async getAircrafts() {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/aircrafts`);
  },

  async getAirports() {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/airports`);
  },

  async getPayments() {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/payments`);
  },

  async getFlightStats() {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/flights/stats`);
  },

  async getUserActivity() {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/users/activity`);
  },

  async getRevenueReports() {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/reports/revenue`);
  },

  async updateFlight(flightId: string, updates: any) {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/flights`, {
      method: "PUT",
      body: JSON.stringify({ flightId, updates }),
    });
  },

  // Crew APIs
  async getCrewFlights(crewId?: number) {
    const crewIdParam = crewId || getUserId();
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/crew/flights?crewId=${crewIdParam}`
    );
  },

  async getFlightPassengers(flightId: string) {
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/flights/${flightId}/passengers`
    );
  },

  // Front Desk APIs
  async getAllBookings(status?: string) {
    const params = status ? `?status=${status}` : "";
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/bookings/all${params}`);
  },

  async getPaymentsByBooking(bookingId: string) {
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/payments?bookingId=${bookingId}`
    );
  },

  async resolvePayment(bookingId: string) {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/payments/resolve`, {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    });
  },

  async createPayment(paymentData: any) {
    return authenticatedFetch(`${API_BASE_URL_GENERAL}/payments`, {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  },

  async getPaymentStatus(paymentId: string) {
    return authenticatedFetch(
      `${API_BASE_URL_GENERAL}/payments/${paymentId}/status`
    );
  },
};

// Mock data for dashboard
export const mockData = {
  passengerBookings: [
    {
      bookingId: "BK001",
      flightNumber: "SV123",
      from: "Riyadh (RUH)",
      to: "Dubai (DXB)",
      date: "2025-02-15",
      time: "14:30",
      status: "Confirmed",
      seat: "12A",
    },
    {
      bookingId: "BK002",
      flightNumber: "MS456",
      from: "Jeddah (JED)",
      to: "Cairo (CAI)",
      date: "2025-03-20",
      time: "09:15",
      status: "Pending",
      seat: "8C",
    },
  ],

  adminReports: {
    totalFlights: 1247,
    totalPassengers: 45632,
    revenue: "$2,450,000",
    topDestinations: ["Dubai", "Cairo", "London", "Paris", "New York"],
  },

  crewFlights: [
    {
      flightNumber: "SV789",
      route: "Riyadh → London",
      date: "2025-02-10",
      time: "22:45",
      aircraft: "Boeing 777",
      role: "Captain",
    },
    {
      flightNumber: "SV234",
      route: "Dubai → Paris",
      date: "2025-02-12",
      time: "06:30",
      aircraft: "Airbus A350",
      role: "First Officer",
    },
  ],
};
