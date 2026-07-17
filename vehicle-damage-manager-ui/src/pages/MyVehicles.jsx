import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, IconButton, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios'; // Importul instantei Axios configurate

const MyVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        plateNumber: '',
        vin: ''
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // preluarea vehiculelor din baza de date la incarcarea paginii
    const fetchVehicles = () => {
        const userId = localStorage.getItem('userId');
        api.get(`/vehicles?userId=${userId}`)
            .then(res => {
                setVehicles(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleAddVehicle = () => {
        const userId = localStorage.getItem('userId');
        api.post(`/vehicles?userId=${userId}`, formData)
            .then(() => {
                setSnackbar({ open: true, message: 'Vehicul salvat!', severity: 'success' });
                handleClose();
                fetchVehicles();
            })
            .catch(err => {
                console.error(err);
            });
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setFormData({ brand: '', model: '', plateNumber: '', vin: '' });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDelete = (id) => {
        api.delete(`/vehicles/${id}`)
            .then(() => {
                setSnackbar({ open: true, message: 'Vehiculul a fost sters cu succes!', severity: 'success' });
                fetchVehicles();
            })
            .catch(err => {
                console.error(err);
                setSnackbar({ open: true, message: 'Eroare la stergerea vehiculului.', severity: 'error' });
            });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Vehiculele mele</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                    onClick={handleOpen}
                >
                    Adauga vehicul
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Marca / Model</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Numar inmatriculare</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Serie sasiu (VIN)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actiuni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    Nu aveti niciun vehicul inregistrat in acest moment.
                                </TableCell>
                            </TableRow>
                        ) : (
                            vehicles.map((v) => (
                                <TableRow key={v.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            {v.brand} {v.model}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={v.plateNumber}
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold', letterSpacing: 1 }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace' }}>{v.vin}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="error" size="small" onClick={() => handleDelete(v.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Inregistrare vehicul Nou</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="brand"
                        label="Marca"
                        fullWidth
                        variant="outlined"
                        value={formData.brand}
                        onChange={handleChange}
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        name="model"
                        label="Model"
                        fullWidth
                        variant="outlined"
                        value={formData.model}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="plateNumber"
                        label="Numar inmatriculare"
                        fullWidth
                        variant="outlined"
                        value={formData.plateNumber}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="vin"
                        label="Serie sasiu (VIN)"
                        fullWidth
                        variant="outlined"
                        value={formData.vin}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} color="inherit" sx={{ textTransform: 'none' }}>
                        Anuleaza
                    </Button>
                    <Button
                        onClick={handleAddVehicle}
                        variant="contained"
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                        disabled={!formData.brand || !formData.plateNumber}
                    >
                        Salveaza Vehicul
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

export default MyVehicles;