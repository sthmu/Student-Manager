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
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Sort,
  ArrowUpward,
  ArrowDownward,
  TrendingFlat
} from '@mui/icons-material';
import FilterPopup from './FilterPopup';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  selectAll, 
  onSelectAllChange, 
  selectedCount,
  onFilterChange,
  currentFilter,
  onSortChange,
  currentSort 
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
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

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleApplySort = (sortOption) => {
    onSortChange(sortOption);
    setSortAnchorEl(null);
  };

  const isFilterOpen = Boolean(filterAnchorEl);
  const isSortOpen = Boolean(sortAnchorEl);
  const isFilterActive = currentFilter !== 'active'; // Show badge if not default filter
  const isSortActive = currentSort && currentSort.field !== 'none'; // Show badge if sorting is applied
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

        {/* Sort Button */}
        <Tooltip title="Sort Students">
          <IconButton
            onClick={handleSortClick}
            sx={{
              height: { xs: 40, sm: 56 },
              width: { xs: 40, sm: 56 },
              border: '1px solid',
              borderColor: isSortActive ? '#10b981' : 'rgba(0, 0, 0, 0.23)',
              backgroundColor: isSortActive ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                borderColor: '#10b981'
              }
            }}
          >
            <Badge 
              variant="dot" 
              color="success"
              invisible={!isSortActive}
            >
              <Sort sx={{ 
                color: isSortActive ? '#10b981' : 'inherit',
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

        {/* Sort Menu */}
        <Menu
          anchorEl={sortAnchorEl}
          open={isSortOpen}
          onClose={handleSortClose}
          PaperProps={{
            sx: {
              minWidth: 220,
              mt: 1,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2
            }
          }}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2" color="text.secondary">
              Sort By
            </Typography>
          </MenuItem>
          <Divider />
          
          {/* ID Sorting */}
          <MenuItem onClick={() => handleApplySort({ field: 'id', order: 'asc' })}>
            <ListItemIcon>
              <ArrowUpward fontSize="small" />
            </ListItemIcon>
            <ListItemText>ID (Low to High)</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleApplySort({ field: 'id', order: 'desc' })}>
            <ListItemIcon>
              <ArrowDownward fontSize="small" />
            </ListItemIcon>
            <ListItemText>ID (High to Low)</ListItemText>
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          {/* Name Sorting */}
          <MenuItem onClick={() => handleApplySort({ field: 'name', order: 'asc' })}>
            <ListItemIcon>
              <ArrowUpward fontSize="small" />
            </ListItemIcon>
            <ListItemText>Name (A-Z)</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleApplySort({ field: 'name', order: 'desc' })}>
            <ListItemIcon>
              <ArrowDownward fontSize="small" />
            </ListItemIcon>
            <ListItemText>Name (Z-A)</ListItemText>
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          {/* Email Sorting */}
          <MenuItem onClick={() => handleApplySort({ field: 'email', order: 'asc' })}>
            <ListItemIcon>
              <ArrowUpward fontSize="small" />
            </ListItemIcon>
            <ListItemText>Email (A-Z)</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleApplySort({ field: 'email', order: 'desc' })}>
            <ListItemIcon>
              <ArrowDownward fontSize="small" />
            </ListItemIcon>
            <ListItemText>Email (Z-A)</ListItemText>
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          {/* Course Sorting */}
          <MenuItem onClick={() => handleApplySort({ field: 'course', order: 'asc' })}>
            <ListItemIcon>
              <ArrowUpward fontSize="small" />
            </ListItemIcon>
            <ListItemText>Course (A-Z)</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleApplySort({ field: 'course', order: 'desc' })}>
            <ListItemIcon>
              <ArrowDownward fontSize="small" />
            </ListItemIcon>
            <ListItemText>Course (Z-A)</ListItemText>
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          {/* Date Sorting */}
          <MenuItem onClick={() => handleApplySort({ field: 'enrolment_date', order: 'asc' })}>
            <ListItemIcon>
              <ArrowUpward fontSize="small" />
            </ListItemIcon>
            <ListItemText>Enrolment Date (Oldest)</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleApplySort({ field: 'enrolment_date', order: 'desc' })}>
            <ListItemIcon>
              <ArrowDownward fontSize="small" />
            </ListItemIcon>
            <ListItemText>Enrolment Date (Newest)</ListItemText>
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          {/* Clear Sort */}
          <MenuItem 
            onClick={() => handleApplySort({ field: 'none', order: 'none' })}
            sx={{ 
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.lighter'
              }
            }}
          >
            <ListItemIcon>
              <TrendingFlat fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>Clear Sorting</ListItemText>
          </MenuItem>
        </Menu>
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
