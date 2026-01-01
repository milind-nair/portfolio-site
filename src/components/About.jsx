import React from 'react';
import { Box, Typography, Container, Paper, Chip, Grid } from '@mui/material';
import { about } from '../constants';

const About = () => {
  return (
    <Container maxWidth="lg" id="about" sx={{ mb: 10 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h2" gutterBottom>
            About Me
          </Typography>
          <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
            {about.bio.map((paragraph, index) => (
                <Typography key={index} variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                    {paragraph}
                </Typography>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
           <Box sx={{ pt: { md: 1 } }}> 
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Tech Stack
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {about.skills.map((skill) => (
                <Chip key={skill} label={skill} variant="outlined" color="primary" />
              ))}
            </Box>
           </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
