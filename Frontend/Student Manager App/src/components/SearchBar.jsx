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
  Badge,
  useMediaQuery,
  useTheme
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Card sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1, sm: 2 }, 
        alignItems: 'center', 
        mb: 2,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <TextField
          placeholder={isMobile ? "Search..." : "Search by name, course, or address..."}
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          value={searchQuery}
          onChange={onSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          sx={{ 
            flexGrow: 1,
            width: { xs: '100%', sm: 'auto' }
          }}
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
          fullWidth={isMobile}
          sx={{ 
            height: { xs: 40, sm: 56 },
            px: { xs: 2, sm: 4 },
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
              height: { xs: 40, sm: 56 },
              width: { xs: 40, sm: 56 },
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
              <FilterList sx={{ 
                color: isFilterActive ? '#7c3aed' : 'inherit',
                fontSize: { xs: 20, sm: 24 }
              }} />
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
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        flexWrap: 'wrap'
      }}>
        <Checkbox 
          checked={selectAll}
          onChange={onSelectAllChange}
          size={isMobile ? "small" : "medium"}
        />
        <Typography variant={isMobile ? "caption" : "body2"}>
          Select All ({selectedCount} selected)
        </Typography>
        {selectedCount > 0 && (
          <Chip 
            label={`${selectedCount} items selected`}
            color="primary"
            size="small"
            sx={{ ml: { xs: 0, sm: 2 } }}
          />
        )}
      </Box>
    </Card>
  );
};

export default SearchBar;
