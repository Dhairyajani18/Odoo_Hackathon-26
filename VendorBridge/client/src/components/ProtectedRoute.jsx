import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If not authorized for this page, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
