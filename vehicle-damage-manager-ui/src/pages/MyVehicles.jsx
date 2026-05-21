import React, { useState } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeleteIcon from '@mui/icons-material/Delete';

const MyVehicles = () => {
    // Starea pentru lista de vehicule
    const [vehicles, setVehicles] = useState([
        { id: 1, brand: 'BMW', model: 'Seria 3', plate: 'B 123 ABC', vin: 'WBA1234567890' },
        { id: 2, brand: 'Audi', model: 'A4', plate: 'CJ 99 XYZ', vin: 'TRU0987654321' },
    ]);

    // Starea pentru Modal (Dialog)
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        plate: '',
        vin: ''
    });

    // Functii pentru manipularea Dialog-ului
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({ brand: '', model: '', plate: '', vin: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddVehicle = () => {
        const newEntry = {
            id: vehicles.length + 1,
            ...formData
        };
        setVehicles([...vehicles, newEntry]);
        handleClose();
    };

    const handleDelete = (id) => {
        setVehicles(vehicles.filter(v => v.id !== id));
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Vehiculele Mele</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                    onClick={handleOpen}
                >
                    Adauga Vehicul
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Marca / Model</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Numar Inmatriculare</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Serie Sasiu (VIN)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actiuni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicles.map((v) => (
                            <TableRow key={v.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        {v.brand} {v.model}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={v.plate}
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold', letterSpacing: 1 }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'monospace' }}>{v.vin}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" sx={{ textTransform: 'none', mr: 1 }}>Detalii</Button>
                                    <IconButton color="error" size="small" onClick={() => handleDelete(v.id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog pentru Adaugare Vehicul */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Inregistrare Vehicul Nou</DialogTitle>
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
                        name="plate"
                        label="Numar Inmatriculare"
                        fullWidth
                        variant="outlined"
                        value={formData.plate}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="vin"
                        label="Serie Sasiu (VIN)"
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
                        disabled={!formData.brand || !formData.plate}
                    >
                        Salveaza Vehicul
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyVehicles;