import { useState, useEffect } from 'react';
import {
  Popover,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider
} from '@mui/material';

const FilterPopup = ({ anchorEl, open, onClose, onApplyFilter, currentFilter }) => {
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  // Update checkboxes when currentFilter changes
  useEffect(() => {
    if (currentFilter === 'active') {
      setShowActive(true);
      setShowInactive(false);
    } else if (currentFilter === 'inactive') {
      setShowActive(false);
      setShowInactive(true);
    } else if (currentFilter === 'all') {
      setShowActive(true);
      setShowInactive(true);
    }
  }, [currentFilter]);

  const handleApply = () => {
    let status;
    if (showActive && showInactive) {
      status = 'all';
    } else if (showActive) {
      status = 'active';
    } else if (showInactive) {
      status = 'inactive';
    } else {
      status = 'active'; // Default to active if nothing selected
    }
    
    onApplyFilter(status);
    onClose();
  };

  const handleReset = () => {
    setShowActive(true);
    setShowInactive(false);
    onApplyFilter('active');
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          p: 2,
          width: 250,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 2
        }
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Filter Students
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox 
              checked={showActive} 
              onChange={(e) => setShowActive(e.target.checked)}
              sx={{
                color: '#7c3aed',
                '&.Mui-checked': {
                  color: '#7c3aed',
                }
              }}
            />
          }
          label="Active Students"
        />
        <FormControlLabel
          control={
            <Checkbox 
              checked={showInactive} 
              onChange={(e) => setShowInactive(e.target.checked)}
              sx={{
                color: '#7c3aed',
                '&.Mui-checked': {
                  color: '#7c3aed',
                }
              }}
            />
          }
          label="Inactive Students"
        />
      </FormGroup>

      <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleReset}
          sx={{
            borderColor: '#7c3aed',
            color: '#7c3aed',
            '&:hover': {
              borderColor: '#6d28d9',
              backgroundColor: 'rgba(124, 58, 237, 0.04)'
            }
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6d28d9 100%)',
            }
          }}
        >
          Apply
        </Button>
      </Box>
    </Popover>
  );
};

export default FilterPopup;
