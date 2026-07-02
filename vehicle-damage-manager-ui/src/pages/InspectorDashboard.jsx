import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../api/axios';

const InspectorDashboard = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
                alert(`Dosarul a fost marcat ca fiind ${statusValue}.`);
                fetchInspectorReports();
            })
            .catch(err => console.error(err));
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2035', letterSpacing: '-0.5px' }}>
                    Panou Evaluare - Inspector Daune
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                    Analizati fisele media si emiteti rezolutiile tehnice pentru dosarele active.
                </Typography>
            </Box>

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
                        {reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    Nu exista dosare validate care asteapta inspectia tehnica.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((r) => (
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
                                            Foto ({r.images ? r.images.length : 0})
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleDecision(r.id, 'APROBAT')}
                                                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                            >
                                                Aproba
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleDecision(r.id, 'RESPINS_INSPECTOR')}
                                                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                            >
                                                Respinge
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={isGalleryOpen} onClose={handleCloseGallery} maxWidth="md" fullWidth>
                {selectedReport && (
                    <>
                        <DialogTitle sx={{ bgcolor: '#1a2035', color: '#fff', fontWeight: 'bold' }}>
                            Galerie Foto - Dosar #{selectedReport.id} ({selectedReport.licensePlate})
                        </DialogTitle>
                        <DialogContent dividers sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                                {selectedReport.images && selectedReport.images.length > 0 ? (
                                    selectedReport.images.map((img, idx) => (
                                        <Grid item xs={12} sm={6} md={4} key={idx}>
                                            <Paper variant="outlined" sx={{ height: 180, overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
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
                                    <Grid item xs={12}>
                                        <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                                            Nu exista imagini incarcate pentru acest dosar de dauna.
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                            <Button variant="contained" onClick={handleCloseGallery} sx={{ borderRadius: '8px' }}>
                                Inchide Galerie
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default InspectorDashboard;