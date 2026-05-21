import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, TextField, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const steps = ['Identificare Vehicul', 'Incarcare Fotografii Daune', 'Detalii Suplimentare (AI Chat)'];

const ReportDamage = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body1" mb={2}>Incarca o poza cu numarul de inmatriculare pentru identificare automata.</Typography>
                        <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                            Incarca Poza Numar
                            <input type="file" hidden />
                        </Button>
                        <TextField fullWidth label="Sau introdu manual numarul" sx={{ mt: 3 }} />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body1" mb={2}>Incarca fotografii detaliate cu partile avariate ale vehiculului.</Typography>
                        <Grid container spacing={2}>
                            {[1, 2, 3].map((i) => (
                                <Grid key={i} xs={4}>
                                    <Paper variant="outlined" sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' }}>
                                        Foto {i}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        <Button variant="contained" component="label" sx={{ mt: 2 }}>
                            Adauga Poze
                            <input type="file" multiple hidden />
                        </Button>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body1">Asistentul AI te va ajuta sa completezi detaliile incidentului.</Typography>
                        <Paper sx={{ p: 2, height: 200, bgcolor: '#f0f2f5', mt: 2, display: 'flex', alignItems: 'flex-end' }}>
                            <Typography variant="caption" color="textSecondary">Interfata Chatbot va fi integrata aici...</Typography>
                        </Paper>
                    </Box>
                );
            default:
                return 'Pas necunoscut';
        }
    };

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="h4" fontWeight="bold" mb={4}>Raportare Dauna Noua</Typography>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>
            <Paper sx={{ p: 4, mt: 4, borderRadius: 3 }}>
                {activeStep === steps.length ? (
                    <Box textAlign="center">
                        <Typography variant="h5">Dosar trimis cu succes!</Typography>
                        <Button onClick={() => setActiveStep(0)} sx={{ mt: 2 }}>Incepe un dosar nou</Button>
                    </Box>
                ) : (
                    <>
                        {renderStepContent(activeStep)}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Inapoi</Button>
                            <Button variant="contained" onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finalizeaza' : 'Continua'}
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default ReportDamage;