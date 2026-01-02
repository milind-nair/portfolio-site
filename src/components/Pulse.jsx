import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Paper, Link, Skeleton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';

const StatCard = ({ icon, title, value, subtext, link }) => (
  <Paper
    component={link ? Link : 'div'}
    href={link}
    target="_blank"
    underline="none"
    sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        borderRadius: 4,
        width: '100%',
        height: '100%',
        background: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(30, 30, 30, 0.4)',
        backdropFilter: 'blur(24px)',
        border: '1px solid',
        borderColor: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
        transition: 'transform 0.2s',
        cursor: link ? 'pointer' : 'default',
        '&:hover': {
            transform: link ? 'translateY(-4px)' : 'none'
        }
    }}
  >
    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', mb: 1 }}>
        {icon}
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 800 }}>
        {value}
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
        {title}
    </Typography>
    {subtext && (
       <Typography variant="caption" color="text.disabled">
         {subtext}
       </Typography>
    )}
  </Paper>
);

const Pulse = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          axios.get('https://api.github.com/users/milind-nair'),
          axios.get('https://api.github.com/users/milind-nair/repos?sort=updated&per_page=1')
        ]);
        
        setStats({
           repos: userRes.data.public_repos,
           followers: userRes.data.followers,
           lastUpdate: reposRes.data[0]?.name,
           lastUrl: reposRes.data[0]?.html_url,
           lastDate: new Date(reposRes.data[0]?.pushed_at).toLocaleDateString()
        });
      } catch (error) {
        console.error("Failed to fetch github stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mb: 8 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Live Activity (Pulse)
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
            {loading ? <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 4 }} /> : (
                <StatCard 
                    icon={<GitHubIcon />}
                    title="Public Repositories"
                    value={stats?.repos}
                    link="https://github.com/milind-nair?tab=repositories"
                />
            )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
            {loading ? <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 4 }} /> : (
                <StatCard 
                    icon={<CodeIcon />}
                    title="Latest Contribution"
                    value={stats?.lastUpdate}
                    subtext={stats?.lastDate}
                    link={stats?.lastUrl}
                />
            )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
            <StatCard 
                icon={<AccessTimeIcon />}
                title="Coding Hours"
                value="Soon"
                subtext="Connecting WakaTime..."
            />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Pulse;
