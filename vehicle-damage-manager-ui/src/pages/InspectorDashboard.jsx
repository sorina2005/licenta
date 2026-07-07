import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import api from '../api/axios';

const InspectorDashboard = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchInspectorReports = () => {
        api.get('/admin/reports/inspector/reports')
            .then(res => {
                setReports(res.data);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchInspectorReports();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenGallery = (report) => {
        setSelectedReport(report);
        setIsGalleryOpen(true);
    };

    const handleCloseGallery = () => {
        setIsGalleryOpen(false);
        setSelectedReport(null);
    };

    const handleDecision = (id, statusValue) => {
        api.put(`/admin/reports/${id}/inspector-review`, { status: statusValue })
            .then(() => {
                setSnackbar({
                    open: true,
                    message: `Dosarul a fost marcat ca fiind ${statusValue}.`,
                    severity: 'success'
                });
                fetchInspectorReports();
            })
            .catch(err => {
                console.error(err);
                setSnackbar({
                    open: true,
                    message: 'Eroare la salvarea deciziei tehnice.',
                    severity: 'error'
                });
            });
    };

    const handleDownloadPdf = (id) => {
        api.get(`/admin/reports/${id}/export-pdf`, { responseType: 'blob' })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Dosar_Dauna_${id}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(err => {
                console.error(err);
                setSnackbar({ open: true, message: 'Eroare la descarcarea fisierului PDF.', severity: 'error' });
            });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const activeReports = reports.filter(r => r.status === 'VALIDAT_PENTRU_INSPECTIE' || r.status === 'REPARATIE_EFECTUATA');
    const archivedReports = reports.filter(r => r.status === 'FINALIZAT');

    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2035', letterSpacing: '-0.5px' }}>
                    Panou Evaluare - Inspector Daune
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                    Gestionati dosarele de dauna active si accesati arhiva documentelor finalizate.
                </Typography>
            </Box>

            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }} textColor="primary" indicatorColor="primary">
                <Tab label={`Dosare Active (${activeReports.length})`} sx={{ fontWeight: 'bold' }} />
                <Tab label={`Arhiva / Istoric (${archivedReports.length})`} sx={{ fontWeight: 'bold' }} />
            </Tabs>

            {tabValue === 0 && (
                <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#1a2035' }}>
                                <TableCell sx={{ color: '#fff', fontWeight: '700' }}>ID</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Numar Auto</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Descriere Avarii</TableCell>
                                <TableCell align="center" sx={{ color: '#fff', fontWeight: '700' }}>Gestiune Media</TableCell>
                                <TableCell align="center" sx={{ color: '#fff', fontWeight: '700' }}>Decizie Fina</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeReports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        Nu exista dosare active care asteapta inspectia tehnica.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                activeReports.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell sx={{ fontWeight: '600', color: '#64748b' }}>#{r.id}</TableCell>
                                        <TableCell sx={{ fontWeight: '700', color: '#1e293b' }}>{r.licensePlate}</TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>{r.description || 'Fara descriere'}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                color="info"
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => handleOpenGallery(r)}
                                                sx={{ borderRadius: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                            >
                                                {r.status === 'REPARATIE_EFECTUATA' ? 'Vizualizare Deviz' : `Foto (${r.images ? r.images.length : 0})`}
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                {r.status === 'REPARATIE_EFECTUATA' ? (
                                                    <Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', bgcolor: '#0284c7', color: '#fff' }}>
                                                        Reparatie Efectuata
                                                    </Box>
                                                ) : (
                                                    <>
                                                        <Button variant="contained" color="success" size="small" startIcon={<CheckCircleIcon />} onClick={() => handleDecision(r.id, 'APROBAT')} sx={{ borderRadius: '8px', fontWeight: 'bold' }}>
                                                            Aproba
                                                        </Button>
                                                        <Button variant="contained" color="error" size="small" startIcon={<CancelIcon />} onClick={() => handleDecision(r.id, 'RESPINS_INSPECTOR')} sx={{ borderRadius: '8px', fontWeight: 'bold' }}>
                                                            Respinge
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            {tabValue === 1 && (
                <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#334155' }}>
                                <TableCell sx={{ color: '#fff', fontWeight: '700' }}>ID</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Numar Auto</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Descriere Avarii</TableCell>
                                <TableCell align="center" sx={{ color: '#fff', fontWeight: '700' }}>Detalii Tehnice</TableCell>
                                <TableCell align="center" sx={{ color: '#fff', fontWeight: '700' }}>Actiuni Export</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {archivedReports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        Nu exista dosare finalizate in arhiva sistemului.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                archivedReports.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell sx={{ fontWeight: '600', color: '#64748b' }}>#{r.id}</TableCell>
                                        <TableCell sx={{ fontWeight: '700', color: '#1e293b' }}>{r.licensePlate}</TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>{r.description || 'Fara descriere'}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="outlined" color="secondary" size="small" startIcon={<VisibilityIcon />} onClick={() => handleOpenGallery(r)} sx={{ borderRadius: '8px', fontWeight: 'bold' }}>
                                                Vezi Deviz Final
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" color="error" size="small" startIcon={<PictureAsPdfIcon />} onClick={() => handleDownloadPdf(r.id)} sx={{ borderRadius: '8px', fontWeight: 'bold', bgcolor: '#dc2626' }}>
                                                Descarca PDF
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            <Dialog open={isGalleryOpen} onClose={handleCloseGallery} maxWidth="md" fullWidth>
                {selectedReport && (
                    <>
                        <DialogTitle sx={{ bgcolor: '#1a2035', color: '#fff', fontWeight: 'bold' }}>
                            Detalii si Evaluare Dosar #{selectedReport.id} ({selectedReport.licensePlate})
                        </DialogTitle>
                        <DialogContent dividers sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">Numar Inmatriculare</Typography>
                                    <Typography variant="h6" fontWeight="700" color="primary" mb={2}>{selectedReport.licensePlate}</Typography>

                                    <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">Descriere Avarii</Typography>
                                    <Typography variant="body1" sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: '8px', border: '1px solid #eef2f6' }} mb={2}>
                                        {selectedReport.description || 'Nu exista descriere completata.'}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" color="textSecondary" fontWeight="bold" mb={1}>Galerie Foto Incidente</Typography>
                                    <Grid container spacing={1}>
                                        {selectedReport.images && selectedReport.images.length > 0 ? (
                                            selectedReport.images.map((img, idx) => (
                                                <Grid size={{ xs: 6, sm: 4 }} key={idx}>
                                                    <Paper variant="outlined" sx={{ height: 100, overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
                                                        <img
                                                            src={`http://localhost:8080/uploads/${img.fileName}`}
                                                            alt={`Avarie ${idx + 1}`}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                                            onClick={() => window.open(`http://localhost:8080/uploads/${img.fileName}`, '_blank')}
                                                        />
                                                    </Paper>
                                                </Grid>
                                            ))
                                        ) : (
                                            <Grid size={{ xs: 12 }}>
                                                <Typography variant="caption" color="textSecondary">Nu exista imagini incarcate.</Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>

                            {(selectedReport.status === 'REPARATIE_EFECTUATA' || selectedReport.status === 'FINALIZAT') && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    <Box>
                                        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold" mb={2}>
                                            Deviz Reparatie Finalizat de Service (Piese, Cantitate & Manopera)
                                        </Typography>
                                        <Paper variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                                            <Table size="small">
                                                <TableHead sx={{ bgcolor: '#f0f4f8' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: '700' }}>Componenta / Piesa</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: '700' }}>Pret Piesa</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: '700' }}>Cantitate</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: '700' }}>Manopera</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: '700' }}>Total Linie</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selectedReport.repairItems && selectedReport.repairItems.length > 0 ? (
                                                        selectedReport.repairItems.map((item, index) => {
                                                            const totalLinie = (item.partPrice * item.quantity) + item.laborPrice;
                                                            return (
                                                                <TableRow key={index}>
                                                                    <TableCell sx={{ fontWeight: '500' }}>{item.componentName}</TableCell>
                                                                    <TableCell align="center">{item.partPrice.toFixed(2)} RON</TableCell>
                                                                    <TableCell align="center">{item.quantity}</TableCell>
                                                                    <TableCell align="center">{item.laborPrice.toFixed(2)} RON</TableCell>
                                                                    <TableCell align="right" sx={{ fontWeight: '600', color: '#1e293b' }}>
                                                                        {totalLinie.toFixed(2)} RON
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 2 }}>
                                                                Nu au fost gasite elemente inregistrate in devizul tehnic.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                    {selectedReport.repairItems && selectedReport.repairItems.length > 0 && (
                                                        <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                                            <TableCell colSpan={4} sx={{ fontWeight: '800', color: '#1a2035' }}>
                                                                TOTAL GENERAL DEVIZ REPARATIE
                                                            </TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: '800', color: '#2e7d32' }}>
                                                                {selectedReport.repairItems.reduce((sum, item) =>
                                                                    sum + (item.partPrice * item.quantity) + item.laborPrice, 0
                                                                ).toFixed(2)} RON
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </Box>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa', justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={handleCloseGallery} sx={{ borderRadius: '8px' }}>
                                Inchide Fereastra
                            </Button>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {selectedReport.status === 'REPARATIE_EFECTUATA' && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => {
                                            api.put(`/admin/reports/${selectedReport.id}/close-file`)
                                                .then(() => {
                                                    setSnackbar({ open: true, message: 'Dosarul a fost finalizat si inchis cu succes.', severity: 'success' });
                                                    handleCloseGallery();
                                                    fetchInspectorReports();
                                                })
                                                .catch(err => {
                                                    console.error(err);
                                                    setSnackbar({ open: true, message: 'Eroare la inchiderea dosarului.', severity: 'error' });
                                                });
                                        }}
                                        sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                    >
                                        Aproba Deviz si Inchide Dosar
                                    </Button>
                                )}
                                {selectedReport.status === 'VALIDAT_PENTRU_INSPECTIE' && (
                                    <>
                                        <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={() => handleDecision(selectedReport.id, 'RESPINS_INSPECTOR')} sx={{ borderRadius: '8px', fontWeight: 'bold' }}>
                                            Respinge
                                        </Button>
                                        <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => handleDecision(selectedReport.id, 'APROBAT')} sx={{ borderRadius: '8px', fontWeight: 'bold' }}>
                                            Aproba (Trimite la Service)
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InspectorDashboard;