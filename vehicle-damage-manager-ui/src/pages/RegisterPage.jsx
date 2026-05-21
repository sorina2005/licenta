import React, { useState } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Paper,
    Alert,
    Avatar
} from '@mui/material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CLIENT'
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (formData.password !== formData.confirmPassword) {
            setError('Parolele introduse nu coincid!');
            return;
        }

        if (formData.password.length < 6) {
            setError('Parola trebuie sa aiba cel putin 6 caractere!');
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = formData;

            await api.post('/auth/register', dataToSend);
            setSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la inregistrare. Va rugam incercati din nou.');
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
                            <AppRegistrationIcon sx={{ fontSize: 32 }} />
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
                            Inregistrare Client
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#616161', textAlign: 'center' }}>
                            Creeaza un cont pentru a gestiona simplu si rapid dosarele de dauna.
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                    {success && (
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                            Cont creat cu succes! Redirectionare catre autentificare...
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Nume utilizator"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Adresa Email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
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
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirma Parola"
                            type="password"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={success}
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
                            Finalizare Inregistrare
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                            <Typography variant="body2" sx={{ color: '#616161' }}>
                                Ai deja un cont?{' '}
                                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                                    Autentifica-te aici
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterPage;