import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardActions, Button, Chip, Collapse, Alert } from '@mui/material';
import { projects } from '../constants';
import { useMode } from '../context/ModeContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Projects = () => {
  const { mode } = useMode();
  const [expandedId, setExpandedId] = React.useState(-1);

  const handleExpandClick = (index) => {
    setExpandedId(expandedId === index ? -1 : index);
  };

  return (
    <Container maxWidth="lg" id="projects" sx={{ mb: 10 }}>
      <Typography 
        variant="h2" 
        gutterBottom
        sx={{
           background: (theme) => theme.palette.mode === 'light' ? 'linear-gradient(45deg, #2a5599 30%, #f50057 90%)' : 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
           WebkitBackgroundClip: 'text',
           WebkitTextFillColor: 'transparent',
           fontWeight: 800,
           mb: 6
        }}
      >
        Featured Projects
      </Typography>
      <Grid container spacing={4}>
        {projects.map((project, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    background: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(30, 30, 30, 0.4)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    boxShadow: (theme) => theme.palette.mode === 'light' ? '0 8px 32px 0 rgba(31, 38, 135, 0.07)' : '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                  }}
                >
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
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Box>
                            <Button size="small">View Code</Button>
                            <Button size="small">Live Demo</Button>
                        </Box>
                        {mode === 'dev' && (
                             <Button 
                                size="small" 
                                color="secondary"
                                onClick={() => handleExpandClick(index)}
                                endIcon={<ExpandMoreIcon sx={{ transform: expandedId === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />}
                             >
                                Tech Specs
                             </Button>
                        )}
                    </CardActions>
                    <Collapse in={expandedId === index} timeout="auto" unmountOnExit>
                        <CardContent sx={{ bgcolor: 'action.hover', borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                System Architecture
                            </Typography>
                            <Alert severity="info" sx={{ mb: 2, py: 0 }}>
                                Diagram Loading... (Placeholder)
                            </Alert>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                Key Challenges
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Optimizing database queries for high-volume transactions and implementing real-time WebSocket communication.
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;
