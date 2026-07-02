import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, TextField, Grid, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../api/axios'; // <-- SCHIMBAT: Folosim instanta ta configurata cu interceptor JWT

const steps = ['Identificare Vehicul', 'Incarcare Fotografii Daune', 'Detalii Suplimentare (AI Chat)'];

const ReportDamage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [plateNumber, setPlateNumber] = useState('');
    const [description, setDescription] = useState('');
    const [reportId, setReportId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handlePlateUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            // Folosim api pentru ruta de procesare placuta
            const response = await api.post('/client/process-plate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            if (data.status === 'success') {
                setPlateNumber(data.plate);
            } else {
                alert('Nu s-a putut detecta numarul. Introduceti manual.');
            }
        } catch (error) {
            console.error('Eroare ALPR:', error);
            alert('Eroare la comunicarea cu serverul ALPR.');
        } finally {
            setLoading(false);
        }
    };

    const handleDamageFilesChange = (event) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setSelectedFiles(filesArray);

            const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
            setImagePreviews(previewsArray);
        }
    };

    const handleNext = async () => {
        if (activeStep === 0) {
            if (!plateNumber) {
                alert('Va rugam sa introduceti sau sa scanati numarul de inmatriculare.');
                return;
            }
            setLoading(true);
            try {
                // IMPORTANT: Folosim api.post (care trimite automat si header-ul Authorization: Bearer ...)
                const response = await api.post('/admin/reports', {
                    licensePlate: plateNumber,
                    description: description || 'Dosar deschis prin asistent electronic',
                    status: 'IN_ASTEPTARE'
                });

                setReportId(response.data.id);
                setActiveStep(1);
            } catch (error) {
                console.error("Detalii eroare server:", error.response?.data || error.message);
                alert(`Eroare la salvarea dosarului: ${error.response?.data?.message || 'Problema de autorizare sau structura baza de date.'}`);
            } finally {
                setLoading(false);
            }
        } else if (activeStep === 1) {
            if (selectedFiles.length === 0) {
                alert('Va rugam sa adaugati cel putin o fotografie a avariilor.');
                return;
            }
            setLoading(true);
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('files', file);
            });
            try {
                // Folosim tot api pentru incarcarea securizata a imaginilor
                await api.post(`/reports/${reportId}/upload-images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setActiveStep(2);
            } catch (error) {
                console.error(error);
                alert('Eroare la incarcarea fisierelor media pe server.');
            } finally {
                setLoading(false);
            }
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body1" mb={2}>Incarca o poza cu numarul de inmatriculare pentru identificare automata.</Typography>
                        <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Incarca Poza Numar'}
                            <input type="file" hidden onChange={handlePlateUpload} accept="image/*" />
                        </Button>
                        <TextField
                            fullWidth
                            label="Sau introdu manual numarul"
                            sx={{ mt: 3 }}
                            value={plateNumber}
                            onChange={(e) => setPlateNumber(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Descriere sumara avarii"
                            sx={{ mt: 2 }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body1" mb={2}>Incarca fotografii detaliate cu partile avariate ale vehiculului.</Typography>
                        <Grid container spacing={2} justifyContent="center">
                            {imagePreviews.length > 0 ? (
                                imagePreviews.map((url, index) => (
                                    <Grid item xs={4} key={index}>
                                        <Paper variant="outlined" sx={{ height: 100, overflow: 'hidden', borderRadius: '8px' }}>
                                            <img src={url} alt={`Avarie ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </Paper>
                                    </Grid>
                                ))
                            ) : (
                                [1, 2, 3].map((i) => (
                                    <Grid item xs={4} key={i}>
                                        <Paper variant="outlined" sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' }}>
                                            Foto {i}
                                        </Paper>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                        <Button variant="contained" component="label" sx={{ mt: 2 }} disabled={loading}>
                            Adauga Poze
                            <input type="file" multiple hidden accept="image/*" onChange={handleDamageFilesChange} />
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
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>ID-ul dosarului dumneavoastra este #{reportId}</Typography>
                        <Button onClick={() => { setActiveStep(0); setPlateNumber(''); setDescription(''); setSelectedFiles([]); setImagePreviews([]); setReportId(null); }} sx={{ mt: 2 }}>Incepe un dosar nou</Button>
                    </Box>
                ) : (
                    <>
                        {renderStepContent(activeStep)}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Button disabled={activeStep === 0 || loading} onClick={handleBack} sx={{ mr: 1 }}>Inapoi</Button>
                            <Button variant="contained" onClick={handleNext} disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : (activeStep === steps.length - 1 ? 'Finalizeaza' : 'Continua')}
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default ReportDamage;