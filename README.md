MY TRIP – Frontend

MY TRIP is a smart airline booking system that simplifies searching, booking, and managing flights.
This repository contains the frontend part of the project, built with React + Tailwind CSS.

🚀 Features (Frontend)
🌍 Landing Page

Modern responsive design

Navbar with Sign In and Sign Up buttons

Hero section with tagline and call-to-action

Features overview and About section

🔑 Authentication

Login & Signup forms

Form validation with error handling

Role-based redirection (Passenger, Admin, Crew)

LocalStorage-based session handling

🧑‍✈️ Passenger Dashboard

Search flights by origin, destination, and date

Book flights and select seat class

Payment simulation (CreditCard, PayPal, Wallet)

View & cancel bookings, check refund eligibility

Notifications (booking confirmations, delays, cancellations)

🛠️ Admin Dashboard

Manage flights (create, update, cancel)

Manage users (view, suspend, delete)

Assign crew to flights

View reports (demand analytics, high/low demand routes)

👨‍💼 Crew Dashboard

View assigned flights

Access passenger lists per flight

Receive notifications (delays, cancellations, assignments)

⚡ Error Handling

Global error boundary for crashes

API error handling (401, 404, 500, network errors)

Inline form validation & toast notifications

Custom 404 & 500 pages

🛠️ Tech Stack

React.js – Frontend framework

React Router – Routing and protected routes

Tailwind CSS – Styling and responsive UI

Recharts (optional) – For Admin reports/analytics

Installation

Clone the repo:

git clone https://github.com/YOUR-USERNAME/mytrip.git
cd mytrip


Switch to frontend branch:

git checkout frontend


Install dependencies:

npm install


Run locally:

npm run dev


LocalStorage – Session & mock auth handling

Fake API (Mock JSON) – Simulated backend for testing
