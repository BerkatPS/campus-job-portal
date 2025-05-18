import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Badge,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    IconButton,
    Paper,
} from '@mui/material';
import {
    Search as SearchIcon,
    Email as EmailIcon,
    Archive as ArchiveIcon,
    FilterList as FilterListIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';
import Layout from '@/Components/Layout/Layout';
import { motion } from 'framer-motion';

const MessagesIndex = ({ conversations, filters }) => {
    const { data, setData, get, processing } = useForm({
        query: filters.query || '',
        filter: filters.filter || 'all',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('candidate.messages.index'), {
            preserveState: true,
        });
    };

    const handleFilterChange = (e) => {
        setData('filter', e.target.value);
        get(route('candidate.messages.index'), {
            data: {
                ...data,
                filter: e.target.value,
            },
            preserveState: true,
        });
    };

    return (
        <Layout>
            <Head title="Pesan" />

            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Typography variant="h4" component="h1" fontWeight="bold">
                                Pesan
                            </Typography>
                            <Button
                                component={Link}
                                href={route('candidate.messages.create')}
                                variant="contained"
                                startIcon={<AddIcon />}
                            >
                                Pesan Baru
                            </Button>
                        </Box>

                        <Paper elevation={2} sx={{ mb: 4, p: 2, borderRadius: '0.75rem' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <form onSubmit={handleSearch}>
                                        <TextField
                                            fullWidth
                                            placeholder="Cari pesan..."
                                            value={data.query}
                                            onChange={e => setData('query', e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton type="submit" edge="end">
                                                            <SearchIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ borderRadius: '15px' }}
                                        />
                                    </form>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="filter-label">Filter</InputLabel>
                                        <Select
                                            labelId="filter-label"
                                            value={data.filter}
                                            onChange={handleFilterChange}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <FilterListIcon />
                                                </InputAdornment>
                                            }
                                            label="Filter"
                                        >
                                            <MenuItem value="all">Semua Pesan</MenuItem>
                                            <MenuItem value="unread">Belum Dibaca</MenuItem>
                                            <MenuItem value="archived">Diarsipkan</MenuItem>
                                            <MenuItem value="unarchived">Tidak Diarsipkan</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Card elevation={3} sx={{ borderRadius: '0.75rem' }}>
                            <CardContent sx={{ p: 0 }}>
                                {conversations.data.length > 0 ? (
                                    <List sx={{ width: '100%', p: 0 }}>
                                        {conversations.data.map((conversation, index) => (
                                            <React.Fragment key={conversation.id}>
                                                <ListItem
                                                    component={Link}
                                                    href={route('candidate.messages.show', conversation.id)}
                                                    alignItems="flex-start"
                                                    sx={{
                                                        p: 3,
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        backgroundColor: conversation.unread_count > 0 ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                        },
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Badge
                                                            badgeContent={conversation.unread_count}
                                                            color="primary"
                                                            max={99}
                                                            overlap="circular"
                                                        >
                                                            <Avatar
                                                                alt={conversation.manager?.name}
                                                                src={conversation.manager?.avatar}
                                                            >
                                                                {conversation.manager?.name.charAt(0)}
                                                            </Avatar>
                                                        </Badge>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="subtitle1" fontWeight={conversation.unread_count > 0 ? 'bold' : 'normal'}>
                                                                    {conversation.manager?.name}
                                                                    {conversation.is_archived && (
                                                                        <ArchiveIcon sx={{ ml: 1, fontSize: '0.875rem', color: 'text.secondary' }} />
                                                                    )}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {formatDistance(new Date(conversation.last_message_at), new Date(), {
                                                                        addSuffix: true,
                                                                        locale: id,
                                                                    })}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                    fontWeight={conversation.unread_count > 0 ? 'bold' : 'normal'}
                                                                >
                                                                    {conversation.subject}
                                                                </Typography>
                                                                <Typography
                                                                    component="div"
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                    }}
                                                                >
                                                                    {conversation.job && (
                                                                        <Typography
                                                                            component="span"
                                                                            variant="body2"
                                                                            color="primary"
                                                                            sx={{ fontWeight: 'medium', mr: 1 }}
                                                                        >
                                                                            [{conversation.job.title}]
                                                                        </Typography>
                                                                    )}
                                                                    {conversation.messages && conversation.messages[0]?.body}
                                                                </Typography>
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                                {index < conversations.data.length - 1 && <Divider component="li" />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                ) : (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <EmailIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6">Tidak ada pesan</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {data.filter === 'unread'
                                                ? 'Semua pesan telah dibaca'
                                                : data.filter === 'archived'
                                                ? 'Tidak ada pesan yang diarsipkan'
                                                : 'Mulai percakapan dengan rekruter'}
                                        </Typography>
                                        <Button
                                            component={Link}
                                            href={route('candidate.messages.create')}
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                        >
                                            Pesan Baru
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {conversations.data.length > 0 && conversations.links && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                {conversations.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        component={Link}
                                        href={link.url || '#'}
                                        disabled={!link.url}
                                        variant={link.active ? 'contained' : 'outlined'}
                                        sx={{ mx: 0.5 }}
                                    >
                                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </motion.div>
                </Box>
            </Container>
        </Layout>
    );
};

export default MessagesIndex;
