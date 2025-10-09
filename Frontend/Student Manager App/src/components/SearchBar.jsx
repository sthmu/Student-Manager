import {
  Box,
  Card,
  TextField,
  Button,
  Checkbox,
  Typography,
  Chip,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  selectAll, 
  onSelectAllChange, 
  selectedCount 
}) => {
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
