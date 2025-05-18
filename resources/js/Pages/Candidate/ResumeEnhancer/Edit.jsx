import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
  Typography,
  Container,
  Paper,
  Button,
  Box,
  TextField,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  FormHelperText,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Tooltip,
  IconButton,
  alpha
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Upload as UploadIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
  PictureAsPdf as PdfIcon,
  EditNote as EditNoteIcon,
  Badge as BadgeIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout.jsx';

const Edit = ({ auth, resumeVersion, flash }) => {
  const [fileUploaded, setFileUploaded] = useState(!!resumeVersion.file_path);
  const [fileName, setFileName] = useState(
    resumeVersion.file_path ? resumeVersion.file_path.split('/').pop() : ''
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [fileError, setFileError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, setData, put, processing, errors, reset } = useForm({
    version_name: resumeVersion.version_name,
    content: resumeVersion.content,
    resume_file: null,
    set_as_current: resumeVersion.is_current,
    _method: 'PUT'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowProgress(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);

    put(route('candidate.resume-enhancer.update', resumeVersion.id), {
      forceFormData: true,
      onSuccess: () => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => setShowProgress(false), 1000);
      },
      onError: (errors) => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => setShowProgress(false), 1000);
      },
      onFinish: () => {
        clearInterval(progressInterval);
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(null);

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFileError('Ukuran file terlalu besar. Maksimal 2MB.');
        return;
      }

      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(fileExt)) {
        setFileError('Format file tidak didukung. Gunakan PDF, DOC, atau DOCX.');
        return;
      }

      setFileUploaded(true);
      setFileName(file.name);
      setData('resume_file', file);
    }
  };

  // Fungsi untuk mendapatkan ekstensi file
  const getFileExtension = (filename) => {
    if (!filename) return '';
    // Handle potential path issues and extract just the filename
    const fileParts = filename.split('/').pop();
    if (!fileParts) return '';

    // Handle special case for .docx files which might not be properly detected
    if (fileParts.endsWith('.docx')) return 'docx';
    if (fileParts.endsWith('.doc')) return 'doc';

    const filenameParts = fileParts.split('.');
    return filenameParts.length > 1 ? filenameParts.pop().toLowerCase() : '';
  };

  // Fungsi untuk mendapatkan icon berdasarkan ekstensi file
  const getFileIcon = (filename) => {
    const extension = getFileExtension(filename);

    switch (extension) {
      case 'pdf':
        return <PdfIcon fontSize="inherit" color="error" />;
      case 'doc':
      case 'docx':
        return <ArticleIcon fontSize="inherit" color="info" />;
      default:
        return <DescriptionIcon fontSize="inherit" color="action" />;
    }
  };

  // Fungsi untuk mendapatkan warna berdasarkan ekstensi file
  const getFileColor = (filename) => {
    const extension = getFileExtension(filename);

    switch (extension) {
      case 'pdf':
        return 'error.light';
      case 'doc':
      case 'docx':
        return 'primary.light';
      default:
        return 'grey.300';
    }
  };

  // Fungsi untuk menghapus file yang di-upload
  const handleRemoveFile = () => {
    setFileUploaded(false);
    setFileName('');
    setData('resume_file', null);
    setFileError(null);
  };

  return (
    <Layout user={auth.user}>
      <Head title={`Edit Resume: ${resumeVersion.version_name}`} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {flash.success && (
          <Alert
            severity="success"
            icon={<CheckIcon sx={{ color: '#14b8a6' }} />}
            sx={{
              mb: 3,
              borderRadius: '0.75rem',
              boxShadow: 1,
              bgcolor: alpha('#14b8a6', 0.1),
              '& .MuiAlert-message': {
                color: 'text.primary'
              }
            }}
          >
            {flash.success}
          </Alert>
        )}
        {flash.error && (
          <Alert
            severity="error"
            icon={<ErrorIcon />}
            sx={{
              mb: 3,
              borderRadius: '0.75rem',
              boxShadow: 1
            }}
          >
            {flash.error}
          </Alert>
        )}

        {/* Header with gradient background */}
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          mb: 4,
          gap: 2,
          p: 3,
          borderRadius: '0.75rem',
          background: 'linear-gradient(145deg, #f0fdfa 0%, #ffffff 100%)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EditNoteIcon sx={{ color: '#14b8a6', fontSize: 36 }} />
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(90deg, #14b8a6 0%, #0d9488 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Edit Resume
            </Typography>
          </Box>
          <Button
            component="a"
            href={route('candidate.resume-enhancer.show', resumeVersion.id)}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{
              borderRadius: '0.75rem',
              borderColor: '#14b8a6',
              color: '#14b8a6',
              '&:hover': {
                borderColor: '#0d9488',
                backgroundColor: alpha('#14b8a6', 0.04),
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Kembali
          </Button>
        </Box>

        {showProgress && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#14b8a6' }} gutterBottom>
              {uploadProgress < 100 ? 'Mengunggah...' : 'Selesai!'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{
                height: 8,
                borderRadius: '0.75rem',
                bgcolor: alpha('#14b8a6', 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: '0.75rem',
                  bgcolor: '#14b8a6'
                }
              }}
            />
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 3
          }}>
            <Box sx={{
              width: isMobile ? '100%' : '66%',
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              <Paper sx={{
                p: 0,
                borderRadius: '0.75rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-2px)'
                }
              }}>
                {/* Gradient stripe at the top of card */}
                <Box sx={{
                  height: '8px',
                  width: '100%',
                  background: 'linear-gradient(90deg, #14b8a6 0%, #0f766e 100%)'
                }} />

                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <BadgeIcon sx={{ color: '#14b8a6' }} />
                    <Typography variant="h5" component="h2" fontWeight="medium" color="#14b8a6">
                      Detail Resume
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <TextField
                        label="Nama Versi"
                        placeholder="Misalnya: Resume Teknik Informatika 2025"
                        fullWidth
                        required
                        value={data.version_name}
                        onChange={(e) => setData('version_name', e.target.value)}
                        error={errors.version_name ? true : false}
                        helperText={errors.version_name}
                        InputProps={{
                          sx: {
                            borderRadius: '0.75rem',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: '#14b8a6'
                            },
                            '&.Mui-focused': {
                              borderColor: '#14b8a6'
                            }
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '0.75rem'
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#14b8a6'
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#14b8a6'
                          }
                        }}
                      />
                    </Box>

                    <Box>
                      <TextField
                        label="Isi Resume"
                        placeholder="Paste isi resume Anda di sini..."
                        multiline
                        rows={15}
                        fullWidth
                        required
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        error={errors.content ? true : false}
                        helperText={errors.content}
                        InputProps={{
                          sx: {
                            borderRadius: '0.75rem',
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '0.75rem'
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#14b8a6'
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#14b8a6'
                          }
                        }}
                      />
                      <FormHelperText sx={{ mt: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                        Untuk hasil analisis yang lebih baik, tempelkan konten lengkap resume Anda.
                      </FormHelperText>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" gutterBottom fontWeight="medium" color="#14b8a6">
                        File Resume
                      </Typography>

                      {fileUploaded ? (
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: '0.75rem',
                          bgcolor: alpha('#14b8a6', 0.05),
                          border: '1px solid',
                          borderColor: alpha('#14b8a6', 0.2),
                          mb: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: alpha('#14b8a6', 0.08),
                          }
                        }}>
                          <Avatar
                            sx={{
                              bgcolor: 'transparent',
                              mr: 2
                            }}
                          >
                            {getFileIcon(fileName)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: 'break-all' }}>
                              {fileName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {getFileExtension(fileName).toUpperCase()}
                            </Typography>
                          </Box>
                          <Tooltip title="Hapus File">
                            <IconButton
                              onClick={handleRemoveFile}
                              color="error"
                              size="small"
                              sx={{
                                transition: 'transform 0.2s',
                                '&:hover': {
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : null}

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<UploadIcon />}
                          sx={{
                            borderRadius: '0.75rem',
                            borderColor: '#14b8a6',
                            color: '#14b8a6',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: '#0f766e',
                              bgcolor: alpha('#14b8a6', 0.04)
                            }
                          }}
                        >
                          {fileUploaded ? 'Ganti File Resume' : 'Unggah Resume (Opsional)'}
                          <input
                            type="file"
                            hidden
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </Button>
                      </Box>

                      {(fileError || errors.resume_file) && (
                        <Alert
                          severity="error"
                          sx={{
                            mt: 2,
                            borderRadius: '0.75rem',
                            '& .MuiAlert-icon': {
                              color: '#ef4444'
                            }
                          }}
                        >
                          {fileError || errors.resume_file}
                        </Alert>
                      )}

                      <FormHelperText sx={{ mt: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                        Format yang didukung: PDF, DOC, DOCX (Maksimal 2MB)
                      </FormHelperText>
                    </Box>

                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={data.set_as_current}
                            onChange={(e) => setData('set_as_current', e.target.checked)}
                            sx={{
                              color: alpha('#14b8a6', 0.7),
                              '&.Mui-checked': {
                                color: '#14b8a6',
                              },
                            }}
                          />
                        }
                        label={
                          <Typography variant="body1" fontWeight="medium">
                            Jadikan sebagai resume aktif di profil saya
                          </Typography>
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>

            <Box sx={{
              width: isMobile ? '100%' : '34%',
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              <Paper sx={{
                p: 0,
                borderRadius: '0.75rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-2px)'
                }
              }}>
                {/* Gradient stripe at the top of card */}
                <Box sx={{
                  height: '8px',
                  width: '100%',
                  background: 'linear-gradient(90deg, #14b8a6 0%, #0f766e 100%)'
                }} />

                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <InfoIcon sx={{ color: '#14b8a6' }} />
                    <Typography variant="h5" component="h2" fontWeight="medium" color="#14b8a6">
                      Tips Resume
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" paragraph>
                    Resume yang baik meningkatkan peluang Anda untuk mendapatkan pekerjaan. Berikut beberapa tips:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        Gunakan bullet points untuk daftar pengalaman dan pencapaian
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        Sertakan kata kunci yang relevan dengan industri yang dituju
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        Buat resume yang singkat dan fokus pada informasi penting
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        Jelaskan pencapaian dengan data dan angka yang spesifik
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        Sesuaikan resume untuk posisi yang dilamar
                      </Typography>
                    </Box>
                  </Box>

                  <Alert
                    severity="info"
                    sx={{
                      mt: 2,
                      borderRadius: '0.75rem',
                      bgcolor: alpha('#14b8a6', 0.1),
                      '& .MuiAlert-icon': {
                        color: '#14b8a6'
                      },
                      '& .MuiAlert-message': {
                        color: 'text.primary'
                      }
                    }}
                  >
                    <Typography variant="body2">
                      Setelah menyimpan, gunakan fitur AI Enhancer untuk mendapatkan saran peningkatan kualitas resume!
                    </Typography>
                  </Alert>
                </Box>
              </Paper>

              <Card
                sx={{
                  p: 0,
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(145deg, rgba(20, 184, 166, 0.08) 0%, rgba(15, 118, 110, 0.12) 100%)',
                    zIndex: 0
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm63 31c1.657 0 3-1.343 3-3s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM34 90c1.657 0 3-1.343 3-3s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm56-76c1.657 0 3-1.343 3-3s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2314b8a6\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                    backgroundSize: 'cover',
                    opacity: 0.5,
                    zIndex: 0
                  },
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
                    <CheckIcon sx={{ color: '#14b8a6' }} />
                    <Typography variant="h6" fontWeight="medium" color="#14b8a6">
                      Periksa Sebelum Menyimpan
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Pastikan Anda sudah:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Mengisi nama versi resume
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Mengisi konten resume lengkap
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography variant="body2" color="text.secondary">
                        Unggah file jika diinginkan
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ textAlign: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={processing}
                  fullWidth
                  sx={{
                    borderRadius: '0.75rem',
                    py: 1.5,
                    bgcolor: '#14b8a6',
                    boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: '#0f766e',
                      boxShadow: '0 6px 20px rgba(20, 184, 166, 0.4)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Container>
    </Layout>
  );
};

export default Edit;
