import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { Settings } from '@mui/icons-material';

const SettingsModal = ({ open, onClose, currentRecordsPerPage, onSaveSettings }) => {
  const [recordsPerPage, setRecordsPerPage] = useState(currentRecordsPerPage);

  useEffect(() => {
    setRecordsPerPage(currentRecordsPerPage);
  }, [currentRecordsPerPage]);

  const handleSave = () => {
    // Save to localStorage for persistence
    localStorage.setItem('recordsPerPage', recordsPerPage.toString());
    onSaveSettings(recordsPerPage);
    onClose();
  };

  const handleReset = () => {
    setRecordsPerPage(8); // Reset to default
    localStorage.removeItem('recordsPerPage');
    onSaveSettings(8);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
        alignItems: 'center', 
        gap: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 2
      }}>
        <Settings />
        <Typography variant="h6" fontWeight="600">
          Display Settings
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Customize how many student records you want to see per page
          </Typography>
          
          <Divider sx={{ mb: 3 }} />

          <FormControl fullWidth>
            <InputLabel id="records-per-page-label">Records Per Page</InputLabel>
            <Select
              labelId="records-per-page-label"
              id="records-per-page"
              value={recordsPerPage}
              label="Records Per Page"
              onChange={(e) => setRecordsPerPage(e.target.value)}
              sx={{
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#7c3aed',
                }
              }}
            >
              <MenuItem value={5}>5 records</MenuItem>
              <MenuItem value={8}>8 records (Default)</MenuItem>
              <MenuItem value={10}>10 records</MenuItem>
              <MenuItem value={15}>15 records</MenuItem>
              <MenuItem value={20}>20 records</MenuItem>
              <MenuItem value={25}>25 records</MenuItem>
              <MenuItem value={50}>50 records</MenuItem>
              <MenuItem value={100}>100 records</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            💡 Your preference will be saved and applied automatically next time you visit
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={handleReset}
          variant="outlined"
          sx={{
            borderColor: '#7c3aed',
            color: '#7c3aed',
            '&:hover': {
              borderColor: '#6d28d9',
              backgroundColor: 'rgba(124, 58, 237, 0.04)'
            }
          }}
        >
          Reset to Default
        </Button>
        <Button 
          onClick={onClose}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6d28d9 100%)',
            }
          }}
        >
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;
