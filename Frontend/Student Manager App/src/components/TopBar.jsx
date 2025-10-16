import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  ListItemIcon
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  Person,
  Settings,
  Logout
} from '@mui/icons-material';
import UserProfileModal from './UserProfileModal';

const TopBar = ({ user, onLogout, pageTitle = 'Dashboard', searchQuery, onSearchChange, onSearch, onOpenSettings }) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  
  const username = user?.email?.split('@')[0] || 'User';

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
    handleUserMenuClose();
  };

  const handleAccountClick = () => {
    if (onOpenSettings) {
      onOpenSettings();
    }
    handleUserMenuClose();
  };

  const handleLogoutClick = () => {
    handleUserMenuClose();
    onLogout();
  };

  const handleClearSearch = () => {
    onSearchChange({ target: { value: '' } });
    onSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
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
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        gap: 2,
        minHeight: { xs: 56, sm: 64 },
        flexWrap: { xs: 'wrap', md: 'nowrap' }
      }}>
        {/* Left side - Page Title */}
        <Box sx={{ minWidth: { xs: '100%', md: 'auto' }, order: { xs: 1, md: 1 } }}>
          <Typography 
            variant="h5" 
            fontWeight="600"
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            {pageTitle}
          </Typography>
        </Box>

        {/* Center - Search Bar */}
        <Box sx={{ 
          flexGrow: 1, 
          maxWidth: { xs: '100%', md: '500px' },
          order: { xs: 3, md: 2 },
          width: { xs: '100%', md: 'auto' }
        }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, email, or course..."
            value={searchQuery}
            onChange={onSearchChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                '& fieldset': { border: 'none' },
                '&:hover': { bgcolor: '#eeeeee' },
                '&.Mui-focused': { bgcolor: 'white', boxShadow: '0 0 0 2px #667eea' }
              }
            }}
          />
        </Box>

        {/* Right side - User Menu */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            cursor: 'pointer',
            p: 1,
            borderRadius: 2,
            order: { xs: 2, md: 3 },
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
          onClick={handleUserMenuOpen}
        >
          <Box sx={{ 
            textAlign: 'right',
            display: { xs: 'none', sm: 'block' } // Hide text on mobile
          }}>
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
          PaperProps={{
            sx: { minWidth: 200 }
          }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleAccountClick}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Account Settings
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* User Profile Modal */}
        <UserProfileModal
          open={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
        />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
