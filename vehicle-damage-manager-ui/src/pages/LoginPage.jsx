import React, { useState } from 'react';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', credentials);
            const user = response.data;

            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'ADMIN') {
                navigate('/admin-dashboard');
            } else if (user.role === 'INSPECTOR') {
                navigate('/inspector-dashboard');
            } else {
                navigate('/client-dashboard');
            }
        } catch (err) {
            setError('Nume utilizator sau parola incorecta!');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
            py: 4
        }}>
            <Container maxWidth="sm">
                <Button
                    component={Link}
                    to="/"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        mb: 3,
                        color: '#616161',
                        textTransform: 'none',
                        fontWeight: '600',
                        '&:hover': { background: 'rgba(0,0,0,0.04)' }
                    }}
                >
                    Inapoi la pagina principala
                </Button>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        border: '1px solid #eaeaea',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                        background: '#ffffff'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            sx={{
                                mb: 2,
                                bgcolor: 'rgba(25, 118, 210, 0.1)',
                                color: 'primary.main',
                                width: 64,
                                height: 64
                            }}
                        >
                            <LockOutlinedIcon sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: '#1a1a1a',
                                letterSpacing: '-0.02em',
                                mb: 1
                            }}
                        >
                            Autentificare
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#616161', textAlign: 'center' }}>
                            Accesati platforma pentru gestionarea dosarelor auto.
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Nume utilizator"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Parola"
                            type="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 4,
                                mb: 3,
                                py: 1.8,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.3)',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px 0 rgba(25, 118, 210, 0.4)',
                                }
                            }}
                        >
                            Log In
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                            <Typography variant="body2" sx={{ color: '#616161' }}>
                                Nu aveti inca un cont?{' '}
                                <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                                    Inregistrati-va aici
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;