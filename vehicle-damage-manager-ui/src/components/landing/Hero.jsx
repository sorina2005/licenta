import React from 'react';
import { Box, Container, Typography, Button, Stack, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Hero = () => {
    return (
        <Box sx={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
            pt: { xs: 10, md: 15 },
            pb: { xs: 10, md: 15 },
            borderBottom: '1px solid #e0e0e0',
            '&::after': {
                content: '""',
                position: 'absolute',
                width: '400px',
                height: '400px',
                bgcolor: 'primary.light',
                opacity: 0.15,
                borderRadius: '50%',
                filter: 'blur(100px)',
                bottom: '-100px',
                left: '-100px',
                zIndex: 0,
            }
        }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            color: 'primary.main',
                            px: 2,
                            py: 0.5,
                            borderRadius: 5,
                            mb: 2,
                            border: '1px solid rgba(25, 118, 210, 0.2)'
                        }}>
                            <AssessmentIcon sx={{ fontSize: '1rem', mr: 1 }} />
                            <Typography variant="caption" fontWeight="bold" textTransform="uppercase" letterSpacing={1}>
                                Platforma Enterprise
                            </Typography>
                        </Box>

                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                color: '#1a1a1a',
                                lineHeight: 1.1,
                                mb: 3,
                                letterSpacing: '-0.02em',
                                fontSize: { xs: '2.5rem', md: '3.5rem' }
                            }}
                        >
                            Gestionare Inteligenta pentru <Box component="span" sx={{
                            background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>Centre de Daune</Box>
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{ color: '#616161', mb: 5, fontWeight: 400, lineHeight: 1.7, maxWidth: '600px' }}
                        >
                            Centralizeaza comunicarea intre Client, Inspector si Service intr-un ecosistem digital securizat.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                            <Button
                                component={Link}
                                to="/register"
                                variant="contained"
                                size="large"
                                startIcon={<RocketLaunchIcon />}
                                sx={{
                                    px: 5,
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
                                Incepe Acum
                            </Button>

                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    width: '120%',
                                    height: '120%',
                                    border: '1px dashed #ccc',
                                    borderRadius: '50%',
                                    animation: 'spin 60s linear infinite',
                                }
                            }}
                        />

                        <Paper
                            elevation={10}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                position: 'relative',
                                bgcolor: 'background.paper',
                                border: '1px solid #eaeaea',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                transform: 'rotate(3deg)',
                            }}
                        >
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" fontWeight="bold">Dosar: #33421 (Activ)</Typography>
                                    <Box sx={{ width: 10, height: 10, bgcolor: 'success.main', borderRadius: '50%' }} />
                                </Stack>

                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                                    <DirectionsCarIcon color="primary" sx={{ fontSize: '2rem' }} />
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">Dacia Logan, 2022</Typography>
                                        <Typography variant="caption" color="textSecondary">VIN: UU1KSD...</Typography>
                                    </Box>
                                </Box>

                                <Typography variant="caption" color="textSecondary">Status AI: Identificare Placa (Succes: B-123-ABC)</Typography>
                                <Box sx={{ width: '100%', height: 6, bgcolor: '#e0e0e0', borderRadius: 3 }}>
                                    <Box sx={{ width: '75%', height: '100%', bgcolor: 'primary.main', borderRadius: 3 }} />
                                </Box>
                            </Stack>
                        </Paper>

                        <Box sx={{
                            position: 'absolute',
                            width: 60,
                            height: 60,
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            top: -20,
                            right: -20,
                            boxShadow: '0 4px 10px rgba(25, 118, 210, 0.4)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            animation: 'float 4s ease-in-out infinite'
                        }}>
                            AI
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <style>
                {`
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </Box>
    );
};

export default Hero;