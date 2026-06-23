import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Employees from './pages/Employees';
import Criteria from './pages/Criteria';
import Scores from './pages/Scores';
import Ranking from './pages/Ranking';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />


          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              {/* Dashboard & Ranking are accessible by all logged in roles (admin, manager, hrd) */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ranking" element={<Ranking />} />

              {/* Admin Only */}
              <Route element={<RoleRoute allowedRoles={['admin']} />}>
                <Route path="/users" element={<Users />} />
              </Route>

              {/* Admin & HRD */}
              <Route element={<RoleRoute allowedRoles={['admin', 'hrd']} />}>
                <Route path="/employees" element={<Employees />} />
                <Route path="/scores" element={<Scores />} />
              </Route>

              {/* Admin & Manager */}
              <Route element={<RoleRoute allowedRoles={['admin', 'manager']} />}>
                <Route path="/criteria" element={<Criteria />} />
              </Route>
            </Route>
          </Route>

          {/* Default redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;