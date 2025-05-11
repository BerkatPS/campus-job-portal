import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    FormHelperText,
    Paper,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import { Send, Save, Check } from '@mui/icons-material';
import FileUpload from '@/Components/Shared/FileUpload';

const ApplicationForm = ({ job, formSections, candidateProfile }) => {
    // Initialize form
    const { data, setData, post, processing, errors, progress } = useForm({
        job_id: job?.id || '',
        cover_letter: '',
        resume: null,
        resume_path: null,
        // Other fields can be added here based on your database schema
    });

    // State for tracking file upload
    const [uploadStatus, setUploadStatus] = useState({
        resume: false,
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    // Handle file change
    const handleFileChange = (file) => {
        // This handles the FileUpload component's onChange properly
        if (file instanceof File) {
            setData('resume', file);
        } else {
            setData('resume', null);
        }
    };

    // Handle file upload complete
    const handleUploadComplete = (response) => {
        // Update upload status
        setUploadStatus(prev => ({
            ...prev,
            resume: true
        }));

        // If resume uploaded to server, store the path
        if (response?.filePath) {
            setData('resume_path', response.filePath);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Submit application using Inertia
        post(route('candidate.jobs.apply', job.id), {
            onSuccess: () => {
                // Handle success
                console.log('Application submitted successfully');
            },
            forceFormData: true
        });
    };

    return (
        <Card sx={{ borderRadius: 2, mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Apply for: {job?.title}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Resume Upload Section */}
                        <Grid item xs={12}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Resume
                                </Typography>

                                <FileUpload
                                    name="resume"
                                    label="Upload your resume"
                                    accept=".pdf,.doc,.docx"
                                    maxSize={5}
                                    variant="outlined"
                                    borderRadius="medium"
                                    uploadType="jobApplication"
                                    entity={{ user_id: candidateProfile?.user_id, job_id: job?.id }}
                                    helperText="Supported formats: PDF, DOC, DOCX (Max: 5MB)"
                                    error={errors.resume}
                                    onChange={handleFileChange}
                                    onUploadComplete={handleUploadComplete}
                                    value={data.resume}
                                    required
                                    showUploadButton={true}
                                    autoUpload={false}
                                />

                                {uploadStatus.resume && (
                                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                        <Check sx={{ mr: 1 }} />
                                        <Typography variant="body2">
                                            Resume uploaded successfully!
                                        </Typography>
                                    </Box>
                                )}

                                {progress && (
                                    <Box sx={{ width: '100%', mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Uploading: {progress}%
                                        </Typography>
                                        <Box
                                            sx={{
                                                height: 4,
                                                width: '100%',
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                mt: 1,
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    height: '100%',
                                                    bgcolor: 'primary.main',
                                                    width: `${progress}%`,
                                                    transition: 'width 0.2s ease'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Cover Letter Section */}
                        <Grid item xs={12}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Cover Letter
                                </Typography>

                                <TextField
                                    name="cover_letter"
                                    label="Cover Letter"
                                    multiline
                                    rows={6}
                                    fullWidth
                                    value={data.cover_letter}
                                    onChange={handleChange}
                                    error={!!errors.cover_letter}
                                    helperText={errors.cover_letter || "Tell us why you're a good fit for this position"}
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />
                            </Paper>
                        </Grid>

                        {/* Additional Form Fields from formSections */}
                        {formSections && formSections.map((section, sectionIndex) => (
                            <Grid item xs={12} key={`section-${sectionIndex}`}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        mb: 3,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        {section.title}
                                    </Typography>

                                    {section.description && (
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {section.description}
                                        </Typography>
                                    )}

                                    <Grid container spacing={2}>
                                        {section.fields && section.fields.map((field, fieldIndex) => (
                                            <Grid item xs={12} sm={field.width || 12} key={`field-${fieldIndex}`}>
                                                {field.type === 'text' && (
                                                    <TextField
                                                        name={field.name}
                                                        label={field.label}
                                                        fullWidth
                                                        value={data[field.name] || ''}
                                                        onChange={handleChange}
                                                        error={!!errors[field.name]}
                                                        helperText={errors[field.name] || field.helperText}
                                                        required={field.required}
                                                        variant="outlined"
                                                    />
                                                )}

                                                {field.type === 'textarea' && (
                                                    <TextField
                                                        name={field.name}
                                                        label={field.label}
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        value={data[field.name] || ''}
                                                        onChange={handleChange}
                                                        error={!!errors[field.name]}
                                                        helperText={errors[field.name] || field.helperText}
                                                        required={field.required}
                                                        variant="outlined"
                                                    />
                                                )}

                                                {field.type === 'select' && (
                                                    <FormControl fullWidth error={!!errors[field.name]}>
                                                        <InputLabel id={`label-${field.name}`}>{field.label}</InputLabel>
                                                        <MuiSelect
                                                            labelId={`label-${field.name}`}
                                                            name={field.name}
                                                            value={data[field.name] || ''}
                                                            onChange={handleChange}
                                                            label={field.label}
                                                            required={field.required}
                                                        >
                                                            {field.options && field.options.map((option, optionIndex) => (
                                                                <MenuItem key={`option-${optionIndex}`} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </MuiSelect>
                                                        {(errors[field.name] || field.helperText) && (
                                                            <FormHelperText>{errors[field.name] || field.helperText}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            </Grid>
                        ))}

                        {/* Submit Button */}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={processing}
                                endIcon={<Send />}
                                sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                            >
                                {processing ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default ApplicationForm;
