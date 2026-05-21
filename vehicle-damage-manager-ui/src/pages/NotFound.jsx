import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Typography variant="h1" fontWeight="bold" color="primary" sx={{ fontSize: '10rem', opacity: 0.2 }}>404</Typography>
            <Typography variant="h4" sx={{ mb: 2 }}>Oops! Pagina negasita.</Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>Pagina pe care o cautati nu exista sau a fost mutata.</Typography>
            <Button variant="contained" onClick={() => navigate('/')}>Inapoi la Home</Button>
        </Box>
    );
};

export default NotFound;