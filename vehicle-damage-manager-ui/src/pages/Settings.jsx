import React from 'react';
import { Box, Typography, Paper, Switch, List, ListItem, ListItemText, ListItemSecondaryAction, Divider } from '@mui/material';

const Settings = () => {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>Setari</Typography>
            <Paper sx={{ borderRadius: 3 }}>
                <List>
                    <ListItem>
                        <ListItemText primary="Notificari Email" secondary="Primeste actualizari despre statusul dosarelor" />
                        <ListItemSecondaryAction>
                            <Switch defaultChecked />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="Analiza Automata AI" secondary="Permite procesarea imediata a pozelor incarcate" />
                        <ListItemSecondaryAction>
                            <Switch defaultChecked />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="Mod Intunecat (Dark Mode)" secondary="Schimba tema interfetei" />
                        <ListItemSecondaryAction>
                            <Switch />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
};

export default Settings;