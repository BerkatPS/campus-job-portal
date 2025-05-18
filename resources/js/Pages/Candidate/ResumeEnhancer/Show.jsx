import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  Typography,
  Container,
  Paper,
  Button,
  Box,
  Divider,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Avatar,
  useTheme,
  useMediaQuery,
  Tooltip,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  AutoFixHigh as AutoFixHighIcon,
  Star as StarIcon,
  PictureAsPdf as PdfIcon,
  Description as DescriptionIcon,
  InsertDriveFile as FileIcon,
  Article as ArticleIcon,
  Info as InfoIcon,
  FileOpen as FileOpenIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout.jsx';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const Show = ({ auth, resumeVersion, enhancements, flash }) => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [enhanceDialog, setEnhanceDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { delete: destroy, processing: deleteProcessing } = useForm();
  const { post, processing: enhanceProcessing } = useForm();

  const handleDelete = () => {
    destroy(route('candidate.resume-enhancer.destroy', resumeVersion.id), {
      onSuccess: () => setDeleteDialog(false),
    });
  };

  const handleEnhance = () => {
    post(route('candidate.resume-enhancer.enhance', resumeVersion.id), {
      onSuccess: () => setEnhanceDialog(false),
    });
  };

  // Fungsi untuk download file jika ada
  const handleDownload = () => {
    if (resumeVersion.file_path) {
      window.open(`/storage/${resumeVersion.file_path}`, '_blank');
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
        return <FileIcon fontSize="inherit" color="action" />;
    }
  };

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'info';
    }
  };

  // Fungsi untuk mendapatkan icon status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'processing':
        return <CircularProgress size={16} />;
      case 'failed':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Layout user={auth.user}>
      <Head title={`Resume: ${resumeVersion.version_name}`} />

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
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
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
                        {resumeVersion.version_name}
                    </Typography>
                    {resumeVersion.is_current && (
                        <Chip
                            label="Resume Aktif"
                            sx={{
                                fontWeight: 'medium',
                                bgcolor: '#14b8a6',
                                color: 'white',
                                borderRadius: '0.5rem',
                                boxShadow: '0 2px 4px rgba(20, 184, 166, 0.3)'
                            }}
                            size="small"
                        />
                    )}
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 1,
                    width: isMobile ? '100%' : 'auto'
                }}>
                    <Button
                        component={Link}
                        href={route('candidate.resume-enhancer.index')}
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                        fullWidth={isMobile}
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
                    <Button
                        component={Link}
                        href={route('candidate.resume-enhancer.edit', resumeVersion.id)}
                        startIcon={<EditIcon />}
                        variant="outlined"
                        fullWidth={isMobile}
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
                        Edit
                    </Button>
                    <Button
                        onClick={() => setDeleteDialog(true)}
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="error"
                        fullWidth={isMobile}
                        sx={{
                            borderRadius: '0.75rem',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: alpha('#ef4444', 0.04),
                            }
                        }}
                    >
                        Hapus
                    </Button>
                </Box>
            </Box>

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
                            <Box sx={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                justifyContent: 'space-between',
                                alignItems: isMobile ? 'flex-start' : 'center',
                                mb: 2,
                                gap: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <FileOpenIcon sx={{ color: '#14b8a6' }} />
                                    <Typography variant="h5" component="h2" fontWeight="medium" color="#14b8a6">
                                        Isi Resume
                                    </Typography>
                                </Box>
                                <Button
                                    onClick={() => setEnhanceDialog(true)}
                                    startIcon={<AutoFixHighIcon />}
                                    variant="contained"
                                    sx={{
                                        borderRadius: '0.75rem',
                                        px: 2,
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
                                    Tingkatkan dengan AI
                                </Button>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            <Box
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    p: 3,
                                    borderRadius: '0.75rem',
                                    bgcolor: alpha('#14b8a6', 0.05),
                                    border: '1px solid',
                                    borderColor: alpha('#14b8a6', 0.2),
                                    minHeight: '400px',
                                    overflow: 'auto',
                                    fontFamily: 'inherit',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: alpha('#14b8a6', 0.08),
                                        borderColor: alpha('#14b8a6', 0.3),
                                    }
                                }}
                            >
                                {resumeVersion.content}
                            </Box>

                            {resumeVersion.file_path && (
                                <Box sx={{ mt: 3 }}>
                                    <Button
                                        startIcon={getFileIcon(resumeVersion.file_path)}
                                        endIcon={<DownloadIcon />}
                                        variant="outlined"
                                        onClick={handleDownload}
                                        sx={{
                                            borderRadius: '0.75rem',
                                            borderColor: '#14b8a6',
                                            color: '#14b8a6',
                                            borderWidth: '1px',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                borderColor: '#0d9488',
                                                backgroundColor: alpha('#14b8a6', 0.04),
                                            }
                                        }}
                                    >
                                        Unduh File Resume
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>

          <Box sx={{
            width: isMobile ? '100%' : '34%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <InfoIcon color="primary" />
                <Typography variant="h5" component="h2" fontWeight="medium">
                  Detail Resume
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Dibuat
                </Typography>
                <Typography variant="body1">
                  {formatDistanceToNow(new Date(resumeVersion.created_at), {
                    addSuffix: true,
                    locale: id
                  })}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Terakhir Diperbarui
                </Typography>
                <Typography variant="body1">
                  {formatDistanceToNow(new Date(resumeVersion.updated_at), {
                    addSuffix: true,
                    locale: id
                  })}
                </Typography>
              </Box>

              {resumeVersion.file_path && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    File Terlampir
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 1,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Avatar
                      sx={{
                        bgcolor:
                          getFileExtension(resumeVersion.file_path) === 'pdf'
                          ? 'transparent'
                          : ['doc', 'docx'].includes(getFileExtension(resumeVersion.file_path))
                          ? 'primary.light'
                          : 'grey.300',
                        mr: 2
                      }}
                    >
                      {getFileIcon(resumeVersion.file_path)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: 'break-all' }}>
                        {resumeVersion.file_path.split('/').pop()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getFileExtension(resumeVersion.file_path).toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="text"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    fullWidth
                    sx={{ mt: 1, borderRadius: 2 }}
                  >
                    Unduh File
                  </Button>
                </Box>
              )}

              {resumeVersion.is_current ? (
                <Box sx={{
                  p: 2,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CheckCircleIcon color="inherit" fontSize="small" />
                  <Typography variant="body2">
                    Resume ini saat ini aktif digunakan di profil Anda.
                  </Typography>
                </Box>
              ) : (
                <Button
                  component={Link}
                  href={route('candidate.resume-enhancer.set-as-current', resumeVersion.id)}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<StarIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Jadikan Resume Aktif
                </Button>
              )}
            </Paper>

              {enhancements && enhancements.length > 0 && (
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
                              <AutoFixHighIcon sx={{ color: '#14b8a6' }} />
                              <Typography variant="h5" component="h2" fontWeight="medium" color="#14b8a6">
                                  Riwayat Peningkatan
                              </Typography>
                          </Box>
                          <Divider sx={{ mb: 2 }} />

                          {enhancements.map((enhancement) => (
                              <Card
                                  key={enhancement.id}
                                  sx={{
                                      mb: 2,
                                      borderRadius: '0.75rem',
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                      border: '1px solid',
                                      borderColor: alpha('#14b8a6', 0.2),
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                          transform: 'translateY(-2px)'
                                      }
                                  }}
                              >
                                  <CardHeader
                                      avatar={
                                          <Avatar
                                              sx={{
                                                  bgcolor: alpha(
                                                      enhancement.status === 'completed' ? '#14b8a6' :
                                                          enhancement.status === 'processing' ? '#f59e0b' : '#ef4444',
                                                      0.2
                                                  ),
                                                  color:
                                                      enhancement.status === 'completed' ? '#0f766e' :
                                                          enhancement.status === 'processing' ? '#b45309' : '#b91c1c'
                                              }}
                                          >
                                              {getStatusIcon(enhancement.status)}
                                          </Avatar>
                                      }
                                      title={
                                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                                              <Typography variant="subtitle1" fontWeight="medium">
                                                  Peningkatan Resume
                                              </Typography>
                                              {enhancement.score && enhancement.status === 'completed' && (
                                                  <Chip
                                                      icon={<StarIcon fontSize="small" />}
                                                      label={`Skor: ${enhancement.score}/10`}
                                                      size="small"
                                                      sx={{
                                                          bgcolor: alpha('#14b8a6', 0.1),
                                                          color: '#0f766e',
                                                          fontWeight: 'medium',
                                                          borderRadius: '0.5rem'
                                                      }}
                                                  />
                                              )}
                                          </Box>
                                      }
                                      subheader={
                                          <Typography variant="body2" color="text.secondary">
                                              {enhancement.processed_at ?
                                                  formatDistanceToNow(new Date(enhancement.processed_at), {
                                                      addSuffix: true,
                                                      locale: id
                                                  }) :
                                                  'Sedang diproses'
                                              }
                                          </Typography>
                                      }
                                  />
                                  <CardContent>
                                      {enhancement.status === 'processing' ? (
                                          <Box sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              p: 2,
                                              borderRadius: '0.75rem',
                                              bgcolor: alpha('#f59e0b', 0.1),
                                              color: '#b45309'
                                          }}>
                                              <CircularProgress size={20} sx={{ mr: 2, color: 'inherit' }} />
                                              <Typography variant="body2" fontWeight="medium">
                                                  Sedang menganalisis resume Anda...
                                              </Typography>
                                          </Box>
                                      ) : enhancement.status === 'completed' ? (
                                          <Button
                                              component={Link}
                                              href={route('candidate.resume-enhancer.enhancement', enhancement.id)}
                                              variant="contained"
                                              fullWidth
                                              sx={{
                                                  borderRadius: '0.75rem',
                                                  bgcolor: '#14b8a6',
                                                  boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
                                                  transition: 'all 0.2s',
                                                  '&:hover': {
                                                      bgcolor: '#0f766e',
                                                      boxShadow: '0 6px 20px rgba(20, 184, 166, 0.4)',
                                                      transform: 'translateY(-2px)'
                                                  }
                                              }}
                                              endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                                          >
                                              Lihat Hasil Analisis
                                          </Button>
                                      ) : (
                                          <Alert
                                              severity="error"
                                              variant="filled"
                                              sx={{ borderRadius: '0.75rem' }}
                                          >
                                              Gagal memproses: {enhancement.overall_feedback || 'Terjadi kesalahan pada sistem'}
                                          </Alert>
                                      )}
                                  </CardContent>
                              </Card>
                          ))}
                      </Box>
                  </Paper>
              )}

              {(!enhancements || enhancements.length === 0) && (
                  <Paper sx={{
                      p: 0,
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  }}>
                      <Box sx={{
                          background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
                          p: 3,
                          color: 'white'
                      }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                              <AutoFixHighIcon sx={{ color: 'white' }} />
                              <Typography variant="h6" fontWeight="bold">
                                  Tingkatkan Resume Anda
                              </Typography>
                          </Box>
                          <Typography variant="body2" paragraph>
                              Anda belum pernah meningkatkan resume ini. Gunakan fitur AI untuk mendapatkan saran peningkatan yang dapat membantu Anda mendapatkan pekerjaan.
                          </Typography>
                          <Button
                              onClick={() => setEnhanceDialog(true)}
                              variant="contained"
                              sx={{
                                  bgcolor: 'white',
                                  color: '#14b8a6',
                                  borderRadius: '0.75rem',
                                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.3)',
                                  '&:hover': {
                                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                                      boxShadow: '0 6px 20px rgba(255, 255, 255, 0.4)',
                                      transform: 'translateY(-2px)'
                                  },
                                  transition: 'all 0.2s'
                              }}
                              fullWidth
                          >
                              Mulai Peningkatan
                          </Button>
                      </Box>
                  </Paper>
              )}
          </Box>
            </Box>
        </Container>

        {/* Dialog Konfirmasi Delete */}
        <Dialog
            open={deleteDialog}
            onClose={() => setDeleteDialog(false)}
            PaperProps={{
                sx: {
                    borderRadius: '0.75rem',
                    p: 1,
                    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.15)'
                }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <DeleteIcon color="error" />
                    <Typography variant="h6" fontWeight="bold">Hapus Resume?</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Apakah Anda yakin ingin menghapus resume "{resumeVersion.version_name}"? Tindakan ini tidak dapat dibatalkan.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={() => setDeleteDialog(false)}
                    variant="outlined"
                    sx={{
                        borderRadius: '0.75rem',
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        color: 'text.primary',
                        '&:hover': {
                            borderColor: 'rgba(0, 0, 0, 0.2)',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        },
                        transition: 'all 0.2s ease-in-out'
                    }}
                >
                    Batal
                </Button>
                <Button
                    onClick={handleDelete}
                    color="error"
                    variant="contained"
                    disabled={deleteProcessing}
                    startIcon={deleteProcessing && <CircularProgress size={20} color="inherit" />}
                    sx={{
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
                        '&:hover': {
                            boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                        },
                        transition: 'all 0.2s ease-in-out'
                    }}
                >
                    {deleteProcessing ? 'Menghapus...' : 'Hapus'}
                </Button>
            </DialogActions>
        </Dialog>

        {/* Dialog Konfirmasi Enhance */}
        <Dialog
            open={enhanceDialog}
            onClose={() => setEnhanceDialog(false)}
            PaperProps={{
                sx: {
                    borderRadius: '0.75rem',
                    p: 1,
                    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.15)'
                }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AutoFixHighIcon sx={{ color: '#14b8a6' }} />
                    <Typography variant="h6" fontWeight="bold" color="#14b8a6">
                        Tingkatkan Resume dengan AI?
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" paragraph>
                        AI akan menganalisis resume Anda dan memberikan saran peningkatan untuk meningkatkan peluang mendapatkan pekerjaan. Proses ini mungkin membutuhkan waktu beberapa saat.
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" color="text.secondary">
                        Anda akan mendapatkan:
                    </Typography>
                    <Box component="ul" sx={{
                        pl: '1.5rem',
                        mt: '0.5rem',
                        '& li': {
                            mb: '0.5rem',
                            color: 'text.primary'
                        }
                    }}>
                        <li>Saran perbaikan untuk kata-kata kunci yang hilang</li>
                        <li>Rekomendasi format dan struktur</li>
                        <li>Pendeteksian ketrampilan yang perlu ditambahkan</li>
                        <li>Skor kualitas resume Anda</li>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={() => setEnhanceDialog(false)}
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
                    Batal
                </Button>
                <Button
                    onClick={handleEnhance}
                    variant="contained"
                    disabled={enhanceProcessing}
                    startIcon={enhanceProcessing ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                    sx={{
                        borderRadius: '0.75rem',
                        bgcolor: '#14b8a6',
                        boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
                        '&:hover': {
                            bgcolor: '#0f766e',
                            boxShadow: '0 6px 20px rgba(20, 184, 166, 0.4)',
                        },
                        transition: 'all 0.2s ease-in-out'
                    }}
                >
                    {enhanceProcessing ? 'Memproses...' : 'Mulai Analisis'}
                </Button>
            </DialogActions>
        </Dialog>
    </Layout>
  );
};

export default Show;
