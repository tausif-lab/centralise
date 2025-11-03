// src/components/sections/PortfolioGenerator.jsx
import React, { useState } from 'react';
import { FileText, QrCode, Download, Eye, Loader } from 'lucide-react';
import '../../styles/sections/portfolio.css';

const PortfolioGenerator = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolioData] = useState({
    name: 'Sarah Johnson',
    role: 'Full Stack Developer',
    bio: 'Passionate about building scalable web applications',
    email: 'sarah.johnson@student.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    projects: [
      { title: 'E-Commerce Platform', description: 'React + Node.js + MongoDB' },
      { title: 'Task Management App', description: 'React Native application' }
    ],
    skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
    achievements: [
      'Hackathon Winner - TechFest 2024',
      'Dean\'s List',
      'AWS Certified'
    ]
  });

  const [generatedFiles, setGeneratedFiles] = useState([
    { id: 1, name: 'Portfolio_Sarah_Johnson.pdf', size: '2.4 MB', date: '2024-02-15', type: 'pdf' },
    { id: 2, name: 'Portfolio_QR_Code.png', size: '125 KB', date: '2024-02-15', type: 'qr' }
  ]);

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newFile = {
        id: generatedFiles.length + 1,
        name: `Portfolio_${portfolioData.name.replace(' ', '_')}_${Date.now()}.pdf`,
        size: '2.4 MB',
        date: new Date().toISOString().split('T')[0],
        type: 'pdf'
      };
      setGeneratedFiles([...generatedFiles, newFile]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleGenerateQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newFile = {
        id: generatedFiles.length + 1,
        name: `Portfolio_QR_Code_${Date.now()}.png`,
        size: '125 KB',
        date: new Date().toISOString().split('T')[0],
        type: 'qr'
      };
      setGeneratedFiles([...generatedFiles, newFile]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="portfolio-section">
      <div className="section-header">
        <div>
          <h2>Portfolio Generator</h2>
          <p>Create and manage your professional portfolio</p>
        </div>
      </div>

      <div className="portfolio-tabs">
        <button
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          📄 Generate
        </button>
        <button
          className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          👁️ Preview
        </button>
        <button
          className={`tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          📁 My Files
        </button>
      </div>

      {activeTab === 'generate' && (
        <div className="generate-section">
          <div className="generation-options">
            <div className="option-card pdf-card">
              <div className="option-icon">📄</div>
              <h3>Generate PDF Portfolio</h3>
              <p>Create a professional PDF document of your portfolio</p>
              <ul className="features-list">
                <li>✓ Professional formatting</li>
                <li>✓ All your information included</li>
                <li>✓ Ready to download & share</li>
                <li>✓ Customizable templates</li>
              </ul>
              <button 
                className="generate-btn pdf-btn"
                onClick={handleGeneratePDF}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader size={18} className="spinning" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    Generate PDF
                  </>
                )}
              </button>
            </div>

            <div className="option-card qr-card">
              <div className="option-icon">🔲</div>
              <h3>Generate QR Code</h3>
              <p>Create a scannable QR code linking to your portfolio</p>
              <ul className="features-list">
                <li>✓ Scannable QR code</li>
                <li>✓ Links to your profile</li>
                <li>✓ Share on business cards</li>
                <li>✓ Track scans</li>
              </ul>
              <button 
                className="generate-btn qr-btn"
                onClick={handleGenerateQR}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader size={18} className="spinning" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode size={18} />
                    Generate QR
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="template-selection">
            <h3>Choose Portfolio Template</h3>
            <div className="templates-grid">
              {[1, 2, 3].map(template => (
                <div key={template} className="template-card">
                  <div className="template-preview">
                    <div className="template-placeholder">Template {template}</div>
                  </div>
                  <button className="select-template-btn">Select</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="preview-section">
          <div className="portfolio-preview">
            <div className="preview-header">
              <h2>{portfolioData.name}</h2>
              <p>{portfolioData.role}</p>
            </div>

            <div className="preview-content">
              <section className="preview-section-item">
                <h3>About</h3>
                <p>{portfolioData.bio}</p>
              </section>

              <section className="preview-section-item">
                <h3>Contact Information</h3>
                <div className="contact-grid">
                  <p>📧 {portfolioData.email}</p>
                  <p>📱 {portfolioData.phone}</p>
                  <p>📍 {portfolioData.location}</p>
                </div>
              </section>

              <section className="preview-section-item">
                <h3>Skills</h3>
                <div className="skills-grid-preview">
                  {portfolioData.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </section>

              <section className="preview-section-item">
                <h3>Projects</h3>
                <div className="projects-list">
                  {portfolioData.projects.map((project, idx) => (
                    <div key={idx} className="project-item">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="preview-section-item">
                <h3>Achievements</h3>
                <ul className="achievements-list">
                  {portfolioData.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="files-section">
          <div className="files-list">
            {generatedFiles.length > 0 ? (
              generatedFiles.map(file => (
                <div key={file.id} className={`file-item ${file.type}`}>
                  <div className="file-icon">
                    {file.type === 'pdf' ? '📄' : '🔲'}
                  </div>
                  <div className="file-info">
                    <h4>{file.name}</h4>
                    <div className="file-meta">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.date}</span>
                    </div>
                  </div>
                  <div className="file-actions">
                    <button className="action-btn view-btn">
                      <Eye size={18} />
                      View
                    </button>
                    <button className="action-btn download-btn">
                      <Download size={18} />
                      Download
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3>No Files Generated Yet</h3>
                <p>Generate your first portfolio file</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGenerator;