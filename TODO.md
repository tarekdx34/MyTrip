# TODO: Integrate Real Backend API in MY TRIP Frontend

## Overview

Replace mockAPI calls in dashboard components with real fetch calls to backend API at http://localhost:8081/api using token from localStorage for authentication.

## Steps

### 1. Update PassengerDashboard.tsx

- [ ] Replace mockAPI.getFlights() with fetch to /api/flights
- [ ] Replace mockAPI.getBookings(userId) with fetch to /api/bookings?userId={userId}
- [ ] Replace mockAPI.getNotifications(userId) with fetch to /api/notifications?userId={userId}
- [ ] Replace mockAPI.getTickets(userId) with fetch to /api/tickets?userId={userId}
- [ ] Replace mockAPI.getCheckInEligibleFlights(userId) with fetch to /api/checkin-eligible?userId={userId}
- [ ] Replace mockAPI.getProfile(userId) with fetch to /api/profile?userId={userId}
- [ ] Replace mockAPI.getRefundStatus(userId) with fetch to /api/refunds?userId={userId}
- [ ] Add Authorization header with Bearer token to all requests
- [ ] Add loading spinner and error handling
- [ ] Use userId from localStorage instead of hardcoded 101

### 2. Update AdminDashboard.jsx

- [ ] Replace mockAPI.getFlights() with fetch to /api/flights
- [ ] Replace mockAPI.getUsers() with fetch to /api/users
- [ ] Replace mockAPI.getDemandReports() with fetch to /api/reports/demand
- [ ] Replace mockAPI.getAircrafts() with fetch to /api/aircrafts
- [ ] Replace mockAPI.getAirports() with fetch to /api/airports
- [ ] Replace mockAPI.getPayments() with fetch to /api/payments
- [ ] Replace mockAPI.getFlightStats() with fetch to /api/flights/stats
- [ ] Replace mockAPI.getUserActivity() with fetch to /api/users/activity
- [ ] Replace mockAPI.getRevenueReports() with fetch to /api/reports/revenue
- [ ] Add Authorization header with Bearer token to all requests
- [ ] Add loading spinner and error handling

### 3. Check and Update CrewDashboard.jsx

- [ ] Read CrewDashboard.jsx to understand current implementation
- [ ] Replace mockAPI calls with real API calls
- [ ] Add Authorization header and error handling

### 4. Check and Update FrontDeskDashboard.jsx

- [ ] Read FrontDeskDashboard.jsx to understand current implementation
- [ ] Replace mockAPI calls with real API calls
- [ ] Add Authorization header and error handling

### 5. Testing

- [ ] Test login flow and token storage
- [ ] Test data fetching in each dashboard
- [ ] Test error handling and loading states
- [ ] Test role-based dashboard access

## API Endpoints Reference (from APIS NEEDED.md)

- Auth: /api/auth/login, /api/auth/register
- Flights: /api/flights
- Bookings: /api/bookings
- Users: /api/users
- Reports: /api/reports/\*
- Aircrafts: /api/aircrafts
- Airports: /api/airports
- Payments: /api/payments
- Tickets: /api/tickets
- Profile: /api/profile
- Refunds: /api/refunds
- Check-in: /api/checkin-eligible, /api/checkin

## Notes

- All API calls require Authorization: Bearer {token} header
- Use userId from localStorage for user-specific requests
- Handle loading states and errors gracefully
- Show error toasts for failed requests
