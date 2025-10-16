import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Pagination, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ActionToolbar from '../components/ActionToolbar';
import StudentTable from '../components/StudentTable';
import AddStudentModal from '../components/AddStudentModal';
import EditStudentModal from '../components/EditStudentModal'; // ← Import EditStudentModal
import ViewStudentModal from '../components/ViewStudentModal'; // ← Import ViewStudentModal
import SettingsModal from '../components/SettingsModal'; // ← Import SettingsModal
import LoadingSpinner from '../components/LoadingSpinner'; // ← Import LoadingSpinner
import { apiGet, apiPost, apiDelete } from '../utils/api'; // ← Import API utilities

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // < 900px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [displayedStudents, setDisplayedStudents] = useState([]); // ← Students to display on current page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Sidebar responsive: closed by default on mobile/tablet, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth > 900; // Open on desktop initially
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // ← Add edit modal state
  const [viewModalOpen, setViewModalOpen] = useState(false); // ← Add view modal state
  const [settingsModalOpen, setSettingsModalOpen] = useState(false); // ← Add settings modal state
  const [selectedStudent, setSelectedStudent] = useState(null); // ← Selected student for viewing/editing
  const [filterStatus, setFilterStatus] = useState('active'); // ← Add filter state
  const [sortConfig, setSortConfig] = useState({ field: 'none', order: 'none' }); // ← Add sort state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(() => {
    // Load saved preference from localStorage, default to 8
    const saved = localStorage.getItem('recordsPerPage');
    return saved ? parseInt(saved, 10) : 8;
  });
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState(() => {
    // Load saved preference from localStorage, default columns
    const saved = localStorage.getItem('visibleColumns');
    return saved ? JSON.parse(saved) : ['id', 'name', 'phone', 'email', 'course'];
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch students from backend (with authentication)
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching students with status:', filterStatus);
      const response = await apiGet(`/students?status=${filterStatus}`);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('Setting students:', data.students);
        setStudents(data.students || []);
        setAllStudents(data.students || []);
      } else {
        console.error('Response not OK:', response.status, data);
        setError('Failed to load students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Cannot connect to server or session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount and when filter changes
  useEffect(() => {
    fetchStudents();
  }, [filterStatus]);

  // Auto-close sidebar on mobile when screen resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Sorting: Apply sort when sortConfig or allStudents changes
  useEffect(() => {
    if (sortConfig.field === 'none') {
      // No sorting, use original order from allStudents
      setStudents([...allStudents]);
      return;
    }

    const sortedStudents = [...allStudents].sort((a, b) => {
      const aValue = a[sortConfig.field] || '';
      const bValue = b[sortConfig.field] || '';

      // Handle different data types
      let comparison = 0;
      
      if (sortConfig.field === 'enrolment_date') {
        // Date comparison
        const dateA = aValue ? new Date(aValue) : new Date(0);
        const dateB = bValue ? new Date(bValue) : new Date(0);
        comparison = dateA - dateB;
      } else if (sortConfig.field === 'id') {
        // Numeric comparison for ID
        comparison = Number(aValue) - Number(bValue);
      } else {
        // String comparison (case-insensitive)
        comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
      }

      return sortConfig.order === 'asc' ? comparison : -comparison;
    });

    setStudents(sortedStudents);
    setCurrentPage(1); // Reset to first page when sorting
  }, [sortConfig, allStudents]);

  // Pagination: Update displayed students when students or page changes
  useEffect(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = students.slice(indexOfFirstRecord, indexOfLastRecord);
    setDisplayedStudents(currentRecords);
  }, [students, currentPage, recordsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(students.length / recordsPerPage);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setSelectedStudents([]); // Clear selections when changing page
    setSelectAll(false);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setStudents(allStudents);
      setCurrentPage(1); // Reset to first page
      return;
    }
    
    const filtered = allStudents.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.course && student.course.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setStudents(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      // Select all students on current page only
      setSelectedStudents(displayedStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // ← Updated handleView to open modal
  const handleView = (student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        const response = await apiDelete(`/students/${student.id}`);
        
        if (response.ok) {
          alert(`${student.name} has been deleted`);
          fetchStudents(); // Refresh list
        } else {
          alert('Failed to delete student');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student or session expired');
      }
    }
  };

  const handleAddStudent = () => {
    setAddModalOpen(true);
  };

  const handleStudentAdded = (newStudent) => {
    console.log('New student added:', newStudent);
    fetchStudents(); // Refresh the student list
  };

  const handleStudentUpdated = (updatedStudent) => {
    console.log('Student updated:', updatedStudent);
    fetchStudents(); // Refresh the student list
  };

  const handleOpenSettings = () => {
    setSettingsModalOpen(true);
  };

  const handleSaveSettings = ({ recordsPerPage: newRecordsPerPage, visibleColumns: newVisibleColumns }) => {
    setRecordsPerPage(newRecordsPerPage);
    setVisibleColumns(newVisibleColumns);
    setCurrentPage(1); // Reset to first page when changing settings
  };

  const handleSortChange = (sortOption) => {
    console.log('Sort changed:', sortOption);
    setSortConfig(sortOption);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Delete ${selectedStudents.length} selected students?`)) {
      try {
        const response = await apiPost('/students/delete-multiple', { ids: selectedStudents });
        
        if (response.ok) {
          alert(`${selectedStudents.length} students deleted`);
          setSelectedStudents([]);
          setSelectAll(false);
          fetchStudents();
        } else {
          alert('Failed to delete students');
        }
      } catch (error) {
        console.error('Error deleting students:', error);
        alert('Error deleting students or session expired');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        onAddStudent={handleAddStudent}
        onSettings={handleOpenSettings}
        onLogout={handleLogout}
      />

      <Box component="main" sx={{ 
        flexGrow: 1, 
        bgcolor: '#f5f5f5', 
        minHeight: '100vh',
        width: { xs: '100%', sm: `calc(100% - ${sidebarOpen ? '280px' : '70px'})` },
        transition: 'width 0.3s ease'
      }}>
        <TopBar 
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={sidebarOpen}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          onOpenSettings={handleOpenSettings}
        />

        <Box sx={{ 
          p: { xs: 2, sm: 3, md: 4 }  // Responsive padding
        }}>
         

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <ActionToolbar
            selectAll={selectAll}
            onSelectAllChange={handleSelectAll}
            selectedCount={selectedStudents.length}
            onFilterChange={setFilterStatus}
            currentFilter={filterStatus}
            onSortChange={handleSortChange}
            currentSort={sortConfig}
          />

          {loading ? (
            <LoadingSpinner message="Loading students..." size={50} />
          ) : (
            <>
              <StudentTable
                students={displayedStudents}
                selectedStudents={selectedStudents}
                selectAll={selectAll}
                onSelectAll={handleSelectAll}
                onSelectStudent={handleSelectStudent}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                visibleColumns={visibleColumns}
              />

              {/* Pagination Controls */}
              <Box sx={{ 
                mt: 3, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' }
              }}>
                <Typography 
                  variant={isMobile ? "caption" : "body2"} 
                  color="text.secondary"
                  sx={{ order: { xs: 2, md: 1 } }}
                >
                  Showing {displayedStudents.length > 0 ? ((currentPage - 1) * recordsPerPage) + 1 : 0} - {Math.min(currentPage * recordsPerPage, students.length)} of {students.length} students
                  {students.length !== allStudents.length && ` (filtered from ${allStudents.length} total)`}
                </Typography>

                {/* Pagination Component */}
                {totalPages > 1 && (
                  <Pagination 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    showFirstButton={!isMobile}
                    showLastButton={!isMobile}
                    size={isMobile ? "small" : "medium"}
                    siblingCount={isMobile ? 0 : 1}
                    boundaryCount={isMobile ? 1 : 1}
                    sx={{
                      order: { xs: 1, md: 2 },
                      '& .MuiPaginationItem-root': {
                        '&.Mui-selected': {
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          color: 'white',
                        }
                      }
                    }}
                  />
                )}

                {selectedStudents.length > 0 && (
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={handleDeleteSelected}
                    size={isMobile ? "small" : "medium"}
                    fullWidth={isMobile}
                    sx={{ order: { xs: 3, md: 3 } }}
                  >
                    Delete Selected ({selectedStudents.length})
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Add Student Modal */}
      <AddStudentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onStudentAdded={handleStudentAdded}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onStudentUpdated={handleStudentUpdated}
      />

      {/* ← View Student Modal */}
      <ViewStudentModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />

      {/* ← Settings Modal */}
      <SettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        currentRecordsPerPage={recordsPerPage}
        currentVisibleColumns={visibleColumns}
        onSaveSettings={handleSaveSettings}
      />
    </Box>        
  );
};

export default Dashboard;
