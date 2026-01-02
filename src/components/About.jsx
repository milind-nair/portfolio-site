import { Box, Typography, Container, Paper, Chip, Grid, Button, List, ListItem } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import BusinessIcon from '@mui/icons-material/Business';
import { about } from '../constants';
import { useMode } from '../context/ModeContext';

const About = () => {
  const { mode } = useMode();
  return (
    <Container maxWidth="lg" id="about" sx={{ mb: 10 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{
               background: (theme) => theme.palette.mode === 'light' ? 'linear-gradient(45deg, #2a5599 30%, #f50057 90%)' : 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               fontWeight: 800,
               mb: 4
            }}
          >
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
            {mode === 'dev' ? (
                <>
                    <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 600,
                            background: (theme) => theme.palette.mode === 'light' ? 'linear-gradient(45deg, #2a5599 30%, #f50057 90%)' : 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                      Tech Stack
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {about.skills.map((skill) => (
                        <Chip 
                            key={skill} 
                            label={skill} 
                            color="primary" 
                            sx={{ 
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 3,
                                    background: (theme) => theme.palette.primary.dark
                                }
                            }}
                        />
                      ))}
                    </Box>
                </>
            ) : (
                <>
                    <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 600,
                            background: (theme) => theme.palette.mode === 'light' ? 'linear-gradient(45deg, #2a5599 30%, #f50057 90%)' : 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                      Experience
                    </Typography>
                    <List sx={{ mb: 2 }}>
                        {about.experiences.map((exp, index) => (
                            <ListItem key={index} disablePadding sx={{ mb: 2, display: 'block' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <BusinessIcon color="secondary" fontSize="small" />
                                    <Typography variant="subtitle1" fontWeight="bold">{exp.role}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                    {exp.company} | {exp.duration}
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 4, mt: 0.5 }}>
                                    {exp.description}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        startIcon={<DownloadIcon />}
                        href="/resume.pdf"
                        target="_blank"
                        fullWidth
                    >
                        Download Resume
                    </Button>
                </>
            )}
           </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
