import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    LinearProgress,
    Paper,
    alpha,
    useTheme,
    IconButton,
    Tooltip,
    Alert
} from '@mui/material';
import {
    CloudUpload,
    Check,
    Error as ErrorIcon,
    Delete,
    InsertDriveFile,
    PictureAsPdf,
    Description,
    Image,
    AttachFile,
    Upload
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// File type icons mapping - enhanced with db-specific types
const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return <Image color="info" />;
    if (fileType === 'application/pdf') return <PictureAsPdf color="error" />;
    if (fileType?.includes('word') || fileType?.includes('document')) return <Description color="primary" />;
    if (fileType?.includes('csv') || fileType?.includes('excel') || fileType?.includes('spreadsheet'))
        return <Description color="success" />;
    return <InsertDriveFile color="action" />;
};

// Format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get appropriate upload endpoint based on upload type
const getUploadEndpoint = (uploadType) => {
    const endpoints = {
        'resume': '/api/candidate-profiles/upload-resume',
        'companyLogo': '/api/companies/upload-logo',
        'avatar': '/api/users/upload-avatar',
        'jobApplication': '/api/job-applications/upload-resume', // This is the problematic endpoint
        'formResponse': '/api/form-responses/upload-attachment',
        'default': '/api/uploads'
    };

    return endpoints[uploadType] || endpoints.default;
};

