// Mock API service for MY TRIP authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  role: 'Passenger' | 'Admin' | 'Crew';
  token: string;
  message: string;
}

export interface SignupResponse {
  userId: number;
  role: 'Passenger';
  message: string;
}

export interface User {
  userId: number;
  role: 'Passenger' | 'Admin' | 'Crew';
  name: string;
  email: string;
}

// Mock users database
const mockUsers = [
  { userId: 101, email: 'test@example.com', password: '123456', role: 'Passenger', name: 'Ahmed Ali' },
  { userId: 102, email: 'admin@mytrip.com', password: 'admin123', role: 'Admin', name: 'Sarah Admin' },
  { userId: 103, email: 'crew@mytrip.com', password: 'crew123', role: 'Crew', name: 'John Pilot' },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await delay(800); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      userId: user.userId,
      role: user.role as 'Passenger' | 'Admin' | 'Crew',
      token: `fake-jwt-token-${user.userId}`,
      message: 'Login successful'
    };
  },

  async signup(userData: SignupRequest): Promise<LoginResponse> {
    await delay(800);
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    const newUserId = Math.max(...mockUsers.map(u => u.userId)) + 1;
    
    // Add to mock database
    const newUser = {
      userId: newUserId,
      email: userData.email,
      password: userData.password,
      role: 'Passenger',
      name: userData.name
    };
    mockUsers.push(newUser);
    
    // Return login response to auto-login user after signup
    return {
      userId: newUser.userId,
      role: newUser.role,
      token: `fake-jwt-token-${newUser.userId}`,
      message: 'Signup successful. Logged in.'
    };
  },

  async getUser(userId: number): Promise<User> {
    await delay(300);
    
    const user = mockUsers.find(u => u.userId === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      userId: user.userId,
      role: user.role as 'Passenger' | 'Admin' | 'Crew',
      name: user.name,
      email: user.email
    };
  }
};

// Mock data for dashboard
export const mockData = {
  passengerBookings: [
    {
      bookingId: 'BK001',
      flightNumber: 'SV123',
      from: 'Riyadh (RUH)',
      to: 'Dubai (DXB)',
      date: '2025-02-15',
      time: '14:30',
      status: 'Confirmed',
      seat: '12A'
    },
    {
      bookingId: 'BK002',
      flightNumber: 'MS456',
      from: 'Jeddah (JED)',
      to: 'Cairo (CAI)',
      date: '2025-03-20',
      time: '09:15',
      status: 'Pending',
      seat: '8C'
    }
  ],
  
  adminReports: {
    totalFlights: 1247,
    totalPassengers: 45632,
    revenue: '$2,450,000',
    topDestinations: ['Dubai', 'Cairo', 'London', 'Paris', 'New York']
  },
  
  crewFlights: [
    {
      flightNumber: 'SV789',
      route: 'Riyadh → London',
      date: '2025-02-10',
      time: '22:45',
      aircraft: 'Boeing 777',
      role: 'Captain'
    },
    {
      flightNumber: 'SV234',
      route: 'Dubai → Paris',
      date: '2025-02-12',
      time: '06:30',
      aircraft: 'Airbus A350',
      role: 'First Officer'
    }
  ]
};