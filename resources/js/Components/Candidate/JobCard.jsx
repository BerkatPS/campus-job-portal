import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, Typography, Chip, Box, Button, Divider } from '@mui/material';
import { LocationOn, Business, AttachMoney, AccessTime } from '@mui/icons-material';

export default function JobCard({ job }) {
    const formatDeadline = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format the salary range
    const formatSalary = (min, max) => {
        if (!min && !max) return 'Not specified';
        if (min && !max) return `$${min.toLocaleString()}+`;
        if (!min && max) return `Up to $${max.toLocaleString()}`;
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    };

    // Calculate days until deadline
    const getDaysUntilDeadline = (dateString) => {
        const deadlineDate = new Date(dateString);
        const currentDate = new Date();

        // Clear time part for accurate day calculation
        deadlineDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        const differenceTime = deadlineDate - currentDate;
        const differenceDays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24));

        if (differenceDays < 0) return 'Expired';
        if (differenceDays === 0) return 'Today';
        if (differenceDays === 1) return '1 day left';
        return `${differenceDays} days left`;
    };

    return (
        <Card className="mb-4 hover:shadow-md transition-all duration-300" elevation={1}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" component="div" className="font-semibold text-gray-900">
                        {job.title}
                    </Typography>
                    <Chip
                        label={job.job_type}
                        size="small"
                        color={job.job_type === 'Full-time' ? 'primary' : 'secondary'}
                        variant="outlined"
                    />
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Business className="text-gray-500 mr-1" fontSize="small" />
                        <Typography variant="body2" className="text-gray-600">
                            {job.company.name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn className="text-gray-500 mr-1" fontSize="small" />
                        <Typography variant="body2" className="text-gray-600">
                            {job.location}
                        </Typography>
                    </Box>
                    {job.is_salary_visible && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AttachMoney className="text-gray-500 mr-1" fontSize="small" />
                            <Typography variant="body2" className="text-gray-600">
                                {formatSalary(job.salary_min, job.salary_max)}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime className="text-gray-500 mr-1" fontSize="small" />
                        <Typography variant="body2" className="text-gray-600">
                            {getDaysUntilDeadline(job.submission_deadline)}
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="body2" className="text-gray-700 mb-3 line-clamp-2">
                    {job.description}
                </Typography>

                <Divider className="my-3" />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" className="text-gray-500">
                        Posted: {new Date(job.created_at).toLocaleDateString()}
                    </Typography>
                    <Link href={`/candidate/jobs/${job.id}`} className="no-underline">
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                        >
                            View Details
                        </Button>
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
}