const FileUpload = ({
                        name,
                        label,
                        accept = '.pdf,.doc,.docx',
                        maxSize = 5, // In MB
                        value,
                        onChange,
                        error,
                        helperText,
                        className,
                        borderRadius = 'medium', // 'small', 'medium', 'large'
                        dragAndDrop = true,
                        variant = 'outlined', // 'outlined', 'filled', 'glass'
                        multiple = false,
                        showProgress = true,
                        showPreview = true,
                        previewType = 'inline', // 'inline', 'list'
                        uploadType = 'default', // 'resume', 'companyLogo', 'avatar', 'jobApplication', 'formResponse'
                        entity = {}, // Associated entity data (user_id, company_id, job_id, etc.)
                        onUploadComplete,
                        autoUpload = false, // Automatically upload file after selection
                        required = false,
                        showUploadButton = false, // Show a separate upload button instead of auto-uploading
                        disabled = false,
                        ...props
                    }) => {
    const theme = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [filePreview, setFilePreview] = useState(value || (multiple ? [] : null));
    const [fileError, setFileError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadResponse, setUploadResponse] = useState(null);

    const fileInputRef = useRef(null);

    // Initialize file preview from value
    useEffect(() => {
        if (value) {
            setFilePreview(value);
        }
    }, [value]);

    // Calculate border radius based on prop
    const getBorderRadius = () => {
        switch (borderRadius) {
            case 'small': return '8px';
            case 'medium': return '16px';
            case 'large': return '24px';
            default: return '16px';
        }
    };

    // Get styles based on variant
    const getContainerStyles = () => {
        const radius = getBorderRadius();
        const baseStyles = {
            borderRadius: radius,
            transition: 'all 0.2s ease-in-out',
            cursor: disabled ? 'not-allowed' : 'pointer',
            position: 'relative',
            padding: theme.spacing(3),
            textAlign: 'center',
            opacity: disabled ? 0.7 : 1,
        };

        switch (variant) {
            case 'filled':
                return {
                    ...baseStyles,
                    backgroundColor: isDragging
                        ? alpha(theme.palette.primary.main, 0.08)
                        : theme.palette.grey[50],
                    border: '2px dashed transparent',
                    '&:hover': !disabled ? {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    } : {}
                };
            case 'glass':
                return {
                    ...baseStyles,
                    backdropFilter: 'blur(8px)',
                    backgroundColor: isDragging
                        ? alpha(theme.palette.primary.main, 0.08)
                        : alpha(theme.palette.background.paper, 0.7),
                    border: `2px dashed ${isDragging
                        ? theme.palette.primary.main
                        : alpha(theme.palette.divider, 0.5)
                    }`,
                    '&:hover': !disabled ? {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        borderColor: theme.palette.primary.light,
                    } : {}
                };
            case 'outlined':
            default:
                return {
                    ...baseStyles,
                    backgroundColor: isDragging
                        ? alpha(theme.palette.primary.main, 0.05)
                        : 'transparent',
                    border: `2px dashed ${isDragging
                        ? theme.palette.primary.main
                        : theme.palette.divider
                    }`,
                    '&:hover': !disabled ? {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    } : {}
                };
        }
    };

    const handleDragEnter = (e) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();
    };

    const validateFile = (file) => {
        // Check file type
        const fileType = file.type;
        const validTypes = accept.split(',').map(type => type.trim());

        if (!validTypes.some(type => {
            // Handle wildcards like .pdf or image/*
            if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
            } else {
                return fileType.match(type);
            }
        })) {
            return `File type must be ${accept}`;
        }

        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            return `File size must be less than ${maxSize}MB`;
        }

        return null;
    };

    const handleFileChange = (e) => {
        if (disabled) return;

        if (multiple) {
            const files = Array.from(e.target.files);
            processMultipleFiles(files);
        } else {
            const file = e.target.files[0];
            if (file) {
                processFile(file);

                // Auto upload if enabled
                if (autoUpload) {
                    uploadFile(file);
                }
            }
        }
    };

    const handleDrop = (e) => {
        if (disabled) return;

        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (multiple) {
                const files = Array.from(e.dataTransfer.files);
                processMultipleFiles(files);

                // Auto upload if enabled
                if (autoUpload) {
                    uploadFiles(files);
                }
            } else {
                const file = e.dataTransfer.files[0];
                processFile(file);

                // Auto upload if enabled
                if (autoUpload) {
                    uploadFile(file);
                }
            }
        }
    };

    const processMultipleFiles = (files) => {
        if (!files.length) return;

        // Check all files for errors
        const errors = files.map(file => validateFile(file));
        const hasError = errors.some(error => error !== null);

        if (hasError) {
            const firstError = errors.find(error => error !== null);
            setFileError(firstError);
            return;
        }

        setFileError('');

        // Process files
        const filePreviews = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            file
        }));

        setFilePreview(filePreviews);

        // Call onChange with the files
        if (onChange) {
            onChange(files);
        }
    };

    const processFile = (file) => {
        if (!file) return;

        const error = validateFile(file);
        if (error) {
            setFileError(error);
            return;
        }

        setFileError('');

        // Process file
        const preview = {
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            file
        };

        setFilePreview(preview);

        // Call onChange with the file
        if (onChange) {
            onChange(file);
        }
    };

    const uploadFile = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        // Add entity data to formData
        Object.keys(entity).forEach(key => {
            formData.append(key, entity[key]);
        });

        const endpoint = getUploadEndpoint(uploadType);

        try {
            setIsUploading(true);
            setUploadProgress(0);
            setUploadSuccess(false);

            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            setUploadSuccess(true);
            setUploadResponse(response.data);

            // Call onUploadComplete callback with response
            if (onUploadComplete) {
                onUploadComplete(response.data);
            }

            // Update file preview with server response data
            if (response.data && response.data.filePath) {
                setFilePreview(prev => ({
                    ...prev,
                    url: response.data.filePath,
                    uploaded: true,
                    id: response.data.id
                }));
            }
        } catch (error) {
            console.error('Upload error:', error);
            setFileError(error.response?.data?.message || 'Error uploading file');
        } finally {
            setIsUploading(false);
        }
    };

    const uploadFiles = async (files) => {
        if (!files || !files.length) return;

        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        // Add entity data to formData
        Object.keys(entity).forEach(key => {
            formData.append(key, entity[key]);
        });

        const endpoint = getUploadEndpoint(uploadType);

        try {
            setIsUploading(true);
            setUploadProgress(0);
            setUploadSuccess(false);

            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            setUploadSuccess(true);
            setUploadResponse(response.data);

            // Call onUploadComplete callback with response
            if (onUploadComplete) {
                onUploadComplete(response.data);
            }

            // Update file previews with server response data
            if (response.data && response.data.files) {
                const updatedPreviews = filePreview.map((preview, index) => ({
                    ...preview,
                    url: response.data.files[index]?.filePath || preview.url,
                    uploaded: true,
                    id: response.data.files[index]?.id
                }));
                setFilePreview(updatedPreviews);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setFileError(error.response?.data?.message || 'Error uploading files');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveFile = (fileToRemove, event) => {
        if (disabled) return;

        event.stopPropagation();

        if (multiple && Array.isArray(filePreview)) {
            const updatedFiles = filePreview.filter(file => file !== fileToRemove);
            setFilePreview(updatedFiles);

            // Call onChange with updated files list
            if (onChange) {
                const updatedFilesList = updatedFiles.map(file => file.file);
                onChange(updatedFilesList);
            }
        } else {
            setFilePreview(null);
            setUploadSuccess(false);
            setUploadResponse(null);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Call onChange with no file
            if (onChange) {
                onChange(null);
            }
        }
    };

    const handleUploadClick = () => {
        if (disabled || isUploading) return;

        if (multiple && Array.isArray(filePreview) && filePreview.length > 0) {
            const files = filePreview.map(f => f.file);
            uploadFiles(files);
        } else if (!multiple && filePreview) {
            uploadFile(filePreview.file);
        }
    };

    const renderFilePreview = () => {
        if (multiple && Array.isArray(filePreview)) {
            if (!filePreview.length) return null;

            if (previewType === 'list') {
                return (
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 2,
                            p: 1,
                            borderRadius: getBorderRadius(),
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        {filePreview.map((file, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 1,
                                    mb: index < filePreview.length - 1 ? 1 : 0,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                                }}
                            >
                                <Box sx={{
                                    p: 1,
                                    borderRadius: '8px',
                                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                                    mr: 2
                                }}>
                                    {getFileIcon(file.type)}
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }} noWrap>
                                        {file.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatFileSize(file.size)}
                                    </Typography>
                                </Box>

                                {file.uploaded && (
                                    <Box sx={{ mx: 1 }}>
                                        <Tooltip title="Uploaded successfully">
                                            <Check color="success" />
                                        </Tooltip>
                                    </Box>
                                )}

                                <Tooltip title="Remove file">
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={(e) => handleRemoveFile(file, e)}
                                        sx={{ ml: 1 }}
                                        disabled={disabled || isUploading}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ))}
                    </Paper>
                );
            }

            // Default inline preview
            return (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {filePreview.map((file, index) => (
                        <Paper
                            key={index}
                            elevation={1}
                            sx={{
                                p: 1,
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                bgcolor: file.uploaded
                                    ? alpha(theme.palette.success.main, 0.05)
                                    : alpha(theme.palette.primary.main, 0.05),
                                border: `1px solid ${file.uploaded
                                    ? alpha(theme.palette.success.main, 0.2)
                                    : alpha(theme.palette.primary.main, 0.1)}`,
                            }}
                        >
                            {getFileIcon(file.type)}
                            <Typography variant="body2" sx={{ fontWeight: 500, mx: 1 }} noWrap>
                                {file.name}
                            </Typography>

                            {file.uploaded && (
                                <Box sx={{ mr: 0.5 }}>
                                    <Tooltip title="Uploaded successfully">
                                        <Check color="success" />
                                    </Tooltip>
                                </Box>
                            )}

                            <IconButton
                                size="small"
                                onClick={(e) => handleRemoveFile(file, e)}
                                sx={{
                                    ml: 0.5,
                                    p: 0.5,
                                    color: theme.palette.grey[600],
                                    '&:hover': {
                                        color: theme.palette.error.main,
                                        bgcolor: alpha(theme.palette.error.main, 0.1)
                                    }
                                }}
                                disabled={disabled || isUploading}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Paper>
                    ))}
                </Box>
            );
        } else if (!multiple && filePreview) {
            // Single file preview
            return (
                <Paper
                    elevation={1}
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: getBorderRadius(),
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: filePreview.uploaded
                            ? alpha(theme.palette.success.main, 0.05)
                            : alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${filePreview.uploaded
                            ? alpha(theme.palette.success.main, 0.2)
                            : alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                >
                    {filePreview.type?.startsWith('image/') ? (
                        <Box
                            component="img"
                            src={filePreview.url}
                            alt="Preview"
                            sx={{
                                height: 48,
                                width: 48,
                                objectFit: 'cover',
                                borderRadius: '8px',
                                mr: 2,
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                height: 48,
                                width: 48,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                mr: 2,
                            }}
                        >
                            {getFileIcon(filePreview.type)}
                        </Box>
                    )}

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }} noWrap>
                            {filePreview.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatFileSize(filePreview.size)}
                        </Typography>
                    </Box>

                    {filePreview.uploaded && (
                        <Box sx={{ mx: 1 }}>
                            <Tooltip title="Uploaded successfully">
                                <Check color="success" />
                            </Tooltip>
                        </Box>
                    )}

                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => handleRemoveFile(filePreview, e)}
                        startIcon={<Delete />}
                        sx={{ borderRadius: 2, ml: 2 }}
                        disabled={disabled || isUploading}
                    >
                        Remove
                    </Button>
                </Paper>
            );
        }

        return null;
    };

    // Filter out props that shouldn't be passed directly to the input element
    const allowedInputProps = { ...props };
    const disallowedProps = ['onFileSelect'];
    disallowedProps.forEach(prop => {
        if (prop in allowedInputProps) {
            delete allowedInputProps[prop];
        }
    });

    return (
        <Box className={className || ''}>
            {label && (
                <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {label} {required && <span style={{ color: theme.palette.error.main }}>*</span>}
                    </Typography>
                </Box>
            )}

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Box
                        sx={getContainerStyles()}
                        onDragEnter={dragAndDrop && !disabled ? handleDragEnter : undefined}
                        onDragLeave={dragAndDrop && !disabled ? handleDragLeave : undefined}
                        onDragOver={dragAndDrop && !disabled ? handleDragOver : undefined}
                        onDrop={dragAndDrop && !disabled ? handleDrop : undefined}
                        onClick={() => !disabled && fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            name={name}
                            accept={accept}
                            onChange={handleFileChange}
                            multiple={multiple}
                            style={{ display: 'none' }}
                            disabled={disabled}
                            {...allowedInputProps}
                        />

                        {isUploading ? (
                            <Box sx={{ py: 2, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
                                {showProgress && (
                                    <>
                                        <LinearProgress
                                            variant="determinate"
                                            value={uploadProgress}
                                            sx={{
                                                width: '100%',
                                                height: 8,
                                                borderRadius: 4,
                                                mb: 1
                                            }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            Uploading... {uploadProgress}%
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        ) : (
                            <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <CloudUpload
                                        sx={{
                                            fontSize: 48,
                                            mb: 2,
                                            color: isDragging
                                                ? theme.palette.primary.main
                                                : theme.palette.grey[400],
                                            opacity: disabled ? 0.5 : 1
                                        }}
                                    />
                                </motion.div>
                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                    {disabled
                                        ? 'Upload disabled'
                                        : (dragAndDrop
                                            ? 'Drag and drop files here or click to browse'
                                            : 'Click to browse files')}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Supported formats: {accept} (Max: {maxSize}MB)
                                </Typography>
                                {multiple && !disabled && (
                                    <Typography variant="caption" color="primary" sx={{ mt: 1, fontWeight: 500 }}>
                                        You can upload multiple files
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </motion.div>
            </AnimatePresence>

            {/* Show upload button if requested */}
            {showUploadButton && filePreview && !isUploading && (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Upload />}
                    onClick={handleUploadClick}
                    sx={{ mt: 2, borderRadius: 2 }}
                    fullWidth
                    disabled={disabled || (multiple ? filePreview.length === 0 : !filePreview) || isUploading}
                >
                    Upload {multiple && Array.isArray(filePreview) ? `${filePreview.length} files` : 'file'}
                </Button>
            )}

            {/* File preview section */}
            {showPreview && renderFilePreview()}

            {/* Success message */}
            {uploadSuccess && (
                <Alert
                    severity="success"
                    sx={{ mt: 2, borderRadius: getBorderRadius() }}
                    onClose={() => setUploadSuccess(false)}
                >
                    File{multiple ? 's' : ''} uploaded successfully!
                </Alert>
            )}

            {/* Error message */}
            {(error || fileError) && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', color: theme.palette.error.main }}>
                    <ErrorIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                    <Typography variant="caption">
                        {error || fileError}
                    </Typography>
                </Box>
            )}

            {/* Helper text */}
            {helperText && !error && !fileError && (
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: theme.palette.text.secondary }}>
                    {helperText}
                </Typography>
            )}
        </Box>
    );
};

export default FileUpload;
