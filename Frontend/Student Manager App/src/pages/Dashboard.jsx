import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import SearchBar from '../components/SearchBar';
import StudentTable from '../components/StudentTable';

// Sample student data - Replace with actual data from backend
const initialStudents = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    address: '123 Main St, New York',
    contact: '+1 234-567-8901',
    course: 'Computer Science'
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    address: '456 Oak Ave, Boston',
    contact: '+1 234-567-8902',
    course: 'Business Administration'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    address: '789 Pine Rd, Chicago',
    contact: '+1 234-567-8903',
    course: 'Engineering'
  },
  {
    id: 4,
    name: 'Emily Davis',
    avatar: 'https://i.pravatar.cc/150?img=4',
    address: '321 Elm St, Seattle',
    contact: '+1 234-567-8904',
    course: 'Psychology'
  },
  {
    id: 5,
    name: 'David Wilson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    address: '654 Maple Dr, Denver',
    contact: '+1 234-567-8905',
    course: 'Mathematics'
  }
];

const Dashboard = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get user data from localStorage (saved during login)
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Toggle sidebar
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setStudents(initialStudents);
      return;
    }
    
    const filtered = initialStudents.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setStudents(filtered);
  };

  // Handle select all
  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  // Handle individual selection
  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // Handle actions
  const handleView = (student) => {
    alert(`Viewing details for ${student.name}`);
    // TODO: Open student details modal/page
  };

  const handleEdit = (student) => {
    alert(`Editing ${student.name}`);
    // TODO: Open edit student modal/page
  };

  const handleDelete = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      setStudents(students.filter(s => s.id !== student.id));
      alert(`${student.name} has been deleted`);
    }
  };

  const handleAddStudent = () => {
    alert('Opening Add New Student form...');
    // TODO: Navigate to add student page or open modal
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedStudents.length} selected students?`)) {
      setStudents(students.filter(s => !selectedStudents.includes(s.id)));
      setSelectedStudents([]);
      setSelectAll(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        onAddStudent={handleAddStudent}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Top Bar Component */}
        <TopBar 
          user={user}
          onLogout={handleLogout}
        />

        {/* Dashboard Content */}
        <Box sx={{ p: 4 }}>
          {/* Page Title */}
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
            Student Records
          </Typography>

          {/* Search Bar Component */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            selectAll={selectAll}
            onSelectAllChange={handleSelectAll}
            selectedCount={selectedStudents.length}
          />

          {/* Student Table Component */}
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

          {/* Summary Footer */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {students.length} of {initialStudents.length} students
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
        </Box>
      </Box>
    </Box>        
  );
};

export default Dashboard;
