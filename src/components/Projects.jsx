import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardMedia,
  TextField,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack
} from '@mui/material';
import { projects, about } from '../constants';
import { useMode } from '../context/ModeContext';
import SearchIcon from '@mui/icons-material/Search';
import CodeIcon from '@mui/icons-material/Code';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';

const parseGithubRepo = (url = '') => {
  const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/?#]+)\/?$/i);
  if (!match) {
    return null;
  }

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/i, '')
  };
};

const getGithubPreviewUrl = (codeUrl) => {
  const repoInfo = parseGithubRepo(codeUrl);
  if (!repoInfo) {
    return null;
  }

  return `https://opengraph.githubassets.com/portfolio-site/${repoInfo.owner}/${repoInfo.repo}`;
};

const getProjectCodeAction = (project) => {
  if (project.codeUrl) {
    return { label: 'View Code', url: project.codeUrl };
  }

  return null;
};

const getProjectPreviewSources = (project) => {
  const sources = [];

  const githubPreviewUrl = getGithubPreviewUrl(project.codeUrl);
  if (githubPreviewUrl && !sources.includes(githubPreviewUrl)) {
    sources.push(githubPreviewUrl);
  }

  if (project.image && !sources.includes(project.image)) {
    sources.push(project.image);
  }

  return sources;
};

const getProjectKey = (project) => project.codeUrl || project.title;

