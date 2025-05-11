import React, { useState, useEffect } from 'react';

import { useForm, usePage, Link } from '@inertiajs/react';
import {
    Box,
    Grid,
    Typography,
    Divider,
    IconButton,
    Paper,
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    DynamicForm as FormIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';

// Import custom components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Input from '@/Components/Shared/Input';
import TextArea from '@/Components/Shared/TextArea';
import FormGroup from '@/Components/Shared/FormGroup';
import Select from '@/Components/Shared/Select';
import Checkbox from '@/Components/Shared/Checkbox';
import Alert from '@/Components/Shared/Alert';
import Layout from '@/Components/Layout/Layout';

const FormBuilderEdit = () => {
    const { formSection, formFields } = usePage().props;
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [fields, setFields] = useState(formFields || []);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: formSection.name || '',
        description: formSection.description || '',
        is_enabled: formSection.is_enabled || true,
        order_index: formSection.order_index || 0,
    });

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
    // }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if form fields are valid
        if (!validateFormFields()) {
            setAlertMessage('Please fill in all field names and provide options for select/radio/checkbox fields.');
            setAlertSeverity('error');
            setShowAlert(true);
            return;
        }

        // Submit the form
        post(route('admin.form-builder.update', formSection.id), {
            data: {
                ...data,
                fields: fields
            },
            onSuccess: () => {
                setAlertMessage('Form section updated successfully.');
                setAlertSeverity('success');
                setShowAlert(true);
            },
            onError: (errors) => {
                setAlertMessage('Please check the form for errors.');
                setAlertSeverity('error');
                setShowAlert(true);

                // Scroll to top to see the alert
                window.scrollTo(0, 0);
            },
        });
    };

    // Add a new form field
    const addFormField = () => {
        setFields([
            ...fields,
            {
                name: '',
                field_type: 'text',
                options: [],
                is_required: false,
                order_index: fields.length,
                form_section_id: formSection.id
            }
        ]);
    };

    // Remove a form field
    const removeFormField = (index) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);

        // Update order_index for remaining fields
        updatedFields.forEach((field, idx) => {
            field.order_index = idx;
        });

        setFields(updatedFields);
    };

    // Update form field
    const updateFormField = (index, field) => {
        const updatedFields = [...fields];
        updatedFields[index] = field;
        setFields(updatedFields);
    };

    // Add option to select/radio/checkbox field
    const addFieldOption = (fieldIndex) => {
        const updatedFields = [...fields];
        const field = updatedFields[fieldIndex];

        if (!field.options) {
            field.options = [];
        } else if (typeof field.options === 'string') {
            // Convert JSON string to array if needed
            try {
                field.options = JSON.parse(field.options);
            } catch (e) {
                field.options = [];
            }
        }

        field.options.push('');
        setFields(updatedFields);
    };

    // Update field option
    const updateFieldOption = (fieldIndex, optionIndex, value) => {
        const updatedFields = [...fields];
        const field = updatedFields[fieldIndex];

        // Ensure options is an array
        if (typeof field.options === 'string') {
            try {
                field.options = JSON.parse(field.options);
            } catch (e) {
                field.options = [];
            }
        }

        field.options[optionIndex] = value;
        setFields(updatedFields);
    };

    // Remove field option
    const removeFieldOption = (fieldIndex, optionIndex) => {
        const updatedFields = [...fields];
        const field = updatedFields[fieldIndex];

        // Ensure options is an array
        if (typeof field.options === 'string') {
            try {
                field.options = JSON.parse(field.options);
            } catch (e) {
                field.options = [];
            }
        }

        field.options.splice(optionIndex, 1);
        setFields(updatedFields);
    };

    // Validate form fields before submission
    const validateFormFields = () => {
        if (fields.length === 0) return false;

        for (const field of fields) {
            if (!field.name.trim()) return false;

            if (['select', 'radio', 'checkbox'].includes(field.field_type)) {
                let options = field.options;

                // Parse options if it's a string
                if (typeof options === 'string') {
                    try {
                        options = JSON.parse(options);
                    } catch (e) {
                        return false;
                    }
                }

                if (!options || !Array.isArray(options) || options.length === 0) {
                    return false;
                }

                for (const option of options) {
                    if (!option.trim()) return false;
                }
            }
        }

        return true;
    };

    // Get options as array
    const getFieldOptions = (field) => {
        if (!field.options) return [];

        if (typeof field.options === 'string') {
            try {
                return JSON.parse(field.options);
            } catch (e) {
                return [];
            }
        }

        return field.options;
    };

    const fieldTypes = [
        { value: 'text', label: 'Text Field' },
        { value: 'textarea', label: 'Text Area' },
        { value: 'number', label: 'Number' },
        { value: 'email', label: 'Email' },
        { value: 'date', label: 'Date' },
        { value: 'select', label: 'Dropdown Select' },
        { value: 'radio', label: 'Radio Buttons' },
        { value: 'checkbox', label: 'Checkboxes' },
        { value: 'file', label: 'File Upload' },
    ];

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
                title={`Edit Form Section: ${formSection.name}`}
                icon={<FormIcon />}
                action={
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        component={Link}
                        href={route('admin.form-builder.index')}
                    >
                        Back to Form Builder
                    </Button>
                }
            >
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormGroup
                                label="Section Information"
                                marginBottom="large"
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Input
                                            label="Section Name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            error={errors.name}
                                            helperText={errors.name}
                                            fullWidth
                                            placeholder="e.g., Personal Information, Education, Work Experience"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextArea
                                            label="Description"
                                            name="description"
                                            value={data.description || ''}
                                            onChange={(e) => setData('description', e.target.value)}
                                            error={errors.description}
                                            helperText={errors.description}
                                            rows={3}
                                            fullWidth
                                            placeholder="Brief description of this form section"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Input
                                            label="Order Index"
                                            name="order_index"
                                            type="number"
                                            value={data.order_index}
                                            onChange={(e) => setData('order_index', e.target.value)}
                                            error={errors.order_index}
                                            helperText={errors.order_index || "Determines the display order of sections"}
                                            fullWidth
                                            InputProps={{ inputProps: { min: 0 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Checkbox
                                            label="Enable this section"
                                            name="is_enabled"
                                            checked={data.is_enabled}
                                            onChange={(e) => setData('is_enabled', e.target.checked)}
                                            helperText="Disabled sections won't be shown in application forms"
                                        />
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormGroup
                                label="Section Status"
                                marginBottom="large"
                            >
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        This section has <strong>{fields.length}</strong> field(s) and is currently <strong>{data.is_enabled ? 'enabled' : 'disabled'}</strong>.
                                    </Typography>
                                </Box>

                                <Typography variant="body2" fontWeight={500}>Notes:</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    - Changing field types will reset any options for that field
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    - Removing fields will delete any data collected by those fields
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    - The order of fields can be changed by dragging them up or down
                                </Typography>
                            </FormGroup>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <FormGroup
                        label="Form Fields"
                        marginBottom="large"
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Manage fields to collect information from applicants.
                        </Typography>

                        {fields.map((field, index) => (
                            <Paper
                                key={index}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    position: 'relative',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <DragIndicatorIcon color="action" sx={{ mr: 1 }} />
                                    <Typography variant="subtitle1" fontWeight={500}>
                                        Field #{index + 1}
                                    </Typography>
                                    <Box sx={{ ml: 'auto' }}>
                                        <IconButton
                                            color="error"
                                            onClick={() => removeFormField(index)}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Input
                                            label="Field Name"
                                            value={field.name}
                                            onChange={(e) => updateFormField(index, { ...field, name: e.target.value })}
                                            required
                                            fullWidth
                                            placeholder="e.g., Full Name, Email Address, Education Level"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Select
                                            label="Field Type"
                                            value={field.field_type}
                                            onChange={(e) => updateFormField(index, { ...field, field_type: e.target.value })}
                                            options={fieldTypes}
                                            required
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Checkbox
                                            label="Required Field"
                                            checked={field.is_required}
                                            onChange={(e) => updateFormField(index, { ...field, is_required: e.target.checked })}
                                            helperText="Applicants must fill this field to submit the application"
                                        />
                                    </Grid>

                                    {/* Options for select, radio, and checkbox fields */}
                                    {['select', 'radio', 'checkbox'].includes(field.field_type) && (
                                        <Grid item xs={12}>
                                            <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Options
                                                </Typography>

                                                {getFieldOptions(field).map((option, optionIndex) => (
                                                    <Box
                                                        key={optionIndex}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            mb: 1
                                                        }}
                                                    >
                                                        <TextField
                                                            size="small"
                                                            value={option}
                                                            onChange={(e) => updateFieldOption(index, optionIndex, e.target.value)}
                                                            placeholder={`Option ${optionIndex + 1}`}
                                                            fullWidth
                                                            sx={{ mr: 1 }}
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => removeFieldOption(index, optionIndex)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ))}

                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => addFieldOption(index)}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Add Option
                                                </Button>
                                            </Paper>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        ))}

                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={addFormField}
                            sx={{ mt: 2 }}
                        >
                            Add Field
                        </Button>
                    </FormGroup>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => {
                                // Reset to original values
                                setData({
                                    _method: 'PUT',
                                    name: formSection.name || '',
                                    description: formSection.description || '',
                                    is_enabled: formSection.is_enabled || true,
                                    order_index: formSection.order_index || 0,
                                });
                                setFields(formFields || []);
                            }}
                            disabled={processing}
                        >
                            Reset
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            loading={processing}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </Card>
            </Layout>
        </>
    );
};

export default FormBuilderEdit;
