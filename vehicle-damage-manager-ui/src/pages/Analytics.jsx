import React from 'react';
import { Box, Typography, Grid, Paper, Divider } from '@mui/material';

const Analytics = () => {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>Statistici Sistem</Typography>
            <Grid container spacing={3}>
                {/* Indicatori Cheie */}
                {[
                    { label: 'Total Dosare', value: '1,284', color: '#4318ff' },
                    { label: 'Timp Mediu Analiza', value: '45s', color: '#6ad2ff' },
                    { label: 'Rata Aprobare AI', value: '92%', color: '#01b574' }
                ].map((stat, i) => (
                    <Grid key={i} xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="textSecondary">{stat.label}</Typography>
                            <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>{stat.value}</Typography>
                        </Paper>
                    </Grid>
                ))}

                {/* Placeholder pentru Grafice */}
                <Grid xs={12}>
                    <Paper sx={{ p: 4, borderRadius: 3, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fbfbfb', border: '2px dashed #ddd' }}>
                        <Typography color="textSecondary">
                            [ Aici se vor integra graficele folosind biblioteca Recharts sau Chart.js ]
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;