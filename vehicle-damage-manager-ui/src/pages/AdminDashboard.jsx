import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Panou de Administrare Sistem
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Gestionati conturile utilizatorilor si vizualizati statisticile globale ale platformei AutoDamage Hub.
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {/* Card Gestiune Utilizatori */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Card elevation={3} sx={{ p: 2 }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <Box sx={{ fontSize: 50, mb: 2 }}>👥</Box>
                                <Typography variant="h5" component="div" fontWeight="medium" gutterBottom>
                                    Gestiune Utilizatori
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3, minHeight: 60 }}>
                                    Vizualizati utilizatorii inregistrati, modificati rolurile alocate si administrati drepturile de acces.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => navigate('/admin-user-management')}
                                >
                                    Accesati Gestiunea
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card Analitice */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Card elevation={3} sx={{ p: 2 }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <Box sx={{ fontSize: 50, mb: 2 }}>📊</Box>
                                <Typography variant="h5" component="div" fontWeight="medium" gutterBottom>
                                    Analitice Sistem
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3, minHeight: 60 }}>
                                    Monitorizati numarul de dosare deschise, situatia daunelor si indicatorii de performanta ai aplicatiei.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    onClick={() => navigate('/analytics')}
                                >
                                    Vizualizati Rapoartele
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AdminDashboard;