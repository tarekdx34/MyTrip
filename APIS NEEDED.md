1. Login API
   Request Body:
   json
   {
   "email": "string",
   "password": "string"
   }
   Response:
   json
   {
   "userId": "number",
   "role": "string" ("Passenger" | "Admin" | "Crew"),
   "token": "string",
   "message": "string"
   }
2. Signup API
   Request Body:
   json
   {
   "email": "string",
   "password": "string",
   "name": "string"
   }
   Response:
   json
   {
   "userId": "number",
   "role": "string" ("Passenger"),
   "message": "string"
   }
3. Get User API
   Request Parameters:
   json
   {
   "userId": "number"
   }
   Response:
   json
   {
   "userId": "number",
   "role": "string" ("Passenger" | "Admin" | "Crew"),
   "name": "string",
   "email": "string"
   }
4. Get Flights API
   Request Parameters:
   json
   {
   "origin": "string",
   "destination": "string",
   "departureDate": "string" (YYYY-MM-DD),
   "returnDate": "string" (YYYY-MM-DD)
   }
   Response:
   json
   [
   {
   "flightId": "string",
   "airline": "string",
   "origin": "string",
   "destination": "string",
   "departureTime": "string" (HH:mm),
   "arrivalTime": "string" (HH:mm),
   "price": {
   "currency": "string",
   "economy": "number",
   "business": "number"
   },
   "availableSeats": "number"
   }
   ]
5. Get Bookings API
   Request Parameters:
   json
   {
   "userId": "number"
   }
   Response:
   json
   [
   {
   "bookingId": "string",
   "flightId": "string",
   "userId": "number",
   "seat": "string",
   "status": "string" ("Confirmed" | "Pending" | "Cancelled")
   }
   ]
6. Cancel Booking API
   Request Parameters:
   json
   {
   "bookingId": "string"
   }
   Response:
   json
   {
   "refundEligible": "boolean",
   "message": "string"
   }
7. Get Demand Reports API
   Request Parameters:
   json
   {
   "route": "string" (origin-destination)
   }
   Response:
   json
   [
   {
   "route": "string",
   "demandLevel": "string" ("High" | "Medium" | "Low"),
   "searchesWithoutDirectFlight": "number"
   }
   ]
8. Get Crew Flights API
   Request Parameters:
   json
   {
   "crewId": "number"
   }
   Response:
   json
   [
   {
   "flightId": "string",
   "airline": "string",
   "origin": "string",
   "destination": "string",
   "departureTime": "string" (HH:mm),
   "arrivalTime": "string" (HH:mm),
   "role": "string" ("Captain" | "Co-Pilot" | "Attendant")
   }
   ]
9. Create Payment API
   Request Body:
   json
   {
   "bookingId": "string",
   "paymentMethod": "string" ("CreditCard" | "PayPal" | "ApplePay"),
   "cardholderName": "string",
   "cardNumber": "string",
   "expiry": "string" (MM/YY),
   "cvv": "string",
   "amount": "number"
   }
   Response:
   json
   {
   "paymentId": "string",
   "status": "string" ("Success" | "Failed"),
   "message": "string"
   }
10. Get Payment Status API
    Request Parameters:
    json
    {
    "paymentId": "string"
    }
    Response:
    json
    {
    "paymentId": "string",
    "status": "string" ("Success" | "Failed"),
    "message": "string"
    }
11. Update Flight API
    Request Body:
    json
    {
