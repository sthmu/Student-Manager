import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Avatar,
  Typography,
  Chip,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

// Column definitions
const COLUMN_CONFIG = {
  id: { label: 'ID', align: 'left' },
  name: { label: 'Student', align: 'left' },
  email: { label: 'Email', align: 'left' },
  phone: { label: 'Phone', align: 'left' },
  course: { label: 'Course', align: 'left' },
  enrolment_date: { label: 'Enrolment Date', align: 'left' },
  is_active: { label: 'Status', align: 'center' }
};

const StudentTable = ({ 
  students, 
  selectedStudents, 
  selectAll,
  onSelectAll,
  onSelectStudent,
  onView,
  onEdit,
  onDelete,
  visibleColumns = ['id', 'name', 'phone', 'email', 'course'] // Default columns
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to render cell content based on column type
  const renderCellContent = (column, student) => {
    switch (column) {
      case 'id':
        return student.id;
      
      case 'name':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Avatar 
              src={student.avatar} 
              alt={student.name}
              sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
            />
            <Typography variant={isMobile ? "body2" : "body1"}>{student.name}</Typography>
          </Box>
        );
      
      case 'email':
        return student.email || 'N/A';
      
      case 'phone':
        return student.phone || 'N/A';
      
      case 'course':
        return (
          <Chip 
            label={student.course || 'N/A'} 
            size="small" 
            color="primary"
            variant="outlined"
          />
        );
      
      case 'enrolment_date':
        return formatDate(student.enrolment_date);
      
      case 'is_active':
        return student.is_active ? (
          <Chip 
            icon={<CheckCircle />}
            label="Active" 
            size="small" 
            color="success"
            variant="outlined"
          />
        ) : (
          <Chip 
            icon={<Cancel />}
            label="Inactive" 
            size="small" 
            color="default"
            variant="outlined"
          />
        );
      
      default:
        return 'N/A';
    }
  };
  return (
    <TableContainer 
      component={Paper} 
      elevation={2}
      sx={{
        overflowX: 'auto',
        '& .MuiTable-root': {
          minWidth: { xs: 650, sm: 750 }
        }
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
            <TableCell padding="checkbox">
              <Checkbox 
                checked={selectAll}
                onChange={onSelectAll}
                size={isMobile ? "small" : "medium"}
              />
            </TableCell>
            {/* Dynamic column headers based on visibleColumns */}
            {visibleColumns.map((columnId) => (
              <TableCell 
                key={columnId} 
                align={COLUMN_CONFIG[columnId]?.align || 'left'}
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                <strong>{COLUMN_CONFIG[columnId]?.label || columnId}</strong>
              </TableCell>
            ))}
            <TableCell 
              align="center"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 }
              }}
            >
              <strong>Actions</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length + 2} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  No students found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow 
                key={student.id}
                hover
                sx={{ 
                  '&:hover': { bgcolor: '#f9f9f9' },
                  bgcolor: selectedStudents.includes(student.id) ? '#f0f0ff' : 'inherit'
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox 
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => onSelectStudent(student.id)}
                    size={isMobile ? "small" : "medium"}
                  />
                </TableCell>
                {/* Dynamic cell content based on visibleColumns */}
                {visibleColumns.map((columnId) => (
                  <TableCell 
                    key={columnId}
                    align={COLUMN_CONFIG[columnId]?.align || 'left'}
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 1, sm: 2 }
                    }}
                  >
                    {renderCellContent(columnId, student)}
                  </TableCell>
                ))}
                <TableCell 
                  align="center"
                  sx={{ px: { xs: 0.5, sm: 2 } }}
                >
                  <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, justifyContent: 'center' }}>
                    <IconButton 
                      size="small" 
                      color="info"
                      onClick={() => onView(student)}
                      title="View"
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                    >
                      <Visibility fontSize={isMobile ? "small" : "small"} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => onEdit(student)}
                      title="Edit"
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                    >
                      <Edit fontSize={isMobile ? "small" : "small"} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                      onClick={() => onDelete(student)}
                      title="Delete"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
