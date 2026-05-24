import React from 'react';

function Navbar({ onOpenAdmin, activeSection, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => onNavigate('home')}>
        Tharun
      </div>
      
      <div className="nav-links">
        <span 
          className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </span>
        <span 
          className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
          onClick={() => onNavigate('skills')}
        >
          Skills
        </span>
        <span 
          className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
          onClick={() => onNavigate('projects')}
        >
          Projects
        </span>
        <span 
          className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
          onClick={() => onNavigate('contact')}
        >
          Contact
        </span>
        
        <button className="nav-admin-btn" onClick={onOpenAdmin}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Admin
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
