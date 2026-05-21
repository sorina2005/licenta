import React from 'react';
import { Box, Typography, Paper, Grid, Divider, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const ClaimPage = () => {
    // Date de test reprezentand rezultatul analizei AI
    const claimInfo = {
        id: "101",
        vehicle: "BMW Seria 3 (B 123 ABC)",
        status: "In Evaluare",
        date: "2026-04-15",
        parts: [
            { name: "Bara Fata", severity: "Mare", cost: "1200 RON" },
            { name: "Far Dreapta", severity: "Totala", cost: "3500 RON" },
            { name: "Capota", severity: "Mica", cost: "450 RON" }
        ]
    };

    const totalCost = claimInfo.parts.reduce((acc, part) => acc + parseInt(part.cost), 0);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Detalii Dosar #{claimInfo.id}</Typography>
                <Chip label={claimInfo.status} color="warning" sx={{ fontWeight: 'bold' }} />
            </Box>

            <Grid container spacing={3}>
                {/* Rezumat Vehicul */}
                <Grid xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Informatii Vehicul</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1"><strong>Vehicul:</strong> {claimInfo.vehicle}</Typography>
                        <Typography variant="body1"><strong>Data Incident:</strong> {claimInfo.date}</Typography>
                        <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f7ff', borderRadius: 2 }}>
                            <Typography variant="caption" color="primary">Analiza AI finalizata la 98% precizie</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Rezultate Detectie AI */}
                <Grid xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} /> Partile Avariate Detectate
                        </Typography>
                        <List>
                            {claimInfo.parts.map((part, index) => (
                                <ListItem key={index} divider={index !== claimInfo.parts.length - 1}>
                                    <ListItemText
                                        primary={part.name}
                                        secondary={`Severitate: ${part.severity}`}
                                    />
                                    <Typography fontWeight="bold">{part.cost}</Typography>
                                </ListItem>
                            ))}
                        </List>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                            <Typography variant="h6">Estimare Totala:</Typography>
                            <Typography variant="h5" color="primary" fontWeight="bold">{totalCost} RON</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'right' }}>
                <Button variant="outlined" sx={{ mr: 2 }}>Descarca PDF</Button>
                <Button variant="contained">Accepta Evaluarea</Button>
            </Box>
        </Box>
    );
};

export default ClaimPage;