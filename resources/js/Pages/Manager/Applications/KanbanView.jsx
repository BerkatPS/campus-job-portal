import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { usePage, Link, Head } from '@inertiajs/react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Grid,
  Card as MuiCard,
  CardContent,
  Avatar,
  Chip,
  ButtonGroup,
  Divider,
  alpha,
  Stack,
  useTheme
} from '@mui/material';
import {
  ViewList,
  FilterList,
  MoreVert,
  FileDownload,
  Star,
  StarBorder,
  Event,
  Email,
  Refresh,
  Search,
  WorkOutline,
  Tune,
  Badge,
  DragIndicator,
  FactCheck,
  DynamicFeed
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Custom Components
import Button from '@/Components/Shared/Button';
import SearchBar from '@/Components/Shared/SearchBar';
import Select from '@/Components/Shared/Select';
import Dropdown from '@/Components/Shared/Dropdown';
import Alert from '@/Components/Shared/Alert';
import Spinner from '@/Components/Shared/Spinner';
import Layout from '@/Components/Layout/Layout';

const KanbanView = () => {
  const { applications, stages, statuses, jobs, flash } = usePage().props;
  const theme = useTheme();
  
  const [searchParams, setSearchParams] = useState({
    search: '',
    status: '',
    job: ''
  });
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState({});

  // Initialize columns with stages data
  useEffect(() => {
    if (stages && applications) {
      const columnsFromBackend = {};
      stages.forEach(stage => {
        columnsFromBackend[stage.id] = {
          id: stage.id,
          name: stage.name,
          color: stage.color,
          items: applications.filter(app => app.current_stage_id === stage.id)
        };
      });
      
      // Add a column for applications without a stage
      columnsFromBackend['unstaged'] = {
        id: 'unstaged',
        name: 'Unstaged',
        color: '#9e9e9e',
        items: applications.filter(app => !app.current_stage_id)
      };
      
      setColumns(columnsFromBackend);
    }
  }, [stages, applications]);

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v !== '')
    );
    
    setLoading(true);
    router.get(route('manager.applications.kanban'), params, {
      preserveState: true,
      replace: true,
      only: ['applications'],
      onSuccess: () => setLoading(false)
    });
  }, [searchParams]);

  // Handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    // If dropped in the same column and same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Get source and destination columns
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    
    // If it's the same column
    if (source.droppableId === destination.droppableId) {
      const newItems = Array.from(sourceColumn.items);
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: newItems
        }
      });
    } else {
      // Moving from one column to another
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [movedItem] = sourceItems.splice(source.index, 1);
      
      // Update movedItem with new stage
      const updatedItem = {
        ...movedItem,
        current_stage_id: destination.droppableId === 'unstaged' ? null : parseInt(destination.droppableId)
      };
      
      destItems.splice(destination.index, 0, updatedItem);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
      
      // Update the backend
      router.post(route('manager.applications.update-stage', movedItem.id), {
        stage_id: destination.droppableId === 'unstaged' ? null : destination.droppableId
      }, {
        preserveScroll: true,
        preserveState: true
      });
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    router.get(route('manager.applications.export'), searchParams);
  };

  // Toggle favorite status
  const toggleFavorite = (id) => {
    router.post(route('manager.applications.toggle-favorite-post', id), {}, {
      preserveScroll: true,
      preserveState: true
    });
  };

  // Dropdown menu for the card
  const getCardActions = (application) => [
    {
      label: 'View Application',
      onClick: () => router.visit(route('manager.applications.show', application.id)),
      icon: <Email fontSize="small" />
    },
    {
      label: 'Schedule Interview',
      onClick: () => router.visit(route('manager.events.create', { application_id: application.id })),
      icon: <Event fontSize="small" />
    },
    { divider: true },
    {
      label: application.is_favorite ? 'Remove from Favorites' : 'Add to Favorites',
      onClick: () => toggleFavorite(application.id),
      color: application.is_favorite ? 'warning' : 'inherit',
      icon: application.is_favorite ? <StarBorder fontSize="small" /> : <Star fontSize="small" />
    },
    { divider: true },
    {
      label: 'Download Resume',
      onClick: () => window.open(application.resume_url, '_blank'),
      disabled: !application.resume,
      icon: <FileDownload fontSize="small" />
    }
  ];

  // Calculate application statistics
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(app => app.status?.name === 'Pending').length || 0;
  const interviewingApplications = applications?.filter(app => app.status?.name === 'Interviewing').length || 0;
  const shortlistedApplications = applications?.filter(app => app.status?.name === 'Shortlisted').length || 0;

  return (
    <Layout>
      <Head title="Applications Kanban" />
      
      {/* Header Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(20, 184, 166, 0.15) 100%)',
          py: 4,
          borderRadius: '1rem',
          px: 3,
          mb: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>Kanban Board</Typography>
            <Typography variant="body2" color="text.secondary">
              Visualize and manage applications through different hiring stages using drag-and-drop.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <ButtonGroup 
              variant="outlined" 
              size="small" 
              sx={{ 
                bgcolor: 'background.paper', 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Tooltip title="List View">
                <IconButton 
                  color="default" 
                  onClick={() => router.visit(route('manager.applications.index'))}
                  sx={{ borderRadius: 0 }}
                >
                  <ViewList />
                </IconButton>
              </Tooltip>
              <Tooltip title="Kanban View">
                <IconButton 
                  color="primary"
                  sx={{ borderRadius: 0 }}
                >
                  <DynamicFeed />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
            
            <Tooltip title="Export Applications">
              <Button
                variant="contained"
                startIcon={<FileDownload />}
                onClick={exportToCSV}
                size="small"
                sx={{ borderRadius: '8px' }}
              >
                Export
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MuiCard sx={{ 
              borderRadius: '1rem', 
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
              }
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="text.secondary" variant="body2">Total Applications</Typography>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: '50%', 
                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                  }}>
                    <Badge fontSize="small" color="primary" />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {totalApplications}
                </Typography>
              </CardContent>
            </MuiCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MuiCard sx={{ 
              borderRadius: '1rem', 
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
              }
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="text.secondary" variant="body2">Pending</Typography>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: '50%', 
                    bgcolor: alpha(theme.palette.warning.main, 0.1)
                  }}>
                    <FactCheck fontSize="small" color="warning" />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {pendingApplications}
                </Typography>
              </CardContent>
            </MuiCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MuiCard sx={{ 
              borderRadius: '1rem', 
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
              }
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="text.secondary" variant="body2">Interviewing</Typography>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: '50%', 
                    bgcolor: alpha(theme.palette.info.main, 0.1)
                  }}>
                    <Event fontSize="small" color="info" />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {interviewingApplications}
                </Typography>
              </CardContent>
            </MuiCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MuiCard sx={{ 
              borderRadius: '1rem', 
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
              }
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="text.secondary" variant="body2">Shortlisted</Typography>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: '50%', 
                    bgcolor: alpha(theme.palette.success.main, 0.1)
                  }}>
                    <WorkOutline fontSize="small" color="success" />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color: theme.palette.success.main }}>
                  {shortlistedApplications}
                </Typography>
              </CardContent>
            </MuiCard>
          </Grid>
        </Grid>
      </Box>
      
      {/* Alert Messages */}
      {flash?.success && (
        <Alert
          severity="success"
          title="Success"
          onClose={() => router.reload({ only: ['flash'] })}
          sx={{ mb: 3 }}
        >
          {flash.success}
        </Alert>
      )}

      {/* Filter Bar */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2.5, 
          mb: 3, 
          borderRadius: '1rem',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <SearchBar
              placeholder="Search applicants"
              value={searchParams.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              size="small"
              startIcon={<Search fontSize="small" />}
              sx={{ borderRadius: '0.75rem' }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Select
              options={jobs.map(job => ({ value: job.id, label: job.title }))}
              value={searchParams.job}
              onChange={(e) => handleFilterChange('job', e.target.value)}
              placeholder="Job Position"
              size="small"
              startIcon={<WorkOutline fontSize="small" />}
              sx={{ borderRadius: '0.75rem' }}
            />
          </Grid>
          
          {/* <Grid item xs={12} sm={6} md={3}>
            <Select
              options={statuses.map(status => ({ value: status.id, label: status.name }))}
              value={searchParams.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              placeholder="Status"
              size="small"
              startIcon={<Badge fontSize="small" />}
              sx={{ borderRadius: '0.75rem' }}
            />
          </Grid> */}
          
          <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Stack direction="row" spacing={1}>
              <Tooltip title="More Filters">
                <IconButton 
                  color="primary" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    }
                  }}
                >
                  <Tune />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Refresh">
                <IconButton 
                  color="primary" 
                  onClick={() => router.reload({ only: ['applications'] })}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <Spinner message="Loading applications..." />
        </Box>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              pb: 2,
              pt: 1,
              px: 1,
              minHeight: 'calc(100vh - 460px)',
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 4,
              }
            }}
          >
            {Object.entries(columns).map(([columnId, column]) => (
              <Paper
                key={columnId}
                sx={{
                  minWidth: 320,
                  maxWidth: 320,
                  mx: 1,
                  bgcolor: `${column.color}05`,
                  border: `1px solid ${column.color}30`,
                  borderRadius: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  height: 'fit-content',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
                elevation={0}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: `${column.color}15`,
                    borderBottom: `1px solid ${column.color}30`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" fontWeight="600" color={column.color}>
                      {column.name}
                    </Typography>
                    <Chip
                      label={column.items.length}
                      size="small"
                      sx={{
                        ml: 1,
                        bgcolor: `${column.color}30`,
                        color: column.color,
                        fontWeight: 'bold',
                        height: 20,
                        fontSize: '0.75rem',
                        borderRadius: '10px'
                      }}
                    />
                  </Box>
                </Box>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{
                        p: 2,
                        minHeight: 100,
                        backgroundColor: snapshot.isDraggingOver
                          ? `${column.color}10`
                          : 'transparent',
                        transition: 'background-color 0.2s ease-in-out',
                        height: '100%',
                      }}
                    >
                      {column.items.length === 0 && (
                        <Box 
                          sx={{ 
                            height: 100, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderRadius: '0.75rem',
                            border: '1px dashed',
                            borderColor: `${column.color}40`,
                            p: 2
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" align="center">
                            Drag applications here
                          </Typography>
                        </Box>
                      )}
                      
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <MuiCard
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 2,
                                borderRadius: '0.75rem',
                                boxShadow: snapshot.isDragging
                                  ? '0 8px 16px rgba(0,0,0,0.1)'
                                  : '0 2px 8px rgba(0,0,0,0.05)',
                                transform: snapshot.isDragging
                                  ? 'rotate(1deg) scale(1.02)'
                                  : 'none',
                                transition: 'box-shadow 0.2s, transform 0.2s',
                                border: item.is_favorite 
                                  ? `1px solid ${theme.palette.warning.main}` 
                                  : '1px solid rgba(0,0,0,0.1)',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar
                                      src={item.user?.avatar || '/images/avatars/default.png'}
                                      sx={{ 
                                        width: 40, 
                                        height: 40,
                                        border: '2px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.2),
                                      }}
                                    />
                                    <Box>
                                      <Typography variant="body2" fontWeight="600">
                                        {item.user?.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 180, display: 'block' }}>
                                        {item.user?.email}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {item.is_favorite && (
                                      <Tooltip title="Favorite">
                                        <Star 
                                          fontSize="small" 
                                          sx={{ 
                                            color: theme.palette.warning.main, 
                                            mr: 0.5 
                                          }} 
                                        />
                                      </Tooltip>
                                    )}
                                    <Dropdown
                                      buttonType="icon"
                                      icon={<MoreVert fontSize="small" />}
                                      items={getCardActions(item)}
                                    />
                                  </Box>
                                </Box>
                                
                                <Divider sx={{ my: 1.5 }} />
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <WorkOutline fontSize="small" color="primary" sx={{ mr: 1 }} />
                                  <Tooltip title={item.job?.title}>
                                    <Typography variant="body2" fontWeight="500" noWrap>
                                      {item.job?.title}
                                    </Typography>
                                  </Tooltip>
                                </Box>
                                <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                                  {item.job?.location} • Dilamar {new Date(item.created_at).toLocaleDateString()}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Chip
                                    label={item.status?.name}
                                    size="small"
                                    sx={{
                                      bgcolor: `${item.status?.color}20`,
                                      color: item.status?.color,
                                      fontWeight: 500,
                                      borderRadius: '12px',
                                      fontSize: '0.7rem',
                                      height: 24
                                    }}
                                  />
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <DragIndicator 
                                      fontSize="small" 
                                      sx={{ 
                                        color: theme => alpha(theme.palette.text.secondary, 0.5),
                                        opacity: 0.5,
                                        '&:hover': { opacity: 1 }
                                      }} 
                                    />
                                  </Box>
                                </Box>
                                
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                  <ButtonGroup 
                                    variant="outlined" 
                                    size="small" 
                                    sx={{ 
                                      '& .MuiButtonGroup-grouped': { 
                                        minWidth: 'auto',
                                        borderRadius: '8px',
                                        px: 1
                                      } 
                                    }}
                                  >
                                    <Tooltip title="View Application">
                                      <IconButton 
                                        size="small" 
                                        color="primary"
                                        onClick={() => router.visit(route('manager.applications.show', item.id))}
                                        sx={{ borderRadius: '8px 0 0 8px' }}
                                      >
                                        <Email fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Schedule Interview">
                                      <IconButton 
                                        size="small" 
                                        color="primary"
                                        onClick={() => router.visit(route('manager.events.create', { application_id: item.id }))}
                                        sx={{ borderRadius: '0 8px 8px 0' }}
                                      >
                                        <Event fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </ButtonGroup>
                                </Box>
                              </CardContent>
                            </MuiCard>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            ))}
          </Box>
        </DragDropContext>
      )}
    </Layout>
  );
};

export default KanbanView;