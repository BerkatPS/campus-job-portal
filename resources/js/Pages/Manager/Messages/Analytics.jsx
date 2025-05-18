import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Paper,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Chip,
    Tooltip,
    LinearProgress,
} from '@mui/material';
import {
    Timer as TimerIcon,
    Message as MessageIcon,
    Forum as ForumIcon,
    BarChart as BarChartIcon,
    TrendingUp as TrendingUpIcon,
    Mail as MailIcon,
    MailOutline as MailOutlineIcon,
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
    Work as WorkIcon,
    Timeline as TimelineIcon,
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import { motion } from 'framer-motion';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';

const Analytics = ({ stats, performance, topJobs, recentConversations }) => {
    // Format data for charts
    const responseDistributionData = Object.entries(stats.response_time_distribution).map(([key, value]) => {
        const labelMap = {
            'within_1_hour': 'Dalam 1 Jam',
            '1_to_4_hours': '1-4 Jam',
            '4_to_24_hours': '4-24 Jam',
            'over_24_hours': 'Lebih dari 24 Jam'
        };
        
        return {
            id: labelMap[key],
            label: labelMap[key],
            value,
            color: key === 'within_1_hour' ? 'hsl(120, 70%, 50%)' : 
                   key === '1_to_4_hours' ? 'hsl(210, 70%, 50%)' : 
                   key === '4_to_24_hours' ? 'hsl(45, 70%, 50%)' : 
                   'hsl(0, 70%, 50%)'
        };
    });
    
    // Convert messages by date to array format for line chart
    const messagesByDateData = [
        {
            id: "total-messages",
            color: "hsl(210, 70%, 50%)",
            data: Object.entries(stats.messages_by_date).map(([date, count]) => ({
                x: date,
                y: count
            }))
        }
    ];
    
    // Prepare data for manager performance bar chart
    const managerPerformanceData = [
        {
            metric: "Waktu Respons (menit)",
            value: performance.avg_response_time
        },
        {
            metric: "Tingkat Respons (%)",
            value: performance.response_rate
        }
    ];
    
    return (
        <Layout>
            <Head title="Analitik Pesan" />
            
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                Analitik Pesan
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Dasbor analitik untuk melihat performa komunikasi dan waktu respons
                            </Typography>
                        </Box>
                        
                        {/* Main Stats Summary */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={3}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        borderRadius: '0.75rem',
                                    }}
                                >
                                    <MessageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        {stats.total_messages}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Total Pesan
                                    </Typography>
                                </Paper>
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        borderRadius: '0.75rem',
                                    }}
                                >
                                    <ForumIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        {stats.total_conversations}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Total Percakapan
                                    </Typography>
                                </Paper>
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        borderRadius: '0.75rem',
                                    }}
                                >
                                    <TimerIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        {stats.avg_response_time} menit
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Rata-rata Waktu Respons
                                    </Typography>
                                </Paper>
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        borderRadius: '0.75rem',
                                    }}
                                >
                                    <TimelineIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                                    <Typography variant="h4" fontWeight="bold">
                                        {performance.response_rate}%
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Tingkat Respons
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                        
                        {/* Main Content */}
                        <Grid container spacing={3}>
                            {/* Response Distribution Chart */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: '0.75rem', height: '100%' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Distribusi Waktu Respons
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Persentase pesan berdasarkan kecepatan balasan
                                    </Typography>
                                    <Box sx={{ height: 300 }}>
                                        <ResponsivePie
                                            data={responseDistributionData}
                                            margin={{ top: 30, right: 80, bottom: 50, left: 80 }}
                                            innerRadius={0.5}
                                            padAngle={0.7}
                                            cornerRadius={3}
                                            activeOuterRadiusOffset={8}
                                            borderWidth={1}
                                            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                                            arcLinkLabelsSkipAngle={10}
                                            arcLinkLabelsTextColor="#333333"
                                            arcLinkLabelsThickness={2}
                                            arcLinkLabelsColor={{ from: 'color' }}
                                            arcLabelsSkipAngle={10}
                                            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                                            defs={[
                                                {
                                                    id: 'dots',
                                                    type: 'patternDots',
                                                    background: 'inherit',
                                                    color: 'rgba(255, 255, 255, 0.3)',
                                                    size: 4,
                                                    padding: 1,
                                                    stagger: true
                                                },
                                                {
                                                    id: 'lines',
                                                    type: 'patternLines',
                                                    background: 'inherit',
                                                    color: 'rgba(255, 255, 255, 0.3)',
                                                    rotation: -45,
                                                    lineWidth: 6,
                                                    spacing: 10
                                                }
                                            ]}
                                            legends={[
                                                {
                                                    anchor: 'bottom',
                                                    direction: 'row',
                                                    justify: false,
                                                    translateX: 0,
                                                    translateY: 40,
                                                    itemsSpacing: 0,
                                                    itemWidth: 100,
                                                    itemHeight: 18,
                                                    itemTextColor: '#999',
                                                    itemDirection: 'left-to-right',
                                                    itemOpacity: 1,
                                                    symbolSize: 18,
                                                    symbolShape: 'circle',
                                                    effects: [
                                                        {
                                                            on: 'hover',
                                                            style: {
                                                                itemTextColor: '#000'
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>
                            
                            {/* Manager Performance Metrics */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: '0.75rem' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Performa Respons
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Metrik performa dalam menangani pesan
                                    </Typography>
                                    
                                    <Box sx={{ mt: 4 }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Pesan Diterima
                                                    </Typography>
                                                    <Typography variant="h5" fontWeight="bold">
                                                        {performance.total_received}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Pesan Dibalas
                                                    </Typography>
                                                    <Typography variant="h5" fontWeight="bold">
                                                        {performance.total_responded}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        
                                        <Box sx={{ my: 3 }}>
                                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                                                Tingkat Respons
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={performance.response_rate} 
                                                        sx={{ 
                                                            height: 10, 
                                                            borderRadius: 5,
                                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: performance.response_rate > 80 
                                                                    ? 'success.main' 
                                                                    : performance.response_rate > 50 
                                                                        ? 'warning.main' 
                                                                        : 'error.main',
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ minWidth: 35 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {`${Math.round(performance.response_rate)}%`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                                                Distribusi Waktu Respons
                                            </Typography>
                                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip title="Pesan yang dijawab dalam waktu 1 jam">
                                                        <Paper 
                                                            elevation={0} 
                                                            sx={{ 
                                                                p: 1, 
                                                                textAlign: 'center',
                                                                bgcolor: 'success.light',
                                                                color: 'success.contrastText',
                                                                borderRadius: 2
                                                            }}
                                                        >
                                                            <Typography variant="h6" fontWeight="bold">
                                                                {performance.response_time_distribution.within_1_hour}
                                                            </Typography>
                                                            <Typography variant="caption">
                                                                &lt; 1 jam
                                                            </Typography>
                                                        </Paper>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip title="Pesan yang dijawab dalam waktu 1-4 jam">
                                                        <Paper 
                                                            elevation={0} 
                                                            sx={{ 
                                                                p: 1, 
                                                                textAlign: 'center',
                                                                bgcolor: 'info.light',
                                                                color: 'info.contrastText',
                                                                borderRadius: 2
                                                            }}
                                                        >
                                                            <Typography variant="h6" fontWeight="bold">
                                                                {performance.response_time_distribution['1_to_4_hours']}
                                                            </Typography>
                                                            <Typography variant="caption">
                                                                1-4 jam
                                                            </Typography>
                                                        </Paper>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip title="Pesan yang dijawab dalam waktu 4-24 jam">
                                                        <Paper 
                                                            elevation={0} 
                                                            sx={{ 
                                                                p: 1, 
                                                                textAlign: 'center',
                                                                bgcolor: 'warning.light',
                                                                color: 'warning.contrastText',
                                                                borderRadius: 2
                                                            }}
                                                        >
                                                            <Typography variant="h6" fontWeight="bold">
                                                                {performance.response_time_distribution['4_to_24_hours']}
                                                            </Typography>
                                                            <Typography variant="caption">
                                                                4-24 jam
                                                            </Typography>
                                                        </Paper>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip title="Pesan yang dijawab dalam waktu lebih dari 24 jam">
                                                        <Paper 
                                                            elevation={0} 
                                                            sx={{ 
                                                                p: 1, 
                                                                textAlign: 'center',
                                                                bgcolor: 'error.light',
                                                                color: 'error.contrastText',
                                                                borderRadius: 2
                                                            }}
                                                        >
                                                            <Typography variant="h6" fontWeight="bold">
                                                                {performance.response_time_distribution.over_24_hours}
                                                            </Typography>
                                                            <Typography variant="caption">
                                                                &gt; 24 jam
                                                            </Typography>
                                                        </Paper>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                            
                            {/* Messages Trend Chart */}
                            <Grid item xs={12}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: '0.75rem' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Tren Aktivitas Pesan (30 Hari Terakhir)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Grafik jumlah pesan per hari
                                    </Typography>
                                    <Box sx={{ height: 400 }}>
                                        <ResponsiveLine
                                            data={messagesByDateData}
                                            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                                            xScale={{ type: 'point' }}
                                            yScale={{
                                                type: 'linear',
                                                min: 'auto',
                                                max: 'auto',
                                                stacked: false,
                                                reverse: false
                                            }}
                                            yFormat=" >-.2f"
                                            axisTop={null}
                                            axisRight={null}
                                            axisBottom={{
                                                tickSize: 5,
                                                tickPadding: 5,
                                                tickRotation: -45,
                                                legend: 'Tanggal',
                                                legendOffset: 45,
                                                legendPosition: 'middle'
                                            }}
                                            axisLeft={{
                                                tickSize: 5,
                                                tickPadding: 5,
                                                tickRotation: 0,
                                                legend: 'Jumlah Pesan',
                                                legendOffset: -40,
                                                legendPosition: 'middle'
                                            }}
                                            pointSize={10}
                                            pointColor={{ theme: 'background' }}
                                            pointBorderWidth={2}
                                            pointBorderColor={{ from: 'serieColor' }}
                                            pointLabelYOffset={-12}
                                            useMesh={true}
                                            legends={[
                                                {
                                                    anchor: 'bottom-right',
                                                    direction: 'column',
                                                    justify: false,
                                                    translateX: 100,
                                                    translateY: 0,
                                                    itemsSpacing: 0,
                                                    itemDirection: 'left-to-right',
                                                    itemWidth: 80,
                                                    itemHeight: 20,
                                                    itemOpacity: 0.75,
                                                    symbolSize: 12,
                                                    symbolShape: 'circle',
                                                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                                    effects: [
                                                        {
                                                            on: 'hover',
                                                            style: {
                                                                itemBackground: 'rgba(0, 0, 0, .03)',
                                                                itemOpacity: 1
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>
                            
                            {/* Top Jobs by Messages */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: '0.75rem' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Pekerjaan dengan Aktivitas Tertinggi
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Pekerjaan dengan jumlah pesan terbanyak
                                    </Typography>
                                    
                                    <List>
                                        {topJobs.map((job, index) => (
                                            <React.Fragment key={job.job_id}>
                                                <ListItem
                                                    secondaryAction={
                                                        <Chip 
                                                            label={`${job.message_count} pesan`}
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                                                            {index + 1}
                                                        </Avatar>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Link href={route('manager.jobs.show', job.job_id)}>
                                                                {job.job_title}
                                                            </Link>
                                                        }
                                                        secondary={job.company_name}
                                                    />
                                                </ListItem>
                                                {index < topJobs.length - 1 && <Divider variant="inset" component="li" />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                            
                            {/* Recent Conversations */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: '0.75rem' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Percakapan Terbaru
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Percakapan dengan aktivitas terbaru
                                    </Typography>
                                    
                                    <List>
                                        {recentConversations.map((conversation, index) => (
                                            <React.Fragment key={conversation.conversation_id}>
                                                <ListItem
                                                    secondaryAction={
                                                        <Chip 
                                                            label={conversation.last_message_date}
                                                            color="secondary"
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <PersonIcon color="primary" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Link href={route('manager.messages.show', conversation.conversation_id)}>
                                                                {conversation.other_party}
                                                            </Link>
                                                        }
                                                        secondary={
                                                            <>
                                                                <Typography variant="caption" color="text.secondary" component="span">
                                                                    {conversation.job_title} - 
                                                                </Typography>
                                                                {" " + conversation.last_message}
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                                {index < recentConversations.length - 1 && <Divider variant="inset" component="li" />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                            
                            {/* Action Buttons */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        component={Link}
                                        href={route('manager.messages.response-times')}
                                        variant="contained"
                                        startIcon={<BarChartIcon />}
                                        sx={{ ml: 2 }}
                                    >
                                        Lihat Metrik Detail
                                    </Button>
                                    <Button
                                        component={Link}
                                        href={route('manager.messages.index')}
                                        variant="outlined"
                                        startIcon={<MailIcon />}
                                        sx={{ ml: 2 }}
                                    >
                                        Kelola Pesan
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </motion.div>
                </Box>
            </Container>
        </Layout>
    );
};

export default Analytics;
