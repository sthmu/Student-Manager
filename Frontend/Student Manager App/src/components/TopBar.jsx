import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';

const TopBar = ({ user, onLogout }) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  const username = user?.email?.split('@')[0] || 'User';

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'white', 
        color: 'black',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            cursor: 'pointer',
            p: 1,
            borderRadius: 2,
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
          onClick={handleUserMenuOpen}
        >
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" fontWeight="600">
              Welcome, {username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Avatar 
            src="https://i.pravatar.cc/150?img=33"
            sx={{ width: 45, height: 45 }}
          />
        </Box>
        
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
        >
          <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleUserMenuClose}>My Account</MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
