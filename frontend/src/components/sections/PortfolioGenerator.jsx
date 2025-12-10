// src/components/sections/PortfolioGenerator.jsx
import React, { useState, useEffect } from 'react';
import { FileText, QrCode, Download, Eye, Loader } from 'lucide-react';
import '../../styles/sections/portfolio.css';

const PortfolioGenerator = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      fetchPortfolioData(userData.user1Id || userData._id);
    }
  }, []);

  const fetchPortfolioData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/portfolio/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPortfolioData(data);
      } else {
        console.error('Failed to fetch portfolio data');
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    }
  };

  const handleGeneratePDF = async () => {
    if (!user) {
      setError('User not found. Please login again.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const userId = user.user1Id || user._id;
      const response = await fetch(`http://localhost:3001/api/portfolio/${userId}/pdf`);
      
      if (response.ok) {
        // Create blob from response
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${user.fullName?.replace(/\s+/g, '_')}_portfolio.pdf` || 'portfolio.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Add to generated files list
        const newFile = {
          id: Date.now(),
          name: `${user.fullName?.replace(/\s+/g, '_')}_portfolio.pdf` || 'portfolio.pdf',
          size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
          date: new Date().toISOString().split('T')[0],
          type: 'pdf'
        };
        setGeneratedFiles(prev => [newFile, ...prev]);
        
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('An error occurred while generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQR = () => {
    setIsGenerating(true);
    // Mock QR generation for now
    setTimeout(() => {
      const newFile = {
        id: Date.now(),
        name: `Portfolio_QR_Code_${Date.now()}.png`,
        size: '125 KB',
        date: new Date().toISOString().split('T')[0],
        type: 'qr'
      };
      setGeneratedFiles(prev => [newFile, ...prev]);
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

      {/* Error Display */}
      {error && (
        <div className="error-message" style={{
          background: '#fee',
          color: '#c00',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

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
          {portfolioData && portfolioData.user ? (
            <div className="portfolio-preview">
              <div className="preview-header">
                <h2>{portfolioData.user.fullName}</h2>
                <p>{portfolioData.user.branch || 'Student'}</p>
              </div>

              <div className="preview-content">
                {portfolioData.portfolio?.profileSummary && (
                  <section className="preview-section-item">
                    <h3>Professional Summary</h3>
                    <p>{portfolioData.portfolio.profileSummary}</p>
                  </section>
                )}

                <section className="preview-section-item">
                  <h3>Contact Information</h3>
                  <div className="contact-grid">
                    {portfolioData.user.email && <p>📧 {portfolioData.user.email}</p>}
                    {portfolioData.user.phone && <p>📱 {portfolioData.user.phone}</p>}
                    {portfolioData.user.location && <p>📍 {portfolioData.user.location}</p>}
                    {portfolioData.user.linkedin && <p>🔗 {portfolioData.user.linkedin}</p>}
                  </div>
                </section>

                {portfolioData.user.skills && portfolioData.user.skills.length > 0 && (
                  <section className="preview-section-item">
                    <h3>Skills</h3>
                    <div className="skills-grid-preview">
                      {portfolioData.user.skills.map((skill, idx) => (
                        <span key={idx} className="skill-badge">{skill}</span>
                      ))}
                    </div>
                  </section>
                )}

                {portfolioData.portfolio?.projects && portfolioData.portfolio.projects.length > 0 && (
                  <section className="preview-section-item">
                    <h3>Projects</h3>
                    <div className="projects-list">
                      {portfolioData.portfolio.projects.map((project, idx) => (
                        <div key={idx} className="project-item">
                          <h4>{project.title}</h4>
                          <p>{project.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading portfolio data...</p>
            </div>
          )}
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
                    <button className="action-btn download-btn" onClick={() => {
                      if (file.type === 'pdf') {
                        handleGeneratePDF();
                      }
                    }}>
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