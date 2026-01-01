import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import { projects } from '../constants';

const Projects = () => {
  return (
    <Container maxWidth="lg" id="projects" sx={{ mb: 10 }}>
      <Typography variant="h2" gutterBottom>
        Featured Projects
      </Typography>
      <Grid container spacing={4}>
        {projects.map((project, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Placeholder image usage */}
                    <Box sx={{ height: 200, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Typography variant="caption" color="text.secondary">Project Preview</Typography>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {project.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                            {project.tags.map(tag => (
                                <Chip key={tag} label={tag} size="small" />
                            ))}
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button size="small">View Code</Button>
                        <Button size="small">Live Demo</Button>
                    </CardActions>
                </Card>
            </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;
