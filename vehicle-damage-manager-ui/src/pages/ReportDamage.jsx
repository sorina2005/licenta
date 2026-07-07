import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, TextField, Grid, CircularProgress, Snackbar, Alert, MenuItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../api/axios';

const steps = ['Identificare Vehicul & Detalii', 'Incarcare Fotografii Daune'];

const accidentTypes = [
    { value: 'COLIZIUNE_TRAFIC', label: 'Coliziune in trafic cu alt vehicul' },
    { value: 'DAUNA_PARCARE', label: 'Dauna gasita in parcare' },
    { value: 'VANDALISM', label: 'Act de vandalism / Autor necunoscut' },
    { value: 'IMPACT_OBSTACOL', label: 'Impact cu un obstacol fix (stalp, gard, copac)' },
    { value: 'ALTELE', label: 'Alt tip de eveniment' }
];

const ReportDamage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [plateNumber, setPlateNumber] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [county, setCounty] = useState('');
    const [accidentDate, setAccidentDate] = useState(new Date().toISOString().split('T')[0]);
    const [accidentType, setAccidentType] = useState('COLIZIUNE_TRAFIC');

    const [reportId, setReportId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handlePlateUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/client/process-plate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            if (data.status === 'success') {
                setPlateNumber(data.plate);
                setSnackbar({ open: true, message: `Numar detectat: ${data.plate}`, severity: 'success' });
            } else {
                setSnackbar({ open: true, message: 'Nu s-a putut detecta numarul. Introduceti manual.', severity: 'warning' });
            }
        } catch (error) {
            console.error('Eroare ALPR:', error);
            setSnackbar({ open: true, message: 'Eroare la comunicarea cu serverul ALPR.', severity: 'error' });
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
            if (!plateNumber || !city || !county) {
                setSnackbar({ open: true, message: 'Va rugam sa completati numarul, orasul si judetul.', severity: 'warning' });
                return;
            }
            setLoading(true);
            try {
                const savedUser = localStorage.getItem('user');
                const loggedInUser = savedUser ? JSON.parse(savedUser) : null;

                if (!loggedInUser || !loggedInUser.username) {
                    setSnackbar({ open: true, message: 'Sesiune utilizator invalida. Va rugam sa va reautentificati.', severity: 'error' });
                    return;
                }

                const descriereCompleta = `Tip accident: ${accidentType} | Locatie: ${city}, ${county} | Data: ${accidentDate} | Detalii: ${description || 'Nu sunt detalii suplimentare'}`;

                const response = await api.post('/client/reports', {
                    username: loggedInUser.username,
                    licensePlate: plateNumber,
                    description: descriereCompleta,
                    status: 'IN_ASTEPTARE'
                });

                setReportId(response.data.id);
                setSnackbar({ open: true, message: 'Dosar initiat cu succes!', severity: 'success' });
                setActiveStep(1);
            } catch (error) {
                console.error("Detalii eroare server:", error.response?.data || error.message);
                const message = error.response?.data?.message || 'Problema de structura sau comunicare cu serverul.';
                setSnackbar({ open: true, message: `Eroare la salvarea dosarului: ${message}`, severity: 'error' });
            } finally {
                setLoading(false);
            }
        } else if (activeStep === 1) {
            if (selectedFiles.length === 0) {
                setSnackbar({ open: true, message: 'Va rugam sa adaugati cel putin o fotografie a avariilor.', severity: 'warning' });
                return;
            }
            setLoading(true);
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('files', file);
            });
            try {
                await api.post(`/client/reports/${reportId}/upload-images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setSnackbar({ open: true, message: 'Imagini incarcate cu succes!', severity: 'success' });
                setActiveStep(2);
            } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: 'Eroare la incarcarea fisierelor media pe server.', severity: 'error' });
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
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" mb={3} textAlign="center" color="text.secondary">
                            Incarca o poza cu numarul de inmatriculare pentru identificare automata sau introdu datele manual.
                        </Typography>

                        <Box textAlign="center" mb={4}>
                            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Incarca Poza Numar'}
                                <input type="file" hidden onChange={handlePlateUpload} accept="image/*" />
                            </Button>
                        </Box>

                        {/* Container principal flexibil si aliniat perfect */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                            <TextField
                                required
                                fullWidth
                                label="Numar de inmatriculare autovehicul"
                                value={plateNumber}
                                onChange={(e) => setPlateNumber(e.target.value)}
                            />

                            {/* Randul 2: Judet si Oras */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Judet accident"
                                    value={county}
                                    onChange={(e) => setCounty(e.target.value)}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Oras / Localitate accident"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </Box>

                            {/* Randul 3: Data si Tip accident */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Data producerii evenimentului"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={accidentDate}
                                    onChange={(e) => setAccidentDate(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    select
                                    label="Tipul accidentului"
                                    value={accidentType}
                                    onChange={(e) => setAccidentType(e.target.value)}
                                >
                                    {accidentTypes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            {/* Randul 4: Descriere */}
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Descriere sumara a dinamicilor sau avariilor vizibile"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Box>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body1" mb={3} color="text.secondary">Incarca fotografii detaliate cu partile avariate ale vehiculului.</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                            {imagePreviews.length > 0 ? (
                                imagePreviews.map((url, index) => (
                                    <Paper key={index} variant="outlined" sx={{ height: 120, overflow: 'hidden', borderRadius: '8px' }}>
                                        <img src={url} alt={`Avarie ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Paper>
                                ))
                            ) : (
                                [1, 2, 3].map((i) => (
                                    <Paper key={i} variant="outlined" sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', color: 'text.secondary' }}>
                                        Foto {i}
                                    </Paper>
                                ))
                            )}
                        </Box>
                        <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} disabled={loading}>
                            Adauga Poze
                            <input type="file" multiple hidden accept="image/*" onChange={handleDamageFilesChange} />
                        </Button>
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
                        <Button onClick={() => { setActiveStep(0); setPlateNumber(''); setCity(''); setCounty(''); setDescription(''); setSelectedFiles(''); setImagePreviews([]); setReportId(null); }} sx={{ mt: 2 }}>Incepe un dosar nou</Button>
                    </Box>
                ) : (
                    <>
                        {renderStepContent(activeStep)}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Button disabled={activeStep === 0 || loading} onClick={handleBack} sx={{ mr: 1 }}>Inapoi</Button>
                            <Button variant="contained" onClick={handleNext} disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : (activeStep === steps.length - 1 ? 'Finalizeaza si Trimite' : 'Continua')}
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ReportDamage;