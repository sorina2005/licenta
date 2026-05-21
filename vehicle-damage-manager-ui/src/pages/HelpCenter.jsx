import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HelpCenter = () => {
    const faqs = [
        { q: "Cum functioneaza detectia automata?", a: "Sistemul nostru foloseste algoritmi de computer vision pentru a identifica piese avariate precum bare, aripi sau faruri din fotografiile incarcate." },
        { q: "Ce documente sunt necesare?", a: "Pentru a deschide un dosar aveti nevoie de talonul masinii, poze cu avaria si o scurta descriere a evenimentului." },
        { q: "Cat dureaza evaluarea?", a: "Analiza initiala prin AI dureaza sub 60 de secunde, urmand ca un inspector sa valideze raportul in maxim 24 de ore." }
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>Centru de Ajutor</Typography>
            {faqs.map((f, i) => (
                <Accordion key={i} sx={{ mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="500">{f.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography color="textSecondary">{f.a}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default HelpCenter;