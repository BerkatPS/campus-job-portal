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
  IconButton
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
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout.jsx';

const Create = ({ auth }) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [fileError, setFileError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, setData, post, processing, errors, reset } = useForm({
    version_name: '',
    content: '',
    resume_file: null,
    set_as_current: true
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

    post(route('candidate.resume-enhancer.store'), {
      forceFormData: true,
      onSuccess: () => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => {
          setShowProgress(false);
          reset();
          setFileUploaded(false);
          setFileName('');
        }, 1000);
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
      <Head title="Buat Resume Baru" />

      <Box
        sx={{
          background: `linear-gradient(145deg, #f0fdfa 0%, #ffffff 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 4,
          pt: 4,
          pb: 2
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            mb: 4,
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddIcon sx={{ color: '#14b8a6', fontSize: 32 }} />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(90deg, #14b8a6 0%, #5eead4 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Buat Resume Baru
              </Typography>
            </Box>
            <Button
              component="a"
              href={route('candidate.resume-enhancer.index')}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              sx={{
                borderRadius: '0.75rem',
                py: 1,
                px: 2,
                borderWidth: '1.5px',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: '#14b8a6',
                color: '#14b8a6',
                '&:hover': {
                  borderWidth: '1.5px',
                  borderColor: '#0d9488',
                  bgcolor: 'rgba(20, 184, 166, 0.04)',
                }
              }}
            >
              Kembali
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        {showProgress && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#14b8a6' }} gutterBottom>
              {uploadProgress < 100 ? 'Mengunggah...' : 'Selesai!'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{
                height: 6,
                borderRadius: '0.75rem',
                bgcolor: 'rgba(20, 184, 166, 0.1)',
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
                overflow: 'hidden',
                boxShadow: theme.shadows[2]
              }}>
                <Box
                  sx={{
                    height: 8,
                    width: '100%',
                    background: `linear-gradient(90deg, #14b8a6 0%, #5eead4 100%)`,
                  }}
                />
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <BadgeIcon sx={{ color: '#14b8a6' }} />
                    <Typography variant="h5" component="h2" fontWeight="medium">
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
                        error={!!errors.version_name}
                        helperText={errors.version_name}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '0.75rem'
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
                        error={!!errors.content}
                        helperText={errors.content}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '0.75rem'
                          }
                        }}
                      />
                      <FormHelperText>
                        Untuk hasil analisis yang lebih baik, tempelkan konten lengkap resume Anda.
                      </FormHelperText>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                        File Resume
                      </Typography>

                      {fileUploaded ? (
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: '0.75rem',
                          bgcolor: 'rgba(20, 184, 166, 0.04)',
                          border: '1px solid',
                          borderColor: 'rgba(20, 184, 166, 0.2)',
                          mb: 2
                        }}>
                          <Avatar
                            sx={{
                              bgcolor: '#14b8a6',
                              color: 'white',
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
                              sx={{
                                color: '#ef4444',
                                '&:hover': {
                                  bgcolor: 'rgba(239, 68, 68, 0.08)'
                                }
                              }}
                              size="small"
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
                            py: 1.2,
                            px: 2.5,
                            borderWidth: '1.5px',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderColor: '#14b8a6',
                            color: '#14b8a6',
                            '&:hover': {
                              borderWidth: '1.5px',
                              borderColor: '#0d9488',
                              bgcolor: 'rgba(20, 184, 166, 0.04)'
                            }
                          }}
                        >
                          Unggah Resume (Opsional)
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

                      <FormHelperText sx={{ mt: 1 }}>
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
                              color: '#14b8a6',
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
                overflow: 'hidden',
                boxShadow: theme.shadows[2]
              }}>
                <Box
                  sx={{
                    height: 8,
                    width: '100%',
                    background: `linear-gradient(90deg, #14b8a6 0%, #5eead4 100%)`,
                  }}
                />
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <InfoIcon sx={{ color: '#14b8a6' }} />
                    <Typography variant="h5" component="h2" fontWeight="medium">
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
                      '& .MuiAlert-icon': {
                        color: '#14b8a6'
                      },
                      border: '1px solid rgba(20, 184, 166, 0.2)',
                      bgcolor: 'rgba(20, 184, 166, 0.05)'
                    }}
                  >
                    <Typography variant="body2">
                      Setelah menyimpan, gunakan fitur AI Enhancer untuk mendapatkan saran peningkatan kualitas resume!
                    </Typography>
                  </Alert>
                </Box>
              </Paper>

              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, #14b8a6 0%, #5eead4 100%)`,
                  color: 'white',
                  p: 3,
                  borderRadius: '0.75rem',
                  boxShadow: theme.shadows[2],
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E") center center',
                    opacity: 0.1,
                    zIndex: 0
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                    <CheckIcon />
                    <Typography variant="h6" fontWeight="bold">
                      Periksa Sebelum Menyimpan
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }} paragraph>
                    Pastikan Anda sudah:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Mengisi nama versi resume
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Mengisi konten resume lengkap
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Unggah file jika diinginkan
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

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
                    fontWeight: 600,
                    textTransform: 'none',
                    bgcolor: '#14b8a6',
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      bgcolor: '#0d9488',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[6],
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(20, 184, 166, 0.7)',
                    }
                  }}
                >
                  {processing ? 'Menyimpan...' : 'Simpan Resume'}
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Container>
    </Layout>
  );
};

export default Create;
