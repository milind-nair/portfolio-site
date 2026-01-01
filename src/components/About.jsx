import React from 'react';
import { Box, Typography, Container, Paper, Chip, Grid } from '@mui/material';

const skills = [
  "React", "Node.js", "TypeScript", "Python", "GraphQL", 
  "Material UI", "Docker", "AWS", "Git"
];

const About = () => {
  return (
    <Container maxWidth="lg" id="about" sx={{ mb: 10 }}>
      <Typography variant="h2" gutterBottom>
        About Me
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
              I am a passionate software engineer with experience in building scalable web applications. 
              My journey began with a curiosity for how things work on the internet, which led me to dive deep into front-end and back-end technologies.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
              When I'm not coding, you can find me exploring new tech trends, contributing to open source, or enjoying a good cup of coffee.
              I believe in writing clean, maintainable code and dealing with complex problems with simple, elegant solutions.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
           <Box>
            <Typography variant="h6" gutterBottom>
              Tech Stack
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {skills.map((skill) => (
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
