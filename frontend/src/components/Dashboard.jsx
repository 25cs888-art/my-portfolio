import React, { useState } from 'react';
import { Plus, Search, Calendar, Edit2, Trash2, LogOut, CheckCircle, Clock, ListTodo, ShieldAlert, Check } from 'lucide-react';

export default function Dashboard({ user, tasks, onLogout, onCreateTask, onUpdateTask, onDeleteTask }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTaskModal, setActiveTaskModal] = useState(null); // 'create' or task object for 'edit'

  // Calculations for stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks based on Search and Priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // Group tasks by status
  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    completed: filteredTasks.filter(t => t.status === 'completed')
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dateStr, status) => {
    if (!dateStr || status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    return dueDate < today;
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <ListTodo size={28} color="#6366f1" />
          <h1>Taskify</h1>
        </div>
        <div className="user-badge">
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-email">{user?.email}</div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onLogout} title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <ListTodo size={24} />
          </div>
          <div className="stat-info">
            <h4>Total Tasks</h4>
            <p>{totalTasks}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h4>In Progress</h4>
            <p>{inProgressTasks}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h4>Completed</h4>
            <p>{completedTasks}</p>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ minWidth: '220px' }}>
          <div className="stat-info" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4>Completion</h4>
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#c084fc' }}>{completionRate}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${completionRate}%`, height: '100%', background: 'linear-gradient(to right, #818cf8, #c084fc)', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Workspace */}
      <main className="dashboard-main">
        {/* Controls Bar */}
        <div className="controls-bar">
          <div className="search-filter-group">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={() => onCreateTask()}>
            <Plus size={18} /> Add New Task
          </button>
        </div>

        {/* Board Columns */}
        <div className="board-grid">
          {/* TO DO COLUMN */}
          <div className="board-column">
            <div className="column-header">
              <div className="column-title">
                <ListTodo size={18} color="#60a5fa" />
                <h3>To Do</h3>
              </div>
              <span className="column-badge" style={{ background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa' }}>
                {tasksByStatus.todo.length}
              </span>
            </div>
            <div className="task-list">
              {tasksByStatus.todo.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onUpdateTask}
                  onDelete={onDeleteTask}
                  getPriorityClass={getPriorityClass}
                  formatDueDate={formatDueDate}
                  isOverdue={isOverdue}
                />
              ))}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="board-column">
            <div className="column-header">
              <div className="column-title">
                <Clock size={18} color="#fbbf24" />
                <h3>In Progress</h3>
              </div>
              <span className="column-badge" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
                {tasksByStatus['in-progress'].length}
              </span>
            </div>
            <div className="task-list">
              {tasksByStatus['in-progress'].map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onUpdateTask}
                  onDelete={onDeleteTask}
                  getPriorityClass={getPriorityClass}
                  formatDueDate={formatDueDate}
                  isOverdue={isOverdue}
                />
              ))}
            </div>
          </div>

          {/* COMPLETED COLUMN */}
          <div className="board-column">
            <div className="column-header">
              <div className="column-title">
                <CheckCircle size={18} color="#34d399" />
                <h3>Completed</h3>
              </div>
              <span className="column-badge" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                {tasksByStatus.completed.length}
              </span>
            </div>
            <div className="task-list">
              {tasksByStatus.completed.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onUpdateTask}
                  onDelete={onDeleteTask}
                  getPriorityClass={getPriorityClass}
                  formatDueDate={formatDueDate}
                  isOverdue={isOverdue}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Inner helper TaskCard component
function TaskCard({ task, onEdit, onDelete, getPriorityClass, formatDueDate, isOverdue }) {
  const formattedDate = formatDueDate(task.dueDate);
  const isExpired = isOverdue(task.dueDate, task.status);

  const moveStatus = (newStatus) => {
    onEdit(task._id, { status: newStatus });
  };

  return (
    <div className={`task-card glass-panel ${getPriorityClass(task.priority)}`}>
      <div className="task-header">
        <h4 className="task-title" style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', opacity: task.status === 'completed' ? 0.6 : 1 }}>
          {task.title}
        </h4>
        <div className="task-actions">
          <button className="task-action-btn" onClick={() => onEdit(task._id)} title="Edit Task">
            <Edit2 size={14} />
          </button>
          <button className="task-action-btn delete" onClick={() => onDelete(task._id)} title="Delete Task">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description" style={{ opacity: task.status === 'completed' ? 0.5 : 0.8 }}>
          {task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span className="tag-badge" style={{
          background: task.priority === 'high' ? 'var(--priority-high-bg)' : task.priority === 'medium' ? 'var(--priority-medium-bg)' : 'var(--priority-low-bg)',
          color: task.priority === 'high' ? 'var(--priority-high)' : task.priority === 'medium' ? 'var(--priority-medium)' : 'var(--priority-low)'
        }}>
          {task.priority}
        </span>
      </div>

      <div className="task-meta">
        <div className={`task-due-date ${isExpired ? 'overdue' : ''}`}>
          {formattedDate && (
            <>
              {isExpired ? <ShieldAlert size={12} /> : <Calendar size={12} />}
              <span>{isExpired ? `Overdue: ${formattedDate}` : formattedDate}</span>
            </>
          )}
        </div>

        {/* Quick status moves */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {task.status === 'todo' && (
            <button className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.75rem', borderRadius: '4px' }} onClick={() => moveStatus('in-progress')}>
              Start
            </button>
          )}
          {task.status === 'in-progress' && (
            <>
              <button className="btn btn-secondary" style={{ padding: '3px 6px', fontSize: '0.75rem', borderRadius: '4px' }} onClick={() => moveStatus('todo')}>
                Back
              </button>
              <button className="btn btn-primary" style={{ padding: '3px 8px', fontSize: '0.75rem', borderRadius: '4px' }} onClick={() => moveStatus('completed')}>
                Finish
              </button>
            </>
          )}
          {task.status === 'completed' && (
            <button className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.75rem', borderRadius: '4px' }} onClick={() => moveStatus('in-progress')}>
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
