import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Pagination } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import SearchBar from '../components/SearchBar';
import StudentTable from '../components/StudentTable';
import AddStudentModal from '../components/AddStudentModal';
import ViewStudentModal from '../components/ViewStudentModal'; // ← Import ViewStudentModal
import SettingsModal from '../components/SettingsModal'; // ← Import SettingsModal

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [displayedStudents, setDisplayedStudents] = useState([]); // ← Students to display on current page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false); // ← Add view modal state
  const [settingsModalOpen, setSettingsModalOpen] = useState(false); // ← Add settings modal state
  const [selectedStudent, setSelectedStudent] = useState(null); // ← Selected student for viewing
  const [filterStatus, setFilterStatus] = useState('active'); // ← Add filter state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(() => {
    // Load saved preference from localStorage, default to 8
    const saved = localStorage.getItem('recordsPerPage');
    return saved ? parseInt(saved, 10) : 8;
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch students from backend
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/students?status=${filterStatus}`);
      const data = await response.json();
      
      if (response.ok) {
        setStudents(data.students);
        setAllStudents(data.students);
      } else {
        setError('Failed to load students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Cannot connect to server. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount and when filter changes
  useEffect(() => {
    fetchStudents();
  }, [filterStatus]);

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
    alert(`Edit functionality coming soon for ${student.name}`);
    // TODO: Open edit modal
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${student.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          alert(`${student.name} has been deleted`);
          fetchStudents(); // Refresh list
        } else {
          alert('Failed to delete student');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student');
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

  const handleOpenSettings = () => {
    setSettingsModalOpen(true);
  };

  const handleSaveSettings = (newRecordsPerPage) => {
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(1); // Reset to first page when changing records per page
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
        const response = await fetch('http://localhost:5000/api/students/delete-multiple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ids: selectedStudents })
        });
        
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
        alert('Error deleting students');
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

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <TopBar 
          user={user}
          onLogout={handleLogout}
        />

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
            Student Records
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            selectAll={selectAll}
            onSelectAllChange={handleSelectAll}
            selectedCount={selectedStudents.length}
            onFilterChange={setFilterStatus}
            currentFilter={filterStatus}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
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
              />

              {/* Pagination Controls */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
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
                    showFirstButton
                    showLastButton
                    sx={{
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
        onSaveSettings={handleSaveSettings}
      />
    </Box>        
  );
};

export default Dashboard;
