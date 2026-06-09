import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import api from '../api/axios';

const ServiceDashboard = () => {
    const [approvedReports, setApprovedReports] = useState([]);

    useEffect(() => {
        api.get('/api/service/approved-cases')
            .then(res => setApprovedReports(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="800" mb={4}>Gestiune Devize Service</Typography>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Dosar</TableCell>
                            <TableCell>Model Autoturism</TableCell>
                            <TableCell>Nota Constatare</TableCell>
                            <TableCell>Actiune</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {approvedReports.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>#{item.id}</TableCell>
                                <TableCell>{item.vehicle?.brand} {item.vehicle?.model}</TableCell>
                                <TableCell>Aprobat de Inspector</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="success" size="small">
                                        Adauga Deviz Pret
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

export default ServiceDashboard;