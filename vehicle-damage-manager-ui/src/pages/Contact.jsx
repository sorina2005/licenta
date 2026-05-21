import React from 'react';
import { Box, Typography, TextField, Button, Paper, Grid } from '@mui/material';

const Contact = () => {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>Contacteaza Suportul</Typography>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Grid container spacing={3}>
                    <Grid xs={12} md={6}>
                        <TextField fullWidth label="Subiect" variant="outlined" />
                    </Grid>
                    <Grid xs={12} md={6}>
                        <TextField fullWidth label="Numar Dosar (Optional)" variant="outlined" />
                    </Grid>
                    <Grid xs={12}>
                        <TextField fullWidth multiline rows={4} label="Mesajul tau" variant="outlined" />
                    </Grid>
                    <Grid xs={12}>
                        <Button variant="contained" size="large">Trimite Mesaj</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Contact;