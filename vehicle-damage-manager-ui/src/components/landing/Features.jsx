import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const Features = () => {
    return (
        <Box sx={{
            py: 12,
            background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
            position: 'relative'
        }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                            display: 'block',
                            mb: 2
                        }}
                    >
                        Ecosistem Digital
                    </Typography>
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontWeight: 800,
                            color: '#1a1a1a',
                            letterSpacing: '-0.02em',
                            fontSize: { xs: '2rem', md: '2.8rem' }
                        }}
                    >
                        Tehnologie de Ultima Ora pentru Daune Auto
                    </Typography>
                </Box>

                <Grid container spacing={4}>

                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            height: '100%',
                            p: 4,
                            borderRadius: 4,
                            border: '1px solid #eef0f2',
                            background: '#ffffff',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 15px 35px rgba(46, 125, 50, 0.1)',
                                borderColor: 'rgba(46, 125, 50, 0.2)'
                            }
                        }}>
                            <Box sx={{
                                display: 'inline-flex',
                                p: 2,
                                borderRadius: 3,
                                bgcolor: 'rgba(46, 125, 50, 0.08)',
                                color: '#2e7d32',
                                mb: 3
                            }}>
                                <CameraAltIcon sx={{ fontSize: 32 }} />
                            </Box>
                            <CardContent sx={{ p: 0 }}>
                                <Typography variant="h5" fontWeight="700" mb={2} sx={{ color: '#1a1a1a' }}>
                                    Recunoastere OCR
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#616161', lineHeight: 1.6 }}>
                                    Tehnologie avansata LPR pentru identificarea imediata a placutelor auto si precompletarea datelor.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            height: '100%',
                            p: 4,
                            borderRadius: 4,
                            border: '1px solid #eef0f2',
                            background: '#ffffff',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 15px 35px rgba(237, 108, 2, 0.1)',
                                borderColor: 'rgba(237, 108, 2, 0.2)'
                            }
                        }}>
                            <Box sx={{
                                display: 'inline-flex',
                                p: 2,
                                borderRadius: 3,
                                bgcolor: 'rgba(237, 108, 2, 0.08)',
                                color: '#ed6c02',
                                mb: 3
                            }}>
                                <AssignmentTurnedInIcon sx={{ fontSize: 32 }} />
                            </Box>
                            <CardContent sx={{ p: 0 }}>
                                <Typography variant="h5" fontWeight="700" mb={2} sx={{ color: '#1a1a1a' }}>
                                    Gestiune Digitala
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#616161', lineHeight: 1.6 }}>
                                    Flux de lucru optimizat si trasabil intre Client, Inspector si Service, totul intr-o singura aplicatie.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Features;