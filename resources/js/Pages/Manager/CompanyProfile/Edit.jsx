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
    MenuItem,
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
    Delete as DeleteIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from "@/Components/Layout/Layout.jsx";

const EditCompanyProfilePage = ({ company, industries }) => {
    const theme = useTheme();
    const [logoPreview, setLogoPreview] = useState(company.logo);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    
    const { data, setData, errors, post, processing, recentlySuccessful, reset } = useForm({
        name: company.name || '',
        description: company.description || '',
        industry: company.industry || '',
        website: company.website || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || '',
        logo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsUploading(true);
        
        // Create FormData to handle file upload
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('industry', data.industry);
        formData.append('website', data.website);
        formData.append('phone', data.phone);
        formData.append('email', data.email);
        formData.append('address', data.address);
        
        if (data.logo) {
            formData.append('logo', data.logo);
        }
        
        // Use post instead of put because of file upload
        post(route('manager.company-profile.update'), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
            onProgress: (progress) => {
                setUploadProgress(progress.percentage);
            },
            onSuccess: () => {
                reset('logo');
                setIsUploading(false);
                setUploadProgress(0);
            },
            onError: () => {
                setIsUploading(false);
                setUploadProgress(0);
            },
        });
    };
    
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Basic validation
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
            alert('Please upload a valid image file (JPG, JPEG, PNG, GIF)');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert('File size should be less than 2MB');
            return;
        }

        setData('logo', file);
        setLogoPreview(URL.createObjectURL(file));
    };
    
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };
    
    const removeLogo = () => {
        setLogoPreview(null);
        setData('logo', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Layout>
            <Head title="Edit Profil Perusahaan" />
            
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
                                href={route('manager.company-profile.index')} 
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
                                Edit Profil Perusahaan
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
                                Profil perusahaan berhasil diperbarui
                            </Alert>
                        )}
                    </motion.div>

                    <Box 
                        sx={{
                            display: 'flex',
                            flexDirection: {xs: 'column', md: 'row'},
                            gap: 3,
                        }}
                    >
                        {/* Logo Section */}
                        <Box 
                            sx={{
                                width: {xs: '100%', md: '30%'},
                                order: {xs: 1, md: 1}
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '1.25rem',
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                                        }
                                    }}
                                >
                                    <Typography 
                                        variant="h6" 
                                        fontWeight="bold" 
                                        sx={{ 
                                            mb: 3, 
                                            alignSelf: 'flex-start',
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
                                        Logo Perusahaan
                                    </Typography>
                                    
                                    <Box 
                                        sx={{ 
                                            position: 'relative', 
                                            mb: 3,
                                            width: 180,
                                            height: 180,
                                        }}
                                    >
                                        <Avatar
                                            src={logoPreview}
                                            alt={data.name}
                                            variant="rounded"
                                            sx={{
                                                width: 180,
                                                height: 180,
                                                mb: 2,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                                fontSize: '3rem',
                                                borderRadius: '1rem',
                                                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.03)'
                                                }
                                            }}
                                        >
                                            {!logoPreview && <BusinessIcon sx={{ fontSize: '4rem' }} />}
                                        </Avatar>
                                        
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
                                                    borderRadius: '1rem',
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
                                            id="logo-upload"
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/gif"
                                            hidden
                                            ref={fileInputRef}
                                            onChange={handleLogoChange}
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
                                            
                                            {logoPreview && (
                                                <IconButton
                                                    onClick={removeLogo}
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
                                        Unggah logo dengan ukuran maksimal 2MB. Format yang didukung: JPG, PNG, GIF.
                                    </Typography>
                                    
                                    {errors.logo && (
                                        <Typography 
                                            variant="body2" 
                                            color="error" 
                                            sx={{ 
                                                mt: 1,
                                                fontWeight: 'medium'
                                            }}
                                        >
                                            {errors.logo}
                                        </Typography>
                                    )}
                                </Paper>
                            </motion.div>
                        </Box>
                        
                        {/* Main Form Section */}
                        <Box 
                            sx={{
                                width: {xs: '100%', md: '70%'},
                                order: {xs: 2, md: 2}
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <form onSubmit={handleSubmit}>
                                    <Paper 
                                        elevation={0}
                                        sx={{
                                            borderRadius: '1.25rem',
                                            border: '1px solid',
                                            borderColor: alpha(theme.palette.primary.main, 0.1),
                                            mb: 4,
                                            overflow: 'hidden',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': {
                                                boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                                            }
                                        }}
                                    >
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
                                                Informasi Perusahaan
                                            </Typography>
                                            
                                            <Stack spacing={3}>
                                                <TextField
                                                    label="Nama Perusahaan"
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
                                                    select
                                                    label="Industri"
                                                    fullWidth
                                                    value={data.industry}
                                                    onChange={e => setData('industry', e.target.value)}
                                                    error={!!errors.industry}
                                                    helperText={errors.industry}
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
                                                >
                                                    {industries.map((industry) => (
                                                        <MenuItem key={industry.id} value={industry.id}>
                                                            {industry.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                
                                                <TextField
                                                    label="Deskripsi Perusahaan"
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    value={data.description}
                                                    onChange={e => setData('description', e.target.value)}
                                                    error={!!errors.description}
                                                    helperText={errors.description}
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
                                                Kontak & Lokasi
                                            </Typography>
                                            
                                            <Stack spacing={3}>
                                                <Box 
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: {xs: 'column', sm: 'row'},
                                                        gap: 2
                                                    }}
                                                >
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
                                                    
                                                    <TextField
                                                        label="Telepon"
                                                        fullWidth
                                                        value={data.phone}
                                                        onChange={e => setData('phone', e.target.value)}
                                                        error={!!errors.phone}
                                                        helperText={errors.phone}
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
                                                </Box>
                                                
                                                <TextField
                                                    label="Website"
                                                    fullWidth
                                                    value={data.website}
                                                    onChange={e => setData('website', e.target.value)}
                                                    error={!!errors.website}
                                                    helperText={errors.website}
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
                                                    label="Alamat Lengkap"
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    value={data.address}
                                                    onChange={e => setData('address', e.target.value)}
                                                    error={!!errors.address}
                                                    helperText={errors.address}
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
                                    </Paper>
                                </form>
                            </motion.div>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
};

export default EditCompanyProfilePage;
