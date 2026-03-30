import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardActions, Button, CardMedia } from '@mui/material';
import { about } from '../constants';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BLOG_FALLBACK_ICON = `${process.env.PUBLIC_URL}/brand-icon.png`;
const BLOG_METADATA_URL = '/blogs/posts.json';

const parseBlogDate = (dateLabel = '') => {
  const timestamp = Date.parse(dateLabel);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const fallbackBlogs = about.blogs.map((blog) => ({
  title: blog.title,
  coverImage: blog.image,
  coverAlt: `${blog.title} cover`,
  path: blog.link,
  dateLabel: blog.date,
  readTime: blog.readTime,
  description: blog.snippet,
  external: true,
}));

const Blogs = () => {
  const [brokenImages, setBrokenImages] = React.useState({});
  const [blogs, setBlogs] = React.useState(fallbackBlogs);

  React.useEffect(() => {
    let active = true;

    const loadBlogs = async () => {
      try {
        const response = await fetch(BLOG_METADATA_URL, { headers: { Accept: 'application/json' } });
        if (!response.ok) {
          throw new Error(`Failed to load blog metadata (${response.status})`);
        }

        const data = await response.json();
        if (!active || !Array.isArray(data) || data.length === 0) {
          return;
        }

        setBlogs(
          data.map((blog) => ({
            title: blog.title,
            coverImage: blog.coverImage,
            coverAlt: blog.coverAlt || `${blog.title} cover`,
            path: blog.path || `/blogs/${blog.slug}/`,
            dateLabel: blog.dateLabel || blog.pubDate,
            readTime: blog.readTime,
            description: blog.description,
            external: false,
          }))
        );
      } catch (error) {
        if (active) {
          setBlogs(fallbackBlogs);
        }
      }
    };

    loadBlogs();

    return () => {
      active = false;
    };
  }, []);

  const sortedBlogs = React.useMemo(
    () =>
      [...blogs]
        .sort((a, b) => {
          const byDate = parseBlogDate(b.dateLabel) - parseBlogDate(a.dateLabel);
          if (byDate !== 0) {
            return byDate;
          }

          return a.title.localeCompare(b.title);
        })
        .slice(0, 6),
    [blogs]
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
            const blogImage = blog.coverImage;
            const imageUnavailable = !blogImage || brokenImages[blog.path];

            return (
            <Grid item key={blog.path} xs={12} sm={6} md={4}>
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
                             alt="Blog logo"
                             sx={{
                               width: 56,
                               height: 56,
                               objectFit: 'contain',
                               opacity: 0.9
                             }}
                           />
                      </Box>
                    ) : (
                      <CardMedia
                        component="img"
                        height="140"
                        image={blogImage}
                        alt={blog.coverAlt}
                        loading="lazy"
                        onError={() =>
                          setBrokenImages((prev) => ({ ...prev, [blog.path]: true }))
                        }
                      />
                    )}
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">{blog.dateLabel}</Typography>
                            <Typography variant="caption" color="primary" fontWeight="bold">{blog.readTime}</Typography>
                        </Box>
                        <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                            {blog.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {blog.description}
                        </Typography>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button 
                            size="small" 
                            endIcon={<ArrowForwardIcon />} 
                            href={blog.path}
                            target={blog.external ? '_blank' : undefined}
                            rel={blog.external ? 'noreferrer' : undefined}
                        >
                            {blog.external ? 'Read on Medium' : 'Read article'}
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        );
        })}
      </Grid>

      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Button href="/blogs/" variant="outlined" endIcon={<ArrowForwardIcon />}>
          View all posts
        </Button>
      </Box>
    </Container>
  );
};

export default Blogs;
