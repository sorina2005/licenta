import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GppBadIcon from '@mui/icons-material/GppBad';

const Unauthorized = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4, maxWidth: 500 }}>
                <GppBadIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>Acces Restrictionat</Typography>
                <Typography variant="body1" color="textSecondary" mb={4}>
                    Nu aveți permisiunile necesare pentru a accesa această secțiune a sistemului.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/client-dashboard')}>
                    Inapoi la Dashboard
                </Button>
            </Paper>
        </Box>
    );
};

export default Unauthorized;