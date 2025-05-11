import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { usePage, Link } from '@inertiajs/react';
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
    ListItemIcon, Divider,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    DynamicForm as FormIcon,
    Reorder as ReorderIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';

// Import custom components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Modal from '@/Components/Shared/Modal';
import Alert from '@/Components/Shared/Alert';
import Spinner from '@/Components/Shared/Spinner';
import Layout from '@/Components/Layout/Layout';

const FormBuilderIndex = () => {
    const { formSections } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [showAlert, setShowAlert] = useState(false);

    // useEffect(() => {
    //     // Check for flash messages from the backend
    //     const { flash } = usePage().props;
    //     if (flash?.message) {
    //         setAlertMessage(flash.message);
    //         setAlertSeverity(flash.type || 'success');
    //         setShowAlert(true);

    //         // Auto-hide the alert after 5 seconds
    //         const timer = setTimeout(() => {
    //             setShowAlert(false);
    //         }, 5000);

    //         return () => clearTimeout(timer);
    //     }
    // }, [usePage().props]);

    // Handle section deletion
    const handleDelete = () => {
        if (!sectionToDelete) return;

        setLoading(true);
        router.delete(route('admin.form-builder.destroy', sectionToDelete.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSectionToDelete(null);
                setAlertMessage('Form section deleted successfully.');
                setAlertSeverity('success');
                setShowAlert(true);
            },
            onError: (errors) => {
                setAlertMessage('Failed to delete form section: ' + Object.values(errors).flat().join(' '));
                setAlertSeverity('error');
                setShowAlert(true);
            },
            onFinish: () => setLoading(false),
        });
    };

    // Handle section toggle (enable/disable)
    const handleToggleSection = (section) => {
        router.patch(route('admin.form-builder.toggle', section.id), {
            is_enabled: !section.is_enabled
        }, {
            preserveScroll: true,
            onError: () => {
                setAlertMessage('Failed to update section status.');
                setAlertSeverity('error');
                setShowAlert(true);
            }
        });
    };

    // Filter sections based on search term
    const filteredSections = formSections.filter(section =>
        section.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                title="Form Builder"
                icon={<FormIcon />}
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        href={route('admin.form-builder.create')}
                    >
                        Add Form Section
                    </Button>
                }
            >
                <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search form sections..."
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
                            <Spinner message="Loading form sections..." />
                        </Box>
                    ) : filteredSections.length === 0 ? (
                        <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                No form sections found. Click "Add Form Section" to create your first section.
                            </Typography>
                        </Paper>
                    ) : (
                        <Paper sx={{ borderRadius: 2 }}>
                            <List disablePadding>
                                {filteredSections.map((section, index) => (
                                    <React.Fragment key={section.id}>
                                        <ListItem
                                            sx={{
                                                borderLeft: (theme) =>
                                                    `4px solid ${section.is_enabled ? theme.palette.primary.main : theme.palette.grey[400]}`,
                                                opacity: section.is_enabled ? 1 : 0.7,
                                                py: 2,
                                            }}
                                        >
                                            <ListItemIcon>
                                                <DragIndicatorIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {section.name}
                                                        </Typography>
                                                        <Chip
                                                            label={`${section.form_fields_count || 0} fields`}
                                                            color="primary"
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ ml: 1 }}
                                                        />
                                                        <Chip
                                                            label={section.is_enabled ? 'Enabled' : 'Disabled'}
                                                            color={section.is_enabled ? 'success' : 'default'}
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={section.description}
                                            />
                                            <ListItemSecondaryAction>
                                                <Box sx={{ display: 'flex' }}>
                                                    <Tooltip title={section.is_enabled ? 'Disable Section' : 'Enable Section'}>
                                                        <IconButton
                                                            onClick={() => handleToggleSection(section)}
                                                            size="small"
                                                            color={section.is_enabled ? 'primary' : 'default'}
                                                            sx={{ mr: 1 }}
                                                        >
                                                            {section.is_enabled ? (
                                                                <VisibilityIcon fontSize="small" />
                                                            ) : (
                                                                <VisibilityOffIcon fontSize="small" />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Section">
                                                        <IconButton
                                                            component={Link}
                                                            href={route('admin.form-builder.edit', section.id)}
                                                            size="small"
                                                            color="primary"
                                                            sx={{ mr: 1 }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Section">
                                                        <IconButton
                                                            onClick={() => {
                                                                setSectionToDelete(section);
                                                                setDeleteModal(true);
                                                            }}
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < filteredSections.length - 1 && <Divider />}
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
                title="Delete Form Section"
                description={
                    <>
                        <Typography variant="body1" gutterBottom>
                            Are you sure you want to delete <strong>{sectionToDelete?.name}</strong>?
                        </Typography>
                        <Typography variant="body2" color="error">
                            This action cannot be undone. All form fields associated with this section will also be deleted.
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

export default FormBuilderIndex;
