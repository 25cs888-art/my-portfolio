import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Component Imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import AdminPanel from './components/AdminPanel';

// Determine API Base URL dynamically
const API_BASE = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://my-portfolio-fj4k.onrender.com/api' // Fallback Render backend
);

function App() {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submittingContact, setSubmittingContact] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const fetchProjects = () => {
    setLoading(true);
    axios.get(`${API_BASE}/projects`)
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching projects:", error);
        showToast("Error connecting to project database", "error");
        setLoading(false);
      });
  };

  const fetchMessages = () => {
    axios.get(`${API_BASE}/contacts`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error("Error fetching messages:", error);
      });
  };

  useEffect(() => {
    fetchProjects();
    fetchMessages();

    // Scroll listener to update active nav link
    const handleScroll = () => {
      const sections = ['home', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleAddProject = (newProject) => {
    axios.post(`${API_BASE}/projects`, newProject)
      .then(() => {
        fetchProjects();
        showToast("Project added successfully!");
      })
      .catch(error => {
        console.error("Error adding project:", error);
        showToast("Failed to add project", "error");
      });
  };

  const handleDeleteProject = (projectId) => {
    axios.delete(`${API_BASE}/projects/${projectId}`)
      .then(() => {
        fetchProjects();
        showToast("Project deleted successfully!");
      })
      .catch(error => {
        console.error("Error deleting project:", error);
        showToast("Failed to delete project", "error");
      });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      showToast("Please fill in all contact fields", "error");
      return;
    }

    setSubmittingContact(true);
    const messageData = {
      name: contactName,
      email: contactEmail,
      message: contactMessage
    };

    axios.post(`${API_BASE}/contacts`, messageData)
      .then(() => {
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setSubmittingContact(false);
        showToast("Message sent! I'll get back to you soon.");
        fetchMessages(); // Refresh message list for admin
      })
      .catch(error => {
        console.error("Error sending message:", error);
        showToast("Failed to send message. Please try again.", "error");
        setSubmittingContact(false);
      });
  };

  return (
    <div className="portfolio-container">
      {/* Dynamic Toast Alert */}
      {toast.show && (
        <div className="toast" style={{ borderLeftColor: toast.type === 'error' ? 'var(--danger)' : 'var(--accent)' }}>
          <span>{toast.type === 'error' ? '❌' : '✨'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar 
        onOpenAdmin={() => setIsAdminOpen(true)} 
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Hero Section */}
      <Hero onNavigate={handleNavigate} />

      {/* Skills Section */}
      <Skills />

      {/* Projects Grid Section */}
      <section id="projects" className="projects-section">
        <h2 className="section-title">Recent Creations</h2>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Retrieving from database...</p>
        ) : projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No projects discovered yet.</p>
        ) : (
          <div className="project-grid">
            {projects.map(project => (
              <div key={project._id} className="project-card glass-card">
                <div className="project-card-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="tech-tags">
                    {project.techStack.map((tech, index) => (
                      <span key={index} className="tag">{tech}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="project-link">
                        Code
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" className="project-link live-btn">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ background: 'rgba(9, 13, 22, 0.2)' }}>
        <h2 className="section-title">Get In Touch</h2>
        
        <div className="contact-container">
          <div className="contact-info">
            <h3>Let's collaborate!</h3>
            <p>
              I am open to discuss web applications development, architecture design, 
              freelance roles, or full-time development opportunities. Send a message 
              and let's build something epic together.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon-wrapper">📧</div>
                <div>
                  <div className="contact-text-label">Email</div>
                  <div className="contact-text-value">tharun@example.com</div>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon-wrapper">📍</div>
                <div>
                  <div className="contact-text-label">Location</div>
                  <div className="contact-text-value">India</div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper glass-card">
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="user_name">Your Name</label>
                <input 
                  type="text" 
                  id="user_name" 
                  className="form-input" 
                  placeholder="John Doe" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_email">Your Email</label>
                <input 
                  type="email" 
                  id="user_email" 
                  className="form-input" 
                  placeholder="john@example.com" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_message">Message</label>
                <textarea 
                  id="user_message" 
                  className="form-input" 
                  placeholder="Hey, I'd like to talk about..." 
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submittingContact}
              >
                {submittingContact ? 'Delivering...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-logo">Tharun</div>
        <div className="footer-nav">
          <span onClick={() => handleNavigate('home')}>Home</span>
          <span onClick={() => handleNavigate('skills')}>Skills</span>
          <span onClick={() => handleNavigate('projects')}>Projects</span>
          <span onClick={() => handleNavigate('contact')}>Contact</span>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Tharun. All rights reserved. Full-stack Project Portfolio.
        </div>
      </footer>

      {/* Admin Panel Modal Overlay */}
      {isAdminOpen && (
        <AdminPanel 
          onClose={() => setIsAdminOpen(false)}
          projects={projects}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          messages={messages}
          onRefreshMessages={fetchMessages}
        />
      )}
    </div>
  );
}

export default App;