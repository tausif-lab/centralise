import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Calendar, Mail } from 'lucide-react';
import '../../styles/sections/verification.css';

const VerificationStatusStudent = ({ userData }) => {
  const [verifiedActivities, setVerifiedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const studentId = userData?.user1Id;

  useEffect(() => {
    if (studentId) {
      fetchVerifiedActivities();
    }
  }, [studentId]);

  const fetchVerifiedActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/verifications/student/${studentId}/verified`
      );
      if (response.ok) {
        const data = await response.json();
        setVerifiedActivities(data);
      } else {
        console.error('Failed to fetch verified activities');
      }
    } catch (error) {
      console.error('Error fetching verified activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={24} className="status-icon approved" />;
      case 'rejected':
        return <XCircle size={24} className="status-icon rejected" />;
      case 'pending':
        return <Clock size={24} className="status-icon pending" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'approved';
      case 'rejected':
        return 'rejected';
      case 'pending':
        return 'pending';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return '✓ Verified';
      case 'rejected':
        return '✗ Rejected';
      case 'pending':
        return '⏳ Pending';
      default:
        return status;
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      workshops: '🎓',
      hackathons: '💻',
      sports: '⚽',
      achievements: '🏆',
      internships: '💼'
    };
    return icons[category] || '📋';
  };

  const openDetailsModal = (activity) => {
    setSelectedActivity(activity);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedActivity(null);
  };

  if (loading) {
    return (
      <div className="verification-status-container">
        <div className="loading">Loading verification status...</div>
      </div>
    );
  }

  const approvedCount = verifiedActivities.filter(
    (a) => a.verificationStatus === 'approved'
  ).length;
  const rejectedCount = verifiedActivities.filter(
    (a) => a.verificationStatus === 'rejected'
  ).length;

  return (
    <div className="verification-status-container">
      <div className="status-header">
        <h2>✓ Verification Status</h2>
        <div className="status-stats">
          <span className="stat approved">
            ✓ Approved: {approvedCount}
          </span>
          <span className="stat rejected">
            ✗ Rejected: {rejectedCount}
          </span>
          <span className="stat total">
            Total: {verifiedActivities.length}
          </span>
        </div>
      </div>

      {verifiedActivities.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={48} />
          <p>No submitted activities with verification status yet</p>
          <p className="hint">Submit an activity with a certificate to see verification status here</p>
        </div>
      ) : (
        <div className="status-grid">
          {verifiedActivities.map((activity) => (
            <div
              key={activity._id}
              className={`status-card ${getStatusColor(activity.verificationStatus)}`}
            >
              <div className="card-header">
                <div className="status-indicator">
                  {getStatusIcon(activity.verificationStatus)}
                  <span className={`status-text ${getStatusColor(activity.verificationStatus)}`}>
                    {getStatusText(activity.verificationStatus)}
                  </span>
                </div>
                <div className="category-tag">
                  {getCategoryIcon(activity.category)} {activity.category.toUpperCase()}
                </div>
              </div>

              <div className="card-body">
                <h3 className="activity-title">{activity.title}</h3>

                <div className="info-item">
                  <span className="label">Date:</span>
                  <span className="value">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>

                {activity.description && (
                  <div className="description-text">
                    <p>{activity.description}</p>
                  </div>
                )}

                {activity.verificationStatus === 'approved' && activity.facultyDetails && (
                  <div className="faculty-info approved-by">
                    <strong>✓ Verified by:</strong>
                    <div className="faculty-details">
                      <span className="name">{activity.facultyDetails.facultyName}</span>
                      <span className="role">
                        ({activity.facultyDetails.facultyId})
                      </span>
                      {activity.approvalDate && (
                        <span className="approval-date">
                          <Calendar size={12} />
                          {new Date(activity.approvalDate).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {activity.verificationStatus === 'rejected' && (
                  <div className="rejection-info">
                    <strong>✗ Rejection Reason:</strong>
                    <p className="reason">{activity.rejectionReason || 'No reason provided'}</p>
                    {activity.facultyDetails && (
                      <div className="faculty-details">
                        <span className="name">Rejected by: {activity.facultyDetails.facultyName}</span>
                        {activity.approvalDate && (
                          <span className="approval-date">
                            <Calendar size={12} />
                            {new Date(activity.approvalDate).toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activity.certificateUrl && (
                  <div className="certificate-section">
                    <a
                      href={`http://localhost:3001${activity.certificateUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-cert-link"
                    >
                      <Eye size={14} /> View Certificate
                    </a>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button
                  className="details-btn"
                  onClick={() => openDetailsModal(activity)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDetailsModal && selectedActivity && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Verification Details</h2>
              <button className="close-btn" onClick={closeDetailsModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-item">
                  <strong>Activity Title:</strong>
                  <p>{selectedActivity.title}</p>
                </div>

                <div className="detail-item">
                  <strong>Category:</strong>
                  <p>
                    {getCategoryIcon(selectedActivity.category)}{' '}
                    {selectedActivity.category.toUpperCase()}
                  </p>
                </div>

                <div className="detail-item">
                  <strong>Status:</strong>
                  <div className="status-display">
                    {getStatusIcon(selectedActivity.verificationStatus)}
                    <span className={getStatusColor(selectedActivity.verificationStatus)}>
                      {getStatusText(selectedActivity.verificationStatus)}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <strong>Submitted Date:</strong>
                  <p>{new Date(selectedActivity.date).toLocaleString()}</p>
                </div>

                {selectedActivity.verificationStatus !== 'pending' && (
                  <div className="detail-item">
                    <strong>Verification Date:</strong>
                    <p>{new Date(selectedActivity.approvalDate).toLocaleString()}</p>
                  </div>
                )}

                {selectedActivity.description && (
                  <div className="detail-item">
                    <strong>Description:</strong>
                    <p>{selectedActivity.description}</p>
                  </div>
                )}

                {selectedActivity.verificationStatus === 'approved' && selectedActivity.facultyDetails && (
                  <div className="faculty-section">
                    <strong>
                      <CheckCircle size={16} className="inline-icon" /> Verified By:
                    </strong>
                    <div className="faculty-card">
                      <div className="faculty-info-row">
                        <span className="label">Faculty Name:</span>
                        <span className="value">{selectedActivity.facultyDetails.facultyName}</span>
                      </div>
                      <div className="faculty-info-row">
                        <span className="label">Faculty ID:</span>
                        <span className="value">{selectedActivity.facultyDetails.facultyId}</span>
                      </div>
                      <div className="faculty-info-row">
                        <span className="label">Email:</span>
                        <span className="value">{selectedActivity.facultyDetails.facultyEmail}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedActivity.verificationStatus === 'rejected' && (
                  <div className="rejection-details">
                    <strong>
                      <XCircle size={16} className="inline-icon" /> Rejection Reason:
                    </strong>
                    <div className="reason-box">
                      <p>{selectedActivity.rejectionReason || 'No reason provided'}</p>
                    </div>
                    {selectedActivity.facultyDetails && (
                      <div className="faculty-info-row">
                        <span className="label">Rejected By:</span>
                        <span className="value">{selectedActivity.facultyDetails.facultyName}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedActivity.certificateUrl && (
                  <div className="cert-details">
                    <strong>Certificate:</strong>
                    <a
                      href={`http://localhost:3001${selectedActivity.certificateUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-link"
                    >
                      <Eye size={16} /> Download/View Certificate
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="close-btn-footer" onClick={closeDetailsModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationStatusStudent;
