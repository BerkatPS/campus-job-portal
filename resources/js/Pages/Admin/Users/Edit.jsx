import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link, Head } from '@inertiajs/react';
import {
    Box,
    Typography,
    Divider,
    Stack,
    Avatar,
} from '@mui/material';
import {
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Badge as BadgeIcon,
    VpnKey as PasswordIcon,
} from '@mui/icons-material';

// Import custom components
import Card from '@/Components/Shared/Card';
import Button from '@/Components/Shared/Button';
import Input from '@/Components/Shared/Input';
import FormGroup from '@/Components/Shared/FormGroup';
import Select from '@/Components/Shared/Select';
import FileUpload from '@/Components/Shared/FileUpload';
import Checkbox from '@/Components/Shared/Checkbox';
import Alert from '@/Components/Shared/Alert';
import Layout from '@/Components/Layout/Layout';

const UserEdit = ({ user = {}, roles = [] }) => {
    const { auth } = usePage().props;
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT', // For method spoofing in Laravel
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role_id: user?.role_id || '',
        avatar: null, // We'll only submit this if a new image is uploaded
        is_active: user?.is_active || false,
        nim: user?.nim || '',
    });

    useEffect(() => {
        // Check for flash messages from the backend
        const { flash } = usePage().props;
        if (flash?.message) {
            setAlertMessage(flash.message);
            setAlertSeverity(flash.type || 'success');
            setShowAlert(true);

            // Auto-hide the alert after 5 seconds
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('admin.users.update', user?.id), {
            onSuccess: () => {
                setAlertMessage('User updated successfully.');
                setAlertSeverity('success');
                setShowAlert(true);
            },
            onError: (errors) => {
                setAlertMessage('Please check the form for errors.');
                setAlertSeverity('error');
                setShowAlert(true);

                // Scroll to top to see the alert
                window.scrollTo(0, 0);
            },
        });
    };

    const handleFileChange = (e) => {
        setData('avatar', e.target.files[0]);
    };

    const togglePasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
        if (!showPasswordFields) {
            // Reset password fields when showing them
            setData({
                ...data,
                password: '',
                password_confirmation: ''
            });
        }
    };

    return (
        <Layout>
            <Head title={`Edit User: ${user?.name || ''}`} />

            {showAlert && (
                <Alert
                    severity={alertSeverity}
                    onClose={() => setShowAlert(false)}
                    sx={{ mb: 2 }}
                >
                    {alertMessage}
                </Alert>
            )}

            <Card
                title={`Edit User: ${user?.name || ''}`}
                icon={<PersonIcon />}
                action={
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        component={Link}
                        href={route('admin.users.index')}
                    >
                        Back to Users
                    </Button>
                }
            >
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormGroup label="Basic Information" marginBottom="large">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Input
                                label="Full Name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                error={errors.name}
                                helperText={errors.name}
                                fullWidth
                                placeholder="Enter user's full name"
                                startIcon={<PersonIcon />}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    error={errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                    placeholder="Enter email address"
                                    startIcon={<EmailIcon />}
                                />
                                <Input
                                    label="NIM/Student ID"
                                    name="nim"
                                    value={data.nim}
                                    onChange={(e) => setData('nim', e.target.value)}
                                    error={errors.nim}
                                    helperText={errors.nim || "Only needed for student accounts"}
                                    fullWidth
                                    placeholder="Enter NIM if applicable"
                                    startIcon={<BadgeIcon />}
                                />
                            </Box>
                        </Box>
                    </FormGroup>

                    {showPasswordFields ? (
                        <FormGroup label="Update Password" marginBottom="large">
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Input
                                    label="New Password"
                                    name="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    helperText={errors.password || "Leave blank to keep current password"}
                                    fullWidth
                                    startIcon={<LockIcon />}
                                />
                                <Input
                                    label="Confirm New Password"
                                    name="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    error={errors.password_confirmation}
                                    helperText={errors.password_confirmation}
                                    fullWidth
                                    startIcon={<LockIcon />}
                                />
                                <Button
                                    variant="text"
                                    color="primary"
                                    onClick={togglePasswordFields}
                                    size="small"
                                >
                                    Cancel Password Change
                                </Button>
                            </Box>
                        </FormGroup>
                    ) : (
                        <Box sx={{ mb: 3 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={togglePasswordFields}
                                startIcon={<PasswordIcon />}
                            >
                                Change Password
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormGroup label="Profile Picture" marginBottom="large">
                            {user?.avatar && (
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Avatar
                                        src={user.avatar}
                                        alt={user?.name || ''}
                                        sx={{ width: 120, height: 120, mb: 2 }}
                                    />
                                </Box>
                            )}

                            <FileUpload
                                name="avatar"
                                accept="image/*"
                                maxSize={2} // in MB
                                onChange={handleFileChange}
                                error={errors.avatar}
                                helperText={errors.avatar || "Upload new profile picture to replace the current one (max 2MB)"}
                                dragAndDrop
                                showPreview
                            />
                        </FormGroup>

                        <FormGroup label="Role & Status" marginBottom="large">
                            <Select
                                label="Role"
                                name="role_id"
                                value={data.role_id}
                                onChange={(e) => setData('role_id', e.target.value)}
                                options={(roles || []).map(role => ({
                                    value: role.id,
                                    label: role.name,
                                    description: role.description
                                }))}
                                required
                                error={errors.role_id}
                                helperText={errors.role_id}
                            />
                            <Checkbox
                                label="Active Account"
                                name="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                helperText="Inactive accounts cannot log in to the system"
                            />
                        </FormGroup>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => {
                                setData({
                                    _method: 'PUT',
                                    name: user?.name || '',
                                    email: user?.email || '',
                                    password: '',
                                    password_confirmation: '',
                                    role_id: user?.role_id || '',
                                    avatar: null,
                                    is_active: user?.is_active || false,
                                    nim: user?.nim || '',
                                });
                                setShowPasswordFields(false);
                            }}
                            disabled={processing}
                        >
                            Reset
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            loading={processing}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Layout>
    );
};

export default UserEdit;
