import React from 'react';
import { Box, Typography, Container, Paper, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import IconButton from '@mui/material/IconButton';

const Contact = () => {
  return (
    <Container maxWidth="lg" id="contact" sx={{ mb: 10 }}>
      <Typography variant="h2" gutterBottom>
        Get In Touch
      </Typography>
      <Typography variant="body1" paragraph sx={{ fontSize: '1.2rem', mb: 4 }}>
        I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" />
                <Typography variant="h6">
                   <Link href="mailto:milind@example.com" underline="hover" color="inherit">
                     milind@example.com
                   </Link>
                </Typography>
            </Box>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon color="primary" />
                <Typography variant="h6">
                     San Francisco, CA
                </Typography>
            </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton color="primary" href="https://github.com" target="_blank" aria-label="Github">
                <GitHubIcon fontSize="large" />
            </IconButton>
            <IconButton color="primary" href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                <LinkedInIcon fontSize="large" />
            </IconButton>
            <IconButton color="primary" href="https://twitter.com" target="_blank" aria-label="Twitter">
                <TwitterIcon fontSize="large" />
            </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default Contact;
