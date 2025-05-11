import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Chip,
    Divider,
    Alert,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Switch,
    Card,
    CardContent,
    Tooltip,
    Stack,
    Checkbox,
    useTheme,
    alpha
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    DeleteOutline as DeleteIcon,
    Add as AddIcon,
    Save as SaveIcon,
    Publish as PublishIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    LocationOn as LocationOnIcon,
    AttachMoney as AttachMoneyIcon,
    Description as DescriptionIcon,
    Assignment as AssignmentIcon,
    School as SchoolIcon,
    CheckCircle as CheckCircleIcon,
    DragIndicator as DragIndicatorIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';

import Layout from '@/Components/Layout/Layout';

const JobCreate = ({ companies = [], hiringStages = [], categories = [] }) => {
    const { auth } = usePage().props;
    const theme = useTheme();
    const [skillInput, setSkillInput] = useState('');
    const [selectedHiringStages, setSelectedHiringStages] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        company_id: '',
        description: '',
        requirements: '',
        location: '',
        job_type: 'full_time',
        experience_level: 'entry',
        salary_min: '',
        salary_max: '',
        is_active: true,
        category_id: '',
        submission_deadline: '',
        skills: [],
        hiring_stages: [],
    });

    const formatCurrency = (value) => {
        const cleanedValue = value.replace(/[^\d]/g, '');
        return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleSalaryChange = (e, field) => {
        const formattedValue = formatCurrency(e.target.value);
        setData(field, formattedValue);
    };

    const handleStageToggle = (stageId) => {
        const updatedStages = selectedHiringStages.includes(stageId)
            ? selectedHiringStages.filter(id => id !== stageId)
            : [...selectedHiringStages, stageId];

        setSelectedHiringStages(updatedStages);
        setData('hiring_stages', updatedStages);
    };

    const moveStageUp = (index) => {
        if (index > 0) {
            const newStages = [...selectedHiringStages];
            [newStages[index], newStages[index - 1]] = [newStages[index - 1], newStages[index]];
            setSelectedHiringStages(newStages);
            setData('hiring_stages', newStages);
        }
    };

    const moveStageDown = (index) => {
        if (index < selectedHiringStages.length - 1) {
            const newStages = [...selectedHiringStages];
            [newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]];
            setSelectedHiringStages(newStages);
            setData('hiring_stages', newStages);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert formatted salary to numeric values before submitting
        const processedData = {
            ...data,
            salary_min: data.salary_min ? parseInt(data.salary_min.replace(/[^\d]/g, '')) : '',
            salary_max: data.salary_max ? parseInt(data.salary_max.replace(/[^\d]/g, '')) : '',
        };

        post(route('admin.jobs.store'), {
            data: processedData,
        });
    };

    const handleAddSkill = () => {
        if (skillInput.trim() !== '' && !data.skills.includes(skillInput.trim())) {
            setData('skills', [...data.skills, skillInput.trim()]);
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setData('skills', data.skills.filter(skill => skill !== skillToRemove));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const jobTypes = [
        { value: 'full_time', label: 'Full Time' },
        { value: 'part_time', label: 'Part Time' },
        { value: 'contract', label: 'Kontrak' },
        { value: 'internship', label: 'Magang' },
        { value: 'freelance', label: 'Freelance' },
    ];

    const experienceLevels = [
        { value: 'entry', label: 'Entry Level (0-2 tahun)' },
        { value: 'mid', label: 'Mid Level (2-5 tahun)' },
        { value: 'senior', label: 'Senior Level (5+ tahun)' },
        { value: 'executive', label: 'Executive (10+ tahun)' },
    ];

    return (
        <Layout>
            <Head title="Buat Lowongan Pekerjaan Baru" />

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header Section */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(20, 184, 166, 0.15) 100%)',
                        py: 4,
                        borderRadius: '1rem',
                        px: 3,
                        mb: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            component={Link}
                            href={route('admin.jobs.index')}
                            sx={{
                                bgcolor: 'background.paper',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h5" component="h1" fontWeight="600" gutterBottom>
                                Buat Lowongan Pekerjaan Baru
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Isi formulir untuk membuat lowongan pekerjaan baru di sistem
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        icon={<WorkIcon fontSize="small" />}
                        label="Admin Panel"
                        color="primary"
                        sx={{ borderRadius: '0.75rem', fontWeight: 600 }}
                    />
                </Box>

                {Object.keys(errors).length > 0 && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: '0.75rem',
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                        }}
                    >
                        Terdapat kesalahan pada formulir. Silakan periksa kembali.
                    </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
                    {/* Main Form Section */}
                    <Box sx={{ flex: { xs: 1, lg: '0 0 66.666667%' } }}>
                        <Stack spacing={3}>
                            {/* Basic Information Card */}
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <WorkIcon color="primary" /> Informasi Dasar
                                    </Typography>

                                    <Stack spacing={3}>
                                        <TextField
                                            label="Judul Pekerjaan"
                                            fullWidth
                                            required
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            error={!!errors.title}
                                            helperText={errors.title}
                                            placeholder="Contoh: Senior Web Developer"
                                            sx={{
                                                '& .MuiOutlinedInput-root': { borderRadius: '0.75rem' }
                                            }}
                                        />

                                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <FormControl fullWidth required error={!!errors.company_id}>
                                                <InputLabel>Perusahaan</InputLabel>
                                                <Select
                                                    value={data.company_id}
                                                    onChange={e => setData('company_id', e.target.value)}
                                                    label="Perusahaan"
                                                    sx={{ borderRadius: '0.75rem' }}
                                                >
                                                    {companies.map(company => (
                                                        <MenuItem key={company.id} value={company.id}>
                                                            {company.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.company_id && <FormHelperText>{errors.company_id}</FormHelperText>}
                                            </FormControl>

                                            <FormControl fullWidth error={!!errors.category_id}>
                                                <InputLabel>Kategori</InputLabel>
                                                <Select
                                                    value={data.category_id}
                                                    onChange={e => setData('category_id', e.target.value)}
                                                    label="Kategori"
                                                    sx={{ borderRadius: '0.75rem' }}
                                                >
                                                    {categories.map(category => (
                                                        <MenuItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.category_id && <FormHelperText>{errors.category_id}</FormHelperText>}
                                            </FormControl>
                                        </Box>

                                        <TextField
                                            label="Lokasi"
                                            fullWidth
                                            required
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                            error={!!errors.location}
                                            helperText={errors.location}
                                            placeholder="Contoh: Jakarta, Remote, Hybrid"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocationOnIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': { borderRadius: '0.75rem' }
                                            }}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Job Details Card */}
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AssignmentIcon color="primary" /> Detail Pekerjaan
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                        <Box sx={{ flex: { xs: '1', sm: '0 0 calc(50% - 12px)' } }}>
                                            <FormControl fullWidth required error={!!errors.job_type}>
                                                <InputLabel>Tipe Pekerjaan</InputLabel>
                                                <Select
                                                    value={data.job_type}
                                                    onChange={e => setData('job_type', e.target.value)}
                                                    label="Tipe Pekerjaan"
                                                    sx={{ borderRadius: '0.75rem' }}
                                                >
                                                    {jobTypes.map(type => (
                                                        <MenuItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.job_type && <FormHelperText>{errors.job_type}</FormHelperText>}
                                            </FormControl>
                                        </Box>

                                        <Box sx={{ flex: { xs: '1', sm: '0 0 calc(50% - 12px)' } }}>
                                            <FormControl fullWidth required error={!!errors.experience_level}>
                                                <InputLabel>Level Pengalaman</InputLabel>
                                                <Select
                                                    value={data.experience_level}
                                                    onChange={e => setData('experience_level', e.target.value)}
                                                    label="Level Pengalaman"
                                                    sx={{ borderRadius: '0.75rem' }}
                                                >
                                                    {experienceLevels.map(level => (
                                                        <MenuItem key={level.value} value={level.value}>
                                                            {level.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.experience_level && <FormHelperText>{errors.experience_level}</FormHelperText>}
                                            </FormControl>
                                        </Box>

                                        <Box sx={{ width: '100%', mt: 3 }}>
                                            <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                                                Rentang Gaji
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                                <TextField
                                                    label="Gaji Minimum"
                                                    fullWidth
                                                    value={data.salary_min}
                                                    onChange={e => handleSalaryChange(e, 'salary_min')}
                                                    error={!!errors.salary_min}
                                                    helperText={errors.salary_min}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': { borderRadius: '0.75rem' }
                                                    }}
                                                />
                                                <TextField
                                                    label="Gaji Maksimum"
                                                    fullWidth
                                                    value={data.salary_max}
                                                    onChange={e => handleSalaryChange(e, 'salary_max')}
                                                    error={!!errors.salary_max}
                                                    helperText={errors.salary_max}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': { borderRadius: '0.75rem' }
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        <Box sx={{ width: '100%', mt: 3 }}>
                                            <TextField
                                                label="Batas Waktu Pendaftaran"
                                                fullWidth
                                                type="date"
                                                value={data.submission_deadline}
                                                onChange={e => setData('submission_deadline', e.target.value)}
                                                error={!!errors.submission_deadline}
                                                helperText={errors.submission_deadline}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': { borderRadius: '0.75rem' }
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ width: '100%', mt: 3 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={data.is_active}
                                                        onChange={e => setData('is_active', e.target.checked)}
                                                        color="primary"
                                                    />
                                                }
                                                label="Aktifkan lowongan secara otomatis"
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Skills Section */}
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SchoolIcon color="primary" /> Skills & Kemampuan
                                    </Typography>

                                    <Stack spacing={3}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField
                                                label="Tambahkan Skill"
                                                value={skillInput}
                                                onChange={e => setSkillInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                sx={{ flexGrow: 1 }}
                                                placeholder="Contoh: JavaScript, React, UI/UX"
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={handleAddSkill}
                                                startIcon={<AddIcon />}
                                                sx={{ borderRadius: '0.75rem' }}
                                            >
                                                Tambah
                                            </Button>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {data.skills.length > 0 ? (
                                                data.skills.map((skill, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={skill}
                                                        onDelete={() => handleRemoveSkill(skill)}
                                                        deleteIcon={<DeleteIcon />}
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{ borderRadius: '0.75rem' }}
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                    Belum ada skill yang ditambahkan
                                                </Typography>
                                            )}
                                        </Box>
                                        {errors.skills && <FormHelperText error>{errors.skills}</FormHelperText>}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Description Section */}
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DescriptionIcon color="primary" /> Deskripsi Pekerjaan
                                    </Typography>

                                    <Box data-color-mode="light" sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: '0.75rem',
                                        overflow: 'hidden'
                                    }}>
                                        <MDEditor
                                            value={data.description}
                                            onChange={value => setData('description', value)}
                                            height={300}
                                            preview="edit"
                                        />
                                    </Box>
                                    {errors.description && (
                                        <FormHelperText error sx={{ mt: 1 }}>{errors.description}</FormHelperText>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Requirements Section */}
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AssignmentIcon color="primary" /> Persyaratan
                                    </Typography>

                                    <Box data-color-mode="light" sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: '0.75rem',
                                        overflow: 'hidden'
                                    }}>
                                        <MDEditor
                                            value={data.requirements}
                                            onChange={value => setData('requirements', value)}
                                            height={300}
                                            preview="edit"
                                        />
                                    </Box>
                                    {errors.requirements && (
                                        <FormHelperText error sx={{ mt: 1 }}>{errors.requirements}</FormHelperText>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Box>

                    {/* Sidebar Section */}
                    <Box sx={{ flex: { xs: 1, lg: '0 0 33.333333%' } }}>
                        <Stack spacing={3} sx={{ position: 'sticky', top: 100 }}>
                            {/* Action Buttons Card */}
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                                        Tindakan
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            startIcon={<PublishIcon />}
                                            sx={{ borderRadius: '0.75rem', py: 1.2 }}
                                        >
                                            {processing ? 'Menyimpan...' : (data.is_active ? 'Publikasikan' : 'Simpan')}
                                        </Button>

                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            component={Link}
                                            href={route('admin.jobs.index')}
                                            sx={{ borderRadius: '0.75rem', py: 1.2 }}
                                        >
                                            Batal
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Hiring Stages Card */}
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                                        Tahapan Perekrutan
                                    </Typography>

                                    {hiringStages.length > 0 ? (
                                        <Stack spacing={1}>
                                            {hiringStages.map((stage, index) => (
                                                <Paper
                                                    key={stage.id}
                                                    variant="outlined"
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: '0.75rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        cursor: 'pointer',
                                                        bgcolor: selectedHiringStages.includes(stage.id) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                                        border: selectedHiringStages.includes(stage.id) ? `1px solid ${theme.palette.primary.main}` : '1px solid',
                                                        borderColor: selectedHiringStages.includes(stage.id) ? 'primary.main' : 'divider',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                                        }
                                                    }}
                                                    onClick={() => handleStageToggle(stage.id)}
                                                >
                                                    <Checkbox
                                                        checked={selectedHiringStages.includes(stage.id)}
                                                        color="primary"
                                                        size="small"
                                                        sx={{ p: 0.5 }}
                                                    />
                                                    <Typography variant="body2" sx={{ flex: 1 }}>
                                                        {stage.name}
                                                    </Typography>
                                                    {selectedHiringStages.includes(stage.id) && (
                                                        <Box>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const index = selectedHiringStages.indexOf(stage.id);
                                                                    moveStageUp(index);
                                                                }}
                                                                disabled={selectedHiringStages.indexOf(stage.id) === 0}
                                                            >
                                                                <ArrowUpwardIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const index = selectedHiringStages.indexOf(stage.id);
                                                                    moveStageDown(index);
                                                                }}
                                                                disabled={selectedHiringStages.indexOf(stage.id) === selectedHiringStages.length - 1}
                                                            >
                                                                <ArrowDownwardIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                </Paper>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Belum ada tahapan perekrutan
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Tips Card */}
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: '1rem',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                                    bgcolor: alpha(theme.palette.primary.main, 0.02)
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                                        Tips
                                    </Typography>

                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <CheckCircleIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Gunakan deskripsi yang jelas dan menarik
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <CheckCircleIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Tambahkan skill yang spesifik dan relevan
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <CheckCircleIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Tentukan deadline yang realistis
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
};

export default JobCreate;
