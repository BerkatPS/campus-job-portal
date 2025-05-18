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
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stepper,
    Step,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    CircularProgress,
    Tabs,
    Tab,
    Rating,
    LinearProgress,
    Checkbox,
    FormControlLabel,
    Avatar,
    Stack,
    useTheme,
    useMediaQuery,
    alpha,
    Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
    ContentCopy as ContentCopyIcon,
    Info as InfoIcon,
    Compare as CompareIcon,
  Warning as WarningIcon,
  Article as ArticleIcon,
  ArrowForward as ArrowForwardIcon,
  Save as SaveIcon,
  CompareArrows as CompareArrowsIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  Summarize as SummarizeIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Search as SearchIcon,
  Grading as GradingIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import Layout from '@/Components/Layout/Layout.jsx';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import axios from 'axios';
import toast from '@/Components/Shared/Toast';

// TabPanel untuk tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resumeenhancer-tabpanel-${index}`}
      aria-labelledby={`resumeenhancer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3, px: { xs: 1, sm: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Enhancement = ({ auth, enhancement, flash }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [applyDialog, setApplyDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [diffView, setDiffView] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [openApplySuggestionDialog, setOpenApplySuggestionDialog] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Make sure resume_version exists to prevent errors
  if (!enhancement || !enhancement.resume_version) {
    return (
      <Layout user={auth.user}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert
            severity="error"
            icon={<ErrorIcon />}
            sx={{
              mb: 3,
              borderRadius: '0.75rem',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
            }}
          >
            Resume version data could not be loaded. Please try again or contact support.
          </Alert>
          <Button
            component={Link}
            href={route('candidate.resume-enhancer.index')}
            variant="contained"
            sx={{
              mt: 2,
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
          >
            Kembali ke Resume Enhancer
          </Button>
        </Container>
      </Layout>
    );
  }

  const { data, setData, post, processing } = useForm({
    enhancement_id: enhancement.id,
    version_name: `${enhancement.resume_version.version_name} (Ditingkatkan)`,
    set_as_current: true,
  });

  const handleApplySuggestions = () => {
    post(route('candidate.resume-enhancer.apply', enhancement.id));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Safely parse JSON if it's a string
  const safelyParseJSON = (jsonData) => {
    if (!jsonData) return null;

    if (typeof jsonData !== 'string') {
      return jsonData; // Already parsed
    }

    try {
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  };

  // Format a suggestion or other data item
  const formatSuggestionItem = (item) => {
    if (!item) return 'Tidak ada data';

    if (typeof item === 'string') {
      return item;
    }

    if (typeof item === 'object') {
      // Look for specific keys in priority order
      if (item.suggestion) return item.suggestion;
      if (item.text) return item.text;
      if (item.description) return item.description;
      if (item.keyword) return item.keyword;
      if (item.skill) return item.skill;
      if (item.content) return item.content;
      if (item.name) return item.name;
      if (item.title) return item.title;

      // For completely unknown objects
      return JSON.stringify(item);
    }

    return String(item);
  };

  // Render content with proper formatting
  const renderFormattedContent = (content) => {
    if (!content) return <Typography color="text.secondary">Tidak ada konten</Typography>;

    // Split by new lines and render each line
    return content.split('\n').map((line, index) => (
      <Typography key={index} paragraph={line.trim().length > 0} variant="body1" sx={{ mb: line.trim().length > 0 ? 1 : 0 }}>
        {line.trim().length > 0 ? line : ' '}
      </Typography>
    ));
  };

  // Fungsi untuk parsing enhancement suggestions
  const renderSuggestions = (suggestions) => {
    try {
      if (!suggestions) return (
        <Alert
          severity="info"
          sx={{
            borderRadius: '0.75rem',
            backgroundColor: alpha('#14b8a6', 0.1),
            color: '#0f766e',
            '& .MuiAlert-icon': {
              color: '#14b8a6'
            }
          }}
        >
          Tidak ada saran yang tersedia.
        </Alert>
      );

      // Parse JSON if it's a string
      const parsedSuggestions = safelyParseJSON(suggestions);

      if (!parsedSuggestions) {
        return (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {suggestions}
          </Typography>
        );
      }

      if (Array.isArray(parsedSuggestions)) {
        return (
          <List>
            {parsedSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                alignItems="flex-start"
                sx={{
                  mb: 2,
                  backgroundColor: alpha('#14b8a6', 0.05),
                  borderRadius: '0.75rem',
                  border: '1px solid',
                  borderColor: alpha('#14b8a6', 0.1),
                  transition: 'all 0.2s',
                  display: 'block',
                  padding: 2.5,
                  '&:hover': {
                    backgroundColor: alpha('#14b8a6', 0.08),
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.08)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 1 }}>
                  <TipsAndUpdatesIcon sx={{ color: '#14b8a6', mr: 1.5, mt: 0.5 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#0f766e',
                      lineHeight: 1.3
                    }}
                  >
                    {suggestion.title || 'Saran Peningkatan'}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    pl: 4.5,
                    color: 'text.primary',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6
                  }}
                >
                  {formatSuggestionItem(suggestion)}
                </Typography>
              </ListItem>
            ))}
          </List>
        );
      } else if (typeof parsedSuggestions === 'object') {
        // Single suggestion object
        return (
          <List>
            <ListItem
              sx={{
                mb: 2,
                backgroundColor: alpha('#14b8a6', 0.05),
                borderRadius: '0.75rem',
                border: '1px solid',
                borderColor: alpha('#14b8a6', 0.1),
                transition: 'all 0.2s',
                display: 'block',
                padding: 2.5,
                '&:hover': {
                  backgroundColor: alpha('#14b8a6', 0.08),
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.08)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 1 }}>
                <TipsAndUpdatesIcon sx={{ color: '#14b8a6', mr: 1.5, mt: 0.5 }} />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#0f766e',
                    lineHeight: 1.3
                  }}
                >
                  {parsedSuggestions.title || 'Saran Peningkatan'}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  pl: 4.5,
                  color: 'text.primary',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6
                }}
              >
                {formatSuggestionItem(parsedSuggestions)}
              </Typography>
            </ListItem>
          </List>
        );
      }

      // Fallback for unexpected formats
      return (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {typeof suggestions === 'string' ? suggestions : JSON.stringify(suggestions, null, 2)}
        </Typography>
      );
    } catch (error) {
      console.error('Error rendering suggestions:', error);
      return (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
          }}
        >
          Terjadi kesalahan saat menampilkan saran.
        </Alert>
      );
    }
  };

  // Render keyword analysis
  const renderKeywordAnalysis = (keywords) => {
    try {
      if (!keywords) return (
        <Alert
          severity="info"
          sx={{
            borderRadius: '0.75rem',
            backgroundColor: alpha('#14b8a6', 0.1),
            color: '#0f766e',
            '& .MuiAlert-icon': {
              color: '#14b8a6'
            }
          }}
        >
          Tidak ada analisis kata kunci yang tersedia.
        </Alert>
      );

      // Parse JSON if it's a string
      const parsedKeywords = safelyParseJSON(keywords);

      if (!parsedKeywords) {
        return (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {keywords}
          </Typography>
        );
      }

      if (Array.isArray(parsedKeywords)) {
        return (
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {parsedKeywords.map((keywordObj, index) => (
                <Chip
                  key={index}
                  label={keywordObj.keyword || formatSuggestionItem(keywordObj)}
                  color="primary"
                  sx={{
                    borderRadius: '0.75rem',
                    backgroundColor: '#14b8a6',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#0f766e',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 3px 10px rgba(20, 184, 166, 0.2)'
                    }
                  }}
                />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              * Kata kunci penting yang ditemukan dalam resume Anda.
            </Typography>
          </Box>
        );
      } else if (typeof parsedKeywords === 'object') {
        // Single keyword object
        return (
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                label={parsedKeywords.keyword || formatSuggestionItem(parsedKeywords)}
                color="primary"
                sx={{
                  borderRadius: '0.75rem',
                  backgroundColor: '#14b8a6',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#0f766e',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 3px 10px rgba(20, 184, 166, 0.2)'
                  }
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              * Kata kunci penting yang ditemukan dalam resume Anda.
            </Typography>
          </Box>
        );
      }

      // Fallback for unexpected formats
      return (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {typeof keywords === 'string' ? keywords : JSON.stringify(keywords, null, 2)}
        </Typography>
      );
    } catch (error) {
      console.error('Error rendering keyword analysis:', error);
      return (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
          }}
        >
          Terjadi kesalahan saat menampilkan analisis kata kunci.
        </Alert>
      );
    }
  };

  // Render format suggestions
  const renderFormatSuggestions = (suggestions) => {
    try {
      if (!suggestions) return (
        <Alert
          severity="info"
          sx={{
            borderRadius: '0.75rem',
            backgroundColor: alpha('#14b8a6', 0.1),
            color: '#0f766e',
            '& .MuiAlert-icon': {
              color: '#14b8a6'
            }
          }}
        >
          Tidak ada saran format yang tersedia.
        </Alert>
      );

      return renderSuggestions(suggestions);
    } catch (error) {
      console.error('Error rendering format suggestions:', error);
      return (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
          }}
        >
          Terjadi kesalahan saat menampilkan saran format.
        </Alert>
      );
    }
  };

  // Render skill suggestions
  const renderSkillSuggestions = (suggestions) => {
    try {
      if (!suggestions) return (
        <Alert
          severity="info"
          sx={{
            borderRadius: '0.75rem',
            backgroundColor: alpha('#14b8a6', 0.1),
            color: '#0f766e',
            '& .MuiAlert-icon': {
              color: '#14b8a6'
            }
          }}
        >
          Tidak ada saran keterampilan yang tersedia.
        </Alert>
      );

      // Parse JSON if it's a string
      const parsedSuggestions = safelyParseJSON(suggestions);

      if (!parsedSuggestions) {
        return (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {suggestions}
          </Typography>
        );
      }

      if (Array.isArray(parsedSuggestions)) {
        return (
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2, gap: 1 }}>
              {parsedSuggestions.map((skill, index) => (
                <Box key={index}>
                  <Chip
                    label={skill.name || skill.skill || formatSuggestionItem(skill)}
                    color="primary"
                    variant="outlined"
                    sx={{
                      borderRadius: '0.75rem',
                      borderColor: '#14b8a6',
                      color: '#14b8a6',
                      backgroundColor: alpha('#14b8a6', 0.05),
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha('#14b8a6', 0.1),
                        transform: 'translateY(-2px)',
                        boxShadow: '0 3px 10px rgba(20, 184, 166, 0.1)'
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              * Skills yang disarankan untuk ditambahkan ke resume Anda berdasarkan analisis AI.
            </Typography>
          </Box>
        );
      } else if (typeof parsedSuggestions === 'object') {
        // Handle single object case
        return (
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2, gap: 1 }}>
              <Box>
                <Chip
                  label={parsedSuggestions.name || parsedSuggestions.skill || formatSuggestionItem(parsedSuggestions)}
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderRadius: '0.75rem',
                    borderColor: '#14b8a6',
                    color: '#14b8a6',
                    backgroundColor: alpha('#14b8a6', 0.05),
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: alpha('#14b8a6', 0.1),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 3px 10px rgba(20, 184, 166, 0.1)'
                    }
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              * Skills yang disarankan untuk ditambahkan ke resume Anda berdasarkan analisis AI.
            </Typography>
          </Box>
        );
      } else {
        return (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {suggestions}
          </Typography>
        );
      }
    } catch (error) {
      console.error('Error rendering skill suggestions:', error);
      return (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {typeof suggestions === 'string' ? suggestions : 'Format saran keterampilan tidak valid.'}
        </Typography>
      );
    }
  };

  // Render the overall feedback tab
  const renderOverallFeedback = () => {
    if (!enhancement.results || !enhancement.results.overall_feedback) {
      return (
        <Alert
          severity="info"
          sx={{
            borderRadius: '0.75rem',
            backgroundColor: alpha('#14b8a6', 0.1),
            color: '#0f766e',
            '& .MuiAlert-icon': {
              color: '#14b8a6'
            }
          }}
        >
          Tidak ada umpan balik keseluruhan yang tersedia.
        </Alert>
      );
    }

    // Format the overall feedback with paragraphs
    const feedback = enhancement.results.overall_feedback;
    const paragraphs = typeof feedback === 'string'
      ? feedback.split('\n').filter(p => p.trim().length > 0)
      : [feedback];

    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: '0.75rem',
          border: '1px solid',
          borderColor: alpha('#14b8a6', 0.2),
          backgroundColor: alpha('#14b8a6', 0.05),
          mb: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <GradingIcon sx={{ color: '#14b8a6', mr: 2, fontSize: '1.75rem' }} />
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#0f766e', fontWeight: 600 }}
            >
              Umpan Balik Keseluruhan
            </Typography>
          </Box>

          {paragraphs.map((paragraph, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{
                mb: 2,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                textAlign: 'justify',
                '&:last-child': { mb: 0 }
              }}
            >
              {paragraph}
            </Typography>
          ))}
        </CardContent>
      </Card>
    );
  };

  // Highlight differences in text
  const highlightDifferences = (original, enhanced) => {
    // Implementasi sederhana untuk menunjukkan perbedaan
    // Dalam implementasi riil, Anda mungkin ingin menggunakan library diff yang lebih canggih
    if (!original || !enhanced || diffView === false) {
      return (
        <Box
          sx={{
            whiteSpace: 'pre-wrap',
            p: 2,
            borderRadius: 1,
            bgcolor: 'action.hover',
            minHeight: '400px',
            overflow: 'auto'
          }}
        >
          {enhanced || original || 'Tidak ada konten yang tersedia.'}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          whiteSpace: 'pre-wrap',
          p: 2,
          borderRadius: 1,
          bgcolor: 'action.hover',
          minHeight: '400px',
          overflow: 'auto'
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          * Teks berwarna hijau adalah konten yang ditambahkan atau diubah.
        </Typography>

        {/* Ini hanya simulasi perbandingan, dalam implementasi nyata gunakan diff library */}
        {enhanced.split('\\n').map((line, i) => {
          const isInOriginal = original.includes(line);
          return (
            <Typography
              key={i}
              component="div"
              sx={{
                color: isInOriginal ? 'text.primary' : 'success.main',
                mb: 1
              }}
            >
              {line}
            </Typography>
          );
        })}
      </Box>
    );
  };

  // Get color based on score value
  const getScoreColor = (score) => {
    if (score >= 7) return '#14b8a6'; // Good score - teal
    if (score >= 5) return '#f59e0b'; // Medium score - amber
    return '#ef4444'; // Poor score - red
  };

  // Get score description based on score value
  const getScoreDescription = (score) => {
    if (score >= 7) return 'Resume Anda sangat baik!';
    if (score >= 5) return 'Resume Anda bagus, tetapi masih perlu beberapa perbaikan.';
    return 'Resume Anda perlu perbaikan yang signifikan.';
  };

  const handleApplyDialogOpen = () => {
    setApplyDialog(true);
  };

  const handleApplyDialogClose = () => {
    setApplyDialog(false);
  };

  const handleRetry = () => {
    // Confirm before retrying
    if (window.confirm('Apakah Anda yakin ingin mencoba ulang analisis ini?')) {
      window.location.href = route('candidate.resume-enhancer.retry', enhancement.id);
    }
  };

  // Parse enhancement data
  const parseEnhancementData = (data, key) => {
    try {
      if (!data || !data[key]) return [];

      // If data[key] is already an array, return it
      if (Array.isArray(data[key])) {
        return data[key];
      }

      // Try to parse JSON string if the data is a string
      if (typeof data[key] === 'string') {
        try {
          const parsed = JSON.parse(data[key]);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          // If parsing fails, return the string as a single item array
          return [{ suggestion: data[key] }];
        }
      }

      // If it's an object but not an array, wrap it in an array
      return [data[key]];
    } catch (error) {
      console.error(`Error parsing ${key} data:`, error);
      return [];
    }
  };

  // Get the appropriate enhancement data
  const getEnhancementData = (key) => {
    // First check if data exists in "results" property (maintained for backwards compatibility)
    if (enhancement.results && enhancement.results[key]) {
      return parseEnhancementData(enhancement.results, key);
    }

    // Otherwise check if it exists directly on the enhancement object
    if (enhancement[key]) {
      return parseEnhancementData(enhancement, key);
    }

    return [];
  };

  // Function to apply enhancement suggestion
  const applySuggestion = (suggestionText) => {
    axios.post(route('candidate.resume-enhancer.apply', enhancement.id), {
      suggestion: suggestionText
    })
      .then(response => {
        // Update the enhancement data with new applied content
        setEnhancement(prev => ({
          ...prev,
          enhanced_content: response.data.enhanced_content,
          applied_at: response.data.applied_at
        }));

        toast.success('Saran berhasil diterapkan!');
        setOpenApplySuggestionDialog(false);
      })
      .catch(error => {
        console.error('Error applying suggestion:', error);
        toast.error('Gagal menerapkan saran. Silakan coba lagi.');
      });
  };

  // Function to retry enhancement
  const retryEnhancement = () => {
    setRetrying(true);

    axios.post(route('candidate.resume-enhancer.retry', enhancement.id))
      .then(response => {
        toast.success('Pemrosesan ulang berhasil dimulai!');

        // Set a timer to redirect after 2 seconds
        setTimeout(() => {
          router.visit(route('candidate.resume-enhancer.processing', response.data.id));
        }, 2000);
      })
      .catch(error => {
        console.error('Error retrying enhancement:', error);
        setRetrying(false);
        toast.error('Gagal memproses ulang. Silakan coba lagi.');
      });
  };

  // Function to copy enhanced content
  const copyEnhancedContent = () => {
    const content = enhancement.enhanced_content || (enhancement.results && enhancement.results.enhanced_content);

    if (!content) {
      toast.error('Tidak ada konten yang dapat disalin');
      return;
    }

    navigator.clipboard.writeText(content)
      .then(() => {
        toast.success('Konten berhasil disalin!');
      })
      .catch(error => {
        console.error('Failed to copy:', error);
        toast.error('Gagal menyalin konten');
      });
  };

  // Handle suggestion apply button
  const handleApplySuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setOpenApplySuggestionDialog(true);
  };

  return (
    <Layout user={auth.user}>
      <Head title="Hasil Peningkatan Resume" />

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

        <Box
          sx={{
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
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                background: 'linear-gradient(90deg, #14b8a6 0%, #0d9488 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Hasil Peningkatan Resume
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {enhancement.processed_at && (
                `Dianalisis ${formatDistanceToNow(new Date(enhancement.processed_at), { addSuffix: true, locale: id })}`
              )}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <Button
              component={Link}
              href={route('candidate.resume-enhancer.show', enhancement.resume_version.id)}
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
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              onClick={handleApplyDialogOpen}
              sx={{
                borderRadius: '0.75rem',
                mr: 1,
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Terapkan Saran
            </Button>
            {enhancement.status === 'failed' && (
              <Button
                variant="outlined"
                color="primary"
                onClick={retryEnhancement}
                sx={{
                  borderRadius: '0.75rem',
                  mr: 1,
                }}
              >
                Coba Lagi
              </Button>
            )}
          </Box>
        </Box>

        {enhancement.status === 'completed' ? (
          <>
            <Paper sx={{
              p: 0,
              mb: 4,
              borderRadius: '0.75rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }}>
              {/* Gradient stripe at the top of card */}
              <Box sx={{
                height: '8px',
                width: '100%',
                background: 'linear-gradient(145deg, #14b8a6 0%, #0f766e 100%)'
              }} />

              <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="resume enhancement tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': {
                      minHeight: '60px',
                      textTransform: 'none',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: '#14b8a6'
                      }
                    },
                    '& .Mui-selected': {
                      color: '#14b8a6',
                      fontWeight: 600
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#14b8a6',
                      height: '3px',
                      borderRadius: '1.5px'
                    }
                  }}
                >
                  <Tab label="Ringkasan" icon={<SummarizeIcon />} iconPosition="start" />
                  <Tab label="Resume yang Ditingkatkan" icon={<ArticleIcon />} iconPosition="start" />
                  <Tab label="Saran Peningkatan" icon={<TipsAndUpdatesIcon />} iconPosition="start" />
                  <Tab label="Analisis Kata Kunci" icon={<SearchIcon />} iconPosition="start" />
                  <Tab label="Saran Format" icon={<FormatListBulletedIcon />} iconPosition="start" />
                  <Tab label="Saran Skills" icon={<GradingIcon />} iconPosition="start" />
                </Tabs>
              </Box>

                <TabPanel value={activeTab} index={0}>
                    <Card elevation={0} sx={{ borderRadius: '0.75rem', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                Umpan Balik Keseluruhan
                            </Typography>

                            <Box sx={{
                                p: 2,
                                bgcolor: alpha(theme.palette.background.default, 0.5),
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(0, 0, 0, 0.06)',
                            }}>
                                {renderFormattedContent(enhancement.overall_feedback)}
                            </Box>

                            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                    Skor Resume:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Rating
                                        value={enhancement.score ? enhancement.score / 2 : 0}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                    />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        {enhancement.score ? enhancement.score.toFixed(1) : '0'}/10
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Highlight key findings */}
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                Statistik & Temuan Utama
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={0} sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(0, 0, 0, 0.08)',
                                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    }}>
                                        <Typography variant="h5" color="primary" fontWeight="medium">
                                            {enhancement.score ? enhancement.score.toFixed(1) : '0'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Skor Resume
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={0} sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(0, 0, 0, 0.08)',
                                        bgcolor: alpha(theme.palette.warning.main, 0.04),
                                    }}>
                                        <Typography variant="h5" color="warning.main" fontWeight="medium">
                                            {getEnhancementData('enhancement_suggestions').length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Saran Peningkatan
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={0} sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(0, 0, 0, 0.08)',
                                        bgcolor: alpha(theme.palette.success.main, 0.04),
                                    }}>
                                        <Typography variant="h5" color="success.main" fontWeight="medium">
                                            {getEnhancementData('skill_suggestions').length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Keterampilan Disarankan
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={0} sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(0, 0, 0, 0.08)',
                                        bgcolor: alpha(theme.palette.info.main, 0.04),
                                    }}>
                                        <Typography variant="h5" color="info.main" fontWeight="medium">
                                            {getEnhancementData('keyword_analysis').length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Kata Kunci
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Top suggestions */}
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                Saran Teratas
                            </Typography>

                            <List sx={{ mb: 2 }}>
                                {getEnhancementData('enhancement_suggestions').slice(0, 3).map((item, index) => (
                                    <ListItem
                                        key={index}
                                        disablePadding
                                        sx={{
                                            mb: 1,
                                            bgcolor: 'transparent',
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <TipsAndUpdatesIcon color="warning" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={formatSuggestionItem(item)}
                                            primaryTypographyProps={{
                                                variant: 'body2',
                                                color: 'text.primary',
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleTabChange(null, 1)}
                                    startIcon={<AssessmentIcon />}
                                    sx={{ borderRadius: '0.75rem' }}
                                >
                                    Lihat Detail Analisis
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleTabChange(null, 2)}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ borderRadius: '0.75rem' }}
                                >
                                    Lihat Saran Peningkatan
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Card elevation={0} sx={{ borderRadius: '0.75rem', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="medium">
                                    Resume yang Ditingkatkan
                                </Typography>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={copyEnhancedContent}
                                    sx={{ borderRadius: '0.75rem' }}
                                >
                                    Salin
                                </Button>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                                p: 1.5,
                                borderRadius: '0.5rem',
                                bgcolor: alpha(theme.palette.warning.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                            }}>
                                <InfoIcon color="warning" sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Konten di bawah ini telah ditingkatkan oleh AI untuk lebih profesional dan efektif.
                                    Anda dapat menyalin konten ini atau menerapkan saran-saran spesifik di tab lain.
                                </Typography>
                            </Box>

                            <Paper
                                elevation={0}
                                sx={{
                                    px: { xs: 2, md: 3 },
                                    py: 2.5,
                                    bgcolor: alpha(theme.palette.background.default, 0.5),
                                    borderRadius: '0.5rem',
                                    border: '1px solid rgba(0, 0, 0, 0.06)',
                                    '& p': { mt: 0, mb: 1.5 }
                                }}
                            >
                                {renderFormattedContent(enhancement.enhanced_content)}
                            </Paper>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                Perbandingan dengan Resume Asli
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setDiffView(!diffView)}
                                    startIcon={diffView ? <ViewStreamIcon /> : <CompareIcon />}
                                    sx={{ borderRadius: '0.75rem', mb: 2 }}
                                >
                                    {diffView ? 'Tampilan Tunggal' : 'Lihat Perbandingan'}
                                </Button>

                                {diffView && (
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 3,
                                        flexDirection: { xs: 'column', lg: 'row' }
                                    }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                flex: 1,
                                                borderRadius: '0.75rem',
                                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Box sx={{
                                                p: { xs: 2, md: 2 },
                                                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                                bgcolor: alpha(theme.palette.grey[500], 0.05),
                                            }}>
                                                <Typography variant="subtitle2" fontWeight="medium">Resume Asli</Typography>
                                            </Box>
                                            <Box sx={{ p: { xs: 2, md: 2 } }}>
                                                {renderFormattedContent(enhancement.original_content)}
                                            </Box>
                                        </Paper>

                                        <Paper
                                            elevation={0}
                                            sx={{
                                                flex: 1,
                                                borderRadius: '0.75rem',
                                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Box sx={{
                                                p: { xs: 2, md: 2 },
                                                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                            }}>
                                                <Typography variant="subtitle2" fontWeight="medium">Resume yang Ditingkatkan</Typography>
                                            </Box>
                                            <Box sx={{ p: { xs: 2, md: 2 } }}>
                                                {renderFormattedContent(enhancement.enhanced_content)}
                                            </Box>
                                        </Paper>
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleTabChange(null, 0)}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{ borderRadius: '0.75rem' }}
                                >
                                    Kembali ke Ringkasan
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleTabChange(null, 2)}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ borderRadius: '0.75rem' }}
                                >
                                    Lihat Saran Peningkatan
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Card elevation={0} sx={{ borderRadius: '0.75rem', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Saran Peningkatan Resume
                      </Typography>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyDialogOpen}
                        startIcon={<CheckIcon />}
                        sx={{ borderRadius: '0.75rem' }}
                      >
                        Terapkan Semua Saran
                      </Button>
                    </Box>

                    <Box sx={{
                      p: 1.5,
                      mb: 3,
                      borderRadius: '0.5rem',
                      bgcolor: alpha(theme.palette.info.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <InfoIcon color="info" sx={{ mr: 1.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        Berikut adalah saran untuk meningkatkan resume Anda. Anda dapat menerapkan semua saran sekaligus atau menerapkan saran individual.
                      </Typography>
                    </Box>

                    {/* Enhancement Suggestions Section */}
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
                      Saran Peningkatan
                    </Typography>

                    <List disablePadding>
                      {getEnhancementData('enhancement_suggestions').map((item, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            mb: 2,
                            borderRadius: '0.75rem',
                            border: '1px solid rgba(0, 0, 0, 0.09)',
                            overflow: 'hidden',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                            }
                          }}
                        >
                          <Box sx={{
                            py: 1.5,
                            px: 2,
                            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                            bgcolor: alpha(theme.palette.warning.main, 0.04),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TipsAndUpdatesIcon color="warning" sx={{ mr: 1.5 }} />
                              <Typography variant="subtitle2" fontWeight="medium">
                                Saran #{index + 1}
                              </Typography>
                            </Box>

                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => handleApplySuggestion(formatSuggestionItem(item))}
                              sx={{
                                borderRadius: '0.5rem',
                                textTransform: 'none',
                                px: 1.5,
                              }}
                            >
                              Terapkan
                            </Button>
                          </Box>

                          <Box sx={{ p: 2 }}>
                            <Typography variant="body1">
                              {formatSuggestionItem(item)}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </List>

                    {/* Keywords Analysis Section */}
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mt: 4, mb: 2 }}>
                      Analisis Kata Kunci
                    </Typography>

                    <Grid container spacing={2}>
                      {getEnhancementData('keyword_analysis').map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              height: '100%',
                              borderRadius: '0.75rem',
                              border: '1px solid rgba(0, 0, 0, 0.09)',
                              transition: 'all 0.2s',
                              display: 'flex',
                              flexDirection: 'column',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                borderColor: alpha(theme.palette.info.main, 0.3),
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <SearchIcon color="info" fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="subtitle2" fontWeight="medium" color="info.main">
                                Kata Kunci
                              </Typography>
                            </Box>
                            <Typography variant="body2">
                              {formatSuggestionItem(item)}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Skill Suggestions Section */}
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mt: 4, mb: 2 }}>
                      Keterampilan yang Disarankan
                    </Typography>

                    <Grid container spacing={2}>
                      {getEnhancementData('skill_suggestions').map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              height: '100%',
                              borderRadius: '0.75rem',
                              border: '1px solid rgba(0, 0, 0, 0.09)',
                              transition: 'all 0.2s',
                              display: 'flex',
                              flexDirection: 'column',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                borderColor: alpha(theme.palette.success.main, 0.3),
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <FormatListBulletedIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="subtitle2" fontWeight="medium" color="success.main">
                                Keterampilan
                              </Typography>
                            </Box>
                            <Typography variant="body2">
                              {formatSuggestionItem(item)}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Format Suggestions Section */}
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mt: 4, mb: 2 }}>
                      Saran Format
                    </Typography>

                    <List disablePadding>
                      {getEnhancementData('format_suggestions').map((item, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            mb: 2,
                            borderRadius: '0.75rem',
                            border: '1px solid rgba(0, 0, 0, 0.09)',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                              borderColor: alpha(theme.palette.secondary.main, 0.3),
                            }
                          }}
                        >
                          <Box sx={{
                            py: 1.5,
                            px: 2,
                            bgcolor: alpha(theme.palette.secondary.main, 0.04),
                            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <SummarizeIcon color="secondary" sx={{ mr: 1.5 }} />
                            <Typography variant="subtitle2" fontWeight="medium">
                              Format #{index + 1}
                            </Typography>
                          </Box>
                          <Box sx={{ p: 2 }}>
                            <Typography variant="body1">
                              {formatSuggestionItem(item)}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </List>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleTabChange(null, 1)}
                        startIcon={<ArrowBackIcon />}
                        sx={{ borderRadius: '0.75rem' }}
                      >
                        Kembali ke Resume
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyDialogOpen}
                        endIcon={<CheckIcon />}
                        sx={{ borderRadius: '0.75rem' }}
                      >
                        Terapkan Semua Saran
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                <Typography variant="h6" gutterBottom>
                  Analisis Kata Kunci
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Kata kunci yang dicari dan dianalisis dalam resume Anda untuk meningkatkan kemungkinan lolos Applicant Tracking System (ATS).
                </Typography>
                {renderKeywordAnalysis(enhancement.keyword_analysis)}
              </TabPanel>

              <TabPanel value={activeTab} index={4}>
                <Typography variant="h6" gutterBottom>
                  Saran Format
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Rekomendasi untuk meningkatkan struktur dan format resume Anda.
                </Typography>
                {renderFormatSuggestions(enhancement.format_suggestions)}
              </TabPanel>

              <TabPanel value={activeTab} index={5}>
                <Typography variant="h6" gutterBottom>
                  Skills yang Disarankan
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Keterampilan yang disarankan untuk ditambahkan ke resume Anda berdasarkan analisis AI.
                </Typography>
                {renderSkillSuggestions(enhancement.skill_suggestions)}
              </TabPanel>
            </Paper>
          </>
        ) : enhancement.status === 'processing' ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Sedang Menganalisis Resume Anda
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Proses ini mungkin membutuhkan waktu beberapa saat. Harap tunggu...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Halaman akan di-refresh secara otomatis setiap 15 detik.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button
                component={Link}
                href={route('candidate.resume-enhancer.show', enhancement.resume_version.id)}
                variant="outlined"
              >
                Kembali
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Gagal Memproses Resume
              </Typography>
              <Typography variant="body1" paragraph>
                {enhancement.overall_feedback || 'Terjadi kesalahan saat memproses resume Anda. Silakan coba lagi nanti.'}
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                component={Link}
                href={route('candidate.resume-enhancer.show', enhancement.resume_version.id)}
                variant="outlined"
              >
                Kembali
              </Button>

              <Button
                component={Link}
                href={route('candidate.resume-enhancer.retry', enhancement.id)}
                variant="contained"
                color="primary"
              >
                Coba Lagi
              </Button>
            </Box>
          </Paper>
        )}
      </Container>

      {/* Apply Suggestions Dialog */}
      <Dialog open={applyDialog} onClose={handleApplyDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Terapkan Saran Peningkatan</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph sx={{ mb: 2 }}>
            Terapkan saran-saran yang diberikan untuk membuat versi resume baru yang lebih baik.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="version_name"
            name="version_name"
            label="Nama Versi Resume"
            type="text"
            fullWidth
            variant="outlined"
            value={data.version_name}
            onChange={e => setData('version_name', e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={data.set_as_current}
                onChange={e => setData('set_as_current', e.target.checked)}
                name="set_as_current"
                color="primary"
              />
            }
            label="Jadikan sebagai resume aktif"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApplyDialogClose} color="inherit">
            Batal
          </Button>
          <Button
            onClick={handleApplySuggestions}
            color="primary"
            disabled={processing}
            variant="contained"
            sx={{ borderRadius: '0.75rem' }}
          >
            {processing ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Memproses...
              </>
            ) : (
              'Terapkan'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Apply Suggestion Dialog */}
      <Dialog open={openApplySuggestionDialog} onClose={() => setOpenApplySuggestionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Terapkan Saran</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph sx={{ mb: 2 }}>
            Terapkan saran yang dipilih untuk membuat versi resume baru yang lebih baik.
          </DialogContentText>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Saran: {selectedSuggestion}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApplySuggestionDialog(false)} color="inherit">
            Batal
          </Button>
          <Button
            onClick={() => applySuggestion(selectedSuggestion)}
            color="primary"
            variant="contained"
            sx={{ borderRadius: '0.75rem' }}
          >
            Terapkan
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Enhancement;
