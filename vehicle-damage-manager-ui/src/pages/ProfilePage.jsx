import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Avatar, Chip, CircularProgress, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import api from '../api/axios';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Eroare la incarcarea profilului:", err);
                setError("Sistemul nu a putut prelua datele profilului dumneavoastra. Va rugam sa reincercati.");
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2035', letterSpacing: '-0.5px' }}>
                    Profilul Meu
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                    Vizualizati detaliile contului dumneavoastra de client si informatiile de identificare in sistem.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Rezumat Profil */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: '16px',
                            border: '1px solid #eef2f6',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            bgcolor: '#fff'
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 110,
                                height: 110,
                                bgcolor: 'rgba(25, 118, 210, 0.1)',
                                color: 'primary.main',
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                mb: 2
                            }}
                        >
                            {user?.username ? user.username.charAt(0).toUpperCase() : 'C'}
                        </Avatar>
                        <Typography variant="h5" fontWeight="700" sx={{ color: '#1e293b' }}>
                            {user?.username}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            {user?.email}
                        </Typography>
                        <Chip
                            label={user?.role || 'CLIENT'}
                            color="primary"
                            variant="filled"
                            sx={{ fontWeight: '700', borderRadius: '8px', px: 1 }}
                        />
                    </Paper>
                </Grid>

                {/* Detalii Identificare */}
                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: '16px',
                            border: '1px solid #eef2f6',
                            bgcolor: '#fff',
                            height: '100%'
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#1a2035', mb: 3 }}>
                            Informatii Personale Cont
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                                <PersonIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary" display="block" fontWeight="600">
                                        NUME UTILIZATOR
                                    </Typography>
                                    <Typography variant="body1" fontWeight="700" sx={{ color: '#1e293b' }}>
                                        {user?.username}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                                <EmailIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary" display="block" fontWeight="600">
                                        ADRESA DE EMAIL
                                    </Typography>
                                    <Typography variant="body1" fontWeight="700" sx={{ color: '#1e293b' }}>
                                        {user?.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                                <BadgeIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="textSecondary" display="block" fontWeight="600">
                                        ROL ACCES PLATFORMA
                                    </Typography>
                                    <Typography variant="body1" fontWeight="700" sx={{ color: '#1e293b' }}>
                                        {user?.role}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfilePage;