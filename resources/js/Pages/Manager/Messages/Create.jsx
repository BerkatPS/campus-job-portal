import React, { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    FormHelperText,
    Paper,
    Grid,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Send as SendIcon,
    AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout';
import { motion } from 'framer-motion';

const CreateMessage = ({ candidates, jobs }) => {
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef();

    const { data, setData, post, processing, errors, reset } = useForm({
        candidate_id: '',
        job_id: '',
        subject: '',
        message: '',
        attachment: null,
    });

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setData('attachment', e.target.files[0]);
            setAttachment(e.target.files[0].name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('manager.messages.store'), {
            onSuccess: () => {
                reset();
                setAttachment(null);
            },
        });
    };

    return (
        <Layout>
            <Head title="Kirim Pesan Baru" />

            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ display: 'flex', mb: 4, alignItems: 'center' }}>
                            <Button
                                component={Link}
                                href={route('manager.messages.index')}
                                startIcon={<ArrowBackIcon />}
                                sx={{ mr: 2 }}
                            >
                                Kembali
                            </Button>
                            <Typography variant="h5" component="h1" fontWeight="bold">
                                Kirim Pesan Baru
                            </Typography>
                        </Box>

                        <Paper elevation={3} sx={{ p: 3, borderRadius: '0.75rem' }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth error={!!errors.candidate_id}>
                                            <InputLabel id="candidate-label">Pilih Kandidat</InputLabel>
                                            <Select
                                                labelId="candidate-label"
                                                value={data.candidate_id}
                                                onChange={(e) => setData('candidate_id', e.target.value)}
                                                label="Pilih Kandidat"
                                                >
                                                {candidates.map((candidate) => (
                                                    <MenuItem key={candidate.id} value={candidate.id}>
                                                        {candidate.name} ({candidate.email})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.candidate_id && (
                                                <FormHelperText error>{errors.candidate_id}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="job-label">Pekerjaan Terkait (Opsional)</InputLabel>
                                            <Select
                                                labelId="job-label"
                                                value={data.job_id}
                                                onChange={(e) => setData('job_id', e.target.value)}
                                                label="Pekerjaan Terkait (Opsional)"
                                             >
                                                <MenuItem value="">
                                                    <em>Tidak ada</em>
                                                </MenuItem>
                                                {jobs.map((job) => (
                                                    <MenuItem key={job.id} value={job.id}>
                                                        {job.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.job_id && (
                                                <FormHelperText error>{errors.job_id}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Subjek Pesan"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            error={!!errors.subject}
                                            helperText={errors.subject}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={6}
                                            label="Isi Pesan"
                                            placeholder="Tuliskan pesan Anda di sini..."
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            error={!!errors.message}
                                            helperText={errors.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                            <Button
                                                variant="outlined"
                                                startIcon={<AttachFileIcon />}
                                                onClick={() => fileInputRef.current.click()}
                                                sx={{ mr: 2 }}
                                            >
                                                Tambahkan Lampiran
                                            </Button>
                                            {attachment && (
                                                <Chip
                                                    label={attachment}
                                                    onDelete={() => {
                                                        setAttachment(null);
                                                        setData('attachment', null);
                                                    }}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                        {errors.attachment && (
                                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                                {errors.attachment}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                endIcon={<SendIcon />}
                                                disabled={processing || !data.candidate_id || !data.subject || !data.message}
                                            >
                                                Kirim Pesan
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </motion.div>
                </Box>
            </Container>
        </Layout>
    );
};

export default CreateMessage;
