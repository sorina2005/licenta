import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import api from '../api/axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', formData);
            alert("Cont creat cu succes! Te poti loga.");
            console.log(response.data);
        } catch (error) {
            alert("Eroare la inregistrare: " + error.response?.data);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h5" align="center">Inregistrare Centru Daune</Typography>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
                    <TextField fullWidth label="Username" margin="normal"
                               onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    <TextField fullWidth label="Email" margin="normal"
                               onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <TextField fullWidth label="Parola" type="password" margin="normal"
                               onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
                        Creeaza Cont
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;