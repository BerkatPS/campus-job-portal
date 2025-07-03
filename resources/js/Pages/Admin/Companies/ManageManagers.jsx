import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Chip,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    alpha,
    useTheme,
    Container,
    Stack,
    Grid,
    Card,
    CardContent,
    Tooltip,
} from '@mui/material';
import {
    Search as SearchIcon,
    ArrowBack as ArrowBackIcon,
    PersonAdd as PersonAddIcon,
    Save as SaveIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import AdminLayout from '@/Layouts/AdminLayout';
import { toast } from 'react-toastify';

export default function ManageManagers({ company, managers, company_managers, primary_manager }) {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedManagers, setSelectedManagers] = useState(company_managers || []);
    const [primaryManager, setPrimaryManager] = useState(primary_manager || null);
    const [allRoles, setAllRoles] = useState(['All Roles', 'Manager']);
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [allCompanies, setAllCompanies] = useState(['All Companies']);
    const [selectedCompany, setSelectedCompany] = useState('All Companies');

    const { data, setData, post, processing, errors } = useForm({
        managers: selectedManagers,
        primary_manager: primaryManager,
    });

    useEffect(() => {
        setData({
            managers: selectedManagers,
            primary_manager: primaryManager,
        });
    }, [selectedManagers, primaryManager]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.companies.update-managers', company.id), {
            onSuccess: () => {
                toast.success('Company managers updated successfully');
            },
        });
    };

    const handleManagerSelection = (managerId) => {
        if (selectedManagers.includes(managerId)) {
            // If removing the primary manager, reset primary manager
            if (primaryManager === managerId) {
                setPrimaryManager(null);
            }
            setSelectedManagers(selectedManagers.filter(id => id !== managerId));
        } else {
            setSelectedManagers([...selectedManagers, managerId]);
        }
    };

    const handlePrimaryManagerSelection = (managerId) => {
        // Ensure the manager is selected first
        if (!selectedManagers.includes(managerId)) {
            setSelectedManagers([...selectedManagers, managerId]);
        }
        setPrimaryManager(managerId);
    };

    const filteredManagers = managers.filter(manager => {
        const matchesSearch = manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            manager.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'All Roles' || true; // All managers have the 'manager' role
        return matchesSearch && matchesRole;
    });

    return (
        <AdminLayout>
            <Head title="Manage Company Managers" />
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Link href={route('admin.companies.show', company.id)}>
                        <IconButton sx={{ mr: 2 }}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                    <Typography variant="h4" component="h1">
                        Company Managers
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<SaveIcon />} 
                        sx={{ ml: 'auto' }} 
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        Save Changes
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                        src={company.logo} 
                        alt={company.name} 
                        sx={{ width: 56, height: 56, mr: 2 }}
                        variant="rounded"
                    >
                        {company.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h5">{company.name}</Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" color="primary">{managers.length}</Typography>
                                <Typography variant="subtitle1">Total Managers</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" color="primary">{managers.filter(manager => selectedManagers.includes(manager.id) && primaryManager === manager.id).length}</Typography>
                                <Typography variant="subtitle1">Primary Managers</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" color="primary">{managers.filter(manager => selectedManagers.includes(manager.id) && primaryManager !== manager.id).length}</Typography>
                                <Typography variant="subtitle1">Secondary Managers</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mb: 2 }}>Manage Company Assignments</Typography>

                <Box sx={{ display: 'flex', mb: 2 }}>
                    <Chip 
                        icon={<PersonAddIcon />} 
                        label={`All Managers (${managers.length})`} 
                        color="primary" 
                        variant="outlined" 
                        sx={{ mr: 2 }}
                    />
                    <Chip 
                        icon={<StarIcon />} 
                        label={`Primary (${managers.filter(manager => selectedManagers.includes(manager.id) && primaryManager === manager.id).length})`} 
                        color="primary" 
                        sx={{ mr: 2 }}
                    />
                    <Chip 
                        icon={<StarBorderIcon />} 
                        label={`Secondary (${managers.filter(manager => selectedManagers.includes(manager.id) && primaryManager !== manager.id).length})`} 
                        color="secondary" 
                    />
                </Box>

                <Box sx={{ display: 'flex', mb: 3 }}>
                    <TextField
                        placeholder="Search for manager name"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        select
                        label="All Companies"
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        SelectProps={{
                            native: true,
                        }}
                        size="small"
                        sx={{ width: 200, mr: 2 }}
                    >
                        {allCompanies.map((company) => (
                            <option key={company} value={company}>
                                {company}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="All Roles"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        SelectProps={{
                            native: true,
                        }}
                        size="small"
                        sx={{ width: 150 }}
                    >
                        {allRoles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </TextField>
                </Box>

                {filteredManagers.length > 0 ? (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {filteredManagers.length} results found
                        </Typography>
                        <Paper variant="outlined">
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                <ListItem sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), py: 1 }}>
                                    <Grid container alignItems="center">
                                        <Grid item xs={3}>
                                            <Typography variant="subtitle2">Manager</Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="subtitle2">Company</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle2">Role</Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="subtitle2">User Role</Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="subtitle2">Status</Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="subtitle2">Added On</Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="subtitle2">Actions</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <Divider />
                                {filteredManagers.map((manager) => {
                                    const isSelected = selectedManagers.includes(manager.id);
                                    const isPrimary = primaryManager === manager.id;
                                    
                                    return (
                                        <React.Fragment key={manager.id}>
                                            <ListItem sx={{ py: 1.5 }}>
                                                <Grid container alignItems="center">
                                                    <Grid item xs={3}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <ListItemAvatar>
                                                                <Avatar src={manager.avatar}>
                                                                    {manager.name.charAt(0)}
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <Box>
                                                                <Typography variant="body1">{manager.name}</Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {manager.email}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar 
                                                                src={company.logo} 
                                                                variant="rounded" 
                                                                sx={{ width: 24, height: 24, mr: 1 }}
                                                            >
                                                                {company.name.charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="body2">{company.name}</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        {isPrimary ? (
                                                            <Chip 
                                                                label="Primary Manager" 
                                                                size="small" 
                                                                color="primary" 
                                                                icon={<StarIcon />} 
                                                            />
                                                        ) : isSelected ? (
                                                            <Chip 
                                                                label="Secondary Manager" 
                                                                size="small" 
                                                                color="secondary" 
                                                                variant="outlined" 
                                                            />
                                                        ) : null}
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <Chip 
                                                            label="Manager" 
                                                            size="small" 
                                                            sx={{ 
                                                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                                                color: theme.palette.info.main,
                                                                borderColor: 'transparent'
                                                            }} 
                                                            variant="outlined" 
                                                        />
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <Chip 
                                                            label="Active" 
                                                            size="small" 
                                                            sx={{ 
                                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                color: theme.palette.success.main,
                                                                borderColor: 'transparent'
                                                            }} 
                                                            variant="outlined" 
                                                        />
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <Typography variant="body2">Jul 3, 2025</Typography>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <Box sx={{ display: 'flex' }}>
                                                            <Tooltip title="View Profile">
                                                                <IconButton size="small" color="info">
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Edit">
                                                                <IconButton size="small" color="primary">
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Remove">
                                                                <IconButton 
                                                                    size="small" 
                                                                    color="error"
                                                                    onClick={() => handleManagerSelection(manager.id)}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            <Box sx={{ display: 'flex', ml: 9, mb: 1 }}>
                                                <Button
                                                    variant={isSelected ? "contained" : "outlined"}
                                                    color={isSelected ? "primary" : "inherit"}
                                                    size="small"
                                                    onClick={() => handleManagerSelection(manager.id)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    {isSelected ? "Selected" : "Select"}
                                                </Button>
                                                {isSelected && (
                                                    <Button
                                                        variant={isPrimary ? "contained" : "outlined"}
                                                        color={isPrimary ? "secondary" : "inherit"}
                                                        size="small"
                                                        startIcon={isPrimary ? <StarIcon /> : <StarBorderIcon />}
                                                        onClick={() => handlePrimaryManagerSelection(manager.id)}
                                                    >
                                                        {isPrimary ? "Primary" : "Set as Primary"}
                                                    </Button>
                                                )}
                                            </Box>
                                            <Divider />
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        </Paper>
                    </Box>
                ) : (
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1">No managers found matching your search criteria.</Typography>
                    </Paper>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<SaveIcon />} 
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </AdminLayout>
    );
}