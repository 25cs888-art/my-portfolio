import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form input states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveLink, setLiveLink] = useState('');

  const fetchProjects = () => {
    axios.get('https://my-portfolio-fj4k.onrender.com/api/projects')
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const techArray = techStack.split(',').map(tech => tech.trim()).filter(tech => tech !== '');

    const newProject = {
      title,
      description,
      techStack: techArray,
      githubLink,
      liveLink
    };

    axios.post('https://my-portfolio-fj4k.onrender.com/api/projects', newProject)
      .then(() => {
        fetchProjects();
        setTitle('');
        setDescription('');
        setTechStack('');
        setGithubLink('');
        setLiveLink('');
      })
      .catch(error => console.error("Error adding project:", error));
  };

  return (
    <div className="portfolio-container">
      <header>
        <h1>Balakumaran T</h1>
        <p className="subtitle">Full-Stack Developer Portfolio</p>
      </header>

      {/* This section will appear on your screen as soon as you save */}
      <section className="form-section">
        <h2>Add New Project</h2>
        <form onSubmit={handleSubmit} className="project-form">
          <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Project Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          <input type="text" placeholder="Tech Stack (comma separated: React, Node, MongoDB)" value={techStack} onChange={(e) => setTechStack(e.target.value)} required />
          <input type="url" placeholder="GitHub Repository URL" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} />
          <input type="url" placeholder="Live Demo URL" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
          <button type="submit">Publish to Portfolio</button>
        </form>
      </section>

      <main>
        <h2>My Projects</h2>
        {loading ? (
          <p>Connecting to database...</p>
        ) : projects.length === 0 ? (
          <p>No projects found. Ready to add some data!</p>
        ) : (
          <div className="project-grid">
            {projects.map(project => (
              <div key={project._id} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-tags">
                  {project.techStack.map((tech, index) => (
                    <span key={index} className="tag">{tech}</span>
                  ))}
                </div>
                <div className="links">
                  {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer">GitHub</a>}
                  {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer">Live Demo</a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;