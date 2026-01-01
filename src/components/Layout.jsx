import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Typography, Box } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from '@mui/material/Avatar';
import { about } from '../constants';

const drawerWidth = 240;

const navItems = [
  { text: 'Home', icon: <HomeIcon />, href: '#hero' },
  { text: 'About', icon: <PersonIcon />, href: '#about' },
  { text: 'Projects', icon: <WorkIcon />, href: '#projects' },
  { text: 'Contact', icon: <EmailIcon />, href: '#contact' },
];

function Layout(props) {
  const { window, darkMode, toggleDarkMode, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Avatar 
          sx={{ width: 80, height: 80, mb: 1, bgcolor: 'primary.main', fontSize: '2rem' }}
        >
            {about.name.charAt(0)}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {about.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
            {about.role}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ px: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              component="a" 
              href={item.href} 
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                    }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} {about.name}
        </Typography>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        color="inherit" 
        elevation={0}
      >
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} /> 
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="nav folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh', 
        }}
      >
        <Toolbar /> 
        {children}
        
        {/* Simple Footer */}
        <Box id="footer" sx={{ mt: 10, py: 4, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Milind Nair. All rights reserved.
            </Typography>
        </Box>
      </Box>
    </Box>
  );
}

Layout.propTypes = {
  window: PropTypes.func,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Layout;
