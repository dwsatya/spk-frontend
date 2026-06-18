import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import ManagerDashboard from './manager/ManagerDashboard';
import HrdDashboard from './hrd/HrdDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'hrd':
      return <HrdDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
}


