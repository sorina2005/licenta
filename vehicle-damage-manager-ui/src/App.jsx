import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ClientDashboard from './pages/ClientDashboard';
import MyVehicles from "./pages/MyVehicles.jsx";
import ReportDamage from "./pages/ReportDamage.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Rute fara Sidebar */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Rute cu Sidebar (Layout comun) */}
                <Route element={<DashboardLayout />}>
                    <Route path="/client-dashboard" element={<ClientDashboard />} />
                    <Route path="/my-vehicles" element={<MyVehicles />} />
                    <Route path="/report-damage" element={<ReportDamage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;