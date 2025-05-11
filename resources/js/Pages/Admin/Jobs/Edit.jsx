import React, { useState, useEffect } from 'react';
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
    Tooltip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    DeleteOutline as DeleteIcon,
    Add as AddIcon,
    Save as SaveIcon,
    Publish as PublishIcon
} from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';

import Layout from '@/Components/Layout/Layout';

const JobEdit = ({ job, companies = [], categories = [] }) => {
    const { auth } = usePage().props;
    const [skillInput, setSkillInput] = useState('');

    const { data, setData, put, processing, errors, reset } = useForm({
        title: job.title || '',
        company_id: job.company_id || '',
        description: job.description || '',
        requirements: job.requirements || '',
        location: job.location || '',
        type: job.type || job.job_type || 'full_time', // Ensure correct value matching
        experience_level: job.experience_level || 'entry', // Ensure correct value matching
        salary_min: job.salary_min || '',
        salary_max: job.salary_max || '',
        status: job.status || (job.is_active ? 'active' : 'closed') || 'draft',
        category_id: job.category_id || '',
        deadline: job.deadline ? job.deadline.split('T')[0] : (job.submission_deadline ? job.submission_deadline.split('T')[0] : ''),
        skills: job.skills || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.jobs.update', job.id));
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

    return (
        <Layout>
            <Head title={`Edit: ${job.title}`} />

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Button
                        component={Link}
                        href={route('admin.jobs.index')}
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 2 }}
                    >
                        Kembali ke Daftar Lowongan
                    </Button>

                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        Edit Lowongan Pekerjaan
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Perbarui informasi lowongan pekerjaan
                    </Typography>
                </Box>

                {Object.keys(errors).length > 0 && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Terdapat kesalahan pada formulir. Silakan periksa kembali.
                    </Alert>
                )}

                <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Judul Pekerjaan"
                                    fullWidth
                                    required
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    placeholder="Contoh: Senior Web Developer"
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <FormControl fullWidth required error={!!errors.company_id}>
                                    <InputLabel id="company-label">Perusahaan</InputLabel>
                                    <Select
                                        labelId="company-label"
                                        value={data.company_id}
                                        onChange={e => setData('company_id', e.target.value)}
                                        label="Perusahaan"
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
                                    <InputLabel id="category-label">Kategori</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        label="Kategori"
                                    >
                                        {categories && categories.map(category => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.category_id && <FormHelperText>{errors.category_id}</FormHelperText>}
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    label="Lokasi"
                                    fullWidth
                                    required
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    error={!!errors.location}
                                    helperText={errors.location}
                                    placeholder="Contoh: Jakarta, Remote, Hybrid"
                                />

                                <FormControl fullWidth required error={!!errors.type}>
                                    <InputLabel id="type-label">Tipe Pekerjaan</InputLabel>
                                    <Select
                                        labelId="type-label"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        label="Tipe Pekerjaan"
                                    >
                                        <MenuItem value="full_time">Full Time</MenuItem>
                                        <MenuItem value="part_time">Part Time</MenuItem>
                                        <MenuItem value="contract">Kontrak</MenuItem>
                                        <MenuItem value="internship">Magang</MenuItem>
                                        <MenuItem value="freelance">Freelance</MenuItem>
                                    </Select>
                                    {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <FormControl fullWidth required error={!!errors.experience_level}>
                                    <InputLabel id="experience-label">Level Pengalaman</InputLabel>
                                    <Select
                                        labelId="experience-label"
                                        value={data.experience_level}
                                        onChange={e => setData('experience_level', e.target.value)}
                                        label="Level Pengalaman"
                                    >
                                        <MenuItem value="entry">Entry Level (0-2 tahun)</MenuItem>
                                        <MenuItem value="mid">Mid Level (2-5 tahun)</MenuItem>
                                        <MenuItem value="senior">Senior Level (5+ tahun)</MenuItem>
                                        <MenuItem value="executive">Executive (10+ tahun)</MenuItem>
                                    </Select>
                                    {errors.experience_level && <FormHelperText>{errors.experience_level}</FormHelperText>}
                                </FormControl>

                                <TextField
                                    label="Gaji Minimum"
                                    fullWidth
                                    type="number"
                                    value={data.salary_min}
                                    onChange={e => setData('salary_min', e.target.value)}
                                    error={!!errors.salary_min}
                                    helperText={errors.salary_min}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    label="Gaji Maksimum"
                                    fullWidth
                                    type="number"
                                    value={data.salary_max}
                                    onChange={e => setData('salary_max', e.target.value)}
                                    error={!!errors.salary_max}
                                    helperText={errors.salary_max || "Kosongkan jika tidak ingin menampilkan range gaji"}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                    }}
                                />

                                <TextField
                                    label="Batas Waktu Pendaftaran"
                                    fullWidth
                                    type="date"
                                    value={data.deadline}
                                    onChange={e => setData('deadline', e.target.value)}
                                    error={!!errors.deadline}
                                    helperText={errors.deadline}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>

                            <FormControl fullWidth required error={!!errors.status}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="active">Aktif</MenuItem>
                                    <MenuItem value="closed">Ditutup</MenuItem>
                                </Select>
                                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                            </FormControl>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Skills & Kemampuan</Typography>

                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                    <TextField
                                        label="Tambahkan Skill"
                                        value={skillInput}
                                        onChange={e => setSkillInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        sx={{ mr: 1, flexGrow: 1 }}
                                        placeholder="Contoh: JavaScript, React, UI/UX, dll"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddSkill}
                                        startIcon={<AddIcon />}
                                    >
                                        Tambah
                                    </Button>
                                </Box>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {data.skills.map((skill, index) => (
                                        <Chip
                                            key={index}
                                            label={skill}
                                            onDelete={() => handleRemoveSkill(skill)}
                                            deleteIcon={<DeleteIcon />}
                                            color="primary"
                                            variant="outlined"
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                    {data.skills.length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            Belum ada skill yang ditambahkan
                                        </Typography>
                                    )}
                                </Box>
                                {errors.skills && <FormHelperText error>{errors.skills}</FormHelperText>}
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Deskripsi Pekerjaan</Typography>
                                <Box data-color-mode="light">
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
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Persyaratan</Typography>
                                <Box data-color-mode="light">
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
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        href={route('admin.jobs.index')}
                                        sx={{ mr: 1 }}
                                    >
                                        Kembali
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        component={Link}
                                        href={route('admin.jobs.show', job.id)}
                                    >
                                        Lihat Detail
                                    </Button>
                                </Box>
                                <Box>
                                    <Button
                                        variant="outlined"
                                        sx={{ mr: 2 }}
                                        onClick={() => {
                                            setData('status', 'draft');
                                            put(route('admin.jobs.update', job.id));
                                        }}
                                        disabled={processing}
                                        startIcon={<SaveIcon />}
                                    >
                                        Simpan sebagai Draft
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing}
                                        startIcon={<PublishIcon />}
                                    >
                                        Perbarui
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Layout>
    );
};

export default JobEdit;
