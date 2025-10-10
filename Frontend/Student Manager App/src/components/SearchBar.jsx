import { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Checkbox,
  Typography,
  Chip,
  InputAdornment,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import FilterPopup from './FilterPopup';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  selectAll, 
  onSelectAllChange, 
  selectedCount,
  onFilterChange,
  currentFilter 
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilter = (status) => {
    onFilterChange(status);
  };

  const isFilterOpen = Boolean(filterAnchorEl);
  const isFilterActive = currentFilter !== 'active'; // Show badge if not default filter
  return (
    <Card sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search by name, course, or address..."
          variant="outlined"
          size="medium"
          value={searchQuery}
          onChange={onSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="contained" 
          onClick={onSearch}
          sx={{ 
            height: 56,
            px: 4,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
          }}
        >
          Search
        </Button>
        
        {/* Filter Button */}
        <Tooltip title="Filter Students">
          <IconButton
            onClick={handleFilterClick}
            sx={{
              height: 56,
              width: 56,
              border: '1px solid',
              borderColor: isFilterActive ? '#7c3aed' : 'rgba(0, 0, 0, 0.23)',
              backgroundColor: isFilterActive ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(124, 58, 237, 0.12)',
                borderColor: '#7c3aed'
              }
            }}
          >
            <Badge 
              variant="dot" 
              color="secondary"
              invisible={!isFilterActive}
            >
              <FilterList sx={{ color: isFilterActive ? '#7c3aed' : 'inherit' }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Filter Popup */}
        <FilterPopup
          anchorEl={filterAnchorEl}
          open={isFilterOpen}
          onClose={handleFilterClose}
          onApplyFilter={handleApplyFilter}
          currentFilter={currentFilter}
        />
      </Box>

      {/* Select All Checkbox */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Checkbox 
          checked={selectAll}
          onChange={onSelectAllChange}
        />
        <Typography variant="body2">
          Select All ({selectedCount} selected)
        </Typography>
        {selectedCount > 0 && (
          <Chip 
            label={`${selectedCount} items selected`}
            color="primary"
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </Box>
    </Card>
  );
};

export default SearchBar;
