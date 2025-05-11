import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage, Link } from '@inertiajs/inertia-react';
import {
    Box,
    Typography,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Grid,
    Tooltip,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    ListItemIcon,
    Divider,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    SwapVert as StagesIcon,
    Reorder as ReorderIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// Import custom components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Modal from '@/Components/Shared/Modal';
import Alert from '@/Components/Shared/Alert';
import Spinner from '@/Components/Shared/Spinner';
import Layout from '@/Components/Layout/Layout';

const HiringStagesIndex = () => {
    const { hiringStages } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [stageToDelete, setStageToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        // Check for flash messages from the backend
        const { flash } = usePage().props;
        if (flash?.message) {
            setAlertMessage(flash.message);
            setAlertSeverity(flash.type || 'success');
            setShowAlert(true);

            // Auto-hide the alert after 5 seconds
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [usePage().props]);

    // Handle stage deletion
    const handleDelete = () => {
        if (!stageToDelete) return;

        setLoading(true);
        Inertia.delete(route('admin.hiring-stages.destroy', stageToDelete.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setStageToDelete(null);
                setAlertMessage('Hiring stage deleted successfully.');
                setAlertSeverity('success');
                setShowAlert(true);
            },
            onError: (errors) => {
                setAlertMessage('Failed to delete hiring stage: ' + Object.values(errors).flat().join(' '));
                setAlertSeverity('error');
                setShowAlert(true);
            },
            onFinish: () => setLoading(false),
        });
    };

    // Get color style for stage
    const getColorStyle = (color) => {
        const colorMap = {
            'primary': '#3f51b5',
            'secondary': '#f50057',
            'success': '#4caf50',
            'error': '#f44336',
            'warning': '#ff9800',
            'info': '#2196f3',
            'default': '#9e9e9e',
        };

        return colorMap[color] || color || '#9e9e9e';
    };

    // Filter stages based on search term
    const filteredStages = hiringStages.filter(stage =>
        stage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort stages by order_index
    const sortedStages = [...filteredStages].sort((a, b) => a.order_index - b.order_index);

    return (
        <>
        <Layout>
            {showAlert && (
                <Alert
                    severity={alertSeverity}
                    onClose={() => setShowAlert(false)}
                    sx={{ mb: 2 }}
                >
                    {alertMessage}
                </Alert>
            )}

            <Card
                title="Hiring Stages"
                icon={<StagesIcon />}
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        href={route('admin.hiring-stages.create')}
                    >
                        Add Hiring Stage
                    </Button>
                }
            >
                <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search hiring stages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>

                    {loading ? (
                        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                            <Spinner message="Loading hiring stages..." />
                        </Box>
                    ) : sortedStages.length === 0 ? (
                        <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                No hiring stages found. Click "Add Hiring Stage" to create your first stage.
                            </Typography>
                        </Paper>
                    ) : (
                        <Paper sx={{ borderRadius: 2 }}>
                            <List disablePadding>
                                {sortedStages.map((stage, index) => (
                                    <React.Fragment key={stage.id}>
                                        <ListItem
                                            sx={{
                                                borderLeft: `4px solid ${getColorStyle(stage.color)}`,
                                                py: 2,
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '50%',
                                                        bgcolor: (theme) => alpha(getColorStyle(stage.color), 0.1),
                                                        color: getColorStyle(stage.color),
                                                    }}
                                                >
                                                    {stage.order_index + 1}
                                                </Box>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {stage.name}
                                                        </Typography>
                                                        {stage.is_default && (
                                                            <Chip
                                                                icon={<CheckCircleIcon />}
                                                                label="Default"
                                                                color="primary"
                                                                size="small"
                                                                sx={{ ml: 1 }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                                secondary={stage.description}
                                            />
                                            <ListItemSecondaryAction>
                                                <Box sx={{ display: 'flex' }}>
                                                    <Tooltip title="Edit Stage">
                                                        <IconButton
                                                            component={Link}
                                                            href={route('admin.hiring-stages.edit', stage.id)}
                                                            size="small"
                                                            color="primary"
                                                            sx={{ mr: 1 }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Stage">
                                                        <IconButton
                                                            onClick={() => {
                                                                setStageToDelete(stage);
                                                                setDeleteModal(true);
                                                            }}
                                                            size="small"
                                                            color="error"
                                                            disabled={stage.is_default}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < sortedStages.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Delete Hiring Stage"
                description={
                    <>
                        <Typography variant="body1" gutterBottom>
                            Are you sure you want to delete <strong>{stageToDelete?.name}</strong>?
                        </Typography>
                        <Typography variant="body2" color="error">
                            This action cannot be undone. Any jobs using this stage will need to be reconfigured.
                        </Typography>
                    </>
                }
                confirmButton
                cancelButton
                confirmText="Delete"
                confirmColor="error"
                onConfirm={handleDelete}
                loading={loading}
            />
            </Layout>
        </>
    );
};

export default HiringStagesIndex;
