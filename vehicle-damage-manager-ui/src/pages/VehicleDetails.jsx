import React from 'react';
import { Box, Typography, Paper, Grid, Divider, Button } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeleteIcon from '@mui/icons-material/Delete';

const VehicleDetails = () => {
    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <DirectionsCarIcon sx={{ fontSize: 40, color: '#1a2035' }} />
                    <Box>
                        <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2035', letterSpacing: '-0.5px' }}>
                            Detalii Vehicul - BMW Seria 3
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Vizualizati specificatiile tehnice si istoricul complet al dosarelor asociate.
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ borderRadius: '10px', fontWeight: 'bold', px: 3 }}
                >
                    Elimina Vehicul
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eef2f6' }}>
                        <Typography variant="h6" fontWeight="700" mb={2} sx={{ color: '#1e293b' }}>
                            Specificatii Tehnice
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography color="textSecondary" variant="body2">Numar Inmatriculare:</Typography>
                            <Typography fontWeight="600" variant="body2" sx={{ bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '6px' }}>
                                B 123 ABC
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="textSecondary" variant="body2">Serie Sasiu (VIN):</Typography>
                            <Typography fontWeight="700" variant="body2" sx={{ color: '#1a2035', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                                WBA12345678901234
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eef2f6' }}>
                        <Typography variant="h6" fontWeight="700" mb={2} sx={{ display: 'flex', alignItems: 'center', color: '#1e293b' }}>
                            <HistoryIcon sx={{ mr: 1, color: '#64748b' }} /> Istoric Interventii si Daune
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="textSecondary" textAlign="center">
                                Nu exista interventii sau dosare de dauna inregistrate pentru acest autovehicul.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default VehicleDetails;