const Projects = () => {
  const { mode } = useMode();
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeProject, setActiveProject] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [previewFailures, setPreviewFailures] = React.useState({});

  const tagOptions = React.useMemo(() => {
    const counts = new Map();
    projects.forEach((project) => {
      (project.tags || []).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  }, []);

  const filteredProjects = React.useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const tags = project.tags || [];
      const matchesTags =
        selectedTags.length === 0 || tags.some((tag) => selectedTags.includes(tag));

      if (!matchesTags) {
        return false;
      }

      if (!normalizedTerm) {
        return true;
      }

      const detailParts = [
        project.title,
        project.description,
        ...(project.tags || []),
        project.details?.summary,
        project.details?.impact,
        project.details?.role,
        ...(project.details?.features || []),
        ...(project.details?.stack || []),
        ...(project.details?.challenges || []),
        project.details?.architecture
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return detailParts.includes(normalizedTerm);
    });
  }, [searchTerm, selectedTags]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleOpenDialog = (project) => {
    setActiveProject(project);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const markPreviewFailure = (project) => {
    const projectKey = getProjectKey(project);
    setPreviewFailures((prev) => ({
      ...prev,
      [projectKey]: (prev[projectKey] || 0) + 1
    }));
  };

  const getCurrentPreviewSource = (project) => {
    const sources = getProjectPreviewSources(project);
    return sources[previewFailures[getProjectKey(project)] || 0] || null;
  };

  const activeProjectCodeAction = activeProject
    ? getProjectCodeAction(activeProject)
    : null;
  const activeProjectPreviewSource = activeProject
    ? getCurrentPreviewSource(activeProject)
    : null;

  return (
    <Container maxWidth="lg" id="projects" sx={{ mb: 10, scrollMarginTop: '100px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap'
        }}
      >
        <Typography 
          variant="h2" 
          gutterBottom
          sx={{
             background: (theme) => theme.palette.mode === 'light' ? 'linear-gradient(45deg, #2a5599 30%, #f50057 90%)' : 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
             fontWeight: 800,
             mb: 0
          }}
        >
          Featured Projects
        </Typography>
        <Button
          variant="outlined"
          href={about.social.github}
          target="_blank"
          rel="noreferrer"
          startIcon={<CodeIcon fontSize="small" />}
        >
          View All on GitHub
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          size="small"
          label="Search projects"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip
            label={`All (${projects.length})`}
            color={selectedTags.length === 0 ? 'primary' : 'default'}
            onClick={() => setSelectedTags([])}
            variant={selectedTags.length === 0 ? 'filled' : 'outlined'}
          />
          {tagOptions.map((option) => (
            <Chip
              key={option.tag}
              label={`${option.tag} (${option.count})`}
              color={selectedTags.includes(option.tag) ? 'primary' : 'default'}
              variant={selectedTags.includes(option.tag) ? 'filled' : 'outlined'}
              onClick={() => handleTagToggle(option.tag)}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={4}>
        {filteredProjects.map((project) => {
            const projectCodeAction = getProjectCodeAction(project);
            const projectPreviewSource = getCurrentPreviewSource(project);

            return (
            <Grid item key={getProjectKey(project)} xs={12} sm={6} md={4}>
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
                    {!projectPreviewSource ? (
                      <Box
                        sx={{
                          height: 200,
                          px: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          background: (theme) =>
                            theme.palette.mode === 'light'
                              ? 'linear-gradient(135deg, rgba(42,85,153,0.14), rgba(245,0,87,0.12))'
                              : 'linear-gradient(135deg, rgba(144,202,249,0.18), rgba(244,143,177,0.16))'
                        }}
                      >
                        <Stack spacing={1} alignItems="center">
                          <HideImageOutlinedIcon color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Preview unavailable
                          </Typography>
                        </Stack>
                      </Box>
                    ) : (
                      <CardMedia
                        component="img"
                        height="200"
                        image={projectPreviewSource}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        onError={() => markPreviewFailure(project)}
                      />
                    )}
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {projectCodeAction && (
                            <Button
                              size="small"
                              href={projectCodeAction.url}
                              target="_blank"
                              rel="noreferrer"
                              startIcon={<CodeIcon fontSize="small" />}
                            >
                              {projectCodeAction.label}
                            </Button>
                          )}
                          {project.demoUrl && (
                            <Button
                              size="small"
                              href={project.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Live Demo
                            </Button>
                          )}
                        </Box>
                        <Button 
                          size="small" 
                          color="secondary"
                          onClick={() => handleOpenDialog(project)}
                        >
                          View Details
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        );
        })}
      </Grid>

      {filteredProjects.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No projects match your filters.
          </Typography>
          <Button variant="outlined" onClick={() => { setSelectedTags([]); setSearchTerm(''); }}>
            Clear Filters
          </Button>
        </Box>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        TransitionProps={{ onExited: () => setActiveProject(null) }}
      >
        <DialogTitle>{activeProject?.title || 'Project Details'}</DialogTitle>
        <DialogContent dividers>
          {activeProject ? (
            <Stack spacing={2}>
              {!activeProjectPreviewSource ? (
                <Box
                  sx={{
                    height: 240,
                    borderRadius: 2,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: (theme) =>
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, rgba(42,85,153,0.14), rgba(245,0,87,0.12))'
                        : 'linear-gradient(135deg, rgba(144,202,249,0.18), rgba(244,143,177,0.16))'
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    <HideImageOutlinedIcon color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Preview unavailable
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  height="240"
                  image={activeProjectPreviewSource}
                  alt={`${activeProject.title} preview`}
                  loading="lazy"
                  sx={{ borderRadius: 2 }}
                  onError={() => markPreviewFailure(activeProject)}
                />
              )}

              <Typography variant="body1">
                {activeProject.details?.summary || activeProject.description}
              </Typography>

              <Box>
                <Typography variant="subtitle2" fontWeight="bold">Role</Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeProject.details?.role || 'Details coming soon.'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight="bold">Impact</Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeProject.details?.impact || 'Details coming soon.'}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight="bold">Stack</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {(activeProject.details?.stack || activeProject.tags || []).map((stackItem) => (
                    <Chip key={stackItem} label={stackItem} size="small" />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight="bold">Key Features</Typography>
                <List dense>
                  {(activeProject.details?.features || []).map((feature) => (
                    <ListItem key={feature} disableGutters>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {mode === 'dev' && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Architecture</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activeProject.details?.architecture || 'Details coming soon.'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Challenges</Typography>
                    <List dense>
                      {(activeProject.details?.challenges || []).map((challenge) => (
                        <ListItem key={challenge} disableGutters>
                          <ListItemText primary={challenge} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </>
              )}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Loading project details...
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {activeProjectCodeAction && (
            <Button
              href={activeProjectCodeAction.url}
              target="_blank"
              rel="noreferrer"
              startIcon={<CodeIcon fontSize="small" />}
            >
              {activeProjectCodeAction.label}
            </Button>
          )}
          {activeProject?.demoUrl && (
            <Button
              href={activeProject.demoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Live Demo
            </Button>
          )}
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Projects;
