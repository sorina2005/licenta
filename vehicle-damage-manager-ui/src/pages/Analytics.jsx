import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import api from '../api/axios';

const COLORS = ['#f59e0b', '#22c55e', '#ef4444', '#a855f7'];

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get('/admin/analytics/dashboard')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const cards = [
        { label: 'Total Dosare Inregistrate', value: data?.totalReports || 0, color: '#4318ff' },

    ];

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2035', letterSpacing: '-0.5px' }}>
                    Statistici Sistem
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                    Monitorizati performanta algoritmilor si distributia operationala a dosarelor.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {cards.map((stat, i) => (
                    <Grid item key={i} xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eef2f6', bgcolor: '#fff' }}>
                            <Typography variant="body2" fontWeight="600" color="textSecondary">{stat.label}</Typography>
                            <Typography variant="h3" fontWeight="800" sx={{ color: stat.color, mt: 1 }}>{stat.value}</Typography>
                        </Paper>
                    </Grid>
                ))}

                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eef2f6', bgcolor: '#fff' }}>
                        <Typography variant="subtitle1" fontWeight="700" mb={2} color="#1a2035">
                            Evolutie Lunara Inregistrari Dosare
                        </Typography>
                        <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={data?.monthlyEvolution || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorDosare" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4318ff" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#4318ff" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="Dosare" stroke="#4318ff" strokeWidth={3} fillOpacity={1} fill="url(#colorDosare)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eef2f6', bgcolor: '#fff' }}>
                        <Typography variant="subtitle1" fontWeight="700" mb={2} color="#1a2035">
                            Status Operational Curent
                        </Typography>
                        <Box sx={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={data?.statusDistribution || []} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {(data?.statusDistribution || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 1 }}>
                                {(data?.statusDistribution || []).map((entry, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                                        <Typography variant="caption" fontWeight="600" color="textSecondary">
                                            {entry.name} ({entry.value})
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;