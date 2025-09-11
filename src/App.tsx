import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import PassengerDashboard from "./components/PassengerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import CrewDashboard from "./components/CrewDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentPage from "./components/PaymentPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Toast";

function App() {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/passenger-dashboard"
              element={
                <ProtectedRoute>
                  <PassengerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crew-dashboard"
              element={
                <ProtectedRoute>
                  <CrewDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ToastProvider>
  );
}

export default App;
