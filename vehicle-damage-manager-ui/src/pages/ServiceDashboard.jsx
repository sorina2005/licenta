import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, Snackbar, Alert } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios';

const ServiceDashboard = () => {
    const [reports, setReports] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [repairItems, setRepairItems] = useState([{ componentName: '', partPrice: 0, quantity: 1, laborPrice: 0 }]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const fetchReports = () => {
        api.get('/admin/reports')
            .then(res => {
                const filtered = res.data.filter(r => r.status === 'APROBAT' || r.status === 'IN_REPARATIE');
                setReports(filtered);
            })
            .catch(err => {
                console.error(err);
                setSnackbar({ open: true, message: 'Eroare la preluarea dosarelor.', severity: 'error' });
            });
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleStartRepair = (id) => {
        api.put(`/admin/reports/${id}/status`, { status: 'IN_REPARATIE' })
            .then(() => {
                setSnackbar({ open: true, message: 'Reparatia a fost pornita.', severity: 'success' });
                fetchReports();
            })
            .catch(err => {
                console.error(err);
                setSnackbar({ open: true, message: 'Eroare la actualizarea statusului.', severity: 'error' });
            });
    };

    const handleOpenFinalize = (id) => {
        setSelectedReportId(id);
        setRepairItems([{ componentName: '', partPrice: 0, quantity: 1, laborPrice: 0 }]);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReportId(null);
    };

    const handleAddItemRow = () => {
        setRepairItems([...repairItems, { componentName: '', partPrice: 0, quantity: 1, laborPrice: 0 }]);
    };

    const handleRemoveItemRow = (index) => {
        if (repairItems.length > 1) {
            const updated = repairItems.filter((_, i) => i !== index);
            setRepairItems(updated);
        }
    };

    const handleFieldChange = (index, field, value) => {
        const updatedRows = [...repairItems];
        if (field === 'componentName') {
            updatedRows[index][field] = value;
        } else {
            updatedRows[index][field] = value === '' ? '' : Number(value);
        }
        setRepairItems(updatedRows);
    };

    const calculateTotal = () => {
        return repairItems.reduce((sum, item) => {
            const partCost = (item.partPrice || 0) * (item.quantity || 0);
            const laborCost = item.laborPrice || 0;
            return sum + partCost + laborCost;
        }, 0);
    };

    const handleSendDeviz = () => {
        api.post(`/admin/reports/${selectedReportId}/finalize`, repairItems)
            .then(() => {
                setSnackbar({ open: true, message: 'Devizul a fost inregistrat si dosarul finalizat.', severity: 'success' });
                setIsModalOpen(false);
                fetchReports();
            })
            .catch(err => {
                console.error(err);
                setSnackbar({ open: true, message: 'Eroare la finalizarea dosarului.', severity: 'error' });
            });
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2035', letterSpacing: '-0.5px' }}>
                    Atelier Service - Personal Tehnic
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                    Urmariti fluxul reparatiilor mecanice si vopsitoriei pentru autovehiculele preluate.
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#1a2035' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Numar Inmatriculare</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Specificatii Dauna</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Status Operational</TableCell>
                            <TableCell align="center" sx={{ color: '#fff', fontWeight: '700' }}>Actualizare Stadiu Lucrari</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    Nu exista autovehicule alocate pentru reparatie in acest moment.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((r) => (
                                <TableRow key={r.id} hover>
                                    <TableCell sx={{ fontWeight: '600', color: '#64748b' }}>#{r.id}</TableCell>
                                    <TableCell sx={{ fontWeight: '700', color: '#1e293b' }}>{r.licensePlate}</TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>{r.description || 'Fara specificatii'}</TableCell>
                                    <TableCell>
                                        <Box sx={{
                                            display: 'inline-block',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            bgcolor: r.status === 'IN_REPARATIE' ? '#a855f7' : '#22c55e',
                                            color: '#fff'
                                        }}>
                                            {r.status}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        {r.status === 'APROBAT' ? (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                startIcon={<BuildIcon />}
                                                onClick={() => handleStartRepair(r.id)}
                                                sx={{ borderRadius: '8px', fontWeight: 'bold', bgcolor: '#a855f7' }}
                                            >
                                                Incepe lucrul
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleOpenFinalize(r.id)}
                                                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                                            >
                                                Finalizeaza
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#1a2035', color: '#fff', fontWeight: 'bold' }}>
                    Introducere Deviz Reparatie - Dosar #{selectedReportId}
                </DialogTitle>
                <DialogContent dividers sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="700">Lista Piese si Manopera</Typography>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddItemRow} size="small">
                            Adauga linie
                        </Button>
                    </Box>

                    {repairItems.map((item, idx) => (
                        <Grid container spacing={2} alignItems="center" key={idx} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Denumire piesa / componenta"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={item.componentName}
                                    onChange={(e) => handleFieldChange(idx, 'componentName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} sm={2}>
                                <TextField
                                    label="Pret piesa"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={item.partPrice}
                                    onChange={(e) => handleFieldChange(idx, 'partPrice', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} sm={2}>
                                <TextField
                                    label="Cantitate"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={item.quantity}
                                    onChange={(e) => handleFieldChange(idx, 'quantity', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} sm={2}>
                                <TextField
                                    label="Pret manopera"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={item.laborPrice}
                                    onChange={(e) => handleFieldChange(idx, 'laborPrice', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} align="center">
                                <IconButton color="error" onClick={() => handleRemoveItemRow(idx)} disabled={repairItems.length === 1}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}

                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f1f5f9', borderRadius: '8px', textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight="700">
                            Total Deviz: {calculateTotal()} RON
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                    <Button variant="outlined" onClick={handleCloseModal} sx={{ borderRadius: '8px' }}>
                        Anuleaza
                    </Button>
                    <Button variant="contained" color="success" onClick={handleSendDeviz} sx={{ borderRadius: '8px', fontWeight: 'bold' }}>
                        Salveaza si Finalizeaza
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ServiceDashboard;