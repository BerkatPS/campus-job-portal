import React, { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Avatar,
    Stack,
    CircularProgress,
    Divider,
    IconButton,
    alpha,
    useTheme,
    Alert
} from '@mui/material';
import {
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    PhotoCamera as PhotoCameraIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";

const EditProfilePage = ({ user }) => {
    const theme = useTheme();
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const { data, setData, errors, post, processing, recentlySuccessful, reset } = useForm({
        name: user.name,
        email: user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const { setData: setAvatarData, post: uploadAvatar, errors: avatarErrors } = useForm({
        avatar: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('_method', 'PUT'); 

        if (data.current_password) {
            formData.append('current_password', data.current_password);
            formData.append('password', data.password);
            formData.append('password_confirmation', data.password_confirmation);
        }

        post(route('manager.profile.update'), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset('current_password', 'password', 'password_confirmation');
            },
            onError: () => {
                // Handle errors
            },
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            alert('Please upload a valid image file (JPG, JPEG, PNG)');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) { 
            alert('File size should be less than 2MB');
            return;
        }

        setAvatarData('avatar', file);
        setAvatarPreview(URL.createObjectURL(file));
        
        uploadAvatarToServer(file);
    };
    
    const uploadAvatarToServer = (file) => {
        setIsUploading(true);
        setUploadProgress(0);
        
        const formData = new FormData();
        formData.append('avatar', file);
        
        uploadAvatar(route('manager.profile.update-avatar'), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
            onProgress: (progress) => {
                setUploadProgress(progress.percentage);
            },
            onSuccess: (response) => {
                setIsUploading(false);
                setUploadProgress(0);
                if (response?.avatar) {
                    setAvatarPreview(response.avatar);
                }
            },
            onError: () => {
                setIsUploading(false);
                setUploadProgress(0);
                alert('Failed to upload avatar. Please try again.');
            },
        });
    };
    
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };
    
    const removeAvatar = () => {
        setAvatarPreview(null);
        setAvatarData('avatar', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Layout>
            <Head title="Edit Profil" />

            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                mb: 4, 
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 2
                            }}
                        >
                            <Button
                                component={Link}
                                href={route('manager.profile.index')}
                                startIcon={<ArrowBackIcon />}
                                variant="outlined"
                                sx={{ 
                                    borderRadius: '10px',
                                    px: 2,
                                    mr: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                    }
                                }}
                            >
                                Kembali
                            </Button>
                            <Typography 
                                variant="h4" 
                                component="h1" 
                                fontWeight="bold" 
                                color="primary.main"
                                sx={{
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Edit Profil
                            </Typography>
                        </Box>

                        {recentlySuccessful && (
                            <Alert 
                                severity="success" 
                                sx={{ 
                                    mb: 3,
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}
                            >
                                Profil berhasil diperbarui.
                            </Alert>
                        )}

                        <Paper 
                            elevation={0} 
                            sx={{ 
                                borderRadius: '1.25rem', 
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: alpha(theme.palette.primary.main, 0.1),
                                mb: 4,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                '&:hover': {
                                    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                                }
                            }}
                        >
                            <form onSubmit={handleSubmit}>
                                <Box sx={{ p: { xs: 3, md: 4 } }}>
                                    <Typography 
                                        variant="h6" 
                                        component="h2" 
                                        fontWeight="bold" 
                                        sx={{ 
                                            mb: 3,
                                            color: theme.palette.primary.main,
                                            position: 'relative',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: '-8px',
                                                left: 0,
                                                width: '40px',
                                                height: '3px',
                                                background: theme.palette.primary.main,
                                                borderRadius: '10px'
                                            }
                                        }}
                                    >
                                        Informasi Profil
                                    </Typography>
                                    
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: { xs: 'column', md: 'row' }, 
                                        gap: 4, 
                                        mb: 3,
                                    }}>
                                        <Box sx={{ 
                                            width: { xs: '100%', md: '30%' }, 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            alignItems: 'center', 
                                            justifyContent: 'flex-start',
                                        }}>
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    width: 150,
                                                    height: 150,
                                                    mb: 2,
                                                }}
                                            >
                                                <Avatar
                                                    src={avatarPreview}
                                                    alt={data.name}
                                                    sx={{
                                                        width: 150,
                                                        height: 150,
                                                        border: '4px solid',
                                                        borderColor: alpha(theme.palette.primary.main, 0.2),
                                                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                                        transition: 'transform 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.03)'
                                                        }
                                                    }}
                                                />
                                                
                                                {isUploading && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: alpha('#000', 0.5),
                                                            borderRadius: '50%',
                                                            zIndex: 2
                                                        }}
                                                    >
                                                        <CircularProgress 
                                                            variant="determinate" 
                                                            value={uploadProgress} 
                                                            size={60}
                                                            sx={{ color: 'white' }}
                                                        />
                                                        <Typography 
                                                            variant="body2" 
                                                            component="div" 
                                                            sx={{ 
                                                                position: 'absolute',
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {`${Math.round(uploadProgress)}%`}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    onChange={handleAvatarChange}
                                                />
                                                
                                                <Box 
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        right: 0,
                                                        display: 'flex',
                                                        gap: 1
                                                    }}
                                                >
                                                    <IconButton
                                                        onClick={triggerFileInput}
                                                        sx={{
                                                            bgcolor: theme.palette.primary.main,
                                                            color: 'white',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                            '&:hover': {
                                                                bgcolor: theme.palette.primary.dark,
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        disabled={isUploading}
                                                    >
                                                        <PhotoCameraIcon />
                                                    </IconButton>
                                                    
                                                    {avatarPreview && (
                                                        <IconButton
                                                            onClick={removeAvatar}
                                                            sx={{
                                                                bgcolor: theme.palette.error.main,
                                                                color: 'white',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                                '&:hover': {
                                                                    bgcolor: theme.palette.error.dark,
                                                                },
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            disabled={isUploading}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </Box>
                                            
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                sx={{ 
                                                    mb: 2, 
                                                    textAlign: 'center',
                                                    px: 2,
                                                    py: 1,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                Unggah foto profil dengan ukuran maksimal 2MB. Format yang didukung: JPG, JPEG, PNG.
                                            </Typography>
                                            
                                            {avatarErrors.avatar && (
                                                <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 'medium' }}>
                                                    {avatarErrors.avatar}
                                                </Typography>
                                            )}
                                        </Box>
                                        
                                        <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                                            <Stack spacing={3}>
                                                <TextField
                                                    label="Nama Lengkap"
                                                    fullWidth
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    error={!!errors.name}
                                                    helperText={errors.name}
                                                    InputProps={{
                                                        sx: {
                                                            borderRadius: '10px',
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                                            },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: alpha(theme.palette.primary.main, 0.5),
                                                            },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: theme.palette.primary.main,
                                                            }
                                                        }
                                                    }}
                                                />
                                                
                                                <TextField
                                                    label="Email"
                                                    fullWidth
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    error={!!errors.email}
                                                    helperText={errors.email}
                                                    InputProps={{
                                                        sx: {
                                                            borderRadius: '10px',
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                                            },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: alpha(theme.palette.primary.main, 0.5),
                                                            },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: theme.palette.primary.main,
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Stack>
                                        </Box>
                                    </Box>
                                    
                                    <Divider sx={{ my: 4, borderColor: alpha(theme.palette.primary.main, 0.1) }} />
                                    
                                    <Typography 
                                        variant="h6" 
                                        component="h2" 
                                        fontWeight="bold" 
                                        sx={{ 
                                            mb: 3,
                                            color: theme.palette.primary.main,
                                            position: 'relative',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: '-8px',
                                                left: 0,
                                                width: '40px',
                                                height: '3px',
                                                background: theme.palette.primary.main,
                                                borderRadius: '10px'
                                            }
                                        }}
                                    >
                                        Ubah Password
                                    </Typography>
                                    
                                    <Stack spacing={3}>
                                        <TextField
                                            label="Password Saat Ini"
                                            fullWidth
                                            type="password"
                                            value={data.current_password}
                                            onChange={e => setData('current_password', e.target.value)}
                                            error={!!errors.current_password}
                                            helperText={errors.current_password}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '10px',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: alpha(theme.palette.primary.main, 0.2),
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }
                                            }}
                                        />
                                        
                                        <TextField
                                            label="Password Baru"
                                            fullWidth
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '10px',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: alpha(theme.palette.primary.main, 0.2),
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }
                                            }}
                                        />
                                        
                                        <TextField
                                            label="Konfirmasi Password Baru"
                                            fullWidth
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            error={!!errors.password_confirmation}
                                            helperText={errors.password_confirmation}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '10px',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: alpha(theme.palette.primary.main, 0.2),
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Box>
                                
                                <Box 
                                    sx={{ 
                                        p: { xs: 3, md: 4 }, 
                                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                                        borderTop: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                        display: 'flex',
                                        justifyContent: 'flex-end'
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        disabled={processing || isUploading}
                                        sx={{
                                            borderRadius: '10px',
                                            px: 3,
                                            py: 1.2,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                                            }
                                        }}
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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

export default EditProfilePage;
