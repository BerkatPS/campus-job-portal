import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
    TextField,
    IconButton,
    Avatar,
    Chip,
    Paper,
    Grid,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    InputAdornment,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Send as SendIcon,
    Archive as ArchiveIcon,
    Unarchive as UnarchiveIcon,
    MoreVert as MoreVertIcon,
    AttachFile as AttachFileIcon,
    Download as DownloadIcon,
    Work as WorkIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Layout from '@/Components/Layout/Layout';
import { motion } from 'framer-motion';

const MessageShow = ({ conversation, candidates }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef();
    const messagesEndRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
        attachment: null,
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation.messages]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setData('attachment', e.target.files[0]);
            setAttachment(e.target.files[0].name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('manager.messages.reply', conversation.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('message', 'attachment');
                setAttachment(null);
            },
        });
    };

    const handleArchive = () => {
        handleMenuClose();
        // Use Inertia to make a PUT request to toggle archive
        window.Inertia.put(route('manager.messages.toggle-archive', conversation.id), {}, {
            preserveScroll: true,
        });
    };

    const renderMessageTime = (date) => {
        return format(new Date(date), 'HH:mm · d MMM yyyy', { locale: id });
    };

    const isCurrentUserMessage = (message) => {
        return message.sender_id === conversation.manager_id;
    };

    return (
        <Layout>
            <Head title={`Pesan: ${conversation.subject}`} />

            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ display: 'flex', mb: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    component={Link}
                                    href={route('manager.messages.index')}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{ mr: 2 }}
                                >
                                    Kembali
                                </Button>
                                <Typography variant="h5" component="h1" fontWeight="bold">
                                    {conversation.subject}
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton onClick={handleMenuOpen}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleArchive}>
                                        <ListItemIcon>
                                            {conversation.is_archived ? <UnarchiveIcon /> : <ArchiveIcon />}
                                        </ListItemIcon>
                                        <ListItemText>
                                            {conversation.is_archived ? 'Batalkan Arsip' : 'Arsipkan'}
                                        </ListItemText>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>

                        <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: '0.75rem' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Kandidat
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Avatar
                                            src={conversation.candidate.avatar}
                                            alt={conversation.candidate.name}
                                            sx={{ width: 40, height: 40, mr: 1 }}
                                        >
                                            {conversation.candidate.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="body1">
                                            {conversation.candidate.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                                {conversation.job && (
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Pekerjaan Terkait
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="body1">
                                                {conversation.job.title}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>

                        <Card elevation={3} sx={{ mb: 3, borderRadius: '0.75rem' }}>
                            <CardContent sx={{ p: 3, minHeight: '400px', maxHeight: '500px', overflowY: 'auto' }}>
                                {conversation.messages.map((message, index) => (
                                    <Box
                                        key={message.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: isCurrentUserMessage(message) ? 'flex-end' : 'flex-start',
                                            mb: 3,
                                        }}
                                    >
                                        {!isCurrentUserMessage(message) && (
                                            <Avatar
                                                src={conversation.candidate.avatar}
                                                alt={conversation.candidate.name}
                                                sx={{ mr: 1, width: 40, height: 40 }}
                                            >
                                                {conversation.candidate.name.charAt(0)}
                                            </Avatar>
                                        )}
                                        <Box
                                            sx={{
                                                maxWidth: '70%',
                                            }}
                                        >
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '0.75rem',
                                                    backgroundColor: isCurrentUserMessage(message)
                                                        ? 'primary.main'
                                                        : 'background.paper',
                                                    color: isCurrentUserMessage(message) ? 'white' : 'text.primary',
                                                }}
                                            >
                                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                                    {message.body}
                                                </Typography>
                                                {message.attachment && (
                                                    <Box sx={{ mt: 2 }}>
                                                        <Button
                                                            href={route('manager.messages.download-attachment', message.id)}
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<DownloadIcon />}
                                                            sx={{
                                                                color: isCurrentUserMessage(message) ? 'white' : 'primary.main',
                                                                borderColor: isCurrentUserMessage(message) ? 'white' : 'primary.main',
                                                            }}
                                                        >
                                                            Unduh Lampiran
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Paper>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    display: 'block',
                                                    textAlign: isCurrentUserMessage(message) ? 'right' : 'left',
                                                    mt: 0.5,
                                                }}
                                            >
                                                {renderMessageTime(message.created_at)}
                                            </Typography>
                                        </Box>
                                        {isCurrentUserMessage(message) && (
                                            <Avatar
                                                sx={{ ml: 1, width: 40, height: 40 }}
                                                alt="You"
                                            >
                                                {message.sender.name.charAt(0)}
                                            </Avatar>
                                        )}
                                    </Box>
                                ))}
                                <div ref={messagesEndRef} />
                            </CardContent>
                        </Card>

                        <Paper elevation={3} sx={{ p: 3, borderRadius: '0.75rem' }}>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Tulis pesan Anda di sini..."
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    error={!!errors.message}
                                    helperText={errors.message}
                                    sx={{ mb: 2 }}
                                />
                                {attachment && (
                                    <Box sx={{ mb: 2 }}>
                                        <Chip
                                            label={attachment}
                                            onDelete={() => {
                                                setAttachment(null);
                                                setData('attachment', null);
                                            }}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>
                                )}
                                {errors.attachment && (
                                    <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
                                        {errors.attachment}
                                    </Typography>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    <IconButton
                                        color="primary"
                                        onClick={() => fileInputRef.current.click()}
                                        size="large"
                                    >
                                        <AttachFileIcon />
                                    </IconButton>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        endIcon={<SendIcon />}
                                        disabled={processing || (!data.message && !data.attachment)}
                                    >
                                        Kirim
                                    </Button>
                                </Box>
                            </form>
                        </Paper>
                    </motion.div>
                </Box>
            </Container>
        </Layout>
    );
};

export default MessageShow;
