import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, MessageSquare, Calendar, User, Award } from 'lucide-react';
import '../../styles/sections/verification.css';

const VerificationRequestsTeacher = ({ userData }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const facultyId = userData?.user1Id;

  useEffect(() => {
    if (facultyId) {
      fetchPendingRequests();
    }
  }, [facultyId]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/verifications/faculty/${facultyId}/pending`
      );
      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data);
      } else {
        console.error('Failed to fetch verification requests');
      }
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setActionInProgress(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/verifications/${selectedRequest._id}/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            facultyId: facultyId,
            approvalNotes: approvalNotes
          })
        }
      );

      if (response.ok) {
        alert('Activity approved successfully!');
        setShowDetailModal(false);
        setApprovalNotes('');
        setSelectedRequest(null);
        fetchPendingRequests();
      } else {
        const errorData = await response.json();
        alert(`Failed to approve: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionInProgress(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/verifications/${selectedRequest._id}/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            facultyId: facultyId,
            rejectionReason: rejectionReason
          })
        }
      );

      if (response.ok) {
        alert('Activity rejected successfully!');
        setShowDetailModal(false);
        setRejectionReason('');
        setSelectedRequest(null);
        fetchPendingRequests();
      } else {
        const errorData = await response.json();
        alert(`Failed to reject: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request');
    } finally {
      setActionInProgress(false);
    }
  };

  const openDetailModal = (request) => {
    setSelectedRequest(request);
    setApprovalNotes('');
    setRejectionReason('');
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
    setApprovalNotes('');
    setRejectionReason('');
  };

  const filteredRequests =
    filterStatus === 'all' ? pendingRequests : pendingRequests;

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

  if (loading) {
    return (
      <div className="verification-container">
        <div className="loading">Loading verification requests...</div>
      </div>
    );
  }

  return (
    <div className="verification-container">
      <div className="verification-header">
        <h2>📋 Activity Verification Requests</h2>
        <div className="stats">
          <span className="stat-badge pending">
            ⏳ Pending: {pendingRequests.length}
          </span>
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="empty-state">
          <Award size={48} />
          <p>No pending verification requests at this time</p>
        </div>
      ) : (
        <div className="requests-grid">
          {pendingRequests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="card-header">
                <div className="category-badge">
                  {getCategoryIcon(request.category)} {request.category.toUpperCase()}
                </div>
                <span className="status-badge pending">Pending</span>
              </div>

              <div className="card-body">
                <h3 className="activity-title">{request.title}</h3>

                <div className="info-row">
                  <User size={16} />
                  <div>
                    <span className="label">Student:</span>
                    <span className="value">{request.studentName}</span>
                  </div>
                </div>

                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{request.studentEmail}</span>
                </div>

                <div className="info-row">
                  <Calendar size={16} />
                  <div>
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(request.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {request.description && (
                  <div className="description">
                    <span className="label">Description:</span>
                    <p>{request.description}</p>
                  </div>
                )}

                {request.certificateUrl && (
                  <div className="certificate-link">
                    <a
                      href={`http://localhost:3001${request.certificateUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-certificate-btn"
                    >
                      <Eye size={14} /> View Certificate
                    </a>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button
                  className="detail-btn"
                  onClick={() => openDetailModal(request)}
                >
                  <MessageSquare size={16} /> Review & Decide
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDetailModal && selectedRequest && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Verify Activity</h2>
              <button className="close-btn" onClick={closeDetailModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="activity-info">
                <h3>{selectedRequest.title}</h3>
                <p className="student-info">
                  <strong>Student:</strong> {selectedRequest.studentName} ({selectedRequest.studentEmail})
                </p>
                <p className="category-info">
                  <strong>Category:</strong> {selectedRequest.category.toUpperCase()}
                </p>
                <p className="date-info">
                  <strong>Submitted:</strong>{' '}
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </p>

                {selectedRequest.description && (
                  <div className="description-box">
                    <strong>Description:</strong>
                    <p>{selectedRequest.description}</p>
                  </div>
                )}

                {selectedRequest.certificateUrl && (
                  <div className="cert-preview">
                    <a
                      href={`http://localhost:3001${selectedRequest.certificateUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="preview-link"
                    >
                      <Eye size={16} /> View/Download Certificate
                    </a>
                  </div>
                )}
              </div>

              <div className="action-section">
                <div className="approval-section">
                  <label htmlFor="approval-notes">
                    <CheckCircle size={18} className="icon-approve" />
                    Approval Notes (Optional):
                  </label>
                  <textarea
                    id="approval-notes"
                    placeholder="Add approval notes or feedback..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="notes-textarea"
                    rows={3}
                  />
                </div>

                <div className="rejection-section">
                  <label htmlFor="rejection-reason">
                    <XCircle size={18} className="icon-reject" />
                    Rejection Reason (if rejecting):
                  </label>
                  <textarea
                    id="rejection-reason"
                    placeholder="Explain why this activity is being rejected..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="notes-textarea"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="approve-btn"
                onClick={handleApprove}
                disabled={actionInProgress}
              >
                <CheckCircle size={16} />
                {actionInProgress ? 'Approving...' : 'Approve Activity'}
              </button>
              <button
                className="reject-btn"
                onClick={handleReject}
                disabled={actionInProgress || !rejectionReason.trim()}
              >
                <XCircle size={16} />
                {actionInProgress ? 'Rejecting...' : 'Reject Activity'}
              </button>
              <button className="cancel-btn" onClick={closeDetailModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationRequestsTeacher;
