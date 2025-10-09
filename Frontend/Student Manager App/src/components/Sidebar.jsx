import {
  Drawer,
  Box,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Home,
  PersonAdd,
  Settings,
  Logout,
  School,
  ChevronLeft,
  Menu as MenuIcon
} from '@mui/icons-material';

const drawerWidth = 280;
const collapsedWidth = 70;

const Sidebar = ({ isOpen, onToggle, onAddStudent, onLogout }) => {
  return (
    <Drawer
      sx={{
        width: isOpen ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: isOpen ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          transition: 'width 0.3s ease',
          overflowX: 'hidden'
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* System Title with Toggle Button */}
      <Box sx={{ 
        p: isOpen ? 3 : 1, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        justifyContent: isOpen ? 'flex-start' : 'center',
        minHeight: 80
      }}>
        {isOpen ? (
          <>
            <School sx={{ fontSize: 40 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
              Student Management System
            </Typography>
            <Box >
              <IconButton
                onClick={onToggle}
                sx={{ color: 'white' }}
                size="small"
              >
                <ChevronLeft />
              </IconButton>
            </Box>
          </>
        ) : (
          <IconButton 
            onClick={onToggle} 
            sx={{ color: 'white' }}
            size="small"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      
      {/* Navigation Menu */}
      <List sx={{ mt: 2 }}>
        <ListItem disablePadding>
          <Tooltip title={!isOpen ? "Home" : ""} placement="right">
            <ListItemButton 
              sx={{ 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                bgcolor: 'rgba(255,255,255,0.15)',
                justifyContent: isOpen ? 'flex-start' : 'center',
                px: isOpen ? 2 : 1
              }}
            >
              <ListItemIcon sx={{ 
                color: 'white',
                minWidth: isOpen ? 40 : 'auto',
                justifyContent: 'center'
              }}>
                <Home />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Home" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        <ListItem disablePadding>
          <Tooltip title={!isOpen ? "Add New Student" : ""} placement="right">
            <ListItemButton 
              onClick={onAddStudent}
              sx={{ 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                justifyContent: isOpen ? 'flex-start' : 'center',
                px: isOpen ? 2 : 1
              }}
            >
              <ListItemIcon sx={{ 
                color: 'white',
                minWidth: isOpen ? 40 : 'auto',
                justifyContent: 'center'
              }}>
                <PersonAdd />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Add New Student" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        <ListItem disablePadding>
          <Tooltip title={!isOpen ? "Settings" : ""} placement="right">
            <ListItemButton 
              sx={{ 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                justifyContent: isOpen ? 'flex-start' : 'center',
                px: isOpen ? 2 : 1
              }}
            >
              <ListItemIcon sx={{ 
                color: 'white',
                minWidth: isOpen ? 40 : 'auto',
                justifyContent: 'center'
              }}>
                <Settings />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Settings" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        <ListItem disablePadding>
          <Tooltip title={!isOpen ? "Logout" : ""} placement="right">
            <ListItemButton 
              onClick={onLogout}
              sx={{ 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                justifyContent: isOpen ? 'flex-start' : 'center',
                px: isOpen ? 2 : 1
              }}
            >
              <ListItemIcon sx={{ 
                color: 'white',
                minWidth: isOpen ? 40 : 'auto',
                justifyContent: 'center'
              }}>
                <Logout />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Logout" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
