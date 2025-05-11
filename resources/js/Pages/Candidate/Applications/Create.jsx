import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Alert,
    AlertTitle,
    Stack,
    Avatar,
    CardContent,
    TextField,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    Checkbox,
    MenuItem,
    Select as MUISelect,
    InputLabel,
    ListItemText,
    OutlinedInput,
    Chip,
    IconButton,
    useTheme,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Send as SendIcon,
    CloudUpload as CloudUploadIcon,
    Check as CheckIcon,
    Description as DescriptionIcon,
    BusinessCenter as BusinessCenterIcon,
    Event as EventIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';

// Import custom components
import Layout from '@/Components/Layout/Layout';
import Button from '@/Components/Shared/Button';
import Input from '@/Components/Shared/Input';
import TextArea from '@/Components/Shared/TextArea';
import Select from '@/Components/Shared/Select';
import FileUpload from '@/Components/Shared/FileUpload';
import Card from '@/Components/Shared/Card';

const ApplicationCreate = ({ job = { id: '', title: '', company: { name: '', logo: null }, submission_deadline: '' }, formSections = [] }) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [errorStep, setErrorStep] = useState(null);
    const [steps, setSteps] = useState(['Personal Information', 'Resume & Cover Letter', 'Review & Submit']);

    // Initialize form with useForm
    const { data, setData, errors, processing, post, setError, clearErrors } = useForm({
        job_id: job.id,
        cover_letter: '',
        resume: null,
        responses: {},
    });

    useEffect(() => {
        // Log formSections untuk debugging
        console.log('Form sections:', formSections);
        
        // Inicializamos secciones si no están definidas para evitar errores
        if (!formSections || !Array.isArray(formSections)) {
            console.warn('formSections tidak valid:', formSections);
        }
    }, [formSections]);

    // Handle response change
    const handleResponseChange = (fieldId, value) => {
        setData('responses', {
            ...data.responses,
            [fieldId]: value,
        });
    };

    // Handle file upload
    const handleFileUpload = (file) => {
        setData('resume', file);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('candidate.jobs.submit-application', job.id), {
            forceFormData: true,
            onSuccess: () => {
                // Success handled by redirect in controller
            },
            onError: (errors) => {
                // Check if there are form section errors and set the error step
                if (errors.responses) {
                    setErrorStep(0);
                } else if (errors.resume || errors.cover_letter) {
                    setErrorStep(1);
                }
            },
        });
    };

    // Handle step navigation
    const handleNext = () => {
        if (validateCurrentStep()) {
            setActiveStep(prevStep => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prevStep => prevStep - 1);
    };

    // Validate the current step
    const validateCurrentStep = () => {
        clearErrors();
        if (activeStep === 0) {
            // Validate custom form fields
            let isValid = true;
            
            formSections.forEach(section => {
                section.fields.forEach(field => {
                    if (field.is_required && (!data.responses[field.id] || data.responses[field.id] === '')) {
                        setError(`responses.${field.id}`, 'This field is required');
                        isValid = false;
                    }
                });
            });
            
            return isValid;
        } else if (activeStep === 1) {
            // Validate resume and cover letter
            let isValid = true;
            
            if (!data.resume) {
                setError('resume', 'Resume is required');
                isValid = false;
            }
            
            return isValid;
        }
        
        return true;
    };

    // Fungsi tambahan untuk memastikan options adalah array
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

    // Render form field based on its type
    const renderField = (field) => {
        const fieldError = errors[`responses.${field.id}`];
        const fieldValue = data.responses[field.id] || '';
        const fieldOptions = getFieldOptions(field);
        
        switch (field.field_type) {
            case 'text':
                return (
                    <Input
                        key={field.id}
                        label={field.name}
                        value={fieldValue}
                        onChange={(e) => handleResponseChange(field.id, e.target.value)}
                        required={field.is_required}
                        error={!!fieldError}
                        helperText={fieldError}
                        fullWidth
                        margin="normal"
                    />
                );
                
            case 'textarea':
                return (
                    <TextArea
                        key={field.id}
                        label={field.name}
                        value={fieldValue}
                        onChange={(e) => handleResponseChange(field.id, e.target.value)}
                        required={field.is_required}
                        error={!!fieldError}
                        helperText={fieldError}
                        fullWidth
                        rows={4}
                        margin="normal"
                    />
                );
                
            case 'select':
                return (
                    <Select
                        key={field.id}
                        label={field.name}
                        value={fieldValue}
                        onChange={(e) => handleResponseChange(field.id, e.target.value)}
                        options={fieldOptions.map(option => ({ value: option, label: option }))}
                        required={field.is_required}
                        error={!!fieldError}
                        helperText={fieldError}
                        fullWidth
                        margin="normal"
                    />
                );
                
            case 'radio':
                return (
                    <FormControl key={field.id} component="fieldset" margin="normal" error={!!fieldError} required={field.is_required}>
                        <FormLabel component="legend">{field.name}</FormLabel>
                        <RadioGroup
                            value={fieldValue}
                            onChange={(e) => handleResponseChange(field.id, e.target.value)}
                        >
                            {fieldOptions.map((option, idx) => (
                                <FormControlLabel
                                    key={idx}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                />
                            ))}
                        </RadioGroup>
                        {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
                    </FormControl>
                );
                
            case 'checkbox':
                return (
                    <FormControl key={field.id} component="fieldset" margin="normal" error={!!fieldError} required={field.is_required}>
                        <FormLabel component="legend">{field.name}</FormLabel>
                        <FormGroup>
                            {fieldOptions.map((option, idx) => (
                                <FormControlLabel
                                    key={idx}
                                    control={
                                        <Checkbox
                                            checked={Array.isArray(fieldValue) ? fieldValue.includes(option) : false}
                                            onChange={(e) => {
                                                const currentValues = Array.isArray(fieldValue) ? [...fieldValue] : [];
                                                if (e.target.checked) {
                                                    handleResponseChange(field.id, [...currentValues, option]);
                                                } else {
                                                    handleResponseChange(
                                                        field.id,
                                                        currentValues.filter(value => value !== option)
                                                    );
                                                }
                                            }}
                                        />
                                    }
                                    label={option}
                                />
                            ))}
                        </FormGroup>
                        {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
                    </FormControl>
                );
                
            case 'date':
                return (
                    <Input
                        key={field.id}
                        label={field.name}
                        type="date"
                        value={fieldValue}
                        onChange={(e) => handleResponseChange(field.id, e.target.value)}
                        required={field.is_required}
                        error={!!fieldError}
                        helperText={fieldError}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                );
                
            case 'number':
                return (
                    <Input
                        key={field.id}
                        label={field.name}
                        type="number"
                        value={fieldValue}
                        onChange={(e) => handleResponseChange(field.id, e.target.value)}
                        required={field.is_required}
                        error={!!fieldError}
                        helperText={fieldError}
                        fullWidth
                        margin="normal"
                    />
                );
                
            case 'email':
                return (
                    <Input
                        key={field.id}
                        label={field.name}
                        type="email"
                        value={fieldValue}
                        onChange={(e) => handleResponseChange(field.id, e.target.value)}
                        required={field.is_required}
                        error={!!fieldError}
                        helperText={fieldError}
                        fullWidth
                        margin="normal"
                    />
                );
                
            case 'file':
                return (
                    <Box key={field.id} sx={{ my: 2 }}>
                        <FormLabel component="legend" required={field.is_required}>
                            {field.name}
                        </FormLabel>
                        <FileUpload
                            onFileSelect={(file) => handleResponseChange(field.id, file)}
                            label={`Upload ${field.name}`}
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            error={!!fieldError}
                            helperText={fieldError}
                        />
                    </Box>
                );
                
            default:
                return null;
        }
    };

    return (
        <Layout>
            <Head title={`Apply for ${job.title}`} />
            
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box mb={4}>
                    <Button
                        component={Link}
                        href={route('candidate.jobs.show', job.id)}
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        Back to Job
                    </Button>
                    
                    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Avatar
                                src={job.company?.logo || undefined}
                                alt={job.company?.name}
                                variant="rounded"
                                sx={{ 
                                    width: 56, 
                                    height: 56, 
                                    mr: 2,
                                    borderRadius: 2,
                                    bgcolor: 'primary.lighter'
                                }}
                            >
                                {job.company?.name?.charAt(0) || <BusinessCenterIcon />}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">
                                    {job.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {job.company?.name}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box display="flex" alignItems="center">
                            <Box display="flex" alignItems="center" mr={3}>
                                <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Deadline: {job.submission_deadline}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                    
                    <Box sx={{ mb: 4 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label, index) => (
                                <Step key={label} completed={activeStep > index}>
                                    <StepLabel error={errorStep === index}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                    
                    <Paper sx={{ p: 4, borderRadius: 2 }}>
                        {activeStep === 0 && (
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Application Form
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Please complete all required fields in the application form below.
                                </Typography>
                                
                                {Object.keys(errors).length > 0 && (
                                    <Alert severity="error" sx={{ mb: 3 }}>
                                        <AlertTitle>Error</AlertTitle>
                                        Please correct the errors in the form to proceed.
                                    </Alert>
                                )}
                                
                                {Array.isArray(formSections) && formSections.map((section) => (
                                    <Card 
                                        key={section.id} 
                                        title={section.name}
                                        subtitle={section.description}
                                        sx={{ mb: 4 }}
                                    >
                                        {Array.isArray(section.fields) && section.fields.map((field) => (
                                            renderField(field)
                                        ))}
                                    </Card>
                                ))}
                            </Box>
                        )}
                        
                        {activeStep === 1 && (
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Resume & Cover Letter
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Upload your resume and provide a cover letter to support your application.
                                </Typography>
                                
                                <Card title="Resume" sx={{ mb: 4 }}>
                                    <FileUpload
                                        onFileSelect={handleFileUpload}
                                        label="Upload Resume (PDF, DOC, DOCX)"
                                        accept=".pdf,.doc,.docx"
                                        error={!!errors.resume}
                                        helperText={errors.resume}
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    {data.resume && (
                                        <Alert 
                                            severity="success" 
                                            icon={<CheckIcon fontSize="inherit" />}
                                            sx={{ mt: 2 }}
                                        >
                                            Resume uploaded: {data.resume.name}
                                        </Alert>
                                    )}
                                </Card>
                                
                                <Card title="Cover Letter (Optional)">
                                    <TextArea
                                        placeholder="Write something about yourself and why you are interested in this position..."
                                        value={data.cover_letter}
                                        onChange={(e) => setData('cover_letter', e.target.value)}
                                        fullWidth
                                        rows={6}
                                        error={!!errors.cover_letter}
                                        helperText={errors.cover_letter}
                                    />
                                </Card>
                            </Box>
                        )}
                        
                        {activeStep === 2 && (
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Review Your Application
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Please review your application details before submitting.
                                </Typography>
                                
                                <Alert severity="info" sx={{ mb: 4 }}>
                                    Once submitted, you won't be able to edit your application.
                                </Alert>
                                
                                <Card title="Application Summary" sx={{ mb: 4 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Resume
                                            </Typography>
                                            {data.resume ? (
                                                <Box display="flex" alignItems="center">
                                                    <DescriptionIcon sx={{ mr: 1, color: 'success.main' }} />
                                                    <Typography variant="body2">
                                                        {data.resume.name}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="error.main">
                                                    No resume uploaded
                                                </Typography>
                                            )}
                                        </Grid>
                                        
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Cover Letter
                                            </Typography>
                                            {data.cover_letter ? (
                                                <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                                    {data.cover_letter.substring(0, 100)}...
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No cover letter provided
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Card>
                                
                                {formSections.length > 0 && (
                                    <Card title="Form Responses">
                                        {Array.isArray(formSections) && formSections.map((section) => (
                                            <Box key={section.id} sx={{ mb: 3 }}>
                                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                    {section.name}
                                                </Typography>
                                                
                                                <Grid container spacing={2}>
                                                    {Array.isArray(section.fields) && section.fields.map((field) => (
                                                        <Grid item xs={12} sm={6} key={field.id}>
                                                            <Typography variant="subtitle2" fontWeight="medium">
                                                                {field.name}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {Array.isArray(data.responses[field.id]) 
                                                                    ? data.responses[field.id].join(', ')
                                                                    : (data.responses[field.id] || 'Not provided')}
                                                            </Typography>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                                
                                                {section !== formSections[formSections.length - 1] && (
                                                    <Divider sx={{ my: 2 }} />
                                                )}
                                            </Box>
                                        ))}
                                    </Card>
                                )}
                            </Box>
                        )}
                        
                        <Box display="flex" justifyContent="space-between" mt={4}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                startIcon={<ArrowBackIcon />}
                                disabled={activeStep === 0}
                            >
                                Back
                            </Button>
                            
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    endIcon={<SendIcon />}
                                    loading={processing}
                                >
                                    Submit Application
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Layout>
    );
};

export default ApplicationCreate; 