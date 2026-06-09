import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const InspectorDashboard = () => {
    const [assignedCases, setAssignedCases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/api/inspector/cases')
            .then(res => setAssignedCases(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="800" mb={4}>Dosare Alocate pentru Inspectie</Typography>
            <Grid container spacing={3}>
                {assignedCases.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold">Dosar #{item.id}</Typography>
                                <Typography color="textSecondary" variant="body2">Vehicul: {item.vehicle?.licensePlate}</Typography>
                                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>Status: {item.status}</Typography>
                                <Button fullWidth variant="contained" onClick={() => navigate(`/damage-analysis/${item.id}`)}>
                                    Evalueaza Daune
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default InspectorDashboard;