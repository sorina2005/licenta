import React, { useState } from 'react';
import { Container, Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import api from '../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('Un email cu instructiuni a fost trimis daca adresa exista in sistem.');
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la procesarea cererii.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 10 }}>
                <Paper sx={{ p: 4, borderRadius: 3 }} elevation={3}>
                    <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">Resetare Parola</Typography>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            required
                            label="Adresa Email"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, py: 1.5 }}>
                            Trimite Link Resetare
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default ForgotPassword;