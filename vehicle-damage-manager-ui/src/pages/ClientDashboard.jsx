import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Chip, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import api from '../api/axios';

const ClientDashboard = () => {
    const [myReports, setMyReports] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const user = savedUser ? JSON.parse(savedUser) : null;
        if (!user?.username) {
            return;
        }

        api.get('/client/reports', {
            withCredentials: true
        })
            .then(res => setMyReports(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="800">Dosarele Mele de Dauna</Typography>
                <Button variant="contained" component={Link} to="/report-damage" startIcon={<AddIcon />}>
                    Raporteaza dauna noua
                </Button>
            </Box>

            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary">Total Dosare</Typography>
                            <Typography variant="h4">{myReports.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary">In Reparatie</Typography>
                            <Typography variant="h4" color="primary.main">
                                {myReports.filter(r => r.status === 'IN_REPARATIE').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary">Solutionate</Typography>
                            <Typography variant="h4" color="success.main">
                                {myReports.filter(r => r.status === 'FINALIZAT').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Dosar</TableCell>
                            <TableCell>Vehicul</TableCell>
                            <TableCell>Data crearii</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {myReports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>#{report.id}</TableCell>
                                <TableCell>
                                    {report.vehicle?.brand || report.licensePlate} {report.vehicle?.model || ''}
                                </TableCell>
                                <TableCell>
                                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Chip label={report.status} color="primary" variant="outlined" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default ClientDashboard;