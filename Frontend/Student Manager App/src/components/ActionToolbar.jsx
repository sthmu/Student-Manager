import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Typography,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Paper,
  FormControlLabel
} from '@mui/material';
import { 
  FilterList, 
  Sort,
  ArrowUpward,
  ArrowDownward,
  Clear,
  CheckCircle,
  Cancel,
  RemoveCircle
} from '@mui/icons-material';

/**
 * Action Toolbar Component
 * Contains Filter, Sort, and Select All controls
 */
const ActionToolbar = ({ 
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

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilter = (status) => {
    onFilterChange(status);
    setFilterAnchorEl(null);
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
  const isFilterActive = currentFilter !== 'active';
  const isSortActive = currentSort && currentSort.field !== 'none';

  // Get filter label
  const getFilterLabel = () => {
    switch (currentFilter) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'all': return 'All';
      default: return 'Active';
    }
  };

  // Get sort label
  const getSortLabel = () => {
    if (!currentSort || currentSort.field === 'none') return 'None';
    
    const fieldNames = {
      id: 'ID',
      name: 'Name',
      email: 'Email',
      course: 'Course',
      enrolment_date: 'Date'
    };
    
    const fieldName = fieldNames[currentSort.field] || currentSort.field;
    const direction = currentSort.order === 'asc' ? '↑' : '↓';
    return `${fieldName} ${direction}`;
  };

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: '#fafafa' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        flexWrap: 'wrap'
      }}>
        {/* Select All Checkbox */}
        <FormControlLabel
          control={
            <Checkbox 
              checked={selectAll}
              onChange={onSelectAllChange}
              color="primary"
            />
          }
          label={
            <Typography variant="body2" fontWeight="500">
              {selectedCount > 0 ? `${selectedCount} selected` : 'Select All'}
            </Typography>
          }
        />

        <Box sx={{ flexGrow: 1 }} />

        {/* Current Filters/Sort Display */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {isFilterActive && (
            <Chip 
              label={`Filter: ${getFilterLabel()}`}
              size="small"
              color="primary"
              variant="outlined"
              onDelete={() => handleApplyFilter('active')}
            />
          )}
          {isSortActive && (
            <Chip 
              label={`Sort: ${getSortLabel()}`}
              size="small"
              color="secondary"
              variant="outlined"
              onDelete={() => handleApplySort({ field: 'none', order: 'none' })}
            />
          )}
        </Box>

        {/* Filter Button */}
        <Badge 
          color="primary" 
          variant="dot" 
          invisible={!isFilterActive}
        >
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleFilterClick}
            sx={{ 
              textTransform: 'none',
              borderColor: isFilterActive ? 'primary.main' : 'grey.300',
              color: isFilterActive ? 'primary.main' : 'text.primary'
            }}
          >
            Filter
          </Button>
        </Badge>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={isFilterOpen}
          onClose={handleFilterClose}
          PaperProps={{
            sx: { minWidth: 200 }
          }}
        >
          <MenuItem 
            onClick={() => handleApplyFilter('active')}
            selected={currentFilter === 'active'}
          >
            <ListItemIcon>
              <CheckCircle fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Active Students</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleApplyFilter('inactive')}
            selected={currentFilter === 'inactive'}
          >
            <ListItemIcon>
              <Cancel fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Inactive Students</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleApplyFilter('all')}
            selected={currentFilter === 'all'}
          >
            <ListItemIcon>
              <RemoveCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>All Students</ListItemText>
          </MenuItem>
        </Menu>

        {/* Sort Button */}
        <Badge 
          color="secondary" 
          variant="dot" 
          invisible={!isSortActive}
        >
          <Button
            variant="outlined"
            startIcon={<Sort />}
            onClick={handleSortClick}
            sx={{ 
              textTransform: 'none',
              borderColor: isSortActive ? 'secondary.main' : 'grey.300',
              color: isSortActive ? 'secondary.main' : 'text.primary'
            }}
          >
            Sort
          </Button>
        </Badge>

        {/* Sort Menu */}
        <Menu
          anchorEl={sortAnchorEl}
          open={isSortOpen}
          onClose={handleSortClose}
          PaperProps={{
            sx: { minWidth: 220 }
          }}
        >
          <MenuItem onClick={() => handleApplySort({ field: 'none', order: 'none' })}>
            <ListItemIcon>
              <Clear fontSize="small" />
            </ListItemIcon>
            <ListItemText>Clear Sorting</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={() => handleApplySort({ field: 'id', order: 'asc' })}>
            <ListItemIcon>
              <ArrowUpward fontSize="small" />
            </ListItemIcon>
            <ListItemText>ID (Ascending)</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleApplySort({ field: 'id', order: 'desc' })}>
            <ListItemIcon>
              <ArrowDownward fontSize="small" />
            </ListItemIcon>
            <ListItemText>ID (Descending)</ListItemText>
          </MenuItem>

          <Divider />

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

          <Divider />

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

          <Divider />

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

          <Divider />

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
        </Menu>
      </Box>
    </Paper>
  );
};

export default ActionToolbar;
