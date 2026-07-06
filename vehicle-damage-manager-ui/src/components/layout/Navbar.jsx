import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem,
    Divider, ListItemIcon, IconButton, Drawer, List, ListItem,
    ListItemButton, ListItemText
} from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Stare pentru meniul dropdown (Desktop)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Stare pentru meniul lateral (Mobile)
    const [mobileOpen, setMobileOpen] = useState(false);

    const userJson = localStorage.getItem('user');
    let user = null;

    try {
        user = userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        user = null;
    }

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleLogout = () => {
        handleMenuClose();
        setMobileOpen(false);
        localStorage.removeItem('user');
        navigate('/');
    };

    const displayName = user?.username || "Utilizator";

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const isClient = storedUser?.role?.replace('ROLE_', '').toUpperCase() === 'CLIENT';

    // Componenta pentru meniul lateral (Mobile)
    const drawerContent = (
        <Box sx={{ width: 280, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="h6" fontWeight="800" sx={{ color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarIcon color="primary" />
                    AutoDamage
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
                {user ? (
                    <List>
                        <Box sx={{ px: 2, pb: 2, mb: 2, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <Typography variant="body1" fontWeight="700" color="#1a1a1a">
                                {displayName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                {user.role || 'Client'}
                            </Typography>
                        </Box>

                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard" onClick={handleDrawerToggle}>
                                <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Dashboard" sx={{ '& .MuiTypography-root': { fontWeight: 600 } }} />
                            </ListItemButton>
                        </ListItem>
                        {isClient && (
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/profile" onClick={handleDrawerToggle}>
                                    <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                                    <ListItemText primary="Profilul meu" />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                ) : (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/login" onClick={handleDrawerToggle}>
                                <ListItemIcon><LoginIcon /></ListItemIcon>
                                <ListItemText primary="Autentificare" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/register" onClick={handleDrawerToggle}>
                                <ListItemIcon><AppRegistrationIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Inregistrare" sx={{ '& .MuiTypography-root': { fontWeight: 600, color: 'primary.main' } }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                )}
            </Box>

            {user && (
                <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                    >
                        Deconectare
                    </Button>
                </Box>
            )}
        </Box>
    );

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                color: 'black',
                boxShadow: 'none',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', height: 70, px: { xs: 2, md: 4 } }}>
                {/* Logo Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography
                        variant="h6"
                        fontWeight="800"
                        component={Link}
                        to="/"
                        sx={{
                            textDecoration: 'none',
                            color: '#1a1a1a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            letterSpacing: '-0.03em'
                        }}
                    >
                        <DirectionsCarIcon color="primary" sx={{ fontSize: 28 }} />
                        <Box component="span" sx={{ color: 'primary.main', display: { xs: 'none', sm: 'inline' } }}>AutoDamage</Box>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Hub</Box>
                    </Typography>

                    {/* Navigarea Desktop pentru Autentificati */}
                    {user && (
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                            <Button
                                component={Link}
                                to="/dashboard"
                                startIcon={<DashboardIcon sx={{ fontSize: 18 }} />}
                                sx={{
                                    textTransform: 'none',
                                    color: location.pathname === '/dashboard' ? 'primary.main' : '#555',
                                    fontWeight: location.pathname === '/dashboard' ? '700' : '500',
                                    bgcolor: location.pathname === '/dashboard' ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                    borderRadius: 2,
                                    px: 2,
                                    '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' }
                                }}
                            >
                                Dashboard
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Container Actiuni si Navigare Desktop */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                    {/* Element vizibil doar pe Mobile - Hamburger Icon */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' }, color: '#1a1a1a' }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Elemente vizibile doar pe Desktop */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        {user ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" fontWeight="700" sx={{ color: '#1a1a1a', lineHeight: 1.2 }}>
                                        {displayName}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.65rem', letterSpacing: 0.5 }}>
                                        {user.role || 'Client'}
                                    </Typography>
                                </Box>
                                <Avatar
                                    onClick={handleMenuOpen}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: 'primary.main',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                                        transition: 'transform 0.2s ease',
                                        '&:hover': { transform: 'scale(1.05)' }
                                    }}
                                >
                                    {displayName[0].toUpperCase()}
                                </Avatar>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.05))',
                                            mt: 1.5,
                                            borderRadius: 3,
                                            border: '1px solid #f0f0f0',
                                            minWidth: 180,
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem component={Link} to="/profile" onClick={handleMenuClose} sx={{ py: 1.2, borderRadius: 1.5, mx: 0.5 }}>
                                        <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                                        Profilul meu
                                    </MenuItem>
                                    <Divider sx={{ my: 1 }} />
                                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.2, borderRadius: 1.5, mx: 0.5 }}>
                                        <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                                        Deconectare
                                    </MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                    component={Link}
                                    to="/login"
                                    sx={{
                                        textTransform: 'none',
                                        color: '#333',
                                        fontWeight: '600',
                                        px: 3,
                                        py: 1,
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                                    }}
                                >
                                    Autentificare
                                </Button>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/register"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: '600',
                                        px: 3,
                                        py: 1,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                                        '&:hover': {
                                            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)'
                                        }
                                    }}
                                >
                                    Incepe Acum
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Toolbar>

            {/* Meniul Lateral (Drawer) pentru vizualizarea pe Mobile */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
                }}
            >
                {drawerContent}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;