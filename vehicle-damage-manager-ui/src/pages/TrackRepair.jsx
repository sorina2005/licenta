import React, { useState } from 'react';
import { Box, Typography, Paper, Stepper, Step, StepLabel, StepContent, Button, ButtonGroup, Chip, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const TrackRepair = () => {
    const [cases, setCases] = useState([
        { id: 'DOS-2026-01', car: 'BMW Seria 3', plate: 'B 123 ABC', status: 'IN_ASTEPTARE' },
        { id: 'DOS-2026-02', car: 'Audi A4', plate: 'CJ 99 DEF', status: 'IN_ANALIZA' },
        { id: 'DOS-2026-03', car: 'Volkswagen Golf', plate: 'TM 45 GHI', status: 'APROBAT' },
        { id: 'DOS-2026-04', car: 'Ford Focus', plate: 'IS 22 JKL', status: 'IN_REPARATIE' },
        { id: 'DOS-2026-05', car: 'Mercedes C-Class', plate: 'B 777 MMM', status: 'FINALIZAT' },
        { id: 'DOS-2026-06', car: 'Opel Astra', plate: 'BV 08 XYZ', status: 'RESPINS' }
    ]);

    const [selectedCaseId, setSelectedCaseId] = useState('DOS-2026-01');

    const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
    const status = currentCase.status;

    const steps = [
        { label: 'Inregistrare Dosar', code: 'IN_ASTEPTARE', desc: 'Dosarul de dauna a fost receptionat cu succes in sistem si alocat unui operator.' },
        { label: 'Analiza Documentatie', code: 'IN_ANALIZA', desc: 'Operatorul evalueaza imaginile transmise si datele extrase computational prin modulul ALPR.' },
        { label: 'Aprobare Inspectie', code: 'APROBAT', desc: 'Inspectorul a validat dosarul si a emis acceptul oficial de plata catre unitatea de service.' },
        { label: 'Reparatie Efectiva', code: 'IN_REPARATIE', desc: 'Autovehiculul se afla in atelierul de service pentru executarea lucrarilor mecanice si de vopsitorie.' },
        { label: 'Finalizare si Livrare', code: 'FINALIZAT', desc: 'Toate lucrarile au fost finalizate cu succes, masina este gata de livrare iar dosarul este inchis.' }
    ];

    const getActiveStep = (currentStatus) => {
        if (currentStatus === 'RESPINS') return -1;
        return steps.findIndex(step => step.code === currentStatus?.toUpperCase());
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'APROBAT': return 'success';
            case 'FINALIZAT': return 'success';
            case 'IN_ANALIZA': return 'info';
            case 'IN_REPARATIE': return 'secondary';
            case 'IN_ASTEPTARE': return 'warning';
            case 'RESPINS': return 'error';
            default: return 'default';
        }
    };

    const handleSimulationStatusChange = (newStatus) => {
        setCases(prevCases =>
            prevCases.map(c => c.id === selectedCaseId ? { ...c, status: newStatus } : c)
        );
    };

    const activeStep = getActiveStep(status);
    const colorStyle = getStatusColor(status);

    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2035', letterSpacing: '-0.5px' }}>
                        Monitorizare Progres Reparatie
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        Selectati un dosar pentru a urmari etapele tehnice si operationale in timp real.
                    </Typography>
                </Box>

                <FormControl size="small" sx={{ minWidth: 250, bgcolor: '#fff', borderRadius: '8px' }}>
                    <InputLabel id="select-case-label">Selecteaza Dosar Client</InputLabel>
                    <Select
                        labelId="select-case-label"
                        value={selectedCaseId}
                        label="Selecteaza Dosar Client"
                        onChange={(e) => setSelectedCaseId(e.target.value)}
                        sx={{ borderRadius: '8px', fontWeight: '600' }}
                    >
                        {cases.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.id} - {c.car} ({c.plate})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: '16px', border: '1px solid #eef2f6', bgcolor: '#fff' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" fontWeight="700" color="#1a2035">
                            {currentCase.car}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Numar auto: <strong>{currentCase.plate}</strong>
                        </Typography>
                        <Chip
                            label={`Status: ${status}`}
                            color={colorStyle === 'default' ? 'default' : colorStyle}
                            size="small"
                            sx={{ fontWeight: '700', mt: 1, borderRadius: '6px' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <ButtonGroup variant="outlined" size="small" fullWidth sx={{ flexWrap: 'wrap', gap: 0.5, '& .MuiButtonGroup-grouped': { border: '1px solid #e2e8f0 !important', borderRadius: '6px !important', minWidth: '110px' } }}>
                            <Button onClick={() => handleSimulationStatusChange('IN_ASTEPTARE')} variant={status === 'IN_ASTEPTARE' ? 'contained' : 'outlined'} color="warning">In Asteptare</Button>
                            <Button onClick={() => handleSimulationStatusChange('IN_ANALIZA')} variant={status === 'IN_ANALIZA' ? 'contained' : 'outlined'} color="info">In Analiza</Button>
                            <Button onClick={() => handleSimulationStatusChange('APROBAT')} variant={status === 'APROBAT' ? 'contained' : 'outlined'} color="success">Aprobat</Button>
                            <Button onClick={() => handleSimulationStatusChange('IN_REPARATIE')} variant={status === 'IN_REPARATIE' ? 'contained' : 'outlined'} color="secondary">In Reparatie</Button>
                            <Button onClick={() => handleSimulationStatusChange('FINALIZAT')} variant={status === 'FINALIZAT' ? 'contained' : 'outlined'} color="success">Finalizat</Button>
                            <Button onClick={() => handleSimulationStatusChange('RESPINS')} variant={status === 'RESPINS' ? 'contained' : 'outlined'} color="error">Respins</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Paper>

            {status === 'RESPINS' ? (
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #fee2e2', bgcolor: '#fef2f2', textAlign: 'center' }}>
                    <CancelIcon sx={{ fontSize: 60, color: '#ef4444', mb: 2 }} />
                    <Typography variant="h5" fontWeight="bold" color="error" gutterBottom>
                        Dosar Operational Respins
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Acest dosar a fost analizat si respins de catre inspectorul de daune din cauza neconformitatilor constatate intre declaratia incidentului si avariile fizice identificate pe caroserie.
                    </Typography>
                </Paper>
            ) : (
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #eef2f6', bgcolor: '#fff' }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => {
                            const isCompleted = index < activeStep;

                            return (
                                <Step key={step.code} completed={isCompleted}>
                                    <StepLabel
                                        StepIconProps={{
                                            sx: {
                                                '&.Mui-active': {
                                                    color: status === 'FINALIZAT' ? 'success.main' : `${colorStyle}.main`
                                                },
                                                '&.Mui-completed': {
                                                    color: 'success.main'
                                                }
                                            }
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="700" sx={{ color: index <= activeStep ? '#1e293b' : '#94a3b8' }}>
                                            {step.label}
                                        </Typography>
                                    </StepLabel>
                                    <StepContent>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, mt: 0.5, maxWidth: 700, lineHeight: '1.6' }}>
                                            {step.desc}
                                        </Typography>
                                    </StepContent>
                                </Step>
                            );
                        })}
                    </Stepper>
                </Paper>
            )}
        </Box>
    );
};

export default TrackRepair;