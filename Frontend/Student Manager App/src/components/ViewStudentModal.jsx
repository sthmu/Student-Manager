import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Divider,
  Grid,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Email,
  Phone,
  School,
  CalendarToday,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

const ViewStudentModal = ({ open, onClose, student }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!student) return null;

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
        pb: { xs: 2, sm: 3 }
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
          Student Details
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {/* Student Profile Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          pb: 3,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Avatar 
            src={student.avatar} 
            alt={student.name}
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 3,
              border: '3px solid #667eea'
            }}
          />
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {student.name}
            </Typography>
            <Chip 
              label={student.is_active ? 'Active' : 'Inactive'}
              color={student.is_active ? 'success' : 'error'}
              size="small"
              icon={student.is_active ? <CheckCircle /> : <Cancel />}
            />
          </Box>
        </Box>

        {/* Student Information Grid */}
        <Grid container spacing={3}>
          {/* ID */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Student ID:
              </Typography>
              <Typography variant="body1">
                #{student.id}
              </Typography>
            </Box>
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Email:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ ml: 3.5 }}>
              {student.email || 'N/A'}
            </Typography>
          </Grid>

          {/* Phone */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Phone:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ ml: 3.5 }}>
              {student.phone || 'N/A'}
            </Typography>
          </Grid>

          {/* Course */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Course:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ ml: 3.5 }}>
              {student.course || 'N/A'}
            </Typography>
          </Grid>

          {/* Enrolment Date */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Enrolment Date:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ ml: 3.5 }}>
              {formatDate(student.enrolment_date)}
            </Typography>
          </Grid>

          {/* Created At */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Record Created:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ ml: 3.5 }}>
              {formatDate(student.created_at)}
            </Typography>
          </Grid>

          {/* Updated At */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Last Updated:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ ml: 3.5 }}>
              {formatDate(student.updated_at)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Additional Information Section */}
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Status:</strong> {student.is_active ? 'This student is currently active in the system.' : 'This student is inactive.'}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewStudentModal;