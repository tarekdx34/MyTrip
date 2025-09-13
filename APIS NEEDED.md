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
    "flightId": "string",
    "updates": "object"
    }
    Response:
    json
    {
    "message": "string"
    }

12. Front Desk - Modify Booking API
    Request Body:
    json
    {
    "bookingId": "string",
    "updates": {
    "seat": "string"
    }
    }
    Response:
    json
    {
    "status": "string" ("Success" | "Failed"),
    "message": "string"
    }

13. Front Desk - Check-in API
    Request Body:
    json
    {
    "bookingId": "string",
    "seatNumber": "string"
    }
    Response:
    json
    {
    "status": "string" ("CheckedIn" | "Failed"),
    "boardingPass": "string",
    "message": "string"
    }

14. Front Desk - Resolve Payment API
    Request Body:
    json
    {
    "bookingId": "string"
    }
    Response:
    json
    {
    "status": "string" ("Resolved" | "Failed"),
    "message": "string"
    }

15. Front Desk - Get All Bookings API
    Request Parameters:
    json
    {
    "status": "string" (optional filter)
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

16. Front Desk - Get Payments by Booking API
    Request Parameters:
    json
    {
    "bookingId": "string"
    }
    Response:
    json
    [
    {
    "paymentId": "string",
    "bookingId": "string",
    "amount": "number",
    "status": "string" ("Pending" | "Success" | "Failed")
    }
    ]

17. Passenger - Get Tickets API
    Method: GET
    Description: Retrieve tickets for a passenger
    Request Parameters:
    json
    {
    "userId": "number"
    }
    Response:
    json
    [
    {
    "ticketId": "string",
    "bookingId": "string",
    "flightId": "string",
    "seatClass": "string",
    "seatNumber": "string",
    "status": "string" ("Confirmed" | "CheckedIn" | "Cancelled"),
    "boardingPass": "string" (optional)
    }
    ]

18. Passenger - Modify Ticket API
    Method: PUT
    Description: Modify ticket details like seat
    Request Body:
    json
    {
    "ticketId": "string",
    "updates": {
    "seatNumber": "string"
    }
    }
    Response:
    json
    {
    "status": "string" ("Success" | "Failed"),
    "message": "string"
    }

19. Passenger - Get Check-in Eligible Flights API
    Method: GET
    Description: Get flights eligible for check-in
    Request Parameters:
    json
    {
    "userId": "number"
    }
    Response:
    json
    [
    {
    "flightId": "string",
    "departureTime": "string",
    "origin": "string",
    "destination": "string",
    "checkedIn": "boolean"
    }
    ]

20. Passenger - Check-in API
    Method: POST
    Description: Perform electronic check-in
    Request Body:
    json
    {
    "bookingId": "string",
    "seatNumber": "string"
    }
    Response:
    json
    {
    "status": "string" ("CheckedIn" | "Failed"),
    "boardingPass": "string",
    "message": "string"
    }

21. Passenger - Get Boarding Pass API
    Method: GET
    Description: Retrieve boarding pass
    Request Parameters:
    json
    {
    "ticketId": "string"
    }
    Response:
    json
    {
    "boardingPass": "string",
    "flightId": "string",
    "seatNumber": "string",
    "departureTime": "string",
    "gate": "string"
    }

22. Passenger - Get Profile API
    Method: GET
    Description: Get passenger profile
    Request Parameters:
    json
    {
    "userId": "number"
    }
    Response:
    json
    {
    "userId": "number",
    "name": "string",
    "email": "string",
    "preferences": {
    "seatPreference": "string" ("Window" | "Aisle" | "Middle"),
    "mealPreference": "string",
    "frequentFlyerNumber": "string"
    }
    }

23. Passenger - Update Profile API
    Method: PUT
    Description: Update passenger profile and preferences
    Request Body:
    json
    {
    "userId": "number",
    "name": "string",
    "email": "string",
    "preferences": {
    "seatPreference": "string",
    "mealPreference": "string",
    "frequentFlyerNumber": "string"
    }
    }
    Response:
    json
    {
    "status": "string" ("Success" | "Failed"),
    "message": "string"
    }

24. Passenger - Request Refund API
    Method: POST
    Description: Request refund for a booking
    Request Body:
    json
    {
    "bookingId": "string",
    "reason": "string"
    }
    Response:
    json
    {
    "refundId": "string",
    "status": "string" ("Requested"),
    "message": "string"
    }

25. Passenger - Get Refund Status API
    Method: GET
    Description: Get refund request status
    Request Parameters:
    json
    {
    "userId": "number"
    }
    Response:
    json
    [
    {
    "refundId": "string",
    "bookingId": "string",
    "amount": "number",
    "status": "string" ("Requested" | "Processing" | "Approved" | "Rejected"),
    "reason": "string"
    }
    ]
