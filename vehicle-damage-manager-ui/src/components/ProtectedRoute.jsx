import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const userJson = localStorage.getItem('user');
    let user = null;

    try {
        user = userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        user = null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // normalizare in litere mari pentru a preveni erorile de tip 'admin' vs 'ADMIN'
    const currentRole = (user.role || '').toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());

    if (!normalizedAllowedRoles.includes(currentRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;