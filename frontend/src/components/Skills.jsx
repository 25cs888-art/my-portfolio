import React from 'react';

function Skills() {
  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: '🎨',
      skills: [
        { name: 'React.js', level: 90 },
        { name: 'JavaScript (ES6+)', level: 85 },
        { name: 'HTML5 & CSS3', level: 95 },
        { name: 'Responsive Web Design', level: 90 }
      ]
    },
    {
      title: 'Backend Development',
      icon: '⚙️',
      skills: [
        { name: 'Node.js', level: 85 },
        { name: 'Express.js', level: 80 },
        { name: 'REST APIs', level: 88 },
        { name: 'Middleware & Security', level: 78 }
      ]
    },
    {
      title: 'Databases & Infrastructure',
      icon: '💾',
      skills: [
        { name: 'MongoDB', level: 82 },
        { name: 'Mongoose ORM', level: 85 },
        { name: 'Git & GitHub', level: 90 },
        { name: 'Render / Vercel Deployments', level: 80 }
      ]
    }
  ];

  return (
    <section id="skills">
      <h2 className="section-title">Technical Expertise</h2>
      
      <div className="skills-grid">
        {skillCategories.map((category, catIdx) => (
          <div key={catIdx} className="skills-category glass-card">
            <h3>
              <span className="skills-icon">{category.icon}</span>
              {category.title}
            </h3>
            
            <div className="skills-list">
              {category.skills.map((skill, skillIdx) => (
                <div key={skillIdx} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-container">
                    <div 
                      className="skill-bar" 
                      style={{ 
                        width: `${skill.level}%`,
                        background: catIdx === 0 
                          ? 'linear-gradient(90deg, var(--primary), var(--secondary))' 
                          : catIdx === 1 
                          ? 'linear-gradient(90deg, var(--secondary), var(--accent))' 
                          : 'linear-gradient(90deg, var(--accent), var(--primary))'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
