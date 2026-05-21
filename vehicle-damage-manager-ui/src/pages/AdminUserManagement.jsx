import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminUserManagement = () => {
    const users = [
        { id: 1, name: 'Ion Popescu', email: 'ion@test.com', role: 'CLIENT' },
        { id: 2, name: 'Vasile Inspector', email: 'vasile@auto.ro', role: 'INSPECTOR' },
        { id: 3, name: 'Admin Hub', email: 'admin@autodamage.ro', role: 'ADMIN' },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>Gestionare Utilizatori</Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nume</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell align="right">Actiuni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id} hover>
                                <TableCell>{u.id}</TableCell>
                                <TableCell>{u.name}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={u.role}
                                        color={u.role === 'ADMIN' ? 'error' : u.role === 'INSPECTOR' ? 'secondary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" color="primary"><EditIcon /></IconButton>
                                    <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminUserManagement;