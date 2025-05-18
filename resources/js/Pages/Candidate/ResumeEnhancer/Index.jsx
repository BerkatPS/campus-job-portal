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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Psychology as PsychologyIcon,
  Upload as UploadIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as DocIcon,
  Article as ArticleIcon,
  Badge as BadgeIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
  School as SchoolIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout.jsx';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';

const Index = ({ auth, resumeVersions, recentEnhancements, currentVersion, flash }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { post, processing } = useForm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleImportFromProfile = () => {
    post(route('candidate.resume-enhancer.import-from-profile'));
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
  const getFileIcon = (filePath) => {
    if (!filePath) return <DescriptionIcon  />;

    const extension = getFileExtension(filePath);

    switch (extension) {
      case 'pdf':
        return <PdfIcon color="error" sx={{ fontSize: 28 }} />;
      case 'doc':
      case 'docx':
        return <ArticleIcon color="info" sx={{ fontSize: 28 }} />;
      default:
        return <DescriptionIcon color="primary" sx={{ fontSize: 28 }} />;
    }
  };

  // Fungsi untuk menampilkan indikator status
  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip
          label="Selesai"
          size="small"
          color="success"
          sx={{ ml: 1, borderRadius: '0.75rem', bgcolor: '#10b981', color: '#fff' }}
        />;
      case 'processing':
        return <Chip
          label="Sedang Diproses"
          size="small"
          color="warning"
          sx={{ ml: 1, borderRadius: '0.75rem', bgcolor: '#f59e0b', color: '#fff' }}
        />;
      case 'failed':
        return <Chip
          label="Gagal"
          size="small"
          color="error"
          sx={{ ml: 1, borderRadius: '0.75rem', bgcolor: '#ef4444', color: '#fff' }}
        />;
      default:
        return null;
    }
  };

  return (
    <Layout user={auth.user}>
      <Head title="Pengembang Resume dengan AI" />

      <Box
        sx={{
          background: `linear-gradient(145deg, ${theme.palette.grey[100]}, ${theme.palette.background.paper})`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 4,
          pt: 4,
          pb: 5
        }}
      >
        <Container maxWidth="lg">
          {flash.success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: '0.75rem',
                boxShadow: theme.shadows[3],
                '& .MuiAlert-icon': {
                  color: '#10b981'
                }
              }}
            >
              {flash.success}
            </Alert>
          )}
          {flash.error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '0.75rem',
                boxShadow: theme.shadows[3],
                '& .MuiAlert-icon': {
                  color: '#ef4444'
                }
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
            gap: 2
          }}>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Pengembang Resume AI
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '600px' }}>
                Tingkatkan resume Anda dengan bantuan kecerdasan buatan untuk meningkatkan peluang mendapatkan pekerjaan
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 1.5
            }}>
              <Button
                component={Link}
                href={route('candidate.resume-enhancer.create')}
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                fullWidth={isMobile}
                sx={{
                  borderRadius: '0.75rem',
                  py: 1.2,
                  px: 2.5,
                  boxShadow: theme.shadows[4],
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[6],
                  }
                }}
              >
                Buat Resume Baru
              </Button>
              <Button
                onClick={() => setOpenDialog(true)}
                startIcon={<UploadIcon />}
                variant="outlined"
                fullWidth={isMobile}
                sx={{
                  borderRadius: '0.75rem',
                  py: 1.2,
                  px: 2.5,
                  borderWidth: '1.5px',
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderWidth: '1.5px',
                    borderColor: '#0d9488',
                    bgcolor: 'rgba(20, 184, 166, 0.04)'
                  }
                }}
              >
                Impor dari Profil
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
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
            <Paper sx={{ p: 3, borderRadius: '0.75rem', boxShadow: theme.shadows[3] }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2
              }}>
                <BadgeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2" fontWeight="medium">
                  Resume Saya
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {resumeVersions && resumeVersions.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {resumeVersions.map((version) => (
                    <ListItem
                      key={version.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '0.75rem',
                        mb: 2,
                        p: 2,
                        bgcolor: version.is_current ? 'rgba(20, 184, 166, 0.04)' : 'transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: theme.shadows[3],
                          bgcolor: version.is_current ? 'rgba(20, 184, 166, 0.08)' : 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                      secondaryAction={
                        <Box sx={{
                          display: 'flex',
                          gap: 1,
                          flexDirection: isMobile ? 'column' : 'row'
                        }}>
                          <Tooltip title="Lihat Detail">
                            <IconButton
                              component={Link}
                              href={route('candidate.resume-enhancer.show', version.id)}
                              edge="end"
                              aria-label="view"
                              color="info"
                              sx={{
                                bgcolor: 'rgba(20, 184, 166, 0.08)',
                                '&:hover': { bgcolor: 'rgba(20, 184, 166, 0.15)' }
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Resume">
                            <IconButton
                              component={Link}
                              href={route('candidate.resume-enhancer.edit', version.id)}
                              edge="end"
                              aria-label="edit"
                              color="primary"
                              sx={{
                                bgcolor: 'rgba(20, 184, 166, 0.08)',
                                color: '#14b8a6',
                                '&:hover': { bgcolor: 'rgba(20, 184, 166, 0.15)' }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        <Avatar sx={{
                          bgcolor: 'transparent',
                          color: 'primary.contrastText',
                          boxShadow: 1
                        }}>
                          {getFileIcon(version.file_path)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {version.version_name}
                            </Typography>
                            {version.is_current && (
                              <Chip
                                label="Aktif"
                                size="small"
                                color="primary"
                                sx={{ ml: 1, borderRadius: '0.75rem', bgcolor: '#14b8a6', color: '#fff' }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              Dibuat {formatDistanceToNow(new Date(version.created_at), {
                                addSuffix: true,
                                locale: id
                              })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info" sx={{
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  bgcolor: 'rgba(20, 184, 166, 0.05)'
                }}>
                  Anda belum memiliki resume. Silakan buat yang baru atau impor dari profil Anda.
                </Alert>
              )}
            </Paper>

            <Paper sx={{ p: 3, borderRadius: '0.75rem', boxShadow: theme.shadows[3] }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2
              }}>
                <RefreshIcon color="primary" sx={{ mr: 1, color: '#14b8a6' }} />
                <Typography variant="h5" component="h2" fontWeight="medium">
                  Riwayat Peningkatan Resume
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {recentEnhancements && recentEnhancements.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {recentEnhancements.map((enhancement) => (
                    <ListItem
                      key={enhancement.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '0.75rem',
                        mb: 2,
                        p: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: theme.shadows[3],
                          bgcolor: 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                      secondaryAction={
                        <Box>
                          <Button
                            component={Link}
                            href={route('candidate.resume-enhancer.enhancement', enhancement.id)}
                            variant="contained"
                            size="small"
                            color="primary"
                            sx={{
                              borderRadius: '0.75rem',
                              boxShadow: theme.shadows[3],
                              bgcolor: '#14b8a6',
                              color: '#fff'
                            }}
                          >
                            Lihat Hasil
                          </Button>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        <Avatar sx={{
                          bgcolor: enhancement.status === 'completed' ? '#10b981' :
                                  enhancement.status === 'processing' ? '#f59e0b' : '#ef4444',
                          color: '#fff',
                          boxShadow: 1
                        }}>
                          {enhancement.status === 'completed' ? (
                            <StarIcon />
                          ) : enhancement.status === 'processing' ? (
                            <RefreshIcon />
                          ) : (
                            <WarningIcon />
                          )}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {enhancement.resumeVersion?.version_name || 'Resume'}
                            </Typography>
                            {getStatusChip(enhancement.status)}
                            {enhancement.score && enhancement.status === 'completed' && (
                              <Chip
                                label={`Skor: ${enhancement.score}/10`}
                                size="small"
                                color="secondary"
                                sx={{ ml: 1, borderRadius: '0.75rem', bgcolor: '#14b8a6', color: '#fff' }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Diproses {formatDistanceToNow(new Date(enhancement.processed_at || enhancement.created_at), {
                              addSuffix: true,
                              locale: id
                            })}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info" sx={{
                  borderRadius: '0.75rem',
                  '& .MuiAlert-icon': {
                    color: '#14b8a6'
                  },
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  bgcolor: 'rgba(20, 184, 166, 0.05)'
                }}>
                  Anda belum memiliki riwayat peningkatan resume.
                </Alert>
              )}
            </Paper>
          </Box>

          <Box sx={{
            width: isMobile ? '100%' : '34%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            <Paper sx={{ p: 3, borderRadius: '0.75rem', boxShadow: theme.shadows[3] }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2
              }}>
                <PsychologyIcon color="primary" sx={{ mr: 1, color: '#14b8a6' }} />
                <Typography variant="h5" component="h2" fontWeight="medium">
                  Tentang Pengembang Resume
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" paragraph>
                  Pengembang Resume menggunakan kecerdasan buatan untuk menganalisis resume Anda dan memberikan saran peningkatan
                  untuk meningkatkan peluang mendapatkan pekerjaan.
                </Typography>
              </Box>

              <List sx={{ mb: 3 }}>
                <ListItem disablePadding sx={{ mb: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FormatListBulletedIcon color="primary" fontSize="small" sx={{ color: '#14b8a6' }} />
                  </ListItemIcon>
                  <ListItemText primary="Analisis kata kunci industri" />
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FormatListBulletedIcon color="primary" fontSize="small" sx={{ color: '#14b8a6' }} />
                  </ListItemIcon>
                  <ListItemText primary="Saran format dan struktur" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FormatListBulletedIcon color="primary" fontSize="small" sx={{ color: '#14b8a6' }} />
                  </ListItemIcon>
                  <ListItemText primary="Rekomendasi keahlian yang perlu ditambahkan" />
                </ListItem>
              </List>

              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, #64ede0 0%, #14b8a6 100%)`,
                  color: 'primary.contrastText',
                  p: 3,
                  borderRadius: '0.75rem',
                  mt: 2,
                  boxShadow: theme.shadows[2],
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E") center center',
                    opacity: 0.1,
                    zIndex: 0
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Tingkatkan Peluang Karir Anda
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Resume yang dioptimalkan dengan AI meningkatkan kesempatan Anda untuk lolos seleksi ATS (Applicant Tracking System)
                  </Typography>
                  <Button
                    component={Link}
                    href={route('candidate.resume-enhancer.create')}
                    variant="contained"
                    color="secondary"
                    sx={{
                      bgcolor: 'white',
                      color: '#14b8a6',
                      fontWeight: 600,
                      borderRadius: '0.75rem',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                      px: 3
                    }}
                  >
                    Mulai Sekarang
                  </Button>
                </Box>
              </Box>
            </Paper>

            {currentVersion && (
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  p: 0,
                  borderRadius: '0.75rem',
                  boxShadow: theme.shadows[3],
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    height: 8,
                    width: '100%',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  }}
                />
                <Box sx={{ p: 3 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <StarIcon color="primary" sx={{ mr: 1, color: '#14b8a6' }} />
                    <Typography variant="h5" component="h2" fontWeight="medium">
                      Resume Aktif
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: 'transparent',
                          width: 56,
                          height: 56,
                          boxShadow: theme.shadows[2]
                        }}
                      >
                        {getFileIcon(currentVersion.file_path)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {currentVersion.version_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Terakhir diperbarui: {formatDistanceToNow(new Date(currentVersion.updated_at), {
                            addSuffix: true,
                            locale: id
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      component={Link}
                      href={route('candidate.resume-enhancer.show', currentVersion.id)}
                      variant="outlined"
                      fullWidth
                      startIcon={<VisibilityIcon />}
                      sx={{
                        borderRadius: '0.75rem',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.2,
                        borderColor: '#14b8a6',
                        color: '#14b8a6',
                        '&:hover': {
                          borderColor: '#0d9488',
                          bgcolor: 'rgba(20, 184, 166, 0.04)'
                        }
                      }}
                    >
                      Lihat
                    </Button>
                    <Button
                      component={Link}
                      href={route('candidate.resume-enhancer.edit', currentVersion.id)}
                      variant="contained"
                      fullWidth
                      startIcon={<EditIcon />}
                      sx={{
                        borderRadius: '0.75rem',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.2,
                        bgcolor: '#14b8a6',
                        color: '#fff'
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>

      {/* Dialog for confirming profile import */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '0.75rem',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={600}>
              Impor dari Profil
            </Typography>
            <IconButton
              onClick={() => setOpenDialog(false)}
              size="small"
              sx={{
                bgcolor: 'rgba(0,0,0,0.05)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.1)',
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Alert severity="info" sx={{
            mb: 3,
            borderRadius: '0.75rem',
            '& .MuiAlert-icon': {
              color: '#14b8a6'
            },
            border: '1px solid rgba(20, 184, 166, 0.2)',
            bgcolor: 'rgba(20, 184, 166, 0.05)'
          }}>
            Ini akan membuat resume baru berdasarkan data profil Anda. Anda dapat mengedit resume tersebut setelah impor selesai.
          </Alert>
          <Typography variant="body1">
            Apakah Anda yakin ingin mengimpor data dari profil Anda untuk membuat resume baru?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: '0.75rem',
              textTransform: 'none',
              fontWeight: 500,
              borderColor: '#14b8a6',
              color: '#14b8a6',
              '&:hover': {
                borderColor: '#0d9488',
                bgcolor: 'rgba(20, 184, 166, 0.04)'
              }
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleImportFromProfile}
            variant="contained"
            color="primary"
            disabled={processing}
            startIcon={processing && <CircularProgress size={20} color="inherit" />}
            sx={{
              borderRadius: '0.75rem',
              textTransform: 'none',
              fontWeight: 500,
              bgcolor: '#14b8a6',
              color: '#fff'
            }}
          >
            {processing ? 'Mengimpor...' : 'Impor'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Index;
