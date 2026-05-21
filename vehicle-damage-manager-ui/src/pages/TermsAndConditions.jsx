import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';

const TermsAndConditions = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 5, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>Termeni si Conditii</Typography>
                <Typography variant="body1" paragraph>
                    Bun venit la AutoDamage Hub. Prin utilizarea serviciilor noastre, sunteti de acord cu prelucrarea datelor vehiculului dumneavoastra in scopul evaluarii daunelor prin inteligenta artificiala...
                </Typography>
                <Typography variant="h6" sx={{ mt: 3 }}>1. Protectia Datelor (GDPR)</Typography>
                <Typography variant="body2" color="textSecondary">
                    Toate fotografiile incarcate sunt procesate anonim de algoritmii nostri de tip Computer Vision...
                </Typography>
            </Paper>
        </Container>
    );
};

export default TermsAndConditions;