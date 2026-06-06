import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import RFQs from './pages/RFQs';
import Quotations from './pages/Quotations';
import Approvals from './pages/Approvals';
import PurchaseOrders from './pages/PurchaseOrders';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Entry Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Layout Segment */}
        <Route path="/" element={<MainLayout />}>
          
          <Route index element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="vendors" element={
            <ProtectedRoute allowedRoles={["Admin", "Procurement Officer", "Manager / Approver"]}>
              <Vendors />
            </ProtectedRoute>
          } />

          <Route path="rfqs" element={
            <ProtectedRoute>
              <RFQs />
            </ProtectedRoute>
          } />

          <Route path="quotations" element={
            <ProtectedRoute>
              <Quotations />
            </ProtectedRoute>
          } />

          <Route path="approvals" element={
            <ProtectedRoute allowedRoles={["Admin", "Procurement Officer", "Manager / Approver"]}>
              <Approvals />
            </ProtectedRoute>
          } />

          <Route path="purchase-orders" element={
            <ProtectedRoute>
              <PurchaseOrders />
            </ProtectedRoute>
          } />

          <Route path="invoices" element={
            <ProtectedRoute>
              <Invoices />
            </ProtectedRoute>
          } />

          <Route path="reports" element={
            <ProtectedRoute allowedRoles={["Admin", "Procurement Officer", "Manager / Approver"]}>
              <Reports />
            </ProtectedRoute>
          } />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
