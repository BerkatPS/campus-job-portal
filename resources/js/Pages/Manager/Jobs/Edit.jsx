import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Box,
    Typography,
    Paper,
    Stack,
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
    alpha,
    useTheme,
    Switch,
    FormControlLabel
} from '@mui/material';
import { DeleteOutline as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';

import Layout from '@/Components/Layout/Layout';

// Format angka menjadi format Rupiah (dengan titik sebagai pemisah ribuan)
const formatRupiah = (angka) => {
    if (!angka) return '';
    // Hapus semua karakter non-digit
    const numStr = angka.toString().replace(/\D/g, '');
    // Format dengan pemisah ribuan
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Parse string angka berformat menjadi number
const parseRupiah = (rupiahStr) => {
    if (!rupiahStr) return '';
    // Hapus semua titik
    return rupiahStr.toString().replace(/\./g, '');
};

export default function Edit({ job, companies = [], hiringStages = [], selectedStages = [], categories = [] }) {
    const theme = useTheme();
    const [skillInput, setSkillInput] = useState('');

    // Preprocess job data to ensure fields are properly formatted
    const formatJobData = (job) => {
        // Determine the correct status based on is_active and existing status
        let status;
        if (job.is_active === true) {
            status = 'active';
        } else if (job.status === 'closed') {
            status = 'closed';
        } else {
            status = 'draft';
        }

        // Format salary values for display
        let salaryMin = job.salary_min ? formatRupiah(job.salary_min.toString()) : '';
        let salaryMax = job.salary_max ? formatRupiah(job.salary_max.toString()) : '';

        return {
            title: job.title || '',
            company_id: job.company_id || '',
            description: job.description || '',
            requirements: job.requirements || '',
            responsibilities: job.responsibilities || '',
            benefits: job.benefits || '',
            location: job.location || '',
            job_type: job.job_type || 'full_time',
            experience_level: job.experience_level || 'entry',
            salary_min: salaryMin,
            salary_max: salaryMax,
            is_salary_visible: job.is_salary_visible || false,
            vacancies: job.vacancies || '1',
            submission_deadline: job.submission_deadline || '',
            deadline: job.deadline || '',
            is_active: job.is_active || false,
            status: status,
            category_id: job.category_id || '',
            skills: job.skills || [],
            hiring_stages: selectedStages || []
        };
    };

    const { data, setData, put, processing, errors, reset } = useForm(formatJobData(job));

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert formatted currency values to numbers before submission
        const processedData = {
            ...data,
            salary_min: parseRupiah(data.salary_min),
            salary_max: parseRupiah(data.salary_max),
        };

        // Make sure is_active is synchronized with status before submitting
        const updatedData = {
            ...processedData,
            is_active: processedData.status === 'active',
        };

        put(route('manager.jobs.update', job.id), updatedData);
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

    const handleStageAdd = (stageId) => {
        if (!data.hiring_stages.includes(stageId)) {
            setData('hiring_stages', [...data.hiring_stages, stageId]);
        }
    };

    const handleStageRemove = (stageId) => {
        setData('hiring_stages', data.hiring_stages.filter(id => id !== stageId));
    };

    const moveStageUp = (index) => {
        if (index > 0) {
            const newStages = [...data.hiring_stages];
            [newStages[index], newStages[index - 1]] = [newStages[index - 1], newStages[index]];
            setData('hiring_stages', newStages);
        }
    };

    const moveStageDown = (index) => {
        if (index < data.hiring_stages.length - 1) {
            const newStages = [...data.hiring_stages];
            [newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]];
            setData('hiring_stages', newStages);
        }
    };

    return (
        <Layout>
            <Head title={`Edit: ${job.title}`} />

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
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" component="h1" fontWeight="600" gutterBottom>
                        Edit Lowongan Pekerjaan
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Perbarui informasi lowongan pekerjaan "{job.title}"
                    </Typography>
                </Box>
            </Box>

            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: '1rem',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                }}
            >
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

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Job Title */}
                        <Box>
                            <TextField
                                label="Judul Pekerjaan"
                                fullWidth
                                required
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.75rem',
                                    }
                                }}
                            />
                        </Box>

                        {/* Company and Category */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 3
                            }}
                        >
                            <FormControl fullWidth error={!!errors.company_id}>
                                <InputLabel id="company-label">Perusahaan</InputLabel>
                                <Select
                                    labelId="company-label"
                                    value={data.company_id}
                                    onChange={e => setData('company_id', e.target.value)}
                                    label="Perusahaan"
                                    sx={{
                                        borderRadius: '0.75rem',
                                    }}
                                    disabled // Disable company change in edit mode as per controller logic
                                >
                                    {(companies || []).map(company => (
                                        <MenuItem key={company.id} value={company.id}>
                                            {company.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.company_id && <FormHelperText>{errors.company_id}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth required error={!!errors.category_id}>
                                <InputLabel id="category-label">Kategori</InputLabel>
                                <Select
                                    labelId="category-label"
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                    label="Kategori"
                                    sx={{
                                        borderRadius: '0.75rem',
                                    }}
                                >
                                    {(categories || []).map(category => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.category_id && <FormHelperText>{errors.category_id}</FormHelperText>}
                            </FormControl>
                        </Box>

                        {/* Location and Vacancies */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 3
                            }}
                        >
                            <TextField
                                label="Lokasi"
                                fullWidth
                                required
                                value={data.location}
                                onChange={e => setData('location', e.target.value)}
                                error={!!errors.location}
                                helperText={errors.location}
                                placeholder="Contoh: Jakarta, Remote, Hybrid"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.75rem',
                                    }
                                }}
                            />

                            <TextField
                                label="Jumlah Posisi yang Dibuka"
                                fullWidth
                                type="number"
                                value={data.vacancies || ''}
                                onChange={e => setData('vacancies', e.target.value)}
                                error={!!errors.vacancies}
                                helperText={errors.vacancies}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.75rem',
                                    }
                                }}
                            />
                        </Box>

                        {/* Job Type and Experience Level */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 3
                            }}
                        >
                            <FormControl fullWidth required error={!!errors.job_type}>
                                <InputLabel id="type-label">Tipe Pekerjaan</InputLabel>
                                <Select
                                    labelId="type-label"
                                    value={data.job_type}
                                    onChange={e => setData('job_type', e.target.value)}
                                    label="Tipe Pekerjaan"
                                    sx={{
                                        borderRadius: '0.75rem',
                                    }}
                                >
                                    <MenuItem value="full_time">Full Time</MenuItem>
                                    <MenuItem value="part_time">Part Time</MenuItem>
                                    <MenuItem value="contract">Kontrak</MenuItem>
                                    <MenuItem value="internship">Magang</MenuItem>
                                    <MenuItem value="freelance">Freelance</MenuItem>
                                </Select>
                                {errors.job_type && <FormHelperText>{errors.job_type}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth required error={!!errors.experience_level}>
                                <InputLabel id="experience-label">Level Pengalaman</InputLabel>
                                <Select
                                    labelId="experience-label"
                                    value={data.experience_level}
                                    onChange={e => setData('experience_level', e.target.value)}
                                    label="Level Pengalaman"
                                    sx={{
                                        borderRadius: '0.75rem',
                                    }}
                                >
                                    <MenuItem value="entry">Entry Level (0-2 tahun)</MenuItem>
                                    <MenuItem value="mid">Mid Level (2-5 tahun)</MenuItem>
                                    <MenuItem value="senior">Senior Level (5+ tahun)</MenuItem>
                                    <MenuItem value="executive">Executive (10+ tahun)</MenuItem>
                                </Select>
                                {errors.experience_level && <FormHelperText>{errors.experience_level}</FormHelperText>}
                            </FormControl>
                        </Box>

                        {/* Salary Min and Max */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 3
                            }}
                        >
                            <TextField
                                label="Gaji Minimum"
                                fullWidth
                                value={data.salary_min}
                                onChange={(e) => {
                                    // Format angka saat input
                                    const formatted = formatRupiah(e.target.value);
                                    setData('salary_min', formatted);
                                }}
                                error={!!errors.salary_min}
                                helperText={errors.salary_min}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.75rem',
                                    }
                                }}
                            />

                            <TextField
                                label="Gaji Maksimum"
                                fullWidth
                                value={data.salary_max}
                                onChange={(e) => {
                                    // Format angka saat input
                                    const formatted = formatRupiah(e.target.value);
                                    setData('salary_max', formatted);
                                }}
                                error={!!errors.salary_max}
                                helperText={errors.salary_max || "Kosongkan jika tidak ingin menampilkan range gaji"}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.75rem',
                                    }
                                }}
                            />
                        </Box>

                        {/* Salary Visibility Option */}
                        <Box sx={{ pl: 1, mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.is_salary_visible}
                                        onChange={(e) => setData('is_salary_visible', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Tampilkan informasi gaji kepada kandidat"
                            />
                        </Box>

                        {/* Submission Deadline and Deadline */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 3
                            }}
                        >
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.75rem',
                                    }
                                }}
                            />
                        </Box>

                        {/* Status */}
                        <Box>
                            <FormControl fullWidth required error={!!errors.status}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={data.status}
                                    onChange={e => {
                                        const newStatus = e.target.value;
                                        setData('status', newStatus);
                                        // Sync the is_active flag based on status
                                        setData('is_active', newStatus === 'active');
                                    }}
                                    label="Status"
                                    sx={{
                                        borderRadius: '0.75rem',
                                    }}
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="active">Aktif</MenuItem>
                                    <MenuItem value="closed">Ditutup</MenuItem>
                                </Select>
                                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                            </FormControl>
                        </Box>

                        {/* Skills Section */}
                        <Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" fontWeight="600" gutterBottom>Skills & Kemampuan</Typography>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <TextField
                                    label="Tambahkan Skill"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    sx={{
                                        mr: 1,
                                        flexGrow: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.75rem',
                                        }
                                    }}
                                    placeholder="Contoh: JavaScript, React, UI/UX, dll"
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddSkill}
                                    startIcon={<AddIcon />}
                                    sx={{
                                        borderRadius: '0.75rem',
                                        boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)'
                                    }}
                                >
                                    Tambah
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {Array.isArray(data.skills) && data.skills.map((skill, index) => (
                                    <Chip
                                        key={index}
                                        label={skill}
                                        onDelete={() => handleRemoveSkill(skill)}
                                        deleteIcon={<DeleteIcon />}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ mb: 1, borderRadius: '0.75rem' }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Hiring Stages Section */}
                        <Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" fontWeight="600" gutterBottom>Tahapan Perekrutan</Typography>

                            <Box sx={{ mb: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="hiring-stage-label">Tambah Tahapan</InputLabel>
                                    <Select
                                        labelId="hiring-stage-label"
                                        label="Tambah Tahapan"
                                        value=""
                                        onChange={e => handleStageAdd(e.target.value)}
                                        sx={{
                                            borderRadius: '0.75rem',
                                        }}
                                    >
                                        {hiringStages
                                            .filter(stage => !data.hiring_stages.includes(stage.id))
                                            .map(stage => (
                                                <MenuItem key={stage.id} value={stage.id}>
                                                    {stage.name}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>

                            <Stack spacing={1}>
                                {data.hiring_stages.map((stageId, index) => {
                                    const stage = hiringStages.find(s => s.id === stageId);
                                    if (!stage) return null;

                                    return (
                                        <Box
                                            key={stageId}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: '0.75rem',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                background: theme.palette.background.paper,
                                            }}
                                        >
                                            <Typography sx={{ flex: 1 }}>
                                                {index + 1}. {stage.name}
                                            </Typography>
                                            <Box>
                                                <Button
                                                    onClick={() => moveStageUp(index)}
                                                    disabled={index === 0}
                                                    size="small"
                                                >
                                                    ↑
                                                </Button>
                                                <Button
                                                    onClick={() => moveStageDown(index)}
                                                    disabled={index === data.hiring_stages.length - 1}
                                                    size="small"
                                                >
                                                    ↓
                                                </Button>
                                                <IconButton
                                                    onClick={() => handleStageRemove(stageId)}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>

                        {/* Job Description */}
                        <Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" fontWeight="600" gutterBottom>Deskripsi Pekerjaan</Typography>
                            <Box sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '0.75rem',
                                overflow: 'hidden'
                            }}>
                                <MDEditor
                                    value={data.description}
                                    onChange={(val) => setData('description', val)}
                                    height={300}
                                />
                            </Box>
                            {errors.description && (
                                <FormHelperText error>{errors.description}</FormHelperText>
                            )}
                        </Box>

                        {/* Requirements */}
                        <Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" fontWeight="600" gutterBottom>Persyaratan</Typography>
                            <Box sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '0.75rem',
                                overflow: 'hidden'
                            }}>
                                <MDEditor
                                    value={data.requirements}
                                    onChange={(val) => setData('requirements', val)}
                                    height={300}
                                />
                            </Box>
                            {errors.requirements && (
                                <FormHelperText error>{errors.requirements}</FormHelperText>
                            )}
                        </Box>

                        {/* Responsibilities */}
                        <Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" fontWeight="600" gutterBottom>Tanggung Jawab</Typography>
                            <Box sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '0.75rem',
                                overflow: 'hidden'
                            }}>
                                <MDEditor
                                    value={data.responsibilities}
                                    onChange={(val) => setData('responsibilities', val)}
                                    height={300}
                                />
                            </Box>
                            {errors.responsibilities && (
                                <FormHelperText error>{errors.responsibilities}</FormHelperText>
                            )}
                        </Box>

                        {/* Benefits */}
                        <Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" fontWeight="600" gutterBottom>Manfaat & Benefit</Typography>
                            <Box sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '0.75rem',
                                overflow: 'hidden'
                            }}>
                                <MDEditor
                                    value={data.benefits}
                                    onChange={(val) => setData('benefits', val)}
                                    height={300}
                                />
                            </Box>
                            {errors.benefits && (
                                <FormHelperText error>{errors.benefits}</FormHelperText>
                            )}
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                href={route('manager.jobs.index')}
                                sx={{
                                    borderRadius: '0.75rem',
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={processing}
                                onClick={(e) => {
                                    // Make sure status and is_active are in sync before submitting
                                    if (data.status === 'active' && !data.is_active) {
                                        setData('is_active', true);
                                    } else if (data.status !== 'active' && data.is_active) {
                                        setData('is_active', false);
                                    }
                                    handleSubmit(e);
                                }}
                                sx={{
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)'
                                }}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Paper>

            {/* Status Card */}
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: '1rem',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                        Status Lowongan
                    </Typography>
                </Box>

                <Box
                    sx={{
                        p: 2,
                        borderRadius: '0.75rem',
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                    }}
                >
                    <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Status saat ini:</Typography>
                            <Chip
                                label={data.status === 'active' ? 'Aktif' : (data.status === 'closed' ? 'Ditutup' : 'Draft')}
                                size="small"
                                color={
                                    data.status === 'active' ? 'success' :
                                        data.status === 'closed' ? 'error' : 'warning'
                                }
                                sx={{
                                    borderRadius: '0.75rem',
                                    fontWeight: 500
                                }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                            {data.status === 'active'
                                ? 'Lowongan dapat dilihat dan dilamar oleh pelamar'
                                : data.status === 'closed'
                                    ? 'Lowongan sudah ditutup dan tidak dapat dilamar lagi'
                                    : 'Lowongan masih dalam tahap draft, belum dapat dilihat oleh pelamar'
                            }
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </Layout>
    );
}
