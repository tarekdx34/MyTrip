import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  if (role === "Admin") {
    return <Navigate to="/admin-dashboard" replace />;
  } else if (role === "Passenger") {
    return <Navigate to="/passenger-dashboard" replace />;
  } else if (role === "Crew") {
    return <Navigate to="/crew-dashboard" replace />;
  } else {
    // Default fallback
    return <Navigate to="/passenger-dashboard" replace />;
  }
};

export default RoleBasedRoute;
