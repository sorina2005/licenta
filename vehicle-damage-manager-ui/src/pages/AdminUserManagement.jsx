import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    Button, Select, MenuItem, FormControl, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, IconButton, Tooltip, Zoom, InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';
import api from '../api/axios';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'CLIENT' });

    // State-uri pentru modalul de vizualizare masini
    const [vehiclesOpen, setVehiclesOpen] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [selectedUsername, setSelectedUsername] = useState('');

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

    const handleViewVehicles = (userId, username) => {
        api.get(`/admin/users/${userId}/vehicles`)
            .then(res => {
                setVehicles(res.data);
                setSelectedUsername(username);
                setVehiclesOpen(true);
            })
            .catch(err => {
                alert('Eroare la descarcarea listei de vehicule.');
                console.error(err);
            });
    };

    const handleDownloadUserReport = (userId) => {
        window.open(`http://localhost:8080/api/admin/users/${userId}/report/pdf`, '_blank');
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Antet Pagina */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2035', letterSpacing: '-0.5px' }}>
                        Management Utilizatori
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        Administrati conturile din sistem, alocati roluri si gestionati permisiunile de acces.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                        borderRadius: '10px',
                        px: 3,
                        py: 1.2,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
                    }}
                >
                    Utilizator Nou
                </Button>
            </Box>

            {/* Tabel Date */}
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#1a2035' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>ID</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Nume Utilizator</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Email</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: '700' }}>Rol Alocat</TableCell>
                            <TableCell align="center" sx={{ color: '#fff', fontWeight: '700' }}>Actiuni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow
                                key={u.id}
                                hover
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    transition: 'background-color 0.2s ease'
                                }}
                            >
                                <TableCell sx={{ fontWeight: '600', color: '#64748b' }}>#{u.id}</TableCell>
                                <TableCell sx={{ fontWeight: '600', color: '#1e293b' }}>{u.username}</TableCell>
                                <TableCell sx={{ color: '#64748b' }}>{u.email}</TableCell>
                                <TableCell>
                                    <FormControl size="small" sx={{ minWidth: 130 }}>
                                        <Select
                                            value={u.role || 'CLIENT'}
                                            onChange={(e) => handleRoleChangeLocal(u.id, e.target.value)}
                                            sx={{
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                bgcolor: '#f8fafc'
                                            }}
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
                                        {/* Buton Salvare Rol */}
                                        <Tooltip title="Salveaza Modificarile" TransitionComponent={Zoom} arrow>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => handleSaveRole(u.id, u.role)}
                                                sx={{ bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}
                                            >
                                                <SaveIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        {/* Actiuni specifice exclusiv rolului de CLIENT */}
                                        {u.role === 'CLIENT' && (
                                            <>
                                                {/* Buton Vizualizare Vehicule */}
                                                <Tooltip title="Vizualizeaza Vehicule" TransitionComponent={Zoom} arrow>
                                                    <IconButton
                                                        color="info"
                                                        size="small"
                                                        onClick={() => handleViewVehicles(u.id, u.username)}
                                                        sx={{ bgcolor: '#e0f2fe', '&:hover': { bgcolor: '#bae6fd' } }}
                                                    >
                                                        <DirectionsCarIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                {/* Buton Descarcare Raport PDF Per Client */}
                                                <Tooltip title="Descarca Fisa Daune PDF" TransitionComponent={Zoom} arrow>
                                                    <IconButton
                                                        color="success"
                                                        size="small"
                                                        onClick={() => handleDownloadUserReport(u.id)}
                                                        sx={{ bgcolor: '#f0fdf4', '&:hover': { bgcolor: '#dcfce7' } }}
                                                    >
                                                        <DescriptionIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}

                                        {/* Buton Stergere Utilizator */}
                                        <Tooltip title="Sterge Utilizator" TransitionComponent={Zoom} arrow>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteUser(u.id)}
                                                sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Modal Creare Utilizator */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: { borderRadius: '16px', p: 1, minWidth: 400 }
                }}
            >
                <DialogTitle sx={{ fontWeight: '800', pb: 1 }}>Creare Utilizator Nou</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
                    <TextField
                        label="Nume Utilizator"
                        fullWidth
                        variant="outlined"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>),
                        }}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>),
                        }}
                    />
                    <TextField
                        label="Parola"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><LockIcon color="action" /></InputAdornment>),
                        }}
                    />
                    <FormControl fullWidth>
                        <Select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            startAdornment={<InputAdornment position="start"><ShieldIcon color="action" sx={{ ml: 1, mr: -0.5 }} /></InputAdornment>}
                            sx={{ borderRadius: '8px' }}
                        >
                            <MenuItem value="CLIENT">CLIENT</MenuItem>
                            <MenuItem value="OPERATOR">OPERATOR</MenuItem>
                            <MenuItem value="INSPECTOR">INSPECTOR</MenuItem>
                            <MenuItem value="SERVICE">SERVICE</MenuItem>
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button onClick={() => setOpen(false)} sx={{ fontWeight: 'bold', color: '#64748b' }}>
                        Anuleaza
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleCreateUser}
                        sx={{ borderRadius: '8px', fontWeight: 'bold', px: 3 }}
                    >
                        Creeaza
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Vizualizare Masini Client */}
            <Dialog open={vehiclesOpen} onClose={() => setVehiclesOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: '800' }}>Autovehicule Inregistrate - {selectedUsername}</DialogTitle>
                <DialogContent dividers>
                    {vehicles.length === 0 ? (
                        <Typography variant="body1" sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
                            Acest client nu are niciun autovehicul inregistrat in sistem.
                        </Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell><strong>ID Vehicul</strong></TableCell>
                                    <TableCell><strong>Numar Inmatriculare</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vehicles.map((v) => (
                                    <TableRow key={v.id}>
                                        <TableCell sx={{ color: '#64748b' }}>#{v.id}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#1e293b' }}>{v.licensePlate || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setVehiclesOpen(false)} variant="contained" color="primary" sx={{ borderRadius: '8px', fontWeight: 'bold' }}>
                        Inchide
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminUserManagement;