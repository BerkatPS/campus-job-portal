import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Box,
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
    Card as MuiCard,
    CardContent,
    alpha,
    Stack,
    useTheme,
    Tooltip
} from '@mui/material';
import {
    DeleteOutline as DeleteIcon,
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Publish as PublishIcon,
    Work as WorkIcon,
    LocationOn as LocationOnIcon,
    Category as CategoryIcon,
    CalendarMonth as CalendarMonthIcon,
    Timer as TimerIcon,
    WorkOutline as WorkOutlineIcon,
    AttachMoney as AttachMoneyIcon,
    Star as StarIcon,
    Badge as BadgeIcon,
    EventAvailable as EventAvailableIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    CheckCircle as CheckCircleIcon,
    WavingHand as WavingHandIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';

import Layout from '@/Components/Layout/Layout';
import NumberFormatInput from '@/Utils/NumberFormatInput';
import { parseFormattedNumber } from '@/Utils/CurrencyFormatter';

export default function Create({ companies, hiringStages, categories, skills }) {
    const [skillInput, setSkillInput] = useState('');
    const theme = useTheme();

    // Update the default form values to match controller expectations
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        company_id: '',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        location: '',
        job_type: 'full_time',
        experience_level: 'entry',
        salary_min: '',
        salary_max: '',
        is_salary_visible: false,
        vacancies: '1',
        submission_deadline: '',
        deadline: '',
        is_active: false, // Default to false (draft)
        status: 'draft', // Explicitly set status to draft
        hiring_stages: [],
        skills: [],
        category_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi data yang diperlukan sebelum mengirimkan
        if (!data.company_id || !data.title || !data.location || !data.submission_deadline) {
            alert('Beberapa data wajib belum diisi!');
            return;
        }

        // Ensure is_active and status are in sync
        const formData = {
            ...data,
            salary_min: data.salary_min ? parseFormattedNumber(data.salary_min) : '',
            salary_max: data.salary_max ? parseFormattedNumber(data.salary_max) : '',
            is_active: data.status === 'active', // Ensure is_active matches status
        };

        // Mengirim POST request ke route create
        post(route('manager.jobs.store'), formData);
    };

    // Function to submit as active job
    const submitAsActive = () => {
        setData('is_active', true);
        setData('status', 'active');
        setTimeout(() => handleSubmit({ preventDefault: () => {} }), 10);
    };

    // Function to submit as draft
    const submitAsDraft = () => {
        setData('is_active', false);
        setData('status', 'draft');
        setTimeout(() => handleSubmit({ preventDefault: () => {} }), 10);
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

    // Helper to handle predefined skill selection
    const handleAddPredefinedSkill = (skill) => {
        if (!data.skills.includes(skill)) {
            setData('skills', [...data.skills, skill]);
        }
    };

    // Handle hiring stages selection
    const handleHiringStagesChange = (event) => {
        const value = event.target.value;
        setData('hiring_stages', typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <Layout>
            <Head title="Buat Lowongan Pekerjaan" />

            {/* Header Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(20, 184, 166, 0.15) 100%)',
                    py: 4,
                    borderRadius: '1rem',
                    px: 3,
                    mb: 4,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Link href={route('manager.jobs.index')}>
                            <IconButton
                                sx={{
                                    mr: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
                                }}
                            >
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                        </Link>
                        <Box>
                            <Typography variant="h5" fontWeight="600" gutterBottom>
                                Buat Lowongan Pekerjaan
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tambahkan lowongan pekerjaan baru untuk perusahaan yang Anda kelola
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {Object.keys(errors).length > 0 && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    Terdapat kesalahan pada formulir. Silakan periksa kembali.
                </Alert>
            )}

            {/* Main Content Layout */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Left Column - Form Fields */}
                <Box sx={{ flex: '1 1 auto', width: { xs: '100%', md: '66.67%' } }}>
                    {/* Informasi Utama */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: '1rem',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <WorkOutlineIcon color="primary" sx={{ mr: 1.5 }} />
                            <Typography variant="h6" fontWeight="600">
                                Informasi Utama
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Company Selection */}
                                <FormControl
                                    fullWidth
                                    required
                                    error={!!errors.company_id}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.75rem',
                                        }
                                    }}
                                >
                                    <InputLabel id="company-label">Perusahaan</InputLabel>
                                    <Select
                                        labelId="company-label"
                                        value={data.company_id}
                                        onChange={e => setData('company_id', e.target.value)}
                                        label="Perusahaan"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <WorkIcon color="action" />
                                            </InputAdornment>
                                        }
                                    >
                                        {Array.isArray(companies) && companies.map(company => (
                                            <MenuItem key={company.id} value={company.id}>
                                                {company.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.company_id && <FormHelperText>{errors.company_id}</FormHelperText>}
                                </FormControl>

                                {/* Judul Pekerjaan */}
                                <TextField
                                    label="Judul Pekerjaan"
                                    fullWidth
                                    required
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    placeholder="Contoh: Front-end Developer, UI/UX Designer"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <WorkIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.75rem',
                                        }
                                    }}
                                />

                                {/* Kategori & Lokasi Row */}
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                                    <FormControl
                                        fullWidth
                                        required
                                        error={!!errors.category_id}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    >
                                        <InputLabel id="category-label">Kategori</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            value={data.category_id}
                                            onChange={e => setData('category_id', e.target.value)}
                                            label="Kategori"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <CategoryIcon color="action" />
                                                </InputAdornment>
                                            }
                                        >
                                            {Array.isArray(categories) && categories.map(category => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.category_id && <FormHelperText>{errors.category_id}</FormHelperText>}
                                    </FormControl>

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
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Tipe & Level Row */}
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                                    <FormControl
                                        fullWidth
                                        required
                                        error={!!errors.job_type}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    >
                                        <InputLabel id="type-label">Tipe Pekerjaan</InputLabel>
                                        <Select
                                            labelId="type-label"
                                            value={data.job_type}
                                            onChange={e => setData('job_type', e.target.value)}
                                            label="Tipe Pekerjaan"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <TimerIcon color="action" />
                                                </InputAdornment>
                                            }
                                        >
                                            <MenuItem value="full_time">Full Time</MenuItem>
                                            <MenuItem value="part_time">Part Time</MenuItem>
                                            <MenuItem value="contract">Kontrak</MenuItem>
                                            <MenuItem value="internship">Magang</MenuItem>
                                            <MenuItem value="freelance">Freelance</MenuItem>
                                        </Select>
                                        {errors.job_type && <FormHelperText>{errors.job_type}</FormHelperText>}
                                    </FormControl>

                                    <FormControl
                                        fullWidth
                                        required
                                        error={!!errors.experience_level}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    >
                                        <InputLabel id="experience-label">Level Pengalaman</InputLabel>
                                        <Select
                                            labelId="experience-label"
                                            value={data.experience_level}
                                            onChange={e => setData('experience_level', e.target.value)}
                                            label="Level Pengalaman"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <BadgeIcon color="action" />
                                                </InputAdornment>
                                            }
                                        >
                                            <MenuItem value="entry">Entry Level (0-2 tahun)</MenuItem>
                                            <MenuItem value="mid">Mid Level (2-5 tahun)</MenuItem>
                                            <MenuItem value="senior">Senior Level (5+ tahun)</MenuItem>
                                            <MenuItem value="executive">Executive (10+ tahun)</MenuItem>
                                        </Select>
                                        {errors.experience_level && <FormHelperText>{errors.experience_level}</FormHelperText>}
                                    </FormControl>
                                </Box>

                                {/* Gaji Row */}
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                                    <NumberFormatInput
                                        label="Gaji Minimum"
                                        fullWidth
                                        value={data.salary_min}
                                        onChange={(e) => setData('salary_min', e.target.rawValue)}
                                        error={!!errors.salary_min}
                                        helperText={errors.salary_min}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <AttachMoneyIcon color="action" />
                                            </InputAdornment>
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    />

                                    <NumberFormatInput
                                        label="Gaji Maksimum"
                                        fullWidth
                                        value={data.salary_max}
                                        onChange={(e) => setData('salary_max', e.target.rawValue)}
                                        error={!!errors.salary_max}
                                        helperText={errors.salary_max}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <AttachMoneyIcon color="action" />
                                            </InputAdornment>
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Deadline & Vacancy Row */}
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                                    <TextField
                                        label="Batas Waktu Pendaftaran"
                                        fullWidth
                                        type="date"
                                        required
                                        value={data.submission_deadline}
                                        onChange={e => setData('submission_deadline', e.target.value)}
                                        error={!!errors.submission_deadline}
                                        helperText={errors.submission_deadline}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EventAvailableIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    />

                                    <TextField
                                        label="Deadline Lamaran"
                                        fullWidth
                                        type="date"
                                        value={data.deadline}
                                        onChange={e => setData('deadline', e.target.value)}
                                        error={!!errors.deadline}
                                        helperText={errors.deadline || "Opsional"}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                                    <TextField
                                        label="Jumlah Lowongan"
                                        fullWidth
                                        type="number"
                                        value={data.vacancies}
                                        onChange={e => setData('vacancies', e.target.value)}
                                        error={!!errors.vacancies}
                                        helperText={errors.vacancies}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BadgeIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        inputProps={{ min: 1 }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    />

                                    <FormControl
                                        fullWidth
                                        required
                                        error={!!errors.status}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.75rem',
                                            }
                                        }}
                                    >
                                        <InputLabel id="status-label">Status</InputLabel>
                                        <Select
                                            labelId="status-label"
                                            value={data.status}
                                            onChange={e => {
                                                setData('status', e.target.value);
                                                // Sync the is_active flag based on status
                                                setData('is_active', e.target.value === 'active');
                                            }}
                                            label="Status"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <InfoIcon color="action" />
                                                </InputAdornment>
                                            }
                                        >
                                            <MenuItem value="draft">Draft</MenuItem>
                                            <MenuItem value="active">Aktif</MenuItem>
                                            <MenuItem value="closed">Ditutup</MenuItem>
                                        </Select>
                                        {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                                    </FormControl>
                                </Box>

                                {/* Hiring Stages Selection */}
                                <FormControl
                                    fullWidth
                                    error={!!errors.hiring_stages}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.75rem',
                                        }
                                    }}
                                >
                                    <InputLabel id="hiring-stages-label">Tahapan Perekrutan</InputLabel>
                                    <Select
                                        labelId="hiring-stages-label"
                                        multiple
                                        value={data.hiring_stages}
                                        onChange={handleHiringStagesChange}
                                        label="Tahapan Perekrutan"
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const stage = hiringStages.find(s => s.id === value);
                                                    return (
                                                        <Chip key={value} label={stage?.name || value} size="small" />
                                                    );
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {Array.isArray(hiringStages) && hiringStages.map(stage => (
                                            <MenuItem key={stage.id} value={stage.id}>
                                                {stage.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.hiring_stages && <FormHelperText>{errors.hiring_stages}</FormHelperText>}
                                    <FormHelperText>
                                        {data.hiring_stages.length === 0 &&
                                            "Jika tidak dipilih, akan menggunakan tahapan default"}
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                        </form>
                    </Paper>

                    {/* Other sections remain unchanged */}
                    {/* Hiring Stages Preview - Tampilkan tahapan yang dipilih */}
                    {data.hiring_stages.length > 0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                borderRadius: '1rem',
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                            }}
                        >
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                Tahapan Perekrutan yang Dipilih
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {data.hiring_stages.map((stageId, index) => {
                                    const stage = hiringStages.find(s => s.id === stageId);
                                    return (
                                        <Chip
                                            key={stageId}
                                            label={`${index + 1}. ${stage?.name || 'Unknown'}`}
                                            color="primary"
                                            sx={{ borderRadius: '0.75rem' }}
                                        />
                                    );
                                })}
                            </Box>
                        </Paper>
                    )}

                    {/* Skill Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: '1rem',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <StarIcon color="primary" sx={{ mr: 1.5 }} />
                            <Typography variant="h6" fontWeight="600">
                                Skills & Kemampuan
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <TextField
                                label="Tambahkan Skill"
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                sx={{
                                    flexGrow: 1,
                                    width: { xs: '100%', sm: 'auto' },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.75rem',
                                    }
                                }}
                                placeholder="Contoh: JavaScript, React, UI/UX, dll"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <StarIcon color="action" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddSkill}
                                startIcon={<AddIcon />}
                                sx={{
                                    height: { xs: 48, sm: 56 },
                                    width: { xs: '100%', sm: 'auto' },
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)'
                                }}
                            >
                                Tambah
                            </Button>
                        </Box>

                        {/* Daftar Skill yang Disarankan */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom fontWeight="600" color="primary.main">
                                Skill yang Disarankan
                            </Typography>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: '0.75rem',
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.primary.main, 0.1),
                                }}
                            >
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {Array.isArray(skills) && skills.length > 0 ? (
                                        skills.map((skill) => (
                                            <Chip
                                                key={skill.id || skill}
                                                label={skill.name || skill}
                                                onClick={() => handleAddPredefinedSkill(skill.name || skill)}
                                                color="primary"
                                                variant="outlined"
                                                clickable
                                                size="small"
                                                sx={{
                                                    m: 0.5,
                                                    borderRadius: '0.75rem',
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    }
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Tidak ada skill yang disarankan
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom fontWeight="600" color="primary.main">
                                Skill yang dipilih:
                            </Typography>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: '0.75rem',
                                    border: '1px solid',
                                    borderColor: theme.palette.divider,
                                    minHeight: '60px'
                                }}
                            >
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {data.skills.length > 0 ? (
                                        data.skills.map((skill, index) => (
                                            <Chip
                                                key={index}
                                                label={skill}
                                                onDelete={() => handleRemoveSkill(skill)}
                                                deleteIcon={<DeleteIcon />}
                                                color="primary"
                                                sx={{
                                                    mb: 1,
                                                    borderRadius: '0.75rem',
                                                    fontWeight: 500,
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Belum ada skill yang ditambahkan
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                            {errors.skills && <FormHelperText error sx={{ mt: 1 }}>{errors.skills}</FormHelperText>}
                        </Box>
                    </Paper>

                    {/* Deskripsi, Persyaratan, Tanggung Jawab, dan Manfaat */}
                    {/* Deskripsi, Persyaratan, Tanggung Jawab, dan Manfaat */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: '1rem',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <WorkIcon color="primary" sx={{ mr: 1.5 }} />
                                    <Typography variant="h6" fontWeight="600">
                                        Deskripsi Pekerjaan
                                    </Typography>
                                </Box>
                                <Box data-color-mode="light" sx={{ mb: 2 }}>
                                    <MDEditor
                                        value={data.description}
                                        onChange={value => setData('description', value)}
                                        height={300}
                                        preview="edit"
                                        style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
                                    />
                                </Box>
                                {errors.description && (
                                    <FormHelperText error sx={{ mt: 1 }}>{errors.description}</FormHelperText>
                                )}
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Berikan deskripsi lengkap tentang peran, tanggung jawab, dan manfaat yang ditawarkan
                                </Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CheckCircleIcon color="primary" sx={{ mr: 1.5 }} />
                                    <Typography variant="h6" fontWeight="600">
                                        Tanggung Jawab
                                    </Typography>
                                </Box>
                                <Box data-color-mode="light" sx={{ mb: 2 }}>
                                    <MDEditor
                                        value={data.responsibilities}
                                        onChange={value => setData('responsibilities', value)}
                                        height={300}
                                        preview="edit"
                                        style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
                                    />
                                </Box>
                                {errors.responsibilities && (
                                    <FormHelperText error sx={{ mt: 1 }}>{errors.responsibilities}</FormHelperText>
                                )}
                            </Box>

                            <Divider />

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <BadgeIcon color="primary" sx={{ mr: 1.5 }} />
                                    <Typography variant="h6" fontWeight="600">
                                        Persyaratan
                                    </Typography>
                                </Box>
                                <Box data-color-mode="light" sx={{ mb: 2 }}>
                                    <MDEditor
                                        value={data.requirements}
                                        onChange={value => setData('requirements', value)}
                                        height={300}
                                        preview="edit"
                                        style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
                                    />
                                </Box>
                                {errors.requirements && (
                                    <FormHelperText error sx={{ mt: 1 }}>{errors.requirements}</FormHelperText>
                                )}
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Jelaskan kualifikasi, pengalaman, dan kemampuan yang dibutuhkan untuk posisi ini
                                </Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <StarIcon color="primary" sx={{ mr: 1.5 }} />
                                    <Typography variant="h6" fontWeight="600">
                                        Manfaat & Benefit
                                    </Typography>
                                </Box>
                                <Box data-color-mode="light" sx={{ mb: 2 }}>
                                    <MDEditor
                                        value={data.benefits}
                                        onChange={value => setData('benefits', value)}
                                        height={300}
                                        preview="edit"
                                        style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
                                    />
                                </Box>
                                {errors.benefits && (
                                    <FormHelperText error sx={{ mt: 1 }}>{errors.benefits}</FormHelperText>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* Right Column - Actions & Tips */}
                <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: '1rem',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                            position: { md: 'sticky' },
                            top: { md: 16 },
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                            }
                        }}
                    >
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Tindakan
                        </Typography>

                        <Stack spacing={2} sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<PublishIcon />}
                                disabled={processing}
                                onClick={submitAsActive}
                                sx={{
                                    borderRadius: '0.75rem',
                                    py: 1.5,
                                    boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 15px rgba(15, 118, 110, 0.3)',
                                    }
                                }}
                            >
                                Tambah Lowongan
                            </Button>

                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<SaveIcon />}
                                disabled={processing}
                                onClick={submitAsDraft}
                                sx={{
                                    borderRadius: '0.75rem',
                                    py: 1.5,
                                    borderWidth: '2px',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderWidth: '2px',
                                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    }
                                }}
                            >
                                Simpan sebagai Draft
                            </Button>

                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                component={Link}
                                href={route('manager.jobs.index')}
                                startIcon={<ArrowBackIcon />}
                                sx={{
                                    borderRadius: '0.75rem',
                                    py: 1.5,
                                    borderWidth: '2px',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderWidth: '2px',
                                        bgcolor: alpha(theme.palette.secondary.main, 0.04),
                                    }
                                }}
                            >
                                Kembali
                            </Button>
                        </Stack>

                        {/* Status display section */}
                        <Divider sx={{ my: 3 }} />

                        <Box>
                            <Typography variant="subtitle2" fontWeight="600" color="primary.main" gutterBottom>
                                Status Lowongan
                            </Typography>

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '0.75rem',
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.primary.main, 0.1),
                                    mb: 3
                                }}
                            >
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2">Status saat ini:</Typography>
                                        <Chip
                                            label={data.status === 'active' ? 'Aktif' : 'Draft'}
                                            size="small"
                                            color={data.status === 'active' ? 'success' : 'warning'}
                                            sx={{
                                                borderRadius: '0.75rem',
                                                fontWeight: 500
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                                        {data.status === 'active' ?
                                            'Lowongan dapat dilihat dan dilamar oleh pelamar' :
                                            'Lowongan masih dalam tahap draft, belum dapat dilihat oleh pelamar'
                                        }
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>

                        {/* Tips */}
                        <Typography variant="subtitle2" fontWeight="600" color="primary.main" gutterBottom>
                            Tips
                        </Typography>

                        <MuiCard
                            elevation={0}
                            sx={{
                                bgcolor: alpha(theme.palette.warning.main, 0.05),
                                borderRadius: '0.75rem',
                                border: '1px solid',
                                borderColor: alpha(theme.palette.warning.main, 0.1),
                                mb: 2,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>• Judul yang jelas:</strong> Gunakan judul yang spesifik dan relevan dengan posisi
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>• Deskripsi lengkap:</strong> Jelaskan tanggung jawab dan manfaat secara detail
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>• Persyaratan spesifik:</strong> Tentukan kualifikasi yang diperlukan untuk seleksi
                                </Typography>
                                <Typography variant="body2">
                                    <strong>• Batas waktu realistis:</strong> Berikan waktu yang cukup bagi pelamar untuk melamar
                                </Typography>
                            </CardContent>
                        </MuiCard>

                        {/* Notifikasi Gaji */}
                        <MuiCard
                            elevation={0}
                            sx={{
                                bgcolor: alpha(theme.palette.info.main, 0.05),
                                borderRadius: '0.75rem',
                                border: '1px solid',
                                borderColor: alpha(theme.palette.info.main, 0.1),
                                mb: 2,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <InfoIcon sx={{ fontSize: 18, mr: 1 }} />
                                    <strong>Catatan Gaji</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Rentang gaji tidak akan ditampilkan publik secara default. Anda dapat mengaktifkannya nanti jika diperlukan.
                                </Typography>
                            </CardContent>
                        </MuiCard>
                    </Paper>
                </Box>
            </Box>
        </Layout>
    );
}
