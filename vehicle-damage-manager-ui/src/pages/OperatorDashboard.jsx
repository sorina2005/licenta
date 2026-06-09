import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import api from '../api/axios';

const OperatorDashboard = () => {
    const [unassignedReports, setUnassignedReports] = useState([]);

    useEffect(() => {
        api.get('/api/operator/unassigned')
            .then(res => setUnassignedReports(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleAssign = () => {
        // Logica pentru deschiderea unui modal de alocare catre un inspector
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="800" mb={4}>Triaj si Alocare Dosare</Typography>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" mb={2}>Dosare in asteptare alocare</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Numar Inmatriculare</TableCell>
                            <TableCell>Actiune</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {unassignedReports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>#{report.id}</TableCell>
                                <TableCell>{report.user?.username}</TableCell>
                                <TableCell>{report.vehicle?.licensePlate}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" size="small" onClick={() => handleAssign()}>
                                        Aloca Inspector
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default OperatorDashboard;