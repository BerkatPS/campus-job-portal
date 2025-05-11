import React from 'react';
import {
    Card as MuiCard,
    CardContent,
    CardHeader,
    Typography,
    Divider,
    Box,
    IconButton,
    useTheme
} from '@mui/material';
import { MoreVert as MoreIcon } from '@mui/icons-material';

const Card = ({
                  children,
                  title,
                  subheader,
                  icon,
                  action,
                  variant = 'elevation',
                  elevation = variant === 'outlined' ? 0 : 1,
                  customHeader = true,
                  divider = false,
                  hover = false,
                  sx = {},
                  headerSx = {},
                  contentSx = {},
                  titleProps = {},
                  ...props
              }) => {
    const theme = useTheme();

    // Pisahkan props yang tidak boleh diteruskan ke DOM elements
    const { titleIcon, item, xs, sm, md, lg, ...otherProps } = props;

    // Gunakan titleIcon jika disediakan (untuk backward compatibility)
    // atau gunakan icon jika titleIcon tidak ada
    const cardIcon = titleIcon || icon;

    // Hitung padding konten berdasarkan ada tidaknya header
    const getContentPadding = () => {
        if (title || subheader) {
            return { pt: customHeader ? 1 : 3, px: 3, pb: 3 };
        }
        return { p: 3 };
    };

    return (
        <MuiCard
            variant={variant}
            elevation={elevation}
            sx={{
                borderRadius: theme.shape.borderRadius * 1.5,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                height: '100%',
                ...(hover && {
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[elevation + 2]
                    }
                }),
                ...sx
            }}
            {...otherProps}
        >
            {title && customHeader && (
                <Box sx={{ pt: 3, px: 3, ...headerSx }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {cardIcon && (
                                <Box sx={{ color: 'primary.main', mr: 1.5, display: 'flex' }}>
                                    {cardIcon}
                                </Box>
                            )}
                            <Typography variant={titleProps.variant || "h6"} component="h2" fontWeight={titleProps.fontWeight || "600"} {...titleProps}>
                                {title}
                            </Typography>
                        </Box>
                        {action && (
                            <Box>
                                {typeof action === 'boolean' ? (
                                    <IconButton size="small">
                                        <MoreIcon />
                                    </IconButton>
                                ) : (
                                    action
                                )}
                            </Box>
                        )}
                    </Box>
                    {subheader && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {subheader}
                        </Typography>
                    )}
                    {divider && <Divider sx={{ mt: 1 }} />}
                </Box>
            )}

            {title && !customHeader && (
                <CardHeader
                    title={title}
                    subheader={subheader}
                    action={action}
                    avatar={cardIcon ? cardIcon : undefined}
                    sx={{ ...headerSx }}
                />
            )}

            <CardContent sx={{ ...getContentPadding(), ...contentSx }}>
                {children}
            </CardContent>
        </MuiCard>
    );
};

export default Card;
