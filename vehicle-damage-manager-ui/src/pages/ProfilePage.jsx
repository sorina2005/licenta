import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, TextField, Grid, Avatar } from '@mui/material';
import api from '../api/axios';

const ProfilePage = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                console.error("Eroare la incarcarea profilului", error);
                setUser({
                    username: 'Ciobanu Doina',
                    email: 'noreply.autodamagehub@gmail.com',
                    role: 'CLIENT'
                });
            }
        };
        fetchProfile();
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Profil Utilizator
                </Typography>
                <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={3} display="flex" justifyContent="center">
                            <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
                                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </Avatar>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nume utilizator"
                                        value={user.username}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Adresa Email"
                                        value={user.email}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Rol Alocat"
                                        value={user.role}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
};

export default ProfilePage;