import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    Button, Select, MenuItem, FormControl, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import api from '../api/axios';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'CLIENT' });

    const fetchUsers = () => {
        api.get('/admin/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChangeLocal = (userId, newRole) => {
        setUsers(prevUsers =>
            prevUsers.map(u => (u.id === userId ? { ...u, role: newRole } : u))
        );
    };

    const handleSaveRole = (userId, updatedRole) => {
        api.put(`/admin/users/${userId}/role`, { role: updatedRole })
            .then(() => {
                alert('Rolul a fost actualizat cu succes!');
                fetchUsers();
            })
            .catch(err => {
                const serverError = err.response?.data || 'Eroare la actualizarea rolului.';
                alert(serverError);
            });
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Sunteti sigur ca doriti sa stergeti acest utilizator?')) {
            api.delete(`/admin/users/${userId}`)
                .then(() => {
                    alert('Utilizator sters cu succes!');
                    fetchUsers();
                })
                .catch(err => console.error(err));
        }
    };

    const handleCreateUser = () => {
        api.post('/admin/users', newUser)
            .then(() => {
                alert('Utilizator creat cu succes!');
                setOpen(false);
                setNewUser({ username: '', email: '', password: '', role: 'CLIENT' });
                fetchUsers();
            })
            .catch(err => {
                const serverError = err.response?.data || 'Eroare la crearea utilizatorului.';
                alert(serverError);
            });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="800">Management Utilizatori Sistem</Typography>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Utilizator Nou
                </Button>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Nume Utilizator</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Rol Alocat</strong></TableCell>
                            <TableCell align="center"><strong>Actiuni</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id} hover>
                                <TableCell>{u.id}</TableCell>
                                <TableCell>{u.username}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>
                                    <FormControl size="small" sx={{ minWidth: 140 }}>
                                        <Select
                                            value={u.role || 'CLIENT'}
                                            onChange={(e) => handleRoleChangeLocal(u.id, e.target.value)}
                                        >
                                            <MenuItem value="CLIENT">CLIENT</MenuItem>
                                            <MenuItem value="OPERATOR">OPERATOR</MenuItem>
                                            <MenuItem value="INSPECTOR">INSPECTOR</MenuItem>
                                            <MenuItem value="SERVICE">SERVICE</MenuItem>
                                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} onClick={() => handleSaveRole(u.id, u.role)}>
                                            Salveaza
                                        </Button>
                                        <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => handleDeleteUser(u.id)}>
                                            Sterge
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Creare Utilizator Nou</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: 350 }}>
                    <TextField label="Nume Utilizator" fullWidth value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
                    <TextField label="Email" type="email" fullWidth value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                    <TextField label="Parola" type="password" fullWidth value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                    <FormControl fullWidth>
                        <Select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                            <MenuItem value="CLIENT">CLIENT</MenuItem>
                            <MenuItem value="OPERATOR">OPERATOR</MenuItem>
                            <MenuItem value="INSPECTOR">INSPECTOR</MenuItem>
                            <MenuItem value="SERVICE">SERVICE</MenuItem>
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Anuleaza</Button>
                    <Button variant="contained" color="success" onClick={handleCreateUser}>Creeaza</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminUserManagement;