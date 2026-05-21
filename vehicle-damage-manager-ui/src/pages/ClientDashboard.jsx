import React from 'react';
import { Grid, Paper, Typography, Box, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ClientDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Salut, {user?.username || 'Utilizator'}!
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={4}>
                Iata un rezumat al activitatii tale in sistemul AutoDamage Hub.
            </Typography>

            <Grid container spacing={3}>
                {/* Card Statistica 1 */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h6">Vehicule Inregistrate</Typography>
                        <Typography variant="h3" fontWeight="bold" color="primary">0</Typography>
                    </Paper>
                </Grid>
                {/* Card Statistica 2 */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h6">Dosare Active</Typography>
                        <Typography variant="h3" fontWeight="bold" color="warning.main">0</Typography>
                    </Paper>
                </Grid>
                {/* Card Actiune Rapida */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                        <Typography variant="h6" mb={1}>Ai o dauna noua?</Typography>
                        <Button variant="contained" color="secondary" startIcon={<AddCircleOutlineIcon />}>
                            Raporteaza Acum
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ClientDashboard;