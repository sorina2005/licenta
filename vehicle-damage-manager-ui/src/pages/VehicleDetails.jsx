import React from 'react';
import { Box, Typography, Paper, Grid, Divider, Button } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const VehicleDetails = () => {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Detalii BMW Seria 3</Typography>
                <Button variant="outlined" color="error">Elimina Vehicul</Button>
            </Box>

            <Grid container spacing={3}>
                <Grid xs={12} md={5}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" mb={2}>Specificatii Tehnice</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="textSecondary">Numar Inmatriculare:</Typography>
                            <Typography fontWeight="bold">B 123 ABC</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="textSecondary">Serie Sasiu (VIN):</Typography>
                            <Typography fontWeight="bold">WBA1234567890</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid xs={12} md={7}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <HistoryIcon sx={{ mr: 1 }} /> Istoric Interventii
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2" color="textSecondary" textAlign="center" py={4}>
                            Nu exista interventii sau daune inregistrate pentru acest vehicul.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default VehicleDetails;