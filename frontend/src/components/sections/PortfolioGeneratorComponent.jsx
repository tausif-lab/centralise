import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/sections/portfolio.css';

const PortfolioGenerator = ({ userId: propUserId }) => {
  // Get userId from props or localStorage
  const [userId, setUserId] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    link: '',
    technologies: [],
    startDate: '',
    endDate: '',
  });
  const [profileSummary, setProfileSummary] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize userId from props or localStorage
  useEffect(() => {
    if (propUserId) {
      setUserId(propUserId);
    } else {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserId(user.user1Id || user._id);
    }
  }, [propUserId]);

  // Fetch portfolio data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/portfolio/${userId}`);
        setPortfolioData(response.data);
        setProfileSummary(response.data.portfolio?.profileSummary || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Add project
  const handleAddProject = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError('User ID not found. Please login again.');
      return;
    }
    
    if (!newProject.title || !newProject.description) {
      setError('Please fill in required fields');
      return;
    }
    
    try {
      setError(null);
      const response = await axios.post(`http://localhost:3001/api/portfolio/${userId}/projects`, newProject);
      
      setPortfolioData({
        ...portfolioData,
        portfolio: response.data,
      });
      
      setNewProject({
        title: '',
        description: '',
        link: '',
        technologies: [],
        startDate: '',
        endDate: '',
      });
      
      setSuccess('Project added successfully!');
      setShowModal(false);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error adding project:', error);
      setError(error.response?.data?.message || 'Failed to add project');
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    try {
      const response = await axios.delete(
        `/api/portfolio/${userId}/projects/${projectId}`
      );
      setPortfolioData({
        ...portfolioData,
        portfolio: response.data,
      });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Update bio
  const handleUpdateBio = async () => {
    try {
      const response = await axios.put(`/api/portfolio/${userId}/bio`, {
        profileSummary,
      });
      setPortfolioData({
        ...portfolioData,
        portfolio: response.data,
      });
      setEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleDownloadPDF = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/portfolio/${userId}/pdf`);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('PDF Error:', error);
      alert(`Error: ${error.message}`);
      return;
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to download PDF');
  }
};

  if (loading) return <div className="portfolio-loading">Loading portfolio...</div>;
  if (!portfolioData) return <div className="portfolio-error">Portfolio not found</div>;

  const { user, portfolio, activities } = portfolioData;

  return (
    <div className="portfolio-generator-container">
      <div className="portfolio-header">
        <h2>Portfolio Generator</h2>
        <div className="portfolio-actions">
          <button
            className="btn-preview"
            onClick={() => setShowPreview(true)}
          >
            👁️ Preview
          </button>
          <button
            className="btn-download"
            onClick={handleDownloadPDF}
          >
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div style={{
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
      {success && (
        <div style={{
          background: '#efe',
          color: '#060',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #cfc'
        }}>
          {success}
        </div>
      )}

      <div className="portfolio-main">
        {/* Bio Section */}
        <div className="portfolio-section">
          <div className="section-header">
            <h3>Professional Summary</h3>
          </div>
          {editingBio ? (
            <div className="bio-section">
              <textarea
                value={profileSummary}
                onChange={(e) => setProfileSummary(e.target.value)}
                rows="4"
                placeholder="Write your professional summary..."
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn-save"
                  onClick={handleUpdateBio}
                >
                  Save
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setEditingBio(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p>{profileSummary || 'No summary added yet'}</p>
              <button
                className="btn-add"
                onClick={() => setEditingBio(true)}
              >
                ✎ Edit
              </button>
            </div>
          )}
        </div>

        {/* Activities Sections */}

        {/* Internships & Training */}
{activities?.internships?.length > 0 && (
  <div className="portfolio-section">
    <h3>Internships & Training</h3>
    <div className="activities-list">
      {activities.internships.map((activity) => (
        <div key={activity._id} className="activity-item">
          <h4>{activity.title}</h4>
          <p><strong>Company:</strong> {activity.company || 'N/A'}</p>
          <p><strong>Location:</strong> {activity.location || 'N/A'}</p>
          <p><strong>Duration:</strong> {new Date(activity.date).toLocaleDateString()} 
            {activity.endDate ? ` - ${new Date(activity.endDate).toLocaleDateString()}` : ' - Present'}
          </p>
          {activity.description && <p><strong>Description:</strong> {activity.description}</p>}
          <div className="verification-badge">
            <strong>✓ Verified by:</strong> {activity.approvedByFacultyId?.fullName || 'Faculty'}
            {activity.approvedByFacultyId?.user1Id && (
              <span className="faculty-id"> (ID: {activity.approvedByFacultyId.user1Id})</span>
            )}
          </div>
          {activity.certificateUrl && (
            <a href={activity.certificateUrl.startsWith('http') ? activity.certificateUrl : `http://localhost:3001${activity.certificateUrl}`} 
               className="cert-link" target="_blank" rel="noopener noreferrer">
              📄 View Certificate
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{/* Workshops & Certifications */}
{activities?.workshops?.length > 0 && (
  <div className="portfolio-section">
    <h3>Workshops & Certifications</h3>
    <div className="activities-list">
      {activities.workshops.map((activity) => (
        <div key={activity._id} className="activity-item">
          <h4>{activity.title}</h4>
          <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
          {activity.location && <p><strong>Location:</strong> {activity.location}</p>}
          {activity.description && <p><strong>Description:</strong> {activity.description}</p>}
          <div className="verification-badge">
            <strong>✓ Verified by:</strong> {activity.approvedByFacultyId?.fullName || 'Faculty'}
            {activity.approvedByFacultyId?.user1Id && (
              <span className="faculty-id"> (ID: {activity.approvedByFacultyId.user1Id})</span>
            )}
          </div>
          {activity.certificateUrl && (
            <a href={activity.certificateUrl.startsWith('http') ? activity.certificateUrl : `http://localhost:3001${activity.certificateUrl}`} 
               className="cert-link" target="_blank" rel="noopener noreferrer">
              📄 View Certificate
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{/* Hackathons */}
{activities?.hackathons?.length > 0 && (
  <div className="portfolio-section">
    <h3>Hackathons & Competitions</h3>
    <div className="activities-list">
      {activities.hackathons.map((activity) => (
        <div key={activity._id} className="activity-item">
          <h4>{activity.title}</h4>
          {activity.event && <p><strong>Event:</strong> {activity.event}</p>}
          <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
          {activity.location && <p><strong>Location:</strong> {activity.location}</p>}
          {activity.description && <p><strong>Description:</strong> {activity.description}</p>}
          <div className="verification-badge">
            <strong>✓ Verified by:</strong> {activity.approvedByFacultyId?.fullName || 'Faculty'}
            {activity.approvedByFacultyId?.user1Id && (
              <span className="faculty-id"> (ID: {activity.approvedByFacultyId.user1Id})</span>
            )}
          </div>
          {activity.certificateUrl && (
            <a href={activity.certificateUrl.startsWith('http') ? activity.certificateUrl : `http://localhost:3001${activity.certificateUrl}`} 
               className="cert-link" target="_blank" rel="noopener noreferrer">
              📄 View Certificate
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{/* Sports Achievements */}
{activities?.sports?.length > 0 && (
  <div className="portfolio-section">
    <h3>Sports Achievements</h3>
    <div className="activities-list">
      {activities.sports.map((activity) => (
        <div key={activity._id} className="activity-item">
          <h4>{activity.title}</h4>
          {activity.event && <p><strong>Event:</strong> {activity.event}</p>}
          <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
          {activity.location && <p><strong>Location:</strong> {activity.location}</p>}
          {activity.description && <p><strong>Description:</strong> {activity.description}</p>}
          <div className="verification-badge">
            <strong>✓ Verified by:</strong> {activity.approvedByFacultyId?.fullName || 'Faculty'}
            {activity.approvedByFacultyId?.user1Id && (
              <span className="faculty-id"> (ID: {activity.approvedByFacultyId.user1Id})</span>
            )}
          </div>
          {activity.certificateUrl && (
            <a href={activity.certificateUrl.startsWith('http') ? activity.certificateUrl : `http://localhost:3001${activity.certificateUrl}`} 
               className="cert-link" target="_blank" rel="noopener noreferrer">
              📄 View Certificate
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{/* Other Achievements */}
{activities?.achievements?.length > 0 && (
  <div className="portfolio-section">
    <h3>Other Achievements</h3>
    <div className="activities-list">
      {activities.achievements.map((activity) => (
        <div key={activity._id} className="activity-item">
          <h4>{activity.title}</h4>
          {activity.event && <p><strong>Event:</strong> {activity.event}</p>}
          <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
          {activity.location && <p><strong>Location:</strong> {activity.location}</p>}
          {activity.description && <p><strong>Description:</strong> {activity.description}</p>}
          <div className="verification-badge">
            <strong>✓ Verified by:</strong> {activity.approvedByFacultyId?.fullName || 'Faculty'}
            {activity.approvedByFacultyId?.user1Id && (
              <span className="faculty-id"> (ID: {activity.approvedByFacultyId.user1Id})</span>
            )}
          </div>
          {activity.certificateUrl && (
            <a href={activity.certificateUrl.startsWith('http') ? activity.certificateUrl : `http://localhost:3001${activity.certificateUrl}`} 
               className="cert-link" target="_blank" rel="noopener noreferrer">
              📄 View Certificate
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
)}

        {/* Projects Section */}
        <div className="portfolio-section">
          <div className="section-header">
            <h3>Projects</h3>
            <button
              className="btn-add"
              onClick={() => setShowModal(true)}
            >
              + Add Project
            </button>
          </div>

          {portfolio?.projects?.length > 0 ? (
            <div className="projects-list">
              {portfolio.projects.map((project) => (
                <div key={project._id} className="project-card">
                  <div className="project-header">
                    <h4>{project.title}</h4>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      ×
                    </button>
                  </div>
                  <p>{project.description}</p>
                  {project.link && (
                    <p>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project
                      </a>
                    </p>
                  )}
                  {project.technologies?.length > 0 && (
                    <p>
                      <strong>Technologies:</strong> {project.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No projects added yet</div>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {showModal && (
        <div className="portfolio-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Project</h3>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddProject}>
              <div className="modal-body">
                <input
                  type="text"
                  placeholder="Project Title"
                  required
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Project Description"
                  required
                  rows="3"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="url"
                  placeholder="Project Link"
                  value={newProject.link}
                  onChange={(e) =>
                    setNewProject({ ...newProject, link: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Technologies (comma separated)"
                  value={newProject.technologies.join(', ')}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      technologies: e.target.value
                        .split(',')
                        .map((t) => t.trim()),
                    })
                  }
                />
                <input
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      startDate: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) =>
                    setNewProject({ ...newProject, endDate: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="portfolio-modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="portfolio-preview-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setShowPreview(false)}
            >
              ×
            </button>
            <PortfolioPreview
              user={user}
              portfolio={portfolio}
              activities={activities}
            />
          </div>
        </div>
      )}
    </div>
  );
};



const PortfolioPreview = ({ user, portfolio, activities }) => {
  return (
    <div className="portfolio-preview-content">
      <div className="portfolio-preview-header">
        <h1>{user?.fullName}</h1>
        <p className="subtitle">{user?.branch}</p>
        <div className="contact-info">
          <p>📧 {user?.email}</p>
          {user?.phone && <p>📱 {user?.phone}</p>}
          {user?.location && <p>📍 {user?.location}</p>}
        </div>
        {/*<div className="social-links">
          {user?.linkedin && (
            <a href={user.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          )}
          {user?.github && (
            <a href={user.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          )}
        </div>*/}
        <div className="social-links">
  {user?.linkedin && (
    <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`} 
       target="_blank" rel="noopener noreferrer">
      LinkedIn
    </a>
  )}
  {user?.github && (
    <a href={user.github.startsWith('http') ? user.github : `https://${user.github}`} 
       target="_blank" rel="noopener noreferrer">
      GitHub
    </a>
  )}
</div>
      </div>

      {/* Academic Info */}
      <div className="preview-section">
        <h2>Academic Information</h2>
        <p><strong>University:</strong> {user?.collegeId}</p>
        {user?.semester && <p><strong>Semester:</strong> {user.semester}</p>}
        {user?.cgpa && <p><strong>CGPA:</strong> {user.cgpa}</p>}
      </div>

      {/* Skills */}
      {user?.skills && user.skills.length > 0 && (
        <div className="preview-section">
          <h2>Technical Skills</h2>
          <p>{user.skills.join(' • ')}</p>
        </div>
      )}

      {portfolio?.profileSummary && (
        <div className="preview-section">
          <h2>Professional Summary</h2>
          <p>{portfolio.profileSummary}</p>
        </div>
      )}

      {/* Update all activities sections similarly with proper field names */}
      {activities?.internships?.length > 0 && (
        <div className="preview-section">
          <h2>Internships & Training</h2>
          {activities.internships.map((activity) => (
            <div key={activity._id} className="preview-item">
              <h3>{activity.title}</h3>
              {activity.company && <p><strong>Company:</strong> {activity.company}</p>}
              {activity.location && <p><strong>Location:</strong> {activity.location}</p>}
              <p><strong>Duration:</strong> {new Date(activity.date).toLocaleDateString()}
                {activity.endDate ? ` - ${new Date(activity.endDate).toLocaleDateString()}` : ' - Present'}
              </p>
              {activity.description && <p>{activity.description}</p>}
              <p className="verified-by">
                ✓ Verified by: {activity.approvedByFacultyId?.fullName || 'Faculty'}
                {activity.approvedByFacultyId?.user1Id && ` (ID: ${activity.approvedByFacultyId.user1Id})`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add similar sections for workshops, hackathons, sports, achievements */}

      {portfolio?.projects?.length > 0 && (
        <div className="preview-section">
          <h2>Projects</h2>
          {portfolio.projects.map((project) => (
            <div key={project._id} className="preview-item">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.link && <p><strong>Link:</strong> <a href={project.link} target="_blank" rel="noopener noreferrer">{project.link}</a></p>}
              {project.technologies?.length > 0 && (
                <p><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
              )}
              {project.startDate && (
                <p><strong>Duration:</strong> {new Date(project.startDate).toLocaleDateString()}
                  {project.endDate ? ` - ${new Date(project.endDate).toLocaleDateString()}` : ' - Ongoing'}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioGenerator;
