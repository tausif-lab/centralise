// src/components/sections/CertificateUpload.jsx
import React, { useState } from 'react';
import { Upload, Check, Clock, X, Download, Eye } from 'lucide-react';
import '../../styles/sections/certificates.css';

const CertificateUpload = () => {
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      name: 'React Advanced Patterns',
      issuer: 'Udemy',
      uploadDate: '2024-01-20',
      status: 'Approved',
      certificateUrl: '#'
    },
    {
      id: 2,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      uploadDate: '2024-01-18',
      status: 'Pending',
      certificateUrl: '#'
    },
    {
      id: 3,
      name: 'Google Cloud Associate',
      issuer: 'Google Cloud',
      uploadDate: '2024-01-10',
      status: 'Rejected',
      reason: 'Certificate format not clear',
      certificateUrl: '#'
    },
    {
      id: 4,
      name: 'JavaScript Mastery',
      issuer: 'Codecademy',
      uploadDate: '2024-02-01',
      status: 'Approved',
      certificateUrl: '#'
    }
  ]);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState({
    certificateName: '',
    issuer: '',
    certificateDate: ''
  });
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile && uploadData.certificateName && uploadData.issuer) {
      const newCertificate = {
        id: Math.max(...certificates.map(c => c.id), 0) + 1,
        name: uploadData.certificateName,
        issuer: uploadData.issuer,
        uploadDate: uploadData.certificateDate,
        status: 'Pending',
        certificateUrl: '#'
      };
      
      setCertificates([...certificates, newCertificate]);
      setSelectedFile(null);
      setUploadData({ certificateName: '', issuer: '', certificateDate: '' });
      setShowUploadForm(false);
    }
  };

  const handleDelete = (id) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'approved';
      case 'Pending': return 'pending';
      case 'Rejected': return 'rejected';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <Check size={20} />;
      case 'Pending': return <Clock size={20} />;
      case 'Rejected': return <X size={20} />;
      default: return null;
    }
  };

  return (
    <div className="certificate-section">
      <div className="section-header">
        <div>
          <h2>Certificate Management</h2>
          <p>Upload and manage your certificates for approval</p>
        </div>
        <button 
          className="upload-btn"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          <Upload size={18} />
          Upload Certificate
        </button>
      </div>

      {showUploadForm && (
        <div className="upload-form-card">
          <h3>Upload New Certificate</h3>
          
          <div
            className={`upload-area ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-input"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept="image/*,.pdf"
            />
            <label htmlFor="file-input" className="upload-label">
              <Upload size={40} />
              <h4>Drag and drop your certificate here</h4>
              <p>or click to browse (PDF, JPG, PNG)</p>
              {selectedFile && <p className="file-selected">✓ {selectedFile.name}</p>}
            </label>
          </div>

          <div className="form-fields">
            <div className="form-group">
              <label>Certificate Name *</label>
              <input
                type="text"
                placeholder="e.g., React Advanced Patterns"
                value={uploadData.certificateName}
                onChange={(e) => setUploadData({...uploadData, certificateName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Issuing Organization *</label>
              <input
                type="text"
                placeholder="e.g., Udemy, Google Cloud"
                value={uploadData.issuer}
                onChange={(e) => setUploadData({...uploadData, issuer: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Certificate Date</label>
              <input
                type="date"
                value={uploadData.certificateDate}
                onChange={(e) => setUploadData({...uploadData, certificateDate: e.target.value})}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              className="submit-btn"
              onClick={handleUpload}
              disabled={!selectedFile || !uploadData.certificateName}
            >
              Upload Certificate
            </button>
            <button 
              className="cancel-btn"
              onClick={() => {
                setShowUploadForm(false);
                setSelectedFile(null);
                setUploadData({ certificateName: '', issuer: '', certificateDate: '' });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="certificates-grid">
        {certificates.map(certificate => (
          <div key={certificate.id} className={`certificate-card ${getStatusColor(certificate.status)}`}>
            <div className="certificate-header">
              <div className="status-section">
                <div className={`status-icon ${getStatusColor(certificate.status)}`}>
                  {getStatusIcon(certificate.status)}
                </div>
                <div>
                  <h3>{certificate.name}</h3>
                  <p className="issuer">{certificate.issuer}</p>
                </div>
              </div>
              <span className={`status-badge ${getStatusColor(certificate.status)}`}>
                {certificate.status}
              </span>
            </div>

            <div className="certificate-details">
              <p className="upload-date">
                Uploaded on: {new Date(certificate.uploadDate).toLocaleDateString()}
              </p>
              {certificate.reason && (
                <p className="rejection-reason">
                  Reason: {certificate.reason}
                </p>
              )}
            </div>

            <div className="certificate-actions">
              <button className="action-btn view-btn">
                <Eye size={16} />
                View
              </button>
              <button className="action-btn download-btn">
                <Download size={16} />
                Download
              </button>
              {certificate.status === 'Rejected' && (
                <button className="action-btn reupload-btn">
                  <Upload size={16} />
                  Reupload
                </button>
              )}
              <button 
                className="action-btn delete-btn"
                onClick={() => handleDelete(certificate.id)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {certificates.length === 0 && !showUploadForm && (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No Certificates Yet</h3>
          <p>Start by uploading your first certificate</p>
        </div>
      )}
    </div>
  );
};

export default CertificateUpload;