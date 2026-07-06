import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Drawer, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const role = user?.role || 'CLIENT';

    const menuConfigs = {
        ADMIN: [
            { text: 'Gestiune Utilizatori', path: '/admin-user-management' },
            { text: 'Gestiune Dosare', path: '/admin-reports' },
            { text: 'Analitice Sistem', path: '/analytics' }
        ],
        OPERATOR: [
            { text: 'Triaj Dosare', path: '/operator-dashboard' },
            { text: 'Analitice', path: '/analytics' }
        ],
        INSPECTOR: [
            { text: 'Dosare Alocate', path: '/inspector-dashboard' }
        ],
        SERVICE: [
            { text: 'Devize Reparatii', path: '/service-dashboard' }
        ],
        CLIENT: [
            { text: 'Dosarele Mele', path: '/client-dashboard' },
            { text: 'Vehiculele Mele', path: '/my-vehicles' }
        ]
    };

    const currentMenu = menuConfigs[role] || [];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <List>
                {currentMenu.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                        >
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;