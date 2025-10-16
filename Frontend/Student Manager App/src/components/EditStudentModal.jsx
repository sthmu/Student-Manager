import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { apiPut } from '../utils/api';

const EditStudentModal = ({ open, onClose, student, onStudentUpdated }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    enrolment_date: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  // Populate form when student prop changes
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        course: student.course || '',
        enrolment_date: student.enrolment_date ? student.enrolment_date.split('T')[0] : '',
        is_active: student.is_active === 1 || student.is_active === true
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_active' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setAlert({ show: false, message: '', severity: 'success' });
    
    try {
      const response = await apiPut(`/students/${student.id}`, formData);
      const data = await response.json();
      
      if (response.ok) {
        setAlert({ 
          show: true, 
          message: 'Student updated successfully!', 
          severity: 'success' 
        });
        
        // Call parent callback to refresh student list
        if (onStudentUpdated) {
          onStudentUpdated(data.student);
        }
        
        // Close modal after 1 second
        setTimeout(() => {
          onClose();
          setAlert({ show: false, message: '', severity: 'success' });
        }, 1000);
        
      } else {
        setAlert({ 
          show: true, 
          message: data.message || 'Failed to update student', 
          severity: 'error' 
        });
      }
      
    } catch (error) {
      console.error('Error updating student:', error);
      setAlert({ 
        show: true, 
        message: 'Cannot connect to server. Please check if backend is running.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setAlert({ show: false, message: '', severity: 'success' });
    onClose();
  };

  if (!student) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          m: isMobile ? 0 : 2
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        fontSize: { xs: '1.1rem', sm: '1.25rem' },
        py: { xs: 1.5, sm: 2 },
        gap: 1
      }}>
        <EditIcon />
        Edit Student
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {alert.show && (
            <Alert severity={alert.severity} sx={{ mb: 2 }}>
              {alert.message}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                placeholder="e.g., John Doe"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                placeholder="student@example.com"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234-567-8900"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Enrolment Date"
                name="enrolment_date"
                type="date"
                value={formData.enrolment_date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleChange}
                    name="is_active"
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Box sx={{ fontWeight: 500 }}>
                      Active Status
                    </Box>
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {formData.is_active ? 'Student is currently active' : 'Student is currently inactive'}
                    </Box>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          px: { xs: 2, sm: 3 }, 
          pb: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            fullWidth={isMobile}
            sx={{ color: 'grey.600' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            fullWidth={isMobile}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Update Student'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditStudentModal;
