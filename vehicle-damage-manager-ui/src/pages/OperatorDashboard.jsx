import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Tooltip, Zoom, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../api/axios';

const OperatorDashboard = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPendingReports = () => {
        api.get('/admin/reports')
            .then(res => {
                const filtered = res.data.filter(r => r.status === 'IN_ASTEPTARE' || r.status === 'IN_ANALIZA');
                setReports(filtered);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchPendingReports();
    }, []);

    const handleStartAnalysis = (id) => {
        api.put(`/admin/reports/${id}/status`, { status: 'IN_ANALIZA' })
            .then(() => {
                fetchPendingReports();
                handleOpenDetails(id);
            })
            .catch(err => console.error(err));
    };

    const handleOpenDetails = (id) => {
        api.get(`/admin/reports/${id}`)
            .then(res => {
                setSelectedReport(res.data);
                setIsModalOpen(true);
            })
            .catch(err => console.error(err));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    const handleExecuteAction = (statusValue) => {
        api.put(`/admin/reports/${selectedReport.id}/review`, { status: statusValue })
            .then(() => {
                alert('Statusul dosarului a fost actualizat conform deciziei.');
                handleCloseModal();
                fetchPendingReports();
            })
            .catch(err => console.error(err));
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2035', letterSpacing: '-0.5px' }}>
                    Panou Operational - Operator
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                    Gestionati, analizati si redirectionati dosarele nou inregistrate in sistem.
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#1a2035' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>ID Dosar</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Numar Auto</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Status Curent</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Client</TableCell>
                            <TableCell align="center" sx={{ color: '#fff', fontWeight: '700' }}>Actiuni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    Nu exista dosare care necesita atentie in acest moment.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((r) => (
                                <TableRow key={r.id} hover>
                                    <TableCell sx={{ fontWeight: '600', color: '#64748b' }}>#{r.id}</TableCell>
                                    <TableCell sx={{ fontWeight: '700', color: '#1e293b' }}>{r.licensePlate}</TableCell>
                                    <TableCell sx={{ fontWeight: '600', color: r.status === 'IN_ANALIZA' ? '#3b82f6' : '#f59e0b' }}>
                                        {r.status}
                                    </TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>{r.user?.username || 'Anonim'}</TableCell>
                                    <TableCell align="center">
                                        {r.status === 'IN_ASTEPTARE' ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                startIcon={<AssignmentIndIcon />}
                                                onClick={() => handleStartAnalysis(r.id)}
                                                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                            >
                                                Preluare
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                color="info"
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => handleOpenDetails(r.id)}
                                                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                            >
                                                Analizeaza
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth borderRadius="12px">
                {selectedReport && (
                    <>
                        <DialogTitle sx={{ bgcolor: '#1a2035', color: '#fff', fontWeight: 'bold' }}>
                            Analiza Detaliata Dosar #{selectedReport.id} - {selectedReport.licensePlate}
                        </DialogTitle>
                        <DialogContent dividers sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">Numar Inmatriculare</Typography>
                                    <Typography variant="h6" fontWeight="700" color="primary" mb={2}>{selectedReport.licensePlate}</Typography>

                                    <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">Descriere Incident</Typography>
                                    <Typography variant="body1" sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: '8px', border: '1px solid #eef2f6' }} mb={2}>
                                        {selectedReport.description || 'Nu exista descriere completata.'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="textSecondary" fontWeight="bold" mb={1}>Fotografii Daune Incarcate</Typography>
                                    <Grid container spacing={1}>
                                        {selectedReport.images && selectedReport.images.length > 0 ? (
                                            selectedReport.images.map((img, idx) => (
                                                <Grid item xs={6} key={idx}>
                                                    <Paper variant="outlined" sx={{ height: 110, overflow: 'hidden', borderRadius: '8px' }}>
                                                        <img
                                                            src={`http://localhost:8080/uploads/${img.fileName}`}
                                                            alt="Avarie"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                                            onClick={() => window.open(`http://localhost:8080/uploads/${img.fileName}`, '_blank')}
                                                        />
                                                    </Paper>
                                                </Grid>
                                            ))
                                        ) : (
                                            <Typography variant="caption" color="textSecondary" sx={{ pl: 1 }}>Nu au fost gasite imagini asociate.</Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Box>
                                <Typography variant="subtitle2" color="textSecondary" fontWeight="bold" mb={1}>Istoric Interactiune Asistent AI</Typography>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f0f4f8', borderRadius: '8px' }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Clientul a parcurs asistentul conversational. Datele tehnice au fost extrase si stocate structural.
                                    </Typography>
                                </Paper>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa', justifyContent: 'space-between' }}>
                            <Button variant="outlined" onClick={handleCloseModal} sx={{ borderRadius: '8px' }}>
                                Inchide Fereastra
                            </Button>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={() => handleExecuteAction('RESPINS')}
                                    sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                >
                                    Respinge
                                </Button>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    startIcon={<ErrorIcon />}
                                    onClick={() => handleExecuteAction('DOCUMENTE_SUPLIMENTARE')}
                                    sx={{ borderRadius: '8px', fontWeight: 'bold', color: '#fff' }}
                                >
                                    Cere Acte
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={() => handleExecuteAction('VALIDAT_PENTRU_INSPECTIE')}
                                    sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                >
                                    Valideaza
                                </Button>
                            </Box>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default OperatorDashboard;