import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Box, Divider, Chip } from '@mui/material';
import { 
    Search as SearchIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    BusinessCenter as BusinessIcon,
    Close as CloseIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import Button from './Button';

const SearchBar = ({
    onSearch,
    placeholder = 'Cari lowongan, perusahaan, atau keahlian...',
    advanced = false,
    initialValues = {
        keyword: '',
        location: '',
        jobType: '',
        category: ''
    },
    filters = [],
    className,
    fullWidth,
    size,
    ...props
}) => {
    const [searchValues, setSearchValues] = useState(initialValues);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof onSearch === 'function') {
            onSearch(searchValues);
        }
    };

    const handleFilterSelect = (filter) => {
        if (activeFilters.includes(filter.id)) {
            setActiveFilters(prev => prev.filter(id => id !== filter.id));
        } else {
            setActiveFilters(prev => [...prev, filter.id]);
        }
    };

    const handleClearAll = () => {
        setSearchValues(initialValues);
        setActiveFilters([]);
    };

    // Extract non-DOM props
    const paperProps = { ...props };
    delete paperProps.fullWidth;

    return (
        <Paper
            component="form"
            elevation={3}
            onSubmit={handleSubmit}
            className={className}
            sx={{
                overflow: 'hidden',
                borderRadius: '8px',
                width: fullWidth ? '100%' : 'auto',
                ...props.sx
            }}
            {...paperProps}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <IconButton type="submit" sx={{ p: 2 }} aria-label="cari">
                    <SearchIcon />
                </IconButton>
                
                <InputBase
                    sx={{ ml: 2, flex: 1 }}
                    placeholder={placeholder}
                    name="keyword"
                    value={searchValues.keyword}
                    onChange={handleChange}
                    fullWidth
                />
                
                {advanced && (
                    <IconButton 
                        sx={{ p: 2, color: 'primary.main' }}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FilterIcon />
                    </IconButton>
                )}
                
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    sx={{ ml: 2 }}
                    size={size || "small"}
                >
                    Cari
                </Button>
            </Box>
            
            {advanced && showFilters && (
                <>
                    <Divider />
                    <Box sx={{ 
                        p: 3, 
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                            ? theme.palette.grey[900] 
                            : theme.palette.grey[50]
                    }}>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
                            gap: 3 
                        }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                bgcolor: 'background.paper', 
                                borderRadius: 1, 
                                px: 3, 
                                py: 2, 
                                border: 1, 
                                borderColor: 'divider' 
                            }}>
                                <LocationIcon sx={{ color: 'text.secondary', mr: 2 }} fontSize="small" />
                                <InputBase
                                    placeholder="Lokasi"
                                    name="location"
                                    value={searchValues.location}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ fontSize: '0.875rem' }}
                                />
                            </Box>
                            
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                bgcolor: 'background.paper', 
                                borderRadius: 1, 
                                px: 3, 
                                py: 2, 
                                border: 1, 
                                borderColor: 'divider' 
                            }}>
                                <WorkIcon sx={{ color: 'text.secondary', mr: 2 }} fontSize="small" />
                                <InputBase
                                    placeholder="Tipe Pekerjaan"
                                    name="jobType"
                                    value={searchValues.jobType}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ fontSize: '0.875rem' }}
                                />
                            </Box>
                            
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                bgcolor: 'background.paper', 
                                borderRadius: 1, 
                                px: 3, 
                                py: 2, 
                                border: 1, 
                                borderColor: 'divider' 
                            }}>
                                <BusinessIcon sx={{ color: 'text.secondary', mr: 2 }} fontSize="small" />
                                <InputBase
                                    placeholder="Kategori"
                                    name="category"
                                    value={searchValues.category}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ fontSize: '0.875rem' }}
                                />
                            </Box>
                        </Box>
                        
                        {filters.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" fontWeight="medium" color="text.secondary">
                                        Filter
                                    </Typography>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        size="small"
                                        onClick={handleClearAll}
                                    >
                                        Hapus Semua
                                    </Button>
                                </Box>
                                
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {filters.map(filter => (
                                        <Chip
                                            key={filter.id}
                                            label={filter.label}
                                            clickable
                                            color={activeFilters.includes(filter.id) ? "primary" : "default"}
                                            onClick={() => handleFilterSelect(filter)}
                                            variant={activeFilters.includes(filter.id) ? "filled" : "outlined"}
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </>
            )}
            
            {advanced && activeFilters.length > 0 && (
                <Box sx={{ 
                    px: 3, 
                    py: 2, 
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), 
                    display: 'flex', 
                    alignItems: 'center' 
                }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                        Filter Aktif:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {activeFilters.map(filterId => {
                            const filter = filters.find(f => f.id === filterId);
                            return filter ? (
                                <Chip
                                    key={filter.id}
                                    label={filter.label}
                                    size="small"
                                    onDelete={() => handleFilterSelect(filter)}
                                    deleteIcon={<CloseIcon fontSize="small" />}
                                    sx={{ fontSize: '0.75rem' }}
                                />
                            ) : null;
                        })}
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

export default SearchBar; 