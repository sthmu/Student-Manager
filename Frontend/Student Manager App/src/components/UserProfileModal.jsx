import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  Divider,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Email,
  Close,
  Edit,
  Visibility,
  VisibilityOff,
  Save
} from '@mui/icons-material';

const UserProfileModal = ({ open, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || user.email?.split('@')[0] || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Validate password change if attempted
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setAlert({
          show: true,
          message: 'Please enter your current password',
          severity: 'error'
        });
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setAlert({
          show: true,
          message: 'New passwords do not match',
          severity: 'error'
        });
        return;
      }
      if (formData.newPassword.length < 6) {
        setAlert({
          show: true,
          message: 'Password must be at least 6 characters',
          severity: 'error'
        });
        return;
      }
    }

    // TODO: Call API to update user profile
    // For now, just update localStorage
    const updatedUser = {
      ...user,
      username: formData.username,
      email: formData.email
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setAlert({
      show: true,
      message: 'Profile updated successfully!',
      severity: 'success'
    });

    setIsEditing(false);

    // Close after 1.5 seconds
    setTimeout(() => {
      setAlert({ show: false, message: '', severity: 'info' });
      onClose();
      // Reload page to reflect changes
      window.location.reload();
    }, 1500);
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      username: user.username || user.email?.split('@')[0] || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
    setAlert({ show: false, message: '', severity: 'info' });
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Person color="primary" />
          <Typography variant="h6" fontWeight="600">
            User Profile
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Alert Messages */}
        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        {/* Profile Picture */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Avatar 
            src="https://i.pravatar.cc/150?img=33"
            sx={{ 
              width: 100, 
              height: 100,
              border: '4px solid #667eea'
            }}
          />
        </Box>

        {/* Profile Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Username */}
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          {/* Password Change Section (only when editing) */}
          {isEditing && (
            <>
              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Change Password (Optional)
                </Typography>
              </Divider>

              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                helperText="At least 6 characters"
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter new password"
              />
            </>
          )}

          {/* Account Info (read-only) */}
          {!isEditing && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Account Status
              </Typography>
              <Typography variant="body2" fontWeight="500">
                Active
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Member since: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {!isEditing ? (
          <>
            <Button onClick={handleClose}>
              Close
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                }
              }}
            >
              Edit Profile
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Save />}
              onClick={handleSave}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                }
              }}
            >
              Save Changes
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileModal;
