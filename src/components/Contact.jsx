import React from 'react';
import { Box, Typography, Container, Grid, TextField, Button, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import IconButton from '@mui/material/IconButton';

const Contact = () => {
  return (
    <Container maxWidth="md" id="contact" sx={{ mb: 10 }}>
      <Typography variant="h2" gutterBottom>
        Get In Touch
      </Typography>
      <Typography variant="body1" paragraph>
        Have a project in mind or just want to say hi? Feel free to send me a message!
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Name" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    fullWidth 
                    label="Message" 
                    multiline 
                    rows={4} 
                    variant="outlined" 
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" size="large" endIcon={<SendIcon />}>
                    Send Message
                </Button>
            </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton color="primary" href="https://github.com" target="_blank">
            <GitHubIcon fontSize="large" />
        </IconButton>
        <IconButton color="primary" href="https://linkedin.com" target="_blank">
            <LinkedInIcon fontSize="large" />
        </IconButton>
        <IconButton color="primary" href="https://twitter.com" target="_blank">
            <TwitterIcon fontSize="large" />
        </IconButton>
      </Box>
    </Container>
  );
};

export default Contact;
