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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress,
    alpha,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Timer as TimerIcon,
    Timeline as TimelineIcon,
    BarChart as BarChartIcon,
    TrendingUp as TrendingUpIcon,
    MoreVert as MoreVertIcon,
    AccessTime as AccessTimeIcon,
    Work as WorkIcon,
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import { motion } from 'framer-motion';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';

const ResponseTimeMetrics = ({ dailyResponseTimes, jobMetrics }) => {
    // Format daily response time data for the line chart
    const responseTimeData = [
        {
            id: "avg-response-time",
            color: "hsl(210, 70%, 50%)",
            data: dailyResponseTimes.map(item => ({
                x: item.date,
                y: Math.round(item.avg_time)
            }))
        }
    ];

    // Format message count data for the line chart
    const messageCountData = [
        {
            id: "message-count",
            color: "hsl(150, 70%, 50%)",
            data: dailyResponseTimes.map(item => ({
                x: item.date,
                y: item.count
            }))
        }
    ];

    // Format job metrics for the bar chart
    const jobMetricsData = jobMetrics.map(job => ({
        jobId: job.job_id,
        job: job.job_title.length > 20 ? job.job_title.substring(0, 20) + '...' : job.job_title,
        "Rata-Rata Waktu Respons": job.avg_response_time,
        "Jumlah Pesan": job.message_count,
    }));

    return (
        <Layout>
            <Head title="Metrik Waktu Respons" />
            
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                            <Button
                                component={Link}
                                href={route('manager.messages.analytics')}
                                startIcon={<ArrowBackIcon />}
                                sx={{ mr: 2 }}
                            >
                                Kembali ke Analitik
                            </Button>
                            <Typography variant="h4" component="h1" fontWeight="bold">
                                Metrik Waktu Respons
                            </Typography>
                        </Box>
                        
                        <Grid container spacing={3}>
                            {/* Daily Response Time Chart */}
                            <Grid item xs={12}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: '0.75rem' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Tren Waktu Respons Harian (30 Hari Terakhir)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Rata-rata waktu respons dalam menit per hari
                                    </Typography>
                                    <Box sx={{ height: 400 }}>
                                        <ResponsiveLine
                                            data={responseTimeData}
                                            margin={{ top: 50, right: 110, bottom: 80, left: 60 }}
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
                                                legendOffset: 60,
                                                legendPosition: 'middle'
                                            }}
                                            axisLeft={{
                                                tickSize: 5,
                                                tickPadding: 5,
                                                tickRotation: 0,
                                                legend: 'Waktu Respons (menit)',
                                                legendOffset: -50,
                                                legendPosition: 'middle'
                                            }}
                                            colors={{ scheme: 'category10' }}
                                            pointSize={10}
                                            pointColor={{ theme: 'background' }}
                                            pointBorderWidth={2}
                                            pointBorderColor={{ from: 'serieColor' }}
                                            pointLabelYOffset={-12}
                                            useMesh={true}
                                            legends={[
                                                {
                                                    anchor: 'top-right',
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
                            
                            {/* Daily Message Count Chart */}
                            <Grid item xs={12}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: '0.75rem' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Jumlah Pesan Harian (30 Hari Terakhir)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Total pesan yang dikirim dan diterima per hari
                                    </Typography>
                                    <Box sx={{ height: 400 }}>
                                        <ResponsiveLine
                                            data={messageCountData}
                                            margin={{ top: 50, right: 110, bottom: 80, left: 60 }}
                                            xScale={{ type: 'point' }}
                                            yScale={{
                                                type: 'linear',
                                                min: 0,
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
                                                legendOffset: 60,
                                                legendPosition: 'middle'
                                            }}
                                            axisLeft={{
                                                tickSize: 5,
                                                tickPadding: 5,
                                                tickRotation: 0,
                                                legend: 'Jumlah Pesan',
                                                legendOffset: -50,
                                                legendPosition: 'middle'
                                            }}
                                            colors={{ scheme: 'category10' }}
                                            curve="monotoneX"
                                            pointSize={10}
                                            pointColor={{ theme: 'background' }}
                                            pointBorderWidth={2}
                                            pointBorderColor={{ from: 'serieColor' }}
                                            pointLabelYOffset={-12}
                                            useMesh={true}
                                            legends={[
                                                {
                                                    anchor: 'top-right',
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
                            
                            {/* Job Performance Bar Chart */}
                            <Grid item xs={12}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: '0.75rem' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Performa Respons Berdasarkan Pekerjaan
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Rata-rata waktu respons per pekerjaan (menit)
                                    </Typography>
                                    <Box sx={{ height: 500 }}>
                                        <ResponsiveBar
                                            data={jobMetricsData}
                                            keys={['Rata-Rata Waktu Respons']}
                                            indexBy="job"
                                            margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                                            padding={0.3}
                                            layout="horizontal"
                                            valueScale={{ type: 'linear' }}
                                            indexScale={{ type: 'band', round: true }}
                                            colors={{ scheme: 'nivo' }}
                                            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                            axisTop={null}
                                            axisRight={null}
                                            axisBottom={{
                                                tickSize: 5,
                                                tickPadding: 5,
                                                tickRotation: 0,
                                                legend: 'Waktu Respons (menit)',
                                                legendPosition: 'middle',
                                                legendOffset: 45
                                            }}
                                            axisLeft={{
                                                tickSize: 5,
                                                tickPadding: 5,
                                                tickRotation: 0,
                                                legend: 'Pekerjaan',
                                                legendPosition: 'middle',
                                                legendOffset: -50
                                            }}
                                            labelSkipWidth={12}
                                            labelSkipHeight={12}
                                            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                            legends={[
                                                {
                                                    dataFrom: 'keys',
                                                    anchor: 'bottom-right',
                                                    direction: 'column',
                                                    justify: false,
                                                    translateX: 120,
                                                    translateY: 0,
                                                    itemsSpacing: 2,
                                                    itemWidth: 100,
                                                    itemHeight: 20,
                                                    itemDirection: 'left-to-right',
                                                    itemOpacity: 0.85,
                                                    symbolSize: 20,
                                                    effects: [
                                                        {
                                                            on: 'hover',
                                                            style: {
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
                            
                            {/* Job Metrics Table */}
                            <Grid item xs={12}>
                                <Paper elevation={2} sx={{ p: 3, borderRadius: '0.75rem' }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Detail Metrik Respons Per Pekerjaan
                                    </Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Pekerjaan</TableCell>
                                                    <TableCell>Perusahaan</TableCell>
                                                    <TableCell align="center">Jumlah Pesan</TableCell>
                                                    <TableCell align="center">Rata-Rata Waktu Respons</TableCell>
                                                    <TableCell align="center">Performa</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {jobMetrics.map((job) => {
                                                    // Determine performance color based on response time
                                                    let performanceColor, performanceLabel;
                                                    
                                                    if (job.avg_response_time <= 60) {
                                                        performanceColor = 'success';
                                                        performanceLabel = 'Sangat Baik';
                                                    } else if (job.avg_response_time <= 240) {
                                                        performanceColor = 'info';
                                                        performanceLabel = 'Baik';
                                                    } else if (job.avg_response_time <= 1440) {
                                                        performanceColor = 'warning';
                                                        performanceLabel = 'Sedang';
                                                    } else {
                                                        performanceColor = 'error';
                                                        performanceLabel = 'Perlu Ditingkatkan';
                                                    }
                                                    
                                                    return (
                                                        <TableRow key={job.job_id}>
                                                            <TableCell>
                                                                <Link 
                                                                    href={route('manager.jobs.show', job.job_id)}
                                                                    style={{ textDecoration: 'none' }}
                                                                >
                                                                    <Typography color="primary.main" sx={{ fontWeight: 'medium' }}>
                                                                        {job.job_title}
                                                                    </Typography>
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell>{job.company_name}</TableCell>
                                                            <TableCell align="center">
                                                                <Chip 
                                                                    label={job.message_count}
                                                                    size="small"
                                                                    color="primary"
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <AccessTimeIcon 
                                                                        fontSize="small" 
                                                                        sx={{ 
                                                                            mr: 1,
                                                                            color: performanceColor + '.main'
                                                                        }} 
                                                                    />
                                                                    <Typography>
                                                                        {job.avg_response_time} menit
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip 
                                                                    label={performanceLabel}
                                                                    size="small"
                                                                    color={performanceColor}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </motion.div>
                </Box>
            </Container>
        </Layout>
    );
};

export default ResponseTimeMetrics;
