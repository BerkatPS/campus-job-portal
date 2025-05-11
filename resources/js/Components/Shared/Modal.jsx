import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton,
    Typography,
    Divider,
    Box,
    alpha,
    useTheme,
    Slide,
    Paper,
    Stack
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Button from './Button';

// Slide transition for the modal
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({
                   open,
                   onClose,
                   title,
                   description,
                   children,
                   footer,
                   maxWidth = 'sm',
                   fullWidth = true,
                   confirmButton,
                   cancelButton,
                   confirmText = 'Konfirmasi',
                   cancelText = 'Batal',
                   confirmColor = 'primary',
                   cancelColor = 'inherit',
                   confirmVariant = 'contained',
                   cancelVariant = 'outlined',
                   onConfirm,
                   loading = false,
                   borderRadius = 'medium', // 'small', 'medium', 'large'
                   hideBackdrop = false,
                   transitionDuration = 300,
                   elevation = 5,
                   disableEscapeKeyDown = true,
                   disableBackdropClick = true,
                   closeIcon = true,
                   showDividers = true,
                   animate = true,
                   scrollable = true,
                   ...props
               }) => {
    const theme = useTheme();

    // Calculate border radius based on prop
    const getBorderRadius = () => {
        switch (borderRadius) {
            case 'small': return theme.spacing(1);
            case 'medium': return theme.spacing(2);
            case 'large': return theme.spacing(3);
            default: return theme.spacing(2);
        }
    };

    const handleConfirm = () => {
        if (onConfirm && typeof onConfirm === 'function') {
            onConfirm();
        }
    };

    // Custom close handler yang hanya menutup modal jika closeIcon diklik
    const handleClose = (event, reason) => {
        // Hanya izinkan penutupan jika reason adalah 'closeButton' atau 'cancelButton'
        if ((reason === 'closeButton' || reason === 'cancelButton') && onClose && typeof onClose === 'function') {
            onClose(event, reason);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={animate ? Transition : undefined}
            transitionDuration={transitionDuration}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            scroll={scrollable ? 'paper' : 'body'}
            hideBackdrop={hideBackdrop}
            disableEscapeKeyDown={disableEscapeKeyDown}
            disableBackdropClick={disableBackdropClick}
            PaperProps={{
                elevation,
                sx: {
                    borderRadius: getBorderRadius(),
                    overflow: 'hidden',
                    overflowY: scrollable ? 'auto' : 'visible',
                    bgcolor: theme.palette.background.paper,
                    maxHeight: 'calc(100% - 64px)',
                }
            }}
            sx={{
                '& .MuiBackdrop-root': {
                    backdropFilter: 'blur(2px)',
                    backgroundColor: alpha(theme.palette.background.paper, 0.2),
                }
            }}
            {...props}
        >
            {title && (
                <>
                    <DialogTitle
                        sx={{
                            p: 2.5,
                            pb: showDividers ? 2 : (description || children ? 1 : 2.5),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 600,
                                fontSize: '1.125rem',
                                lineHeight: 1.3,
                                flexGrow: 1,
                                pr: closeIcon ? 2 : 0
                            }}
                        >
                            {title}
                        </Typography>

                        {closeIcon && onClose && (
                            <IconButton
                                edge="end"
                                color="inherit"
                                onClick={(e) => handleClose(e, 'closeButton')}
                                aria-label="close"
                                sx={{
                                    color: theme.palette.grey[500],
                                    transition: 'all 0.2s',
                                    borderRadius: 1.5,
                                    p: 1,
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                    </DialogTitle>

                    {showDividers && <Divider />}
                </>
            )}

            <DialogContent
                sx={{
                    p: 2.5,
                    pt: title && !showDividers ? 0 : 2,
                    pb: footer || confirmButton || cancelButton ? (showDividers ? 1.5 : 0) : 2.5
                }}
            >
                {description && (
                    <DialogContentText
                        sx={{
                            mb: 2,
                            color: theme.palette.text.secondary,
                            fontSize: '0.95rem'
                        }}
                    >
                        {description}
                    </DialogContentText>
                )}
                {children}
            </DialogContent>

            {(footer || confirmButton || cancelButton) && (
                <>
                    {showDividers && <Divider />}

                    <DialogActions
                        sx={{
                            p: 2.5,
                            pt: showDividers ? 2 : 1,
                            justifyContent: 'flex-end',
                            gap: 1
                        }}
                    >
                        {footer || (
                            <>
                                {cancelButton && (
                                    <Button
                                        variant={cancelVariant}
                                        color={cancelColor}
                                        onClick={(e) => handleClose(e, 'cancelButton')}
                                        disabled={loading}
                                        size="medium"
                                        rounded="medium"
                                    >
                                        {cancelText}
                                    </Button>
                                )}

                                {confirmButton && (
                                    <Button
                                        variant={confirmVariant}
                                        color={confirmColor}
                                        onClick={handleConfirm}
                                        loading={loading}
                                        size="medium"
                                        rounded="medium"
                                    >
                                        {confirmText}
                                    </Button>
                                )}
                            </>
                        )}
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default Modal;
