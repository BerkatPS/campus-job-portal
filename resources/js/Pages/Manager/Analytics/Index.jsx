import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import {
    Container,
    Typography,
    Box,
    Paper,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    TextField,
    alpha,
    useTheme,
    useMediaQuery,
    Button,
    CircularProgress
} from '@mui/material';
import {
    LocalizationProvider
} from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";

// Stats Card Component
const StatCard = ({ title, value, subtitle, icon, color }) => {
    const theme = useTheme();

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: '1.25rem',
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" variant="body2" fontWeight="medium">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" sx={{
                            fontWeight: 'bold',
                            my: 1,
                            background: `linear-gradient(45deg, ${color} 30%, ${alpha(color, 0.7)} 90%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            bgcolor: alpha(color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: color,
                            boxShadow: `0 4px 12px ${alpha(color, 0.15)}`,
                            border: '1px solid',
                            borderColor: alpha(color, 0.2)
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: '0.75rem',
                    bgcolor: 'background.paper',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}
            >
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>{`${label}`}</Typography>
                {payload.map((entry, index) => (
                    <Typography key={`item-${index}`} variant="body2" color={entry.color} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: entry.color,
                            marginRight: 1
                        }
                    }}>
                        {`${entry.name}: ${entry.value}`}
                    </Typography>
                ))}
            </Paper>
        );
    }
    return null;
};

const AnalyticsPage = ({ stats, filters, filterOptions }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedCompany, setSelectedCompany] = useState(filters.companyId || '');
    const [selectedJob, setSelectedJob] = useState(filters.jobId || '');
    const [dateFrom, setDateFrom] = useState(dayjs(filters.startDate));
    const [dateTo, setDateTo] = useState(dayjs(filters.endDate));
    const [tabValue, setTabValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    // Colors for charts
    const chartColors = [
        theme.palette.primary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main,
        theme.palette.info.main,
        ...Array(10).fill(0).map(() => '#' + Math.floor(Math.random()*16777215).toString(16))
    ];

    // Function to update analytics with current filters
    const updateAnalytics = () => {
        setIsLoading(true);

        // Format dates for the backend
        const formattedStartDate = dateFrom.format('YYYY-MM-DD');
        const formattedEndDate = dateTo.format('YYYY-MM-DD');

        // Use Inertia router to fetch new data with filters
        router.visit(route('manager.analytics.index'), {
            data: {
                company_id: selectedCompany,
                job_id: selectedJob,
                start_date: formattedStartDate,
                end_date: formattedEndDate
            },
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    // Handle company selection change
    const handleCompanyChange = (e) => {
        const companyId = e.target.value;
        setSelectedCompany(companyId);

        // Reset job selection if company changes
        if (selectedJob && companyId !== filters.companyId) {
            setSelectedJob('');
        }

        // Debounce the API call
        if (debounceTimeout) clearTimeout(debounceTimeout);
        const timeoutId = setTimeout(updateAnalytics, 500);
        setDebounceTimeout(timeoutId);
    };

    // Handle job selection change
    const handleJobChange = (e) => {
        setSelectedJob(e.target.value);

        // Debounce the API call
        if (debounceTimeout) clearTimeout(debounceTimeout);
        const timeoutId = setTimeout(updateAnalytics, 500);
        setDebounceTimeout(timeoutId);
    };

    // Handle date from change
    const handleDateFromChange = (newValue) => {
        setDateFrom(newValue);

        // Debounce the API call
        if (debounceTimeout) clearTimeout(debounceTimeout);
        const timeoutId = setTimeout(updateAnalytics, 800);
        setDebounceTimeout(timeoutId);
    };

    // Handle date to change
    const handleDateToChange = (newValue) => {
        setDateTo(newValue);

        // Debounce the API call
        if (debounceTimeout) clearTimeout(debounceTimeout);
        const timeoutId = setTimeout(updateAnalytics, 800);
        setDebounceTimeout(timeoutId);
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Cleanup debounce timeout on component unmount
    useEffect(() => {
        return () => {
            if (debounceTimeout) clearTimeout(debounceTimeout);
        };
    }, [debounceTimeout]);

    // Pie chart application status data
    const pieChartData = stats.applicationsByStatus.map(item => ({
        name: item.status,
        value: item.count,
        color: item.color
    }));

    // Monthly trend data
    const monthlyTrendData = stats.monthlyTrend || [];

    // Application by job data
    const applicationsByJobData = stats.applicationsByJob || [];

    return (
        <Layout>
            <Head title="Analytics" />

            <Container maxWidth="xl">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            fontWeight="bold"
                            color="primary.main"
                            sx={{
                                mb: 4,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Analytics Dashboard
                        </Typography>

                        {/* Filters */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 4,
                                borderRadius: '1.25rem',
                                border: '1px solid',
                                borderColor: alpha(theme.palette.primary.main, 0.1),
                                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            {isLoading && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                        zIndex: 10,
                                        borderRadius: '1.25rem'
                                    }}
                                >
                                    <CircularProgress size={40} />
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                <Box sx={{ flexBasis: { xs: '100%', md: '25%' } }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="company-select-label">Perusahaan</InputLabel>
                                        <Select
                                            labelId="company-select-label"
                                            value={selectedCompany}
                                            label="Perusahaan"
                                            onChange={handleCompanyChange}
                                            sx={{
                                                borderRadius: '10px',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: alpha(theme.palette.primary.main, 0.5),
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            }}
                                        >
                                            <MenuItem value="">Semua Perusahaan</MenuItem>
                                            {filterOptions.companies.map((company) => (
                                                <MenuItem key={company.id} value={company.id}>
                                                    {company.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{ flexBasis: { xs: '100%', md: '25%' } }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="job-select-label">Lowongan</InputLabel>
                                        <Select
                                            labelId="job-select-label"
                                            value={selectedJob}
                                            label="Lowongan"
                                            onChange={handleJobChange}
                                            sx={{
                                                borderRadius: '10px',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: alpha(theme.palette.primary.main, 0.5),
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            }}
                                        >
                                            <MenuItem value="">Semua Lowongan</MenuItem>
                                            {filterOptions.jobs.map((job) => (
                                                <MenuItem key={job.id} value={job.id}>
                                                    {job.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{ flexBasis: { xs: '100%', md: '25%' } }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Dari Tanggal"
                                            value={dateFrom}
                                            onChange={handleDateFromChange}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    sx: {
                                                        borderRadius: '10px',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: alpha(theme.palette.primary.main, 0.2),
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: alpha(theme.palette.primary.main, 0.5),
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: theme.palette.primary.main,
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                                <Box sx={{ flexBasis: { xs: '100%', md: '25%' } }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Sampai Tanggal"
                                            value={dateTo}
                                            onChange={handleDateToChange}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    sx: {
                                                        borderRadius: '10px',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: alpha(theme.palette.primary.main, 0.2),
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: alpha(theme.palette.primary.main, 0.5),
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: theme.palette.primary.main,
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>

                    {/* Stats Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <Box sx={{ flexBasis: { xs: '100%', sm: '50%', md: '33%' } }}>
                                <StatCard
                                    title="Total Lowongan"
                                    value={stats.totalJobs}
                                    subtitle="Keseluruhan"
                                    icon={<Box component="span" sx={{ fontSize: 24 }}>📋</Box>}
                                    color={theme.palette.primary.main}
                                />
                            </Box>
                            <Box sx={{ flexBasis: { xs: '100%', sm: '50%', md: '33%' } }}>
                                <StatCard
                                    title="Total Lamaran"
                                    value={stats.totalApplications}
                                    subtitle="Keseluruhan"
                                    icon={<Box component="span" sx={{ fontSize: 24 }}>👨‍💼</Box>}
                                    color={theme.palette.success.main}
                                />
                            </Box>
                            <Box sx={{ flexBasis: { xs: '100%', sm: '50%', md: '30%' } }}>
                                <StatCard
                                    title="Total Acara"
                                    value={stats.totalEvents}
                                    subtitle="Seluruh jadwal"
                                    icon={<Box component="span" sx={{ fontSize: 24 }}>📅</Box>}
                                    color={theme.palette.warning.main}
                                />
                            </Box>
                        </Box>
                    </motion.div>

                    {/* Tabs */}
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: alpha(theme.palette.primary.main, 0.1),
                            mb: 3,
                            pb: 0.5
                        }}
                    >
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="analytics tabs"
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{
                                '& .MuiTab-root': {
                                    fontWeight: 'medium',
                                    borderRadius: '8px 8px 0 0',
                                    transition: 'all 0.2s ease',
                                    mx: 0.5,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                        color: theme.palette.primary.main
                                    }
                                },
                                '& .Mui-selected': {
                                    fontWeight: 'bold'
                                }
                            }}
                        >
                            <Tab label="Lowongan" />
                            <Tab label="Lamaran" />
                            <Tab label="Status" />
                        </Tabs>
                    </Box>

                    {/* Charts Section */}
                    <Box sx={{ mb: 4 }}>
                        {/* Jobs Tab */}
                        {tabValue === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1.25rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                        mb: 4,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                                        }
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{
                                        mb: 1,
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: 'inline-block'
                                    }}>
                                        Tren Lowongan Pekerjaan
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Menampilkan jumlah lowongan pekerjaan yang dibuat sepanjang waktu
                                    </Typography>
                                    <Box sx={{
                                        height: 400,
                                        borderRadius: '1rem',
                                        p: 1,
                                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.05),
                                    }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={monthlyTrendData}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
                                                <XAxis
                                                    dataKey="date"
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                    axisLine={{ stroke: alpha(theme.palette.text.secondary, 0.2) }}
                                                />
                                                <YAxis
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                    axisLine={{ stroke: alpha(theme.palette.text.secondary, 0.2) }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ paddingTop: 15 }} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="jobs"
                                                    name="Lowongan"
                                                    stroke={theme.palette.primary.main}
                                                    strokeWidth={3}
                                                    dot={{ stroke: theme.palette.primary.main, strokeWidth: 2, r: 4, fill: 'white' }}
                                                    activeDot={{ r: 8, fill: theme.palette.primary.main }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1.25rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                                        }
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{
                                        mb: 1,
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: 'inline-block'
                                    }}>
                                        Lowongan per Kategori
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Distribusi lowongan pekerjaan berdasarkan kategori
                                    </Typography>
                                    <Box sx={{
                                        height: 400,
                                        borderRadius: '1rem',
                                        p: 1,
                                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.05),
                                    }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={stats.jobsByCategory}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                    axisLine={{ stroke: alpha(theme.palette.text.secondary, 0.2) }}
                                                />
                                                <YAxis
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                    axisLine={{ stroke: alpha(theme.palette.text.secondary, 0.2) }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ paddingTop: 15 }} />
                                                <Bar
                                                    dataKey="jobs"
                                                    name="Jumlah Lowongan"
                                                    fill={theme.palette.primary.main}
                                                    radius={[6, 6, 0, 0]}
                                                    barSize={40}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            </motion.div>
                        )}

                        {/* Applications Tab */}
                        {tabValue === 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1.25rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                        mb: 4,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                                        }
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{
                                        mb: 1,
                                        background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: 'inline-block'
                                    }}>
                                        Tren Lamaran Pekerjaan
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Jumlah lamaran yang masuk sepanjang waktu
                                    </Typography>
                                    <Box sx={{
                                        height: 400,
                                        borderRadius: '1rem',
                                        p: 1,
                                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.05),
                                    }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={monthlyTrendData}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
                                                <XAxis
                                                    dataKey="date"
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                    axisLine={{ stroke: alpha(theme.palette.text.secondary, 0.2) }}
                                                />
                                                <YAxis
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                    axisLine={{ stroke: alpha(theme.palette.text.secondary, 0.2) }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ paddingTop: 15 }} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="applications"
                                                    name="Total Lamaran"
                                                    stroke={theme.palette.success.main}
                                                    strokeWidth={3}
                                                    dot={{ stroke: theme.palette.success.main, strokeWidth: 2, r: 4, fill: 'white' }}
                                                    activeDot={{ r: 8, fill: theme.palette.success.main }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1.25rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                                        }
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{
                                        mb: 1,
                                        background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: 'inline-block'
                                    }}>
                                        Lamaran per Lowongan
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Distribusi lamaran berdasarkan lowongan pekerjaan
                                    </Typography>
                                    <Box sx={{
                                        height: 400,
                                        borderRadius: '1rem',
                                        p: 1,
                                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.05),
                                    }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={applicationsByJobData}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                                layout="vertical"
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
                                                <XAxis
                                                    type="number"
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                    axisLine={{ stroke: alpha(theme.palette.text.secondary, 0.2) }}
                                                />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={150}
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                    axisLine={{ stroke: alpha(theme.palette.text.secondary, 0.2) }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ paddingTop: 15 }} />
                                                <Bar
                                                    dataKey="applications"
                                                    name="Jumlah Lamaran"
                                                    fill={theme.palette.success.main}
                                                    radius={[0, 6, 6, 0]}
                                                    barSize={20}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            </motion.div>
                        )}

                        {/* Status Tab */}
                        {tabValue === 2 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    gap: 3
                                }}>
                                    <Box sx={{
                                        width: { xs: '100%', md: '41.666%' },
                                        flexShrink: 0
                                    }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: '1.25rem',
                                                border: '1px solid',
                                                borderColor: alpha(theme.palette.primary.main, 0.1),
                                                height: '100%',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                '&:hover': {
                                                    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                                                }
                                            }}
                                        >
                                            <Typography variant="h6" fontWeight="bold" sx={{
                                                mb: 1,
                                                background: `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.warning.light} 90%)`,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                display: 'inline-block'
                                            }}>
                                                Status Lamaran
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                Distribusi lamaran berdasarkan status
                                            </Typography>
                                            <Box sx={{
                                                height: 400,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                borderRadius: '1rem',
                                                p: 1,
                                                bgcolor: alpha(theme.palette.background.paper, 0.5),
                                                border: '1px solid',
                                                borderColor: alpha(theme.palette.primary.main, 0.05),
                                            }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={pieChartData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={80}
                                                            outerRadius={120}
                                                            fill="#8884d8"
                                                            paddingAngle={3}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            label={{
                                                                fill: theme.palette.text.primary,
                                                                fontSize: 12,
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            {pieChartData.map((entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={entry.color}
                                                                    stroke={alpha(entry.color, 0.5)}
                                                                    strokeWidth={2}
                                                                />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend
                                                            wrapperStyle={{ paddingTop: 15 }}
                                                            iconType="circle"
                                                            iconSize={10}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Paper>
                                    </Box>

                                    <Box sx={{
                                        width: { xs: '100%', md: '58.333%' },
                                        flexGrow: 1
                                    }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: '1.25rem',
                                                border: '1px solid',
                                                borderColor: alpha(theme.palette.primary.main, 0.1),
                                                height: '100%',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                '&:hover': {
                                                    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                                                }
                                            }}
                                        >
                                            <Typography variant="h6" fontWeight="bold" sx={{
                                                mb: 1,
                                                background: `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.warning.light} 90%)`,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                display: 'inline-block'
                                            }}>
                                                Performa Status Lamaran
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                Perbandingan status lamaran sepanjang waktu
                                            </Typography>
                                            <Box sx={{
                                                height: 400,
                                                borderRadius: '1rem',
                                                p: 1,
                                                bgcolor: alpha(theme.palette.background.paper, 0.5),
                                                border: '1px solid',
                                                borderColor: alpha(theme.palette.primary.main, 0.05),
                                            }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={stats.applicationsByStatusTrend}
                                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
                                                        <XAxis
                                                            dataKey="date"
                                                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                            axisLine={{ stroke: alpha(theme.palette.text.secondary, 0.2) }}
                                                        />
                                                        <YAxis
                                                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                            axisLine={{ stroke: alpha(theme.palette.text.secondary, 0.2) }}
                                                        />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend
                                                            wrapperStyle={{ paddingTop: 15 }}
                                                            iconType="circle"
                                                            iconSize={10}
                                                        />
                                                        {pieChartData.map((status, index) => (
                                                            <Bar
                                                                key={status.name}
                                                                dataKey={status.name}
                                                                name={status.name}
                                                                stackId="a"
                                                                fill={status.color}
                                                                radius={[index === 0 ? 6 : 0, index === pieChartData.length - 1 ? 6 : 0, index === pieChartData.length - 1 ? 6 : 0, index === 0 ? 6 : 0]}
                                                            />
                                                        ))}
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Paper>
                                    </Box>
                                </Box>
                            </motion.div>
                        )}
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
};

export default AnalyticsPage;
