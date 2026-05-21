import React from 'react';
import { Box, Typography, Paper, TextField, Button, Avatar, Divider, Grid } from '@mui/material';

const UserProfile = () => {
    const user = JSON.parse(localStorage.getItem('user')) || { username: 'Utilizator', email: 'user@example.com', role: 'CLIENT' };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>Profilul Meu</Typography>

            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                        <Avatar sx={{ width: 100, height: 100, margin: '0 auto', bgcolor: 'primary.main', fontSize: '2rem' }}>
                            {user.username[0].toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" sx={{ mt: 2 }}>{user.username}</Typography>
                        <Typography variant="body2" color="textSecondary">{user.role}</Typography>
                        <Button variant="outlined" sx={{ mt: 3, textTransform: 'none' }} fullWidth>Schimba Poza</Button>
                    </Paper>
                </Grid>

                <Grid xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        <Typography variant="h6" mb={2}>Informatii Cont</Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={2}>
                            <Grid xs={12} md={6}>
                                <TextField fullWidth label="Nume Utilizator" defaultValue={user.username} variant="outlined" />
                            </Grid>
                            <Grid xs={12} md={6}>
                                <TextField fullWidth label="Adresa Email" defaultValue={user.email} variant="outlined" />
                            </Grid>
                            <Grid xs={12}>
                                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Schimbare Parola</Typography>
                                <TextField fullWidth type="password" label="Parola Noua" variant="outlined" />
                            </Grid>
                        </Grid>
                        <Button variant="contained" sx={{ mt: 4, textTransform: 'none' }}>Salveaza Modificarile</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserProfile;