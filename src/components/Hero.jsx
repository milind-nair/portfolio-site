import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { about } from '../constants';

const Hero = () => {
  return (
    <Box
      id="hero"
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, rgba(42,85,153,0.1) 0%, rgba(245,0,87,0.1) 100%)',
        borderRadius: 4,
        p: 4,
        mb: 6,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h1" component="h1" gutterBottom sx={{ background: '-webkit-linear-gradient(45deg, #2a5599 30%, #f50057 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Hello, I'm {about.name}.
        </Typography>
        <Typography variant="h3" color="text.secondary" gutterBottom>
          {about.role}
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.2rem', maxWidth: '600px', mb: 4 }}>
          {about.description}
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          endIcon={<ArrowForwardIcon />}
          href="#projects"
        >
          View My Work
        </Button>
      </Container>
    </Box>
  );
};

export default Hero;
