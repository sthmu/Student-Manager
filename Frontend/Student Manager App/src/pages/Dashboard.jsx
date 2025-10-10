import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import SearchBar from '../components/SearchBar';
import StudentTable from '../components/StudentTable';
import AddStudentModal from '../components/AddStudentModal';
import ViewStudentModal from '../components/ViewStudentModal'; // ← Import ViewStudentModal

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false); // ← Add view modal state
  const [selectedStudent, setSelectedStudent] = useState(null); // ← Selected student for viewing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch students from backend
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/students');
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

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setStudents(allStudents);
      return;
    }
    
    const filtered = allStudents.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.course && student.course.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setStudents(filtered);
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedStudents(students.map(s => s.id));
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
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <StudentTable
                students={students}
                selectedStudents={selectedStudents}
                selectAll={selectAll}
                onSelectAll={handleSelectAll}
                onSelectStudent={handleSelectStudent}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {students.length} of {allStudents.length} students
                </Typography>
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
    </Box>        
  );
};

export default Dashboard;
