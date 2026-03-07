import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardActions, Button, CardMedia } from '@mui/material';
import { about } from '../constants';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BLOG_FALLBACK_ICON = 'https://cdn.simpleicons.org/medium/12100E';

const parseBlogDate = (dateLabel = '') => {
  const timestamp = Date.parse(dateLabel);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const Blogs = () => {
  const [brokenImages, setBrokenImages] = React.useState({});
  const sortedBlogs = React.useMemo(
    () =>
      [...about.blogs].sort((a, b) => {
        const byDate = parseBlogDate(b.date) - parseBlogDate(a.date);
        if (byDate !== 0) {
          return byDate;
        }

        return a.title.localeCompare(b.title);
      }),
    []
  );

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
        {sortedBlogs.map((blog) => {
            const blogImage = blog.image;
            const imageUnavailable = !blogImage || brokenImages[blog.link];

            return (
            <Grid item key={blog.link} xs={12} sm={6} md={4}>
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
                    {imageUnavailable ? (
                      <Box sx={{ height: 140, bgcolor: 'secondary.main', opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Box
                             component="img"
                             src={BLOG_FALLBACK_ICON}
                             alt="Medium logo"
                             sx={{
                               width: 56,
                               height: 56,
                               objectFit: 'contain',
                               opacity: 0.9,
                               filter: (theme) => theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
                             }}
                           />
                      </Box>
                    ) : (
                      <CardMedia
                        component="img"
                        height="140"
                        image={blogImage}
                        alt={`${blog.title} cover`}
                        loading="lazy"
                        onError={() =>
                          setBrokenImages((prev) => ({ ...prev, [blog.link]: true }))
                        }
                      />
                    )}
                    
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
        );
        })}
      </Grid>
    </Container>
  );
};

export default Blogs;
