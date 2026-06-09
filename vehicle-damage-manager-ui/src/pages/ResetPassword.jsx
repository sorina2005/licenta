import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import api from '../api/axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Parolele nu coincid.');
            return;
        }

        try {
            await api.post('/auth/reset-password', { token, newPassword: password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Token invalid sau expirat.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 10 }}>
                <Paper sx={{ p: 4, borderRadius: 3 }} elevation={3}>
                    <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">Introdu noua parola</Typography>
                    {success && <Alert severity="success" sx={{ mb: 2 }}>Parola schimbata! Redirectionare la login...</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            required
                            type="password"
                            label="Noua Parola"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            required
                            type="password"
                            label="Confirma Noua Parola"
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.5 }} disabled={success}>
                            Actualizeaza Parola
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default ResetPassword;

//todo reset password sa functioneze doar in cazul in care userul are token-ul