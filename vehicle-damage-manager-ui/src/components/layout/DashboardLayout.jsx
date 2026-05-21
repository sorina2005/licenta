import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom'; // <--- ESTE IMPORTAT?
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;