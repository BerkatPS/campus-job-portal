import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Input from '../Input';
import FormGroup from '../FormGroup';
import DatePicker from '../DatePicker';
import TextArea from '../TextArea';
import {
    Box,
    Chip,
    FormControlLabel,
    Switch,
    Typography,
    Paper,
    Avatar,
    Divider,
    Grid,
    Tooltip,
    alpha
} from '@mui/material';
import {
    AccessTime as TimeIcon,
    Event as EventIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Info as InfoIcon,
    PaletteOutlined as ColorIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const EventModal = ({
                        open,
                        onClose,
                        onSave,
                        onDelete,
                        event,
                        title = 'Tambah Acara',
                        loading = false,
                        readOnly = false,
                        ...props
                    }) => {
    const [formData, setFormData] = useState({
        title: '',
        start: null,
        end: null,
        allDay: false,
        location: '',
        description: '',
        attendees: '',
        color: '#14b8a6'
    });

    useEffect(() => {
        if (event) {
            setFormData({
                id: event.id || null,
                title: event.title || '',
                start: event.start ? new Date(event.start) : null,
                end: event.end ? new Date(event.end) : null,
                allDay: event.allDay || false,
                location: event.location || '',
                description: event.description || '',
                attendees: event.attendees || '',
                color: event.color || '#14b8a6'
            });
        } else {
            // Reset form untuk acara baru
            setFormData({
                title: '',
                start: null,
                end: null,
                allDay: false,
                location: '',
                description: '',
                attendees: '',
                color: '#14b8a6'
            });
        }
    }, [event, open]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'allDay' ? checked : value
        }));
    };

    const handleSave = () => {
        if (typeof onSave === 'function') {
            onSave(formData);
        }
    };

    const handleDelete = () => {
        if (typeof onDelete === 'function' && formData.id) {
            onDelete(formData.id);
        }
    };

    // Updated colors with new design system colors
    const colors = [
        { label: 'Teal', value: '#14b8a6' },
        { label: 'Indigo', value: '#6366f1' },
        { label: 'Red', value: '#ef4444' },
        { label: 'Green', value: '#10b981' },
        { label: 'Amber', value: '#f59e0b' },
        { label: 'Purple', value: '#8b5cf6' }
    ];

    const ColorButton = ({ color, isSelected, onClick }) => (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Tooltip title={color.label}>
                <Box
                    onClick={onClick}
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '12px',
                        backgroundColor: color.value,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: isSelected ? '2px solid white' : 'none',
                        boxShadow: isSelected
                            ? `0 0 0 2px ${color.value}, 0 0 0 4px ${alpha(color.value, 0.3)}`
                            : `0 2px 4px ${alpha('#000', 0.1)}`,
                        transition: 'all 0.2s ease'
                    }}
                >
                    {isSelected && <ColorIcon sx={{ color: 'white', fontSize: 18 }} />}
                </Box>
            </Tooltip>
        </motion.div>
    );

    const InfoItem = ({ icon, title, content }) => (
        <Box className="flex items-start mb-4" sx={{ '&:last-child': { mb: 0 } }}>
            <Avatar
                sx={{
                    bgcolor: alpha(formData.color, 0.1),
                    color: formData.color,
                    width: 42,
                    height: 42,
                    borderRadius: '12px',
                    mr: 2
                }}
            >
                {icon}
            </Avatar>
            <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                    {content}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={event?.id ? (readOnly ? 'Detail Acara' : 'Edit Acara') : title}
            maxWidth="sm"
            confirmButton={!readOnly}
            cancelButton
            confirmText={event?.id ? 'Simpan Perubahan' : 'Simpan'}
            confirmColor="primary"
            onConfirm={handleSave}
            loading={loading}
            {...props}
            footer={
                readOnly ? (
                    <Box className="w-full flex justify-end">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Tutup
                            </button>
                        </motion.div>
                    </Box>
                ) : (
                    <Box className="w-full flex justify-between">
                        {event?.id && (
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                                    disabled={loading}
                                >
                                    Hapus
                                </button>
                            </motion.div>
                        )}
                        <Box className="flex space-x-2">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                                    disabled={loading}
                                >
                                    Batal
                                </button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                                    disabled={loading}
                                >
                                    {event?.id ? 'Simpan Perubahan' : 'Simpan'}
                                </button>
                            </motion.div>
                        </Box>
                    </Box>
                )
            }
        >
            <Box className="space-y-5">
                {readOnly ? (
                    <Box className="space-y-5">
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                borderTop: `4px solid ${formData.color}`,
                                background: alpha(formData.color, 0.03)
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                                {formData.title}
                            </Typography>

                            {formData.start && (
                                <InfoItem
                                    icon={<EventIcon />}
                                    title="Tanggal"
                                    content={
                                        <>
                                            {formData.start.toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                            {formData.allDay ? ' (Seharian)' : (
                                                <>
                                                    {' '}
                                                    {formData.start.toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                    {formData.end && (
                                                        <>
                                                            {' - '}
                                                            {formData.end.toLocaleTimeString('id-ID', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    }
                                />
                            )}

                            {formData.location && (
                                <InfoItem
                                    icon={<LocationIcon />}
                                    title="Lokasi"
                                    content={formData.location}
                                />
                            )}

                            {formData.attendees && (
                                <InfoItem
                                    icon={<PersonIcon />}
                                    title="Peserta"
                                    content={formData.attendees}
                                />
                            )}

                            {formData.description && (
                                <InfoItem
                                    icon={<InfoIcon />}
                                    title="Deskripsi"
                                    content={formData.description}
                                />
                            )}
                        </Paper>
                    </Box>
                ) : (
                    <>
                        <FormGroup>
                            <Input
                                label="Judul Acara"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                disabled={readOnly}
                                placeholder="Masukkan judul acara"
                                variant="outlined"
                                InputProps={{
                                    sx: { borderRadius: '12px' }
                                }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.allDay}
                                        onChange={handleChange}
                                        name="allDay"
                                        disabled={readOnly}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Typography variant="body2" fontWeight={500}>
                                        Seharian
                                    </Typography>
                                }
                            />
                        </FormGroup>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormGroup>
                                    <DatePicker
                                        label="Tanggal Mulai"
                                        name="start"
                                        value={formData.start}
                                        onChange={(date) => setFormData(prev => ({ ...prev, start: date }))}
                                        required
                                        showTimeSelect={!formData.allDay}
                                        dateFormat={formData.allDay ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}
                                        timeFormat="HH:mm"
                                        disabled={readOnly}
                                        startIcon={<EventIcon />}
                                        InputProps={{
                                            sx: { borderRadius: '12px' }
                                        }}
                                    />
                                </FormGroup>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormGroup>
                                    <DatePicker
                                        label="Tanggal Selesai"
                                        name="end"
                                        value={formData.end}
                                        onChange={(date) => setFormData(prev => ({ ...prev, end: date }))}
                                        showTimeSelect={!formData.allDay}
                                        dateFormat={formData.allDay ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}
                                        timeFormat="HH:mm"
                                        disabled={readOnly}
                                        startIcon={<EventIcon />}
                                        minDate={formData.start}
                                        InputProps={{
                                            sx: { borderRadius: '12px' }
                                        }}
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>

                        <FormGroup>
                            <Input
                                label="Lokasi"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                disabled={readOnly}
                                placeholder="Masukkan lokasi acara"
                                startIcon={<LocationIcon />}
                                InputProps={{
                                    sx: { borderRadius: '12px' }
                                }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Input
                                label="Peserta"
                                name="attendees"
                                value={formData.attendees}
                                onChange={handleChange}
                                disabled={readOnly}
                                placeholder="Nama peserta (pisahkan dengan koma)"
                                startIcon={<PersonIcon />}
                                InputProps={{
                                    sx: { borderRadius: '12px' }
                                }}
                            />
                        </FormGroup>

                        <FormGroup label="Warna">
                            <Box className="flex gap-2 pt-2">
                                {colors.map(color => (
                                    <ColorButton
                                        key={color.value}
                                        color={color}
                                        isSelected={formData.color === color.value}
                                        onClick={() => !readOnly && setFormData(prev => ({ ...prev, color: color.value }))}
                                    />
                                ))}
                            </Box>
                        </FormGroup>

                        <FormGroup>
                            <TextArea
                                label="Deskripsi"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={readOnly}
                                placeholder="Masukkan detail acara"
                                rows={4}
                                InputProps={{
                                    sx: { borderRadius: '12px' }
                                }}
                            />
                        </FormGroup>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default EventModal;
