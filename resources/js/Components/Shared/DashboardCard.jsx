import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function DashboardCard({ title, value, icon, color, onClick, className }) {
    return (
        <Card
            className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${className}`}
            onClick={onClick}
            sx={{
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography
                        variant="h4"
                        component="div"
                        className="font-bold"
                        sx={{ color }}
                    >
                        {value}
                    </Typography>
                    <Box sx={{
                        backgroundColor: color + '20', // Add 20% opacity
                        borderRadius: '50%',
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
                    </Box>
                </Box>
                <Typography variant="body2" className="text-gray-600 mt-4">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
}
