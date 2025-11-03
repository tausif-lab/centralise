import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CertificateApprovalDashboard.css';

const CertificateApprovalDashboard = ({ facultyId, facultyRole }) => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCert, setSelectedCert] = useState(null);
    const [approvalAction, setApprovalAction] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchPendingCertificates();
        fetchStats();
    }, []);

    const fetchPendingCertificates = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3001/api/certificates/faculty/${facultyId}/pending`,
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            setCertificates(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load certificates');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3001/api/certificates/stats/${facultyId}`,
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats');
        }
    };

    const handleApproveCertificate = async () => {
        if (!selectedCert) return;
        try {
            setActionLoading(true);
            await axios.post(
                `http://localhost:3001/api/certificates/${selectedCert._id}/approve`,
                { facultyId },
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            setCertificates(certificates.filter(c => c._id !== selectedCert._id));
            setSelectedCert(null);
            setApprovalAction(null);
            fetchStats();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve certificate');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectCertificate = async () => {
        if (!selectedCert || !rejectionReason.trim()) {
            setError('Please provide a rejection reason');
            return;
        }
        try {
            setActionLoading(true);
            await axios.post(
                `http://localhost:3001/api/certificates/${selectedCert._id}/reject`,
                { facultyId, rejectionReason },
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            setCertificates(certificates.filter(c => c._id !== selectedCert._id));
            setSelectedCert(null);
            setApprovalAction(null);
            setRejectionReason('');
            fetchStats();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject certificate');
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewCertificate = (cert) => {
        setSelectedCert(cert);
        setApprovalAction(null);
        setRejectionReason('');
    };

    const closeModal = () => {
        setSelectedCert(null);
        setApprovalAction(null);
        setRejectionReason('');
    };

    return (
        <div className="certificate-approval-dashboard">
            <div className="dashboard-header">
                <h2>Certificate Approval Dashboard</h2>
                <p>Faculty Role: <strong>{facultyRole}</strong></p>
            </div>

            {stats && (
                <div className="statistics">
                    <div className="stat-card">
                        <div className="stat-label">Total</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    {stats.byStatus.map(stat => (
                        <div key={stat._id} className={`stat-card stat-${stat._id}`}>
                            <div className="stat-label">{stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}</div>
                            <div className="stat-value">{stat.count}</div>
                        </div>
                    ))}
                </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
                <div className="loading">Loading certificates...</div>
            ) : (
                <>
                    {certificates.length === 0 ? (
                        <div className="empty-state"><p>No pending certificates to review</p></div>
                    ) : (
                        <div className="certificates-list">
                            <h3>Pending Certificates ({certificates.length})</h3>
                            <table className="certificates-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Activity</th>
                                        <th>Category</th>
                                        <th>Submitted</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certificates.map(cert => (
                                        <tr key={cert._id}>
                                            <td>{cert.studentName || 'N/A'}</td>
                                            <td>{cert.activityTitle}</td>
                                            <td>{cert.category}</td>
                                            <td>{new Date(cert.submittedAt).toLocaleDateString()}</td>
                                            <td>
                                                <button className="btn-view" onClick={() => handleViewCertificate(cert)}>Review</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {selectedCert && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Review Certificate</h3>
                            <button className="btn-close" onClick={closeModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="cert-details">
                                <div className="detail-row">
                                    <span className="label">Student:</span>
                                    <span className="value">{selectedCert.studentName}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Activity:</span>
                                    <span className="value">{selectedCert.activityTitle}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Category:</span>
                                    <span className="value">{selectedCert.category}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Submitted:</span>
                                    <span className="value">{new Date(selectedCert.submittedAt).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="cert-preview">
                                <h4>Certificate</h4>
                                {selectedCert.certificateFile.endsWith('.pdf') ? (
                                    <a href={`http://localhost:3001${selectedCert.certificateFile}`} target="_blank" rel="noopener noreferrer" className="btn-open-pdf">📄 Open PDF</a>
                                ) : (
                                    <img src={`http://localhost:3001${selectedCert.certificateFile}`} alt="Certificate" className="cert-image" />
                                )}
                            </div>

                            <div className="hash-info">
                                <h4>Hash Information</h4>
                                <div className="hash-value">
                                    <small>SHA-256:</small>
                                    <code>{selectedCert.certificateHash.substring(0, 20)}...</code>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            {approvalAction === null && (
                                <>
                                    <button className="btn btn-approve" onClick={() => setApprovalAction('approve')}>✓ Approve</button>
                                    <button className="btn btn-reject" onClick={() => setApprovalAction('reject')}>✗ Reject</button>
                                </>
                            )}

                            {approvalAction === 'approve' && (
                                <div className="action-confirmation">
                                    <p>Are you sure you want to approve this certificate?</p>
                                    <button className="btn btn-confirm" onClick={handleApproveCertificate} disabled={actionLoading}>{actionLoading ? 'Processing...' : 'Confirm Approval'}</button>
                                    <button className="btn btn-cancel" onClick={() => setApprovalAction(null)}>Cancel</button>
                                </div>
                            )}

                            {approvalAction === 'reject' && (
                                <div className="action-confirmation">
                                    <textarea placeholder="Enter reason for rejection..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="reject-reason" />
                                    <button className="btn btn-confirm" onClick={handleRejectCertificate} disabled={actionLoading || !rejectionReason.trim()}>{actionLoading ? 'Processing...' : 'Confirm Rejection'}</button>
                                    <button className="btn btn-cancel" onClick={() => setApprovalAction(null)}>Cancel</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateApprovalDashboard;
