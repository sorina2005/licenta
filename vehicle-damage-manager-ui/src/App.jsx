import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';

import ClientDashboard from './pages/ClientDashboard';
import ReportDamage from './pages/ReportDamage';
import MyVehicles from './pages/MyVehicles';
import ProfilePage from './pages/ProfilePage';

import InspectorDashboard from './pages/InspectorDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import ServiceDashboard from './pages/ServiceDashboard';

// Importurile pentru Admin
import AdminDashboard from './pages/AdminDashboard'; // <-- ADAUGAT
import AdminUserManagement from './pages/AdminUserManagement';
import AdminDamageReports from './pages/AdminDamageReports';
import Analytics from './pages/Analytics';
import TrackRepair from "./pages/TrackRepair.jsx"; // <-- ASIGURA-TE CA AI IMPORTUL DACA EXISTA

const DashboardRedirect = () => {
    const userJson = localStorage.getItem('user');
    let user = null;

    try {
        user = userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        user = null;
    }

    const userRole = (user?.role || 'CLIENT').toUpperCase();

    if (userRole === 'CLIENT') return <Navigate to="/client-dashboard" replace />;
    if (userRole === 'INSPECTOR') return <Navigate to="/inspector-dashboard" replace />;
    if (userRole === 'OPERATOR') return <Navigate to="/operator-dashboard" replace />;
    if (userRole === 'SERVICE') return <Navigate to="/service-dashboard" replace />;
    if (userRole === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;

    return <Navigate to="/login" replace />;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardRedirect />} />

                    <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
                        <Route path="/client-dashboard" element={<ClientDashboard />} />
                        <Route path="/report-damage" element={<ReportDamage />} />
                        <Route path="/my-vehicles" element={<MyVehicles />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/track-repair" element={<TrackRepair />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['INSPECTOR']} />}>
                        <Route path="/inspector-dashboard" element={<InspectorDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['OPERATOR']} />}>
                        <Route path="/operator-dashboard" element={<OperatorDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['SERVICE']} />}>
                        <Route path="/service-dashboard" element={<ServiceDashboard />} />
                    </Route>

                    {/* GRUP RUTE ADMIN ACTUALIZAT */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="/admin-user-management" element={<AdminUserManagement />} />
                        <Route path="/admin-reports" element={<AdminDamageReports />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;