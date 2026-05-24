import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './index.css';

// Component Imports
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TaskModal from './components/TaskModal';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [tasks, setTasks] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // null, 'create', or task object for editing
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const socketRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Fetch tasks
  const fetchTasks = async (authToken) => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast('Failed to fetch tasks', 'error');
    }
  };

  // Auth operations
  const handleAuthSuccess = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    fetchTasks(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setTasks([]);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    showToast('Logged out successfully', 'info');
  };

  // Task operations
  const handleCreateTask = async (taskData) => {
    try {
      await axios.post(`${API_BASE}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveModal(null);
      showToast('Task created successfully!', 'success');
      // No need to manually refresh; WebSockets will handle it.
      // But in case WS fails, we can fall back to manual fetch if needed
    } catch (err) {
      console.error(err);
      showToast('Failed to create task', 'error');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await axios.put(`${API_BASE}/tasks/${taskId}`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveModal(null);
      showToast('Task updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Task deleted successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete task', 'error');
    }
  };

  // Open edit modal helper
  const handleOpenEditModal = (taskId, statusUpdateOnly = null) => {
    const taskToEdit = tasks.find(t => t._id === taskId);
    if (statusUpdateOnly) {
      // Direct quick update
      handleUpdateTask(taskId, statusUpdateOnly);
    } else {
      // Open modal
      setActiveModal(taskToEdit);
    }
  };

  // Socket Connection and API loading on startup
  useEffect(() => {
    if (token && user) {
      fetchTasks(token);

      // Initialize Socket connection
      socketRef.current = io('http://localhost:5000');

      socketRef.current.on('connect', () => {
        console.log('Connected to WebSocket server');
        socketRef.current.emit('join', user.id);
      });

      // Listening for real-time task updates
      socketRef.current.on('taskCreated', (newTask) => {
        setTasks(prev => {
          if (prev.some(t => t._id === newTask._id)) return prev;
          return [newTask, ...prev];
        });
        showToast(`New task: "${newTask.title}" added`, 'info');
      });

      socketRef.current.on('taskUpdated', (updatedTask) => {
        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
      });

      socketRef.current.on('taskDeleted', (deletedTaskId) => {
        setTasks(prev => prev.filter(t => t._id !== deletedTaskId));
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [token, user?.id]);

  return (
    <div className="App">
      {/* Toast Alert Banner */}
      {toast.show && (
        <div className={`notification-banner ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Flow Router */}
      {!token ? (
        <Auth onAuthSuccess={handleAuthSuccess} showNotification={showToast} />
      ) : (
        <Dashboard
          user={user}
          tasks={tasks}
          onLogout={handleLogout}
          onCreateTask={() => setActiveModal('create')}
          onUpdateTask={handleOpenEditModal}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* Task Creation / Editing Modal */}
      {activeModal && (
        <TaskModal
          task={activeModal === 'create' ? null : activeModal}
          onClose={() => setActiveModal(null)}
          onSave={(taskData) => {
            if (activeModal === 'create') {
              handleCreateTask(taskData);
            } else {
              handleUpdateTask(activeModal._id, taskData);
            }
          }}
        />
      )}
    </div>
  );
}

export default App;