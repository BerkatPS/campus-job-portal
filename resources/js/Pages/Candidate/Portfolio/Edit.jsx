import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CandidateLayout from '@/Components/Layout/Layout.jsx';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    TextField,
    Typography,
    Divider,
    Card,
    CardMedia,
    IconButton
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    CloudUpload as CloudUploadIcon,
    DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

export default function Edit({ auth, portfolioItem, types }) {
    const [thumbnailPreview, setThumbnailPreview] = useState(portfolioItem.thumbnail || null);

    const { data, setData, put, errors, processing } = useForm({
        title: portfolioItem.title || '',
        description: portfolioItem.description || '',
        project_url: portfolioItem.project_url || '',
        repository_url: portfolioItem.repository_url || '',
        thumbnail: null, // Don't pre-load the file object, just the preview URL
        start_date: portfolioItem.start_date ? new Date(portfolioItem.start_date) : null,
        end_date: portfolioItem.end_date ? new Date(portfolioItem.end_date) : null,
        type: portfolioItem.type || 'project',
        is_featured: portfolioItem.is_featured || false
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('candidate.portfolio.update', portfolioItem.id), {
            onSuccess: () => {
                toast.success('Portfolio item updated successfully');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to update portfolio item');
            }
        });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid image file (JPG, PNG, or GIF)');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        setData('thumbnail', file);

        // Create thumbnail preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setThumbnailPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const removeThumbnail = () => {
        setData('thumbnail', null);
        setThumbnailPreview(null);
    };

    return (
        <CandidateLayout
            user={auth.user}
            header={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" component="h1" fontWeight={600}>
                        Edit Portfolio Item
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        component={Link}
                        href={route('candidate.portfolio.index')}
                    >
                        Back to Portfolio
                    </Button>
                </Box>
            }
        >
            <Head title="Edit Portfolio Item" />

            <Container maxWidth="lg">
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mt: 3,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                        Edit Project Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Update information about your project, open source contribution, or work experience.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '8fr 4fr' }, gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Project Title"
                                    name="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    required
                                />

                                <FormControl fullWidth error={!!errors.type}>
                                    <InputLabel id="type-label">Type</InputLabel>
                                    <Select
                                        labelId="type-label"
                                        id="type"
                                        value={data.type}
                                        label="Type"
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        {Object.entries(types).map(([value, label]) => (
                                            <MenuItem key={value} value={value}>{label}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                                </FormControl>
                            </Box>

                            <Box>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    error={!!errors.description}
                                    helperText={errors.description}
                                    multiline
                                    rows={4}
                                />
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Project URL"
                                    name="project_url"
                                    value={data.project_url}
                                    onChange={(e) => setData('project_url', e.target.value)}
                                    error={!!errors.project_url}
                                    helperText={errors.project_url || "Live demo or published URL"}
                                    placeholder="https://example.com"
                                />

                                <TextField
                                    fullWidth
                                    label="Repository URL"
                                    name="repository_url"
                                    value={data.repository_url}
                                    onChange={(e) => setData('repository_url', e.target.value)}
                                    error={!!errors.repository_url}
                                    helperText={errors.repository_url || "GitHub, GitLab, etc."}
                                    placeholder="https://github.com/username/repo"
                                />
                            </Box>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                    <DatePicker
                                        label="Start Date"
                                        value={data.start_date}
                                        onChange={(date) => setData('start_date', date)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!errors.start_date}
                                                helperText={errors.start_date || "When did you start this project?"}
                                            />
                                        )}
                                    />

                                    <DatePicker
                                        label="End Date"
                                        value={data.end_date}
                                        onChange={(date) => setData('end_date', date)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!errors.end_date}
                                                helperText={errors.end_date || "Leave empty if ongoing"}
                                            />
                                        )}
                                    />
                                </Box>
                            </LocalizationProvider>

                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Project Thumbnail
                                </Typography>

                                {thumbnailPreview ? (
                                    <Box sx={{ mb: 2 }}>
                                        <Card sx={{ maxWidth: 300, position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={thumbnailPreview}
                                                alt="Thumbnail preview"
                                                onError={(e) => {
                                                    console.error('Image load error');
                                                    e.target.src = '/default-project.jpg';
                                                }}
                                            />
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                    }
                                                }}
                                                onClick={removeThumbnail}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Card>
                                    </Box>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        Upload Thumbnail
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleThumbnailChange}
                                        />
                                    </Button>
                                )}

                                {errors.thumbnail && (
                                    <FormHelperText error>{errors.thumbnail}</FormHelperText>
                                )}

                                <Typography variant="body2" color="text.secondary">
                                    Recommended: 1200×630 pixels, max 2MB (JPG, PNG, GIF)
                                </Typography>
                            </Box>

                            <Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            name="is_featured"
                                            color="primary"
                                        />
                                    }
                                    label="Feature this project in your portfolio"
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Featured projects will appear at the top of your portfolio
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                component={Link}
                                href={route('candidate.portfolio.index')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={processing}
                            >
                                Update Project
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </CandidateLayout>
    );
}
