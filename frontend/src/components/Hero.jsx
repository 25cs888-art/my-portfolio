import React from 'react';

function Hero({ onNavigate }) {
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <p className="hero-subtitle">Welcome to my space</p>
        <h1 className="hero-title">
          Hi, I'm <span className="text-gradient">Tharun</span> <br />
          Full-Stack Developer
        </h1>
        <p className="hero-bio">
          I build high-performance web applications with modern architectures. 
          Focusing on robust backend logic, sleek database design, and elegant 
          responsive interfaces that deliver seamless user experiences.
        </p>
        
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => onNavigate('projects')}>
            View Projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('contact')}>
            Let's Talk
          </button>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="blob-container">
          <div className="blob-background"></div>
          <div className="hero-img-container">
            {/* Beautiful dynamic developer visual code representation */}
            <span className="hero-img-placeholder">💻</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
