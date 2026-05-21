import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

const InspectorDashboard = () => {
    const allClaims = [
        { id: 101, user: "Ion Popescu", vehicle: "B 123 ABC", status: "In Asteptare" },
        { id: 102, user: "Maria Enache", vehicle: "CJ 99 XYZ", status: "In Analiza AI" },
        { id: 103, user: "Andrei Dan", vehicle: "CT 44 RRR", status: "Finalizat" },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>Panou Control Inspector</Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#1976d2' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>ID Dosar</TableCell>
                            <TableCell sx={{ color: 'white' }}>Client</TableCell>
                            <TableCell sx={{ color: 'white' }}>Vehicul</TableCell>
                            <TableCell sx={{ color: 'white' }}>Status</TableCell>
                            <TableCell align="right" sx={{ color: 'white' }}>Actiuni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allClaims.map((claim) => (
                            <TableRow key={claim.id} hover>
                                <TableCell>#{claim.id}</TableCell>
                                <TableCell>{claim.user}</TableCell>
                                <TableCell>{claim.vehicle}</TableCell>
                                <TableCell>{claim.status}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" variant="contained">Revizuire</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default InspectorDashboard;