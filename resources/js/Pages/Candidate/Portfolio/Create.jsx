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
    IconButton,
    Chip,
    Autocomplete
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    CloudUpload as CloudUploadIcon,
    DeleteOutline as DeleteOutlineIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

export default function Create({ auth, types, mediaTypes }) {
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const { data, setData, post, errors, processing, reset } = useForm({
        title: '',
        description: '',
        project_url: '',
        repository_url: '',
        thumbnail: null,
        start_date: null,
        end_date: null,
        type: 'project',
        is_featured: false,
        role: '',
        organization: '',
        skills: [],
        achievements: [],
        media_type: 'image',
        media_url: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('candidate.portfolio.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setThumbnailPreview(null);
                toast.success("Portfolio item created successfully!");
            },
            onError: (errors) => {
                toast.error("There were problems with your submission.");
                console.error(errors);
            }
        });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should not exceed 2MB");
            return;
        }

        setData('thumbnail', file);

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

    const getSkillSuggestions = () => {
        return [
            'JavaScript', 'React', 'Vue.js', 'Angular', 'Node.js',
            'PHP', 'Laravel', 'Python', 'Django', 'Flask',
            'Java', 'Spring Boot', 'C#', '.NET', 'Ruby',
            'HTML', 'CSS', 'SASS', 'Tailwind CSS', 'Bootstrap',
            'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
            'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
            'Git', 'CI/CD', 'Agile', 'Scrum', 'DevOps',
            'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
            'Mobile Development', 'React Native', 'Flutter', 'iOS', 'Android',
            'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
            'Blockchain', 'Ethereum', 'Smart Contracts', 'Web3', 'NFTs',
            'Game Development', 'Unity', 'Unreal Engine', '3D Modeling', 'Animation',
            'Project Management', 'Leadership', 'Communication', 'Problem Solving'
        ];
    };

    return (
        <CandidateLayout user={auth.user}>
            <Head title="Create Portfolio Item" />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" alignItems="center" mb={4}>
                    <Button
                        component={Link}
                        href={route('candidate.portfolio.index')}
                        startIcon={<ArrowBackIcon />}
                        sx={{ mr: 2 }}
                    >
                        Back to Portfolio
                    </Button>
                    <Typography variant="h4" component="h1">
                        Create Portfolio Item
                    </Typography>
                </Box>

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
                        Portfolio Item Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Add information about your work, project, education, certification, or other achievement to showcase to potential employers.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '8fr 4fr' }, gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Title"
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

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Role"
                                    name="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    error={!!errors.role}
                                    helperText={errors.role || "Your position or role in this item"}
                                    placeholder="Developer, Manager, Student, etc."
                                />

                                <TextField
                                    fullWidth
                                    label="Organization"
                                    name="organization"
                                    value={data.organization}
                                    onChange={(e) => setData('organization', e.target.value)}
                                    error={!!errors.organization}
                                    helperText={errors.organization || "Company, school, or group associated"}
                                    placeholder="Tech Co, State University, etc."
                                />
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

                            <Box>
                                <Autocomplete
                                    multiple
                                    id="skills"
                                    options={getSkillSuggestions()}
                                    freeSolo
                                    value={data.skills}
                                    onChange={(_, newValue) => setData('skills', newValue)}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                size="small"
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Skills"
                                            placeholder="Add skills"
                                            helperText="Enter skills related to this item (press Enter after each one)"
                                            error={!!errors.skills}
                                        />
                                    )}
                                />
                            </Box>

                            <Box>
                                <Autocomplete
                                    multiple
                                    id="achievements"
                                    options={[]}
                                    freeSolo
                                    value={data.achievements}
                                    onChange={(_, newValue) => setData('achievements', newValue)}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                size="small"
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Achievements"
                                            placeholder="Add achievements"
                                            helperText="Enter notable achievements related to this item"
                                            error={!!errors.achievements}
                                        />
                                    )}
                                />
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                <FormControl fullWidth error={!!errors.media_type}>
                                    <InputLabel id="media-type-label">Media Type</InputLabel>
                                    <Select
                                        labelId="media-type-label"
                                        id="media_type"
                                        value={data.media_type}
                                        label="Media Type"
                                        onChange={(e) => setData('media_type', e.target.value)}
                                    >
                                        {Object.entries(mediaTypes).map(([value, label]) => (
                                            <MenuItem key={value} value={value}>{label}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>
                                        {errors.media_type || "What type of media represents this item?"}
                                    </FormHelperText>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Media URL"
                                    name="media_url"
                                    value={data.media_url}
                                    onChange={(e) => setData('media_url', e.target.value)}
                                    error={!!errors.media_url}
                                    helperText={errors.media_url || "Link to related media (video, document, etc.)"}
                                    placeholder="https://example.com/media"
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
                                                helperText={errors.start_date || "When did you start?"}
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
                                    Thumbnail Image
                                </Typography>

                                {thumbnailPreview ? (
                                    <Box position="relative" sx={{ width: 200, height: 150, mb: 2 }}>
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                image={thumbnailPreview}
                                                alt="Thumbnail preview"
                                                sx={{ width: 200, height: 150, objectFit: 'cover' }}
                                            />
                                        </Card>
                                        <IconButton
                                            size="small"
                                            onClick={removeThumbnail}
                                            sx={{
                                                position: 'absolute',
                                                top: 5,
                                                right: 5,
                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                }
                                            }}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
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
                                            hidden
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                        />
                                    </Button>
                                )}

                                {errors.thumbnail && (
                                    <Typography color="error" variant="caption">
                                        {errors.thumbnail}
                                    </Typography>
                                )}

                                <Typography variant="caption" color="text.secondary" display="block">
                                    Recommended size: 800x600px. Maximum size: 2MB.
                                </Typography>
                            </Box>

                            <Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Feature this item at the top of your portfolio"
                                />
                            </Box>
                        </Box>

                        <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="button"
                                variant="outlined"
                                sx={{ mr: 2 }}
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
                                Save Portfolio Item
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </CandidateLayout>
    );
}
