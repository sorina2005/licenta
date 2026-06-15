import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../api/axios';

const AdminDamageReports = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        api.get('/admin/reports')
            .then(res => setReports(res.data))
            .catch(err => console.error(err));
    }, []);

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

    const handleDownloadPDF = () => {
        // Deschide direct link-ul de download din backend
        window.open('http://localhost:8080/api/admin/reports/export/pdf', '_blank');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="800">Management Global Dosare Daune</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPDF}
                >
                    Export Raport PDF
                </Button>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell><strong>ID Dosar</strong></TableCell>
                            <TableCell><strong>Detalii/Descriere Incident</strong></TableCell>
                            <TableCell><strong>Numar Inmatriculare</strong></TableCell>
                            <TableCell><strong>Proprietar Dosar (Client)</strong></TableCell>
                            <TableCell><strong>Email Client</strong></TableCell>
                            <TableCell><strong>Status Curent</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((r) => (
                            <TableRow key={r.id} hover>
                                <TableCell>{r.id}</TableCell>
                                <TableCell>{r.description || r.details || 'Fara descriere'}</TableCell>
                                <TableCell>{r.licensePlate || r.plateNumber || 'N/A'}</TableCell>
                                <TableCell>{r.user?.username || r.client?.username || 'Anonim'}</TableCell>
                                <TableCell>{r.user?.email || r.client?.email || 'N/A'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={r.status || 'IN_ASTEPTARE'}
                                        color={getStatusColor(r.status)}
                                        variant="contained"
                                        sx={{ fontWeight: 'bold', minWidth: 120 }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default AdminDamageReports;