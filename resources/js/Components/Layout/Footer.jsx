import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    TextField,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    useTheme,
    Paper,
    Tooltip,
    alpha
} from '@mui/material';
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    LinkedIn as LinkedInIcon,
    Send as SendIcon,
    LocationOn as LocationOnIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';

const Footer = () => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    // Function to scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © {currentYear} Bayu Angga Loker. All rights reserved.
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2
                        }}
                    >
                        <Link href="#" color="inherit" underline="hover">
                            Privacy Policy
                        </Link>
                        <Link href="#" color="inherit" underline="hover">
                            Terms of Service
                        </Link>
                        <Link href="#" color="inherit" underline="hover">
                            Contact Us
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
