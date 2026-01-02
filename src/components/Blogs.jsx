import { Box, Typography, Container, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { about } from '../constants';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Blogs = () => {
  return (
    <Container maxWidth="lg" id="blogs" sx={{ mb: 10, scrollMarginTop: '100px' }}>
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
        Recent Thoughts
      </Typography>

      <Grid container spacing={4}>
        {about.blogs.map((blog, index) => (
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
                    boxShadow: (theme) => theme.palette.mode === 'light' ? '0 8px 32px 0 rgba(31, 38, 135, 0.07)' : '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'translateY(-8px)'
                    }
                  }}
                >
                    {/* Placeholder for Blog Image if we want one, or just a colored top bar */}
                    <Box sx={{ height: 140, bgcolor: 'secondary.main', opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <AutoStoriesIcon sx={{ fontSize: 60, opacity: 0.5 }} />
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">{blog.date}</Typography>
                            <Typography variant="caption" color="primary" fontWeight="bold">{blog.readTime}</Typography>
                        </Box>
                        <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                            {blog.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {blog.snippet}
                        </Typography>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button 
                            size="small" 
                            endIcon={<ArrowForwardIcon />} 
                            href={blog.link}
                            target="_blank"
                        >
                            Read on Medium
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blogs;
