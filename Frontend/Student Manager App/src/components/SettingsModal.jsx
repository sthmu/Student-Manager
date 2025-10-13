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
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Settings, ViewColumn } from '@mui/icons-material';

// Available columns in the student table
const AVAILABLE_COLUMNS = [
  { id: 'id', label: 'ID', mandatory: false },
  { id: 'name', label: 'Student Name', mandatory: true }, // Always shown
  { id: 'email', label: 'Email', mandatory: false },
  { id: 'phone', label: 'Phone', mandatory: false },
  { id: 'course', label: 'Course', mandatory: false },
  { id: 'enrolment_date', label: 'Enrolment Date', mandatory: false },
  { id: 'is_active', label: 'Status', mandatory: false }
];

const DEFAULT_COLUMNS = ['id', 'name', 'phone', 'email', 'course'];

const SettingsModal = ({ open, onClose, currentRecordsPerPage, currentVisibleColumns, onSaveSettings }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [recordsPerPage, setRecordsPerPage] = useState(currentRecordsPerPage);
  const [visibleColumns, setVisibleColumns] = useState(currentVisibleColumns || DEFAULT_COLUMNS);

  useEffect(() => {
    setRecordsPerPage(currentRecordsPerPage);
    setVisibleColumns(currentVisibleColumns || DEFAULT_COLUMNS);
  }, [currentRecordsPerPage, currentVisibleColumns]);

  const handleColumnToggle = (columnId) => {
    const column = AVAILABLE_COLUMNS.find(col => col.id === columnId);
    
    // Prevent toggling mandatory columns
    if (column?.mandatory) return;

    setVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        // Remove column (but keep at least one column)
        if (prev.length > 1) {
          return prev.filter(id => id !== columnId);
        }
        return prev;
      } else {
        // Add column
        return [...prev, columnId];
      }
    });
  };

  const handleSave = () => {
    // Save to localStorage for persistence
    localStorage.setItem('recordsPerPage', recordsPerPage.toString());
    localStorage.setItem('visibleColumns', JSON.stringify(visibleColumns));
    onSaveSettings({ recordsPerPage, visibleColumns });
    onClose();
  };

  const handleReset = () => {
    setRecordsPerPage(8); // Reset to default
    setVisibleColumns(DEFAULT_COLUMNS); // Reset to default columns
    localStorage.removeItem('recordsPerPage');
    localStorage.removeItem('visibleColumns');
    onSaveSettings({ recordsPerPage: 8, visibleColumns: DEFAULT_COLUMNS });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
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
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 1.5, sm: 2 }
      }}>
        <Settings fontSize={isMobile ? "small" : "medium"} />
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="600">
          Display Settings
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        {/* Records Per Page Setting */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
            📄 Display Density
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Customize how many student records you want to see per page
          </Typography>
          
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
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Column Visibility Setting */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ViewColumn sx={{ color: '#7c3aed' }} />
            <Typography variant="subtitle1" fontWeight="600">
              Table Columns
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select which columns to display in the student table
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
            <FormGroup>
              {AVAILABLE_COLUMNS.map((column) => (
                <FormControlLabel
                  key={column.id}
                  control={
                    <Checkbox
                      checked={visibleColumns.includes(column.id)}
                      onChange={() => handleColumnToggle(column.id)}
                      disabled={column.mandatory}
                      sx={{
                        color: '#7c3aed',
                        '&.Mui-checked': {
                          color: '#7c3aed',
                        },
                        '&.Mui-disabled': {
                          color: 'rgba(124, 58, 237, 0.5)',
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {column.label}
                      </Typography>
                      {column.mandatory && (
                        <Typography variant="caption" sx={{ 
                          color: 'white',
                          bgcolor: '#7c3aed',
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: '0.65rem'
                        }}>
                          Required
                        </Typography>
                      )}
                    </Box>
                  }
                />
              ))}
            </FormGroup>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', fontStyle: 'italic' }}>
              ℹ️ At least one column must be selected. Required columns cannot be hidden.
            </Typography>
          </Paper>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
          💡 Your preferences will be saved and applied automatically next time you visit
        </Typography>
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
