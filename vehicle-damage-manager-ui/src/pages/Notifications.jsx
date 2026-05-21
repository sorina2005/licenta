
import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Notifications = () => {
    const notifications = [
        { id: 1, title: 'Analiza AI Finalizata', desc: 'Dosarul #101 a fost procesat cu succes.', time: 'Acum 5 minute', type: 'success' },
        { id: 2, title: 'Vehicul Adaugat', desc: 'Audi A4 a fost inregistrat in sistem.', time: 'Ieri la 14:20', type: 'info' },
        { id: 3, title: 'Document Lipsa', desc: 'Te rugam sa incarci o poza mai clara cu spatele masinii.', time: 'Acum 2 zile', type: 'error' },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>Notificari</Typography>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <List sx={{ p: 0 }}>
                    {notifications.map((n, index) => (
                        <React.Fragment key={n.id}>
                            <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: n.type === 'success' ? 'success.light' : n.type === 'error' ? 'error.light' : 'primary.light' }}>
                                        {n.type === 'success' ? <CheckCircleOutlineIcon /> : n.type === 'error' ? <ErrorOutlineIcon /> : <NotificationsIcon />}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography fontWeight="bold">{n.title}</Typography>}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary">{n.desc}</Typography>
                                            <br />
                                            <Typography component="span" variant="caption" color="text.secondary">{n.time}</Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            {index < notifications.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default Notifications;