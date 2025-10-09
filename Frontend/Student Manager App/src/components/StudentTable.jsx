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
  Box
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material';

const StudentTable = ({ 
  students, 
  selectedStudents, 
  selectAll,
  onSelectAll,
  onSelectStudent,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
            <TableCell padding="checkbox">
              <Checkbox 
                checked={selectAll}
                onChange={onSelectAll}
              />
            </TableCell>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Student</strong></TableCell>
            <TableCell><strong>Address</strong></TableCell>
            <TableCell><strong>Contact</strong></TableCell>
            <TableCell><strong>Course</strong></TableCell>
            <TableCell align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
                  />
                </TableCell>
                <TableCell>{student.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={student.avatar} alt={student.name} />
                    <Typography>{student.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{student.address}</TableCell>
                <TableCell>{student.contact}</TableCell>
                <TableCell>
                  <Chip 
                    label={student.course} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton 
                      size="small" 
                      color="info"
                      onClick={() => onView(student)}
                      title="View"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => onEdit(student)}
                      title="Edit"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
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
