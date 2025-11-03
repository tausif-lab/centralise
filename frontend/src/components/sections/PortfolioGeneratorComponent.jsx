import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/sections/portfolio.css';

const PortfolioGenerator = ({ userId }) => {
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
    try {
      const response = await axios.post(`/api/portfolio/${userId}/projects`, newProject);
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
      setShowModal(false);
    } catch (error) {
      console.error('Error adding project:', error);
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

        // Update the activity sections to show correct field names
{activities?.internships?.length > 0 && (
  <div className="portfolio-section">
    <h3>Internships & Training</h3>
    <div className="activities-list">
      {activities.internships.map((activity) => (
        <div key={activity._id} className="activity-item">
          <h4>{activity.title}</h4>
          <p><strong>Company:</strong> {activity.company}</p>
          <p><strong>Location:</strong> {activity.location}</p>
          <p><strong>Duration:</strong> {new Date(activity.date).toLocaleDateString()} - {activity.endDate ? new Date(activity.endDate).toLocaleDateString() : 'Present'}</p>
          <p><strong>Description:</strong> {activity.description}</p>
          <div className="verification-badge">
            <strong>Verified by:</strong> {activity.approvedByFacultyId?.fullName}
            <span className="faculty-id">(ID: {activity.approvedByFacultyId?.user1Id})</span>
          </div>
          {activity.certificateUrl && (
            <a href={activity.certificateUrl} className="cert-link" target="_blank" rel="noopener noreferrer">
              View Certificate
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{/* Similar updates for certificates and accomplishments sections */}

        {/* Certificates & Workshops */}
        {activities?.certificates?.length > 0 && (
          <div className="portfolio-section">
            <h3>Certificates & Workshops</h3>
            <div className="activities-list">
              {activities.certificates.map((activity) => (
                <div key={activity._id} className="activity-item">
                  <h4>{activity.name}</h4>
                  <p><strong>Organization:</strong> {activity.organization}</p>
                  <p>
                    <strong>Verified by:</strong> {activity.approvedByFacultyId?.name}
                    {' '}(ID: {activity.approvedByFacultyId?._id})
                  </p>
                  {activity.certificateLink && (
                    <a href={activity.certificateLink} className="cert-link" target="_blank" rel="noopener noreferrer">
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accomplishments */}
        {activities?.accomplishments?.length > 0 && (
          <div className="portfolio-section">
            <h3>Accomplishments</h3>
            <div className="activities-list">
              {activities.accomplishments.map((activity) => (
                <div key={activity._id} className="activity-item">
                  <h4>{activity.name}</h4>
                  <p><strong>Category:</strong> {activity.category}</p>
                  <p>
                    <strong>Verified by:</strong> {activity.approvedByFacultyId?.name}
                    {' '}(ID: {activity.approvedByFacultyId?._id})
                  </p>
                  {activity.certificateLink && (
                    <a href={activity.certificateLink} className="cert-link" target="_blank" rel="noopener noreferrer">
                      View Certificate
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

// Portfolio Preview Component
const PortfolioPreview = ({ user, portfolio, activities }) => {
  return (
    <div className="portfolio-preview-content">
      <div className="portfolio-preview-header">
        <h1>{user?.name}</h1>
        <p>{user?.branch}</p>
        <p>{user?.email}</p>
        <p>{user?.mobileNumber}</p>
      </div>

      {portfolio?.profileSummary && (
        <div className="preview-section">
          <h2>Professional Summary</h2>
          <p>{portfolio.profileSummary}</p>
        </div>
      )}

      {activities?.internships?.length > 0 && (
        <div className="preview-section">
          <h2>Internships & Training</h2>
          {activities.internships.map((activity) => (
            <div key={activity._id} className="preview-item">
              <h3>{activity.name}</h3>
              <p>Organization: {activity.organization}</p>
              <p>Duration: {activity.duration}</p>
              <p>
                Verified by: {activity.approvedByFacultyId?.name}
                {' '}(ID: {activity.approvedByFacultyId?._id})
              </p>
            </div>
          ))}
        </div>
      )}

      {activities?.certificates?.length > 0 && (
        <div className="preview-section">
          <h2>Certificates & Workshops</h2>
          {activities.certificates.map((activity) => (
            <div key={activity._id} className="preview-item">
              <h3>{activity.name}</h3>
              <p>Organization: {activity.organization}</p>
              <p>
                Verified by: {activity.approvedByFacultyId?.name}
                {' '}(ID: {activity.approvedByFacultyId?._id})
              </p>
            </div>
          ))}
        </div>
      )}

      {activities?.accomplishments?.length > 0 && (
        <div className="preview-section">
          <h2>Accomplishments</h2>
          {activities.accomplishments.map((activity) => (
            <div key={activity._id} className="preview-item">
              <h3>{activity.name}</h3>
              <p>Category: {activity.category}</p>
              <p>
                Verified by: {activity.approvedByFacultyId?.name}
                {' '}(ID: {activity.approvedByFacultyId?._id})
              </p>
            </div>
          ))}
        </div>
      )}

      {portfolio?.projects?.length > 0 && (
        <div className="preview-section">
          <h2>Projects</h2>
          {portfolio.projects.map((project) => (
            <div key={project._id} className="preview-item">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.link && <p>Link: {project.link}</p>}
              {project.technologies?.length > 0 && (
                <p>Technologies: {project.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioGenerator;
