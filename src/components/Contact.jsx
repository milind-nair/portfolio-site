import React from 'react';
import { Box, Typography, Container, Paper, Link, IconButton, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { about } from '../constants';

const Contact = () => {
  return (
    <Container maxWidth="md" id="contact" sx={{ mb: 10 }}>
      {/* Section Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
         <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
            Let's Connect
         </Typography>
         <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
         </Typography>
      </Box>
      
      {/* Contact Card */}
      <Paper 
        elevation={3} 
        sx={{ 
            p: 6, 
            borderRadius: 4, 
            textAlign: 'center',
            background: (theme) => theme.palette.mode === 'light' ? 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)' : 'linear-gradient(135deg, #1e1e1e 0%, #252525 100%)',
            border: '1px solid',
            borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', mb: 4 }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    p: 2, 
                    background: (theme) => theme.palette.action.hover, 
                    borderRadius: 2,
                    width: 'fit-content'
                }}
            >
                <EmailIcon color="primary" sx={{ fontSize: 30 }} />
                <Link href={`mailto:${about.email}`} underline="none" variant="h5" color="text.primary" sx={{ fontWeight: 600 }}>
                     {about.email}
                </Link>
            </Box>

             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon color="text.secondary" />
                <Typography variant="body1" color="text.secondary">
                     {about.location}
                </Typography>
            </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
            Find me on social media:
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Tooltip title="Github">
                <IconButton 
                    href={about.social.github} 
                    target="_blank" 
                    sx={{ p: 2, border: '1px solid', borderColor: 'divider', '&:hover': { color: 'primary.main', borderColor: 'primary.main' } }}
                >
                    <GitHubIcon fontSize="medium" />
                </IconButton>
            </Tooltip>
            <Tooltip title="LinkedIn">
                <IconButton 
                    href={about.social.linkedin} 
                    target="_blank" 
                    sx={{ p: 2, border: '1px solid', borderColor: 'divider', '&:hover': { color: '#0077b5', borderColor: '#0077b5' } }}
                >
                    <LinkedInIcon fontSize="medium" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Twitter">
                <IconButton 
                    href={about.social.twitter} 
                    target="_blank" 
                    sx={{ p: 2, border: '1px solid', borderColor: 'divider', '&:hover': { color: '#1da1f2', borderColor: '#1da1f2' } }}
                >
                    <TwitterIcon fontSize="medium" />
                </IconButton>
            </Tooltip>
        </Box>
      </Paper>
    </Container>
  );
};

export default Contact;
