import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    Paper,
    Typography,
    Box,
    Divider,
    useTheme,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    LinearProgress,
    IconButton,
    Card,
    CardContent,
    Tooltip,
    alpha,
    Chip,
    ButtonBase,
    Menu,
    MenuItem,
    Tabs,
    Tab,
    Button
} from '@mui/material';
import {
    Business as BusinessIcon,
    Work as WorkIcon,
    Group as GroupIcon,
    TrendingUp as TrendingUpIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Refresh as RefreshIcon,
    FilterList as FilterListIcon,
    MoreHoriz as MoreHorizIcon,
    DateRange as DateRangeIcon,
    ChevronRight as ChevronRightIcon,
    LocationOn as LocationOnIcon,
    CalendarToday as CalendarTodayIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '@/Components/Layout/Layout';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Dashboard = ({ stats, recentJobs, recentCompanies, statusData, applicationTrend }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('month');
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [filterBy, setFilterBy] = useState('all');
    const [activeTab, setActiveTab] = useState(0);

    // Basic handlers
    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterSelect = (filter) => {
        setFilterBy(filter);
        handleFilterClose();
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Format application trend data from controller
    const formattedTrendData = applicationTrend?.map(item => ({
        name: item.month,
        applications: item.applications,
        // Simulasikan data companies untuk chart
        companies: Math.round(item.applications * 0.3)
    })) || [];

    // Format status data to match pie chart format
    const formattedStatusData = statusData?.map(item => {
        // Sesuaikan warna dengan status yang ada
        const getStatusColor = (name) => {
            const status = name?.toLowerCase();
            if (status?.includes('reject')) return theme.palette.error.main;
            if (status?.includes('accept')) return theme.palette.success.main;
            if (status?.includes('interview')) return theme.palette.primary.main;
            if (status?.includes('process')) return theme.palette.warning.main;
            return theme.palette.info.main;
        };

        return {
            name: item.name,
            value: item.value,
            color: getStatusColor(item.name)
        };
    }) || [];

    // Format tanggal untuk recent items
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days < 1) {
            return 'Today';
        } else if (days === 1) {
            return '1 day ago';
        } else if (days < 7) {
            return `${days} days ago`;
        } else if (days < 30) {
            const weeks = Math.floor(days / 7);
            return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        } else {
            const months = Math.floor(days / 30);
            return months === 1 ? '1 month ago' : `${months} months ago`;
        }
    };

    // Format recent companies untuk tampilan
    const formattedCompanies = recentCompanies?.map(company => ({
        id: company.id,
        name: company.name,
        logo: company.logo,
        industry: company.industry || 'Industry',
        location: 'Jakarta', // Default location karena tidak ada di controller
        registered_date: formatDate(company.created_at)
    })) || [];

    // Format recent jobs untuk tampilan
    const formattedJobs = recentJobs?.map(job => ({
        id: job.id,
        title: job.title,
        company: {
            name: job.company,
            logo: null // Logo tidak tersedia di response controller
        },
        location: 'Jakarta', // Default location karena tidak ada di controller
        type: 'Full-time', // Default type karena tidak ada di controller
        created_at: formatDate(job.created_at),
        applications: job.applications,
        status: job.status
    })) || [];

    // Stat Card Component
    const StatCard = ({ icon, title, value, changeValue, color, delay = 0 }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    bgcolor: alpha(color, 0.04),
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }
                }}
            >
                {/* Background decoration */}
                <Box
                    sx={{
                        position: 'absolute',
                        right: -10,
                        top: -10,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: alpha(color, 0.1),
                        zIndex: 0
                    }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2
                        }}
                    >
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 1.5,
                                bgcolor: alpha(color, 0.1),
                                color: color,
                                display: 'flex',
                            }}
                        >
                            {icon}
                        </Box>

                        <Typography
                            variant="caption"
                            sx={{
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                fontSize: '0.675rem',
                                letterSpacing: 0.5,
                                color: 'text.secondary',
                                opacity: 0.7
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 1.5,
                        }}
                    >
                        {value}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {changeValue > 0 ? (
                            <ArrowUpwardIcon
                                sx={{
                                    color: theme.palette.success.main,
                                    fontSize: 16,
                                    mr: 0.5
                                }}
                            />
                        ) : (
                            <ArrowDownwardIcon
                                sx={{
                                    color: theme.palette.error.main,
                                    fontSize: 16,
                                    mr: 0.5
                                }}
                            />
                        )}
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                color: changeValue > 0 ? theme.palette.success.main : theme.palette.error.main,
                                mr: 1
                            }}
                        >
                            {Math.abs(changeValue)}%
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            vs last month
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );

    return (
        <Layout>
            <Head title="Dashboard Admin" />

            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    mb: 3,
                    gap: { xs: 2, sm: 0 }
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight={700}
                        sx={{
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                            mb: 1
                        }}
                    >
                        Dashboard
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Track and analyze your campus job portal performance
                    </Typography>
                </Box>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Time range selector */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 1.5,
                            bgcolor: 'background.paper',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
                            overflow: 'hidden'
                        }}
                    >
                        {['week', 'month', 'year'].map((range) => (
                            <ButtonBase
                                key={range}
                                sx={{
                                    px: 2,
                                    py: 1,
                                    bgcolor: timeRange === range ? theme.palette.primary.main : 'transparent',
                                    color: timeRange === range ? 'white' : 'text.primary',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    borderRight: range !== 'year' ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                                    transition: 'all 0.15s ease-in-out',
                                }}
                                onClick={() => setTimeRange(range)}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </ButtonBase>
                        ))}
                    </Box>

                    {/* Refresh button */}
                    <Tooltip title="Refresh data">
                        <IconButton
                            onClick={handleRefresh}
                            sx={{
                                bgcolor: 'background.paper',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
                            }}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Filter button */}
                    <Tooltip title="Filter data">
                        <IconButton
                            onClick={handleFilterClick}
                            sx={{
                                bgcolor: 'background.paper',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
                            }}
                        >
                            <FilterListIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Filter menu */}
                    <Menu
                        anchorEl={filterAnchorEl}
                        open={Boolean(filterAnchorEl)}
                        onClose={handleFilterClose}
                        PaperProps={{
                            elevation: 2,
                            sx: {
                                mt: 1.5,
                                borderRadius: 1.5,
                                minWidth: 180,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            }
                        }}
                    >
                        {['all', 'companies', 'jobs', 'applications'].map((filter) => (
                            <MenuItem
                                key={filter}
                                selected={filterBy === filter}
                                onClick={() => handleFilterSelect(filter)}
                                sx={{
                                    borderRadius: 1,
                                    mx: 0.5,
                                    my: 0.25,
                                    fontSize: '0.9rem',
                                }}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)} Data
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Box>

            {/* Loading progress indicator */}
            {loading && (
                <LinearProgress
                    sx={{
                        height: 4,
                        borderRadius: 1,
                        mb: 3
                    }}
                />
            )}

            {/* Stats cards */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <StatCard
                        icon={<BusinessIcon />}
                        title="TOTAL COMPANIES"
                        value={stats?.totalCompanies || 0}
                        changeValue={12}
                        color={theme.palette.primary.main}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <StatCard
                        icon={<WorkIcon />}
                        title="TOTAL JOBS"
                        value={stats?.totalJobs || 0}
                        changeValue={8}
                        color={theme.palette.info.main}
                        delay={0.1}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <StatCard
                        icon={<GroupIcon />}
                        title="TOTAL CANDIDATES"
                        value={stats?.totalCandidates || 0}
                        changeValue={18}
                        color={theme.palette.success.main}
                        delay={0.2}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <StatCard
                        icon={<TrendingUpIcon />}
                        title="TOTAL APPLICATIONS"
                        value={stats?.totalApplications || 0}
                        changeValue={-5}
                        color={theme.palette.warning.main}
                        delay={0.3}
                    />
                </Box>
            </Box>

            {/* Charts Section */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
                {/* Growth Chart */}
                <Box sx={{ flex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <Card
                            variant="outlined"
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                height: '100%'
                            }}
                        >
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={600}>Application Trend</Typography>
                                        <Typography variant="body2" color="text.secondary">Monthly applications</Typography>
                                    </Box>
                                    <IconButton size="small">
                                        <MoreHorizIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box sx={{ p: 2, height: 300 }}>
                                    {formattedTrendData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={formattedTrendData}
                                                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                                            >
                                                <defs>
                                                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                                />
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: theme.palette.background.paper,
                                                        border: 'none',
                                                        borderRadius: 6,
                                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                                        padding: '10px 14px',
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="applications"
                                                    name="Applications"
                                                    stroke={theme.palette.primary.main}
                                                    fillOpacity={1}
                                                    fill="url(#colorApplications)"
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                            <Typography color="text.secondary">No data available</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Box>

                {/* Applications Pie Chart */}
                <Box sx={{ flex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        <Card
                            variant="outlined"
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                height: '100%'
                            }}
                        >
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={600}>Applications</Typography>
                                        <Typography variant="body2" color="text.secondary">Status distribution</Typography>
                                    </Box>
                                    <IconButton size="small">
                                        <MoreHorizIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column' }}>
                                    {formattedStatusData.length > 0 ? (
                                        <>
                                            <Box sx={{ flex: 1 }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={formattedStatusData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={90}
                                                            paddingAngle={2}
                                                            dataKey="value"
                                                        >
                                                            {formattedStatusData.map((entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={entry.color}
                                                                    stroke={theme.palette.background.paper}
                                                                    strokeWidth={2}
                                                                />
                                                            ))}
                                                        </Pie>
                                                        <RechartsTooltip
                                                            formatter={(value, name) => [
                                                                `${value} applications`,
                                                                name
                                                            ]}
                                                            contentStyle={{
                                                                backgroundColor: theme.palette.background.paper,
                                                                border: 'none',
                                                                borderRadius: 6,
                                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                                                padding: '10px 14px',
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Box>

                                            {/* Legend */}
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                                                {formattedStatusData.map((item, index) => (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                                                            {item.name}: <b>{item.value}</b>
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </>
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                            <Typography color="text.secondary">No data available</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Box>
            </Box>

            {/* Recent Activity Section */}
            <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', mb: 4 }}>
                <CardContent sx={{ p: 0 }}>
                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            px: 2,
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: 1.5,
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                minWidth: 0,
                                px: 2,
                                py: 1,
                                mr: 1,
                            }
                        }}
                    >
                        <Tab label="Recent Companies" />
                        <Tab label="Recent Jobs" />
                        <Tab label="Recent Activities" />
                    </Tabs>

                    {/* Companies Tab */}
                    {activeTab === 0 && (
                        <List disablePadding>
                            {formattedCompanies.length > 0 ? (
                                <>
                                    {formattedCompanies.map((company, index) => (
                                        <React.Fragment key={company.id || index}>
                                            {index > 0 && <Divider component="li" variant="inset" sx={{ ml: 9 }} />}
                                            <ListItem sx={{ py: 2 }}>
                                                <ListItemAvatar sx={{ minWidth: 64 }}>
                                                    <Avatar
                                                        src={company.logo || ""}
                                                        alt={company.name}
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            ml: 1,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            color: theme.palette.primary.main,
                                                            fontWeight: 'bold',
                                                            fontSize: '1.25rem',
                                                        }}
                                                    >
                                                        {company.name?.charAt(0) || <BusinessIcon />}
                                                    </Avatar>
                                                </ListItemAvatar>

                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            {company.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
                                                                <Chip
                                                                    label={company.industry}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 22,
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 500,
                                                                        borderRadius: 1,
                                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                        color: theme.palette.primary.main,
                                                                    }}
                                                                />

                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <LocationOnIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {company.location}
                                                                    </Typography>
                                                                </Box>

                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <CalendarTodayIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {company.registered_date}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    }
                                                />

                                                <IconButton size="small">
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                            </ListItem>
                                        </React.Fragment>
                                    ))}
                                    <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, display: 'flex', justifyContent: 'center' }}>
                                        <Button endIcon={<ChevronRightIcon />} sx={{ textTransform: 'none' }}>View All Companies</Button>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <BusinessIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography color="text.secondary">No recent companies</Typography>
                                </Box>
                            )}
                        </List>
                    )}

                    {/* Jobs Tab */}
                    {activeTab === 1 && (
                        <List disablePadding>
                            {formattedJobs.length > 0 ? (
                                <>
                                    {formattedJobs.map((job, index) => (
                                        <React.Fragment key={job.id || index}>
                                            {index > 0 && <Divider component="li" variant="inset" sx={{ ml: 9 }} />}
                                            <ListItem sx={{ py: 2 }}>
                                                <ListItemAvatar sx={{ minWidth: 64 }}>
                                                    <Avatar
                                                        src={job.company?.logo || ""}
                                                        alt={job.company?.name}
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            ml: 1,
                                                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                            color: theme.palette.secondary.main,
                                                            fontWeight: 'bold',
                                                            fontSize: '1.25rem',
                                                        }}
                                                    >
                                                        {job.company?.name?.charAt(0) || <WorkIcon />}
                                                    </Avatar>
                                                </ListItemAvatar>

                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            {job.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                                {job.company?.name} • {job.location}
                                                            </Typography>

                                                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                                                <Chip
                                                                    label={job.type || "Full-time"}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 22,
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 500,
                                                                        borderRadius: 1,
                                                                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                                        color: theme.palette.secondary.main,
                                                                    }}
                                                                />

                                                                <Chip
                                                                    label={`${job.applications} applications`}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 22,
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 500,
                                                                        borderRadius: 1,
                                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                        color: theme.palette.primary.main,
                                                                    }}
                                                                />

                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <CalendarTodayIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {job.created_at}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    }
                                                />

                                                <IconButton size="small">
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                            </ListItem>
                                        </React.Fragment>
                                    ))}
                                    <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, display: 'flex', justifyContent: 'center' }}>
                                        <Button endIcon={<ChevronRightIcon />} sx={{ textTransform: 'none' }}>View All Jobs</Button>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <WorkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography color="text.secondary">No recent jobs</Typography>
                                </Box>
                            )}
                        </List>
                    )}

                    {/* Activities Tab */}
                    {activeTab === 2 && (
                        <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <Box sx={{ mb: 2, p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: '50%', display: 'flex' }}>
                                <DateRangeIcon color="primary" sx={{ fontSize: 40 }} />
                            </Box>

                            <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                                Activity Tracking Coming Soon
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                                Track and monitor user activities, application interactions,
                                and system changes in real-time.
                            </Typography>

                            <Button variant="contained" color="primary" sx={{ px: 3, borderRadius: 1.5 }}>
                                Enable Activity Tracking
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Dashboard;
