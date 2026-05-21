import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [sent, setSent] = useState(false);

    return (
        <Box sx={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" mb={2}>Recuperare Parola</Typography>
                {!sent ? (
                    <>
                        <Typography variant="body2" color="textSecondary" mb={3}>
                            Introdu adresa de email si iti vom trimite un link pentru resetarea parolei.
                        </Typography>
                        <TextField fullWidth label="Email" variant="outlined" sx={{ mb: 3 }} />
                        <Button variant="contained" fullWidth onClick={() => setSent(true)}>
                            Trimite Link
                        </Button>
                    </>
                ) : (
                    <Alert severity="success">
                        Daca exista un cont asociat acestui email, vei primi instructiunile in cateva minute.
                    </Alert>
                )}
                <Button component={Link} to="/login" sx={{ mt: 2, textTransform: 'none' }}>
                    Inapoi la Autentificare
                </Button>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;