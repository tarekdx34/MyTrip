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

import { mockAPI as frontDeskMockAPI } from "../components/FrontDeskDashboard";

// API service for MY TRIP authentication with backend
const API_BASE_URL = "http://localhost:8080/api/auth";

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
