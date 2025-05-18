import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CandidateLayout from '@/Layouts/CandidateLayout';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
    Tooltip,
    Typography,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    DragIndicator as DragIndicatorIcon,
    Edit as EditIcon,
    GitHub as GitHubIcon,
    OpenInNew as OpenInNewIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    CardMembership as CertificationIcon,
    Article as PublicationIcon,
    EmojiEvents as AwardIcon,
    Slideshow as PresentationIcon,
    Palette as CreativeWorkIcon,
    Science as ResearchIcon,
    Code as CodeIcon,
    Label as OtherIcon,
    Movie as VideoIcon,
    Description as DocumentIcon,
    Link as LinkIcon,
    Public as WebsiteIcon,
    Storage as RepositoryIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import axios from 'axios';
import Layout from "@/Components/Layout/Layout.jsx";

export default function Index({ auth, portfolioItems, types }) {
    const [items, setItems] = useState(portfolioItems);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            axios.delete(route('candidate.portfolio.destroy', itemToDelete.id))
                .then(response => {
                    setItems(items.filter(item => item.id !== itemToDelete.id));
                    toast.success('Portfolio item deleted successfully');
                    setDeleteConfirmOpen(false);
                    setItemToDelete(null);
                })
                .catch(error => {
                    console.error('Error deleting item:', error);
                    toast.error('Failed to delete portfolio item');
                });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setItemToDelete(null);
    };

    const handleToggleFeatured = (item) => {
        axios.patch(route('candidate.portfolio.toggle-featured', item.id))
            .then(response => {
                const updatedItems = items.map(i => {
                    if (i.id === item.id) {
                        return { ...i, is_featured: !i.is_featured };
                    }
                    return i;
                });

                setItems(updatedItems);
                toast.success('Featured status updated');
            })
            .catch(error => {
                console.error('Error toggling featured status:', error);
                toast.error('Failed to update featured status');
            });
    };

    const handleDragEnd = (result) => {
        setIsDragging(false);

        if (!result.destination) {
            return;
        }

        const reorderedItems = Array.from(items);
        const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, reorderedItem);

        // Update display order based on new positions
        const updatedItems = reorderedItems.map((item, index) => ({
            ...item,
            display_order: index
        }));

        setItems(updatedItems);

        // Send updated order to the backend
        axios.post(route('candidate.portfolio.update-order'), {
            items: updatedItems.map((item, index) => ({
                id: item.id,
                display_order: index
            }))
        })
        .then(response => {
            toast.success('Portfolio order updated');
        })
        .catch(error => {
            console.error('Error updating order:', error);
            toast.error('Failed to update portfolio order');
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const getTypeLabel = (type) => {
        return types[type] || 'Unknown Type';
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'project':
                return <CodeIcon fontSize="small" />;
            case 'work_experience':
                return <WorkIcon fontSize="small" />;
            case 'education':
                return <SchoolIcon fontSize="small" />;
            case 'certification':
                return <CertificationIcon fontSize="small" />;
            case 'publication':
                return <PublicationIcon fontSize="small" />;
            case 'award':
                return <AwardIcon fontSize="small" />;
            case 'presentation':
                return <PresentationIcon fontSize="small" />;
            case 'creative_work':
                return <CreativeWorkIcon fontSize="small" />;
            case 'research':
                return <ResearchIcon fontSize="small" />;
            case 'open_source':
                return <GitHubIcon fontSize="small" />;
            case 'other':
            default:
                return <OtherIcon fontSize="small" />;
        }
    };

    const getMediaIcon = (mediaType) => {
        switch (mediaType) {
            case 'video':
                return <VideoIcon fontSize="small" />;
            case 'document':
                return <DocumentIcon fontSize="small" />;
            case 'website':
                return <WebsiteIcon fontSize="small" />;
            case 'social_media':
                return <LinkIcon fontSize="small" />;
            case 'repository':
                return <RepositoryIcon fontSize="small" />;
            case 'image':
            default:
                return null;
        }
    };

    return (
        <Layout
            user={auth.user}
            header={
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    gap={2}
                >
                    <Typography variant="h5" component="h1" fontWeight={600}>
                        My Portfolio
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={Link}
                        href={route('candidate.portfolio.create')}
                        sx={{
                            borderRadius: '0.75rem',
                            textTransform: 'none',
                            px: 2,
                            py: 1,
                            fontWeight: 'medium'
                        }}
                    >
                        Add New Item
                    </Button>
                </Box>
            }
        >
            <Head title="My Portfolio" />

            <Container maxWidth="xl">
                {items.length > 0 ? (
                    <Box sx={{ mt: 3 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 4,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <DragIndicatorIcon
                                    fontSize="small"
                                    color="action"
                                    sx={{ mr: 1, opacity: 0.7 }}
                                />
                                <Typography variant="body1" fontWeight="medium" color="text.primary">
                                    Manage Your Portfolio
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Drag and drop items to reorder your portfolio. Star important items to feature them at the top.
                            </Typography>
                        </Paper>

                        <DragDropContext
                            onDragEnd={handleDragEnd}
                            onDragStart={() => setIsDragging(true)}
                        >
                            <Droppable droppableId="portfolio-items">
                                {(provided) => (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            mx: -1.5,
                                        }}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <Box
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        sx={{
                                                            width: {
                                                                xs: '100%',
                                                                sm: '50%',
                                                                md: '33.333%',
                                                                lg: '25%'
                                                            },
                                                            p: 1.5,
                                                        }}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            zIndex: snapshot.isDragging ? 1000 : 'auto'
                                                        }}
                                                    >
                                                        <Card
                                                            sx={{
                                                                height: '100%',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                                '&:hover': {
                                                                    transform: 'translateY(-4px)',
                                                                    boxShadow: 4
                                                                },
                                                                position: 'relative',
                                                                backgroundColor: item.is_featured ? 'rgba(255, 244, 229, 0.7)' : 'background.paper',
                                                                borderRadius: '1rem',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            <Box
                                                                {...provided.dragHandleProps}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 8,
                                                                    left: 8,
                                                                    cursor: 'grab',
                                                                    zIndex: 1,
                                                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                                    borderRadius: '50%',
                                                                    p: 0.5,
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                }}
                                                            >
                                                                <DragIndicatorIcon color="action" />
                                                            </Box>

                                                            <CardMedia
                                                                component="img"
                                                                height="160"
                                                                image={item.thumbnail || '/default-project.jpg'}
                                                                alt={item.title}
                                                                sx={{ objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    e.target.src = '/default-project.jpg';
                                                                }}
                                                            />

                                                            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                                                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                    <Typography
                                                                        variant="subtitle1"
                                                                        component="h2"
                                                                        fontWeight={600}
                                                                        gutterBottom
                                                                        noWrap
                                                                        sx={{
                                                                            fontSize: '1.1rem',
                                                                            lineHeight: 1.3
                                                                        }}
                                                                    >
                                                                        {item.title}
                                                                    </Typography>
                                                                    <IconButton
                                                                        size="small"
                                                                        color={item.is_featured ? 'warning' : 'default'}
                                                                        onClick={() => handleToggleFeatured(item)}
                                                                        sx={{ ml: 1 }}
                                                                    >
                                                                        {item.is_featured ? <StarIcon /> : <StarBorderIcon />}
                                                                    </IconButton>
                                                                </Box>

                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                                    <Chip
                                                                        icon={getTypeIcon(item.type)}
                                                                        label={getTypeLabel(item.type)}
                                                                        size="small"
                                                                        color="primary"
                                                                        variant="outlined"
                                                                        sx={{
                                                                            borderRadius: '1rem',
                                                                            '& .MuiChip-label': {
                                                                                px: 1.5,
                                                                                fontWeight: 'medium'
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>

                                                                {(item.role || item.organization) && (
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                        sx={{ mb: 1, fontWeight: item.role ? 500 : 400 }}
                                                                    >
                                                                        {item.role && item.role}
                                                                        {item.role && item.organization && ' at '}
                                                                        {item.organization && item.organization}
                                                                    </Typography>
                                                                )}

                                                                <Typography variant="body2" color="text.secondary" paragraph sx={{
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 3,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    minHeight: '3.6em',
                                                                    lineHeight: 1.5
                                                                }}>
                                                                    {item.description || 'No description provided.'}
                                                                </Typography>

                                                                {item.skills && item.skills.length > 0 && (
                                                                    <Box sx={{ mb: 2 }}>
                                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 'medium' }}>
                                                                            Skills:
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                            {item.skills.slice(0, 3).map((skill, i) => (
                                                                                <Chip
                                                                                    key={i}
                                                                                    label={skill}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    sx={{
                                                                                        fontSize: '0.7rem',
                                                                                        borderRadius: '0.75rem',
                                                                                        height: '24px'
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                            {item.skills.length > 3 && (
                                                                                <Chip
                                                                                    label={`+${item.skills.length - 3}`}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    sx={{
                                                                                        fontSize: '0.7rem',
                                                                                        borderRadius: '0.75rem',
                                                                                        height: '24px'
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                )}

                                                                {(item.start_date || item.end_date) && (
                                                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                                                        {formatDate(item.start_date)} - {formatDate(item.end_date)}
                                                                    </Typography>
                                                                )}
                                                            </CardContent>

                                                            <Divider />

                                                            <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                                                                <Box>
                                                                    <IconButton
                                                                        size="small"
                                                                        component={Link}
                                                                        href={route('candidate.portfolio.edit', item.id)}
                                                                        color="primary"
                                                                    >
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => handleDeleteClick(item)}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Box>

                                                                <Box>
                                                                    {item.media_url && (
                                                                        <Tooltip title={`View ${item.media_type || 'Media'}`}>
                                                                            <IconButton
                                                                                size="small"
                                                                                href={item.media_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                color="primary"
                                                                            >
                                                                                {getMediaIcon(item.media_type)}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}

                                                                    {item.repository_url && (
                                                                        <Tooltip title="View Repository">
                                                                            <IconButton
                                                                                size="small"
                                                                                href={item.repository_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                <GitHubIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}

                                                                    {item.project_url && (
                                                                        <Tooltip title="View Project">
                                                                            <IconButton
                                                                                size="small"
                                                                                href={item.project_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                <OpenInNewIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}
                                                                </Box>
                                                            </CardActions>
                                                        </Card>
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Box>
                ) : (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, md: 5 },
                                borderRadius: 3,
                                backgroundColor: 'background.paper',
                                border: '1px dashed',
                                borderColor: 'divider',
                                maxWidth: 700,
                                mx: 'auto',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                            }}
                        >
                            <Typography variant="h6" gutterBottom color="text.secondary" fontWeight={500}>
                                You haven't added any portfolio items yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                                Create your professional portfolio to showcase your skills, projects, education, certifications, and achievements to potential employers.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                component={Link}
                                href={route('candidate.portfolio.create')}
                                sx={{
                                    borderRadius: '0.75rem',
                                    py: 1,
                                    px: 2.5,
                                    textTransform: 'none',
                                    fontWeight: 'medium'
                                }}
                            >
                                Add Your First Item
                            </Button>
                        </Paper>
                    </Box>
                )}

                <Dialog
                    open={deleteConfirmOpen}
                    onClose={handleDeleteCancel}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            overflow: 'hidden'
                        }
                    }}
                >
                    <DialogTitle sx={{ pb: 1 }}>
                        Confirm Delete
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleDeleteCancel} variant="outlined" sx={{ borderRadius: '0.75rem', textTransform: 'none' }}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ borderRadius: '0.75rem', textTransform: 'none' }}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Layout>
    );
}
