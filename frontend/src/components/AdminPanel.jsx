import { useState, useEffect } from 'react';

function AdminPanel({ 
  onClose, 
  projects, 
  onAddProject, 
  onDeleteProject, 
  messages, 
  onRefreshMessages 
}) {
  const [activeTab, setActiveTab] = useState('add'); // 'add' | 'manage' | 'messages'
  
  // Project Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveLink, setLiveLink] = useState('');

  // Fetch messages when messages tab is clicked
  useEffect(() => {
    if (activeTab === 'messages' && onRefreshMessages) {
      onRefreshMessages();
    }
  }, [activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const techArray = techStack.split(',').map(t => t.trim()).filter(t => t !== '');
    
    onAddProject({
      title,
      description,
      techStack: techArray,
      githubLink,
      liveLink
    });

    // Reset form fields
    setTitle('');
    setDescription('');
    setTechStack('');
    setGithubLink('');
    setLiveLink('');
    
    // Switch to manage tab to see new project
    setActiveTab('manage');
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal glass-card">
        <button className="admin-close" onClick={onClose}>
          &times;
        </button>
        
        <div className="admin-header">
          <h2 className="text-gradient">Portfolio Admin Dashboard</h2>
          <p className="subtitle" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage projects and review contact submissions
          </p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add Project
          </button>
          <button 
            className={`admin-tab ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Projects ({projects.length})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Inquiries ({messages.length})
          </button>
        </div>

        <div className="admin-content">
          {/* TAB 1: ADD PROJECT */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Project Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Task Manager Dashboard" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  className="form-input" 
                  placeholder="Detail the project's purpose and scope..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Tech Stack * (comma separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. React, Node.js, Express, MongoDB" 
                  value={techStack} 
                  onChange={(e) => setTechStack(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>GitHub Link</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://github.com/..." 
                  value={githubLink} 
                  onChange={(e) => setGithubLink(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Live Demo Link</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://..." 
                  value={liveLink} 
                  onChange={(e) => setLiveLink(e.target.value)} 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                Publish Project
              </button>
            </form>
          )}

          {/* TAB 2: MANAGE PROJECTS */}
          {activeTab === 'manage' && (
            <div className="admin-list">
              {projects.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                  No projects available. Publish some from the first tab!
                </p>
              ) : (
                projects.map(project => (
                  <div key={project._id} className="admin-item">
                    <div className="admin-item-info">
                      <span className="admin-item-title">{project.title}</span>
                      <span className="admin-item-subtitle">
                        {project.techStack.join(', ')}
                      </span>
                    </div>
                    <button 
                      className="btn-delete" 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
                          onDeleteProject(project._id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: INCOMING MESSAGES */}
          {activeTab === 'messages' && (
            <div className="message-grid">
              {messages.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                  No messages found in your inbox.
                </p>
              ) : (
                messages.map(msg => (
                  <div key={msg._id} className="message-card glass-card">
                    <div className="message-meta">
                      <div className="message-sender">
                        <span className="message-name">{msg.name}</span>
                        <span className="message-email">{msg.email}</span>
                      </div>
                      <span className="message-date">{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className="message-text">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
