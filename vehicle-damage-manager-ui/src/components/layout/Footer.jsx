import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, Stack } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box sx={{
            background: 'linear-gradient(180deg, #141619 0%, #0c0d0e 100%)',
            color: '#94a3b8',
            pt: 10,
            pb: 6,
            mt: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <DirectionsCarIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography variant="h6" color="white" fontWeight="800" sx={{ letterSpacing: '-0.03em' }}>
                                <Box component="span" sx={{ color: 'primary.main' }}>AutoDamage</Box>Hub
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#94a3b8', pr: { md: 4 } }}>
                            Platforma inteligenta pentru managementul si automatizarea fluxurilor in centrele de daune auto. Integrare nativa intre inspectori, clienti si unitati service prin tehnologii avansate.
                        </Typography>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="white" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, mb: 3, fontSize: '0.75rem' }}>
                            Platforma
                        </Typography>
                        <Stack spacing={2}>
                            {['Servicii', 'Echipa', 'Preturi', 'Panou Control'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    underline="none"
                                    sx={{
                                        color: '#94a3b8',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { color: 'primary.main', transform: 'translateX(4px)' }
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="white" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, mb: 3, fontSize: '0.75rem' }}>
                            Suport
                        </Typography>
                        <Stack spacing={2}>
                            {['Contact', 'FAQ', 'Ghid Utilizator', 'Documentatie API'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    underline="none"
                                    sx={{
                                        color: '#94a3b8',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { color: 'primary.main', transform: 'translateX(4px)' }
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                        &copy; {currentYear} AutoDamage Hub. Toate drepturile rezervate.
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: '500' }}>
                        Proiect Licenta - Universitatea [Numele Tau]
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;