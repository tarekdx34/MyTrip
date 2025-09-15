# TODO: Refactor PassengerDashboard to use Real APIs

## Current Status

- PassengerDashboard.tsx uses mockAPI for all data operations
- api.ts has real APIs but missing bookingAPI, ticketsAPI, paymentsAPI
- Backend BookingController exists with full CRUD operations

## Pending Tasks

### 1. Add bookingAPI to api.ts

- [x] Implement createBooking (POST /api/bookings)
- [x] Implement getBookingsByPassenger (GET /api/bookings/passenger/{passengerID})
- [x] Implement cancelBooking (DELETE /api/bookings/{bookingID})
- [x] Implement confirmBooking (PUT /api/bookings/{bookingID}/confirm)
- [x] Implement getBookingById (GET /api/bookings/{bookingID})
- [x] Implement refundBooking (PUT /api/bookings/{bookingID}/refund)
- [x] Add BookingRequest and BookingResponse interfaces

### 2. Add ticketsAPI to api.ts

- [x] Check if backend has ticket endpoints (may use booking data)
- [x] Implement getTicketsByPassenger
- [x] Implement modifyTicket (if needed)

### 3. Add paymentsAPI to api.ts

- [x] Check if backend has payment endpoints
- [x] Implement createPayment
- [x] Implement getPaymentStatus (if needed)

### 4. Refactor SearchFlights tab

- [ ] Replace mockAPI.getFlights with flightAPI.searchFlights or flightAPI.getAvailableFlights
- [ ] Update flight search parameters to match backend API
- [ ] Handle flight data structure differences

### 5. Refactor Bookings tab

- [ ] Replace mockAPI.getBookings with bookingAPI.getBookingsByPassenger
- [ ] Replace mockAPI.cancelBooking with bookingAPI.cancelBooking
- [ ] Update booking data handling

### 6. Refactor BookingModal

- [ ] Replace mockAPI.createBooking with bookingAPI.createBooking
- [ ] Update booking request payload to match BookingRequest DTO
- [ ] Handle booking response and redirect to payment

### 7. Refactor Notifications tab

- [ ] Check if backend has notification endpoints
- [ ] If not, implement local notification handling or create backend endpoint
- [ ] Replace mockAPI.getNotifications

### 8. Refactor Tickets tab

- [ ] Use booking data or ticketsAPI if available
- [ ] Replace mockAPI.getTickets
- [ ] Handle ticket data from bookings

### 9. Refactor CheckIn tab

- [ ] Use booking data with flightAPI.getFlightsByStatus
- [ ] Replace mockAPI.getCheckInEligibleFlights
- [ ] Implement check-in logic (may need new backend endpoint)

### 10. Refactor Profile tab

- [ ] Replace mockAPI.getProfile with userAPI.getUserById and passengerAPI.getPassengerByUserId
- [ ] Replace mockAPI.updateProfile with userAPI.updateUser
- [ ] Handle profile data structure

### 11. Refactor Refunds tab

- [ ] Use booking data with refund status
- [ ] Replace mockAPI.requestRefund with bookingAPI.refundBooking
- [ ] Replace mockAPI.getRefundStatus

### 12. Remove mockAPI usage

- [ ] Remove entire mockAPI object from PassengerDashboard.tsx
- [ ] Remove mock interfaces (Flight, Booking, etc.)
- [ ] Remove localStorage usage for mock data

### 13. Add proper error handling

- [ ] Add try/catch blocks around all API calls
- [ ] Update UI to show loading states, errors, and success messages
- [ ] Handle network errors and backend validation errors

### 14. Update types and interfaces

- [ ] Use BookingResponse from api.ts instead of mock Booking interface
- [ ] Ensure type safety throughout the component
- [ ] Update state variables to use correct types

### 15. Test all features

- [ ] Test flight search and booking creation
- [ ] Test booking management (view, cancel)
- [ ] Test check-in functionality
- [ ] Test profile updates
- [ ] Test refund requests
- [ ] Verify error handling works correctly
