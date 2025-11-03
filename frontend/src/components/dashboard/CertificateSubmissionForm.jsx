import React, { useState } from 'react';
import axios from 'axios';
import './CertificateSubmissionForm.css';

const CertificateSubmissionForm = ({ userId, activityId, activityTitle, onSuccess }) => {
    const [formData, setFormData] = useState({ category: '', certificateFile: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = ['Workshops', 'Hackathons', 'Sports', 'Extracurricular Activity'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setError('Only PNG, JPG, and PDF files are allowed');
                return;
            }
            setFormData(prev => ({ ...prev, certificateFile: file }));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) { setError('Please select a category'); return; }
        if (!formData.certificateFile) { setError('Please upload a certificate file'); return; }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const submitFormData = new FormData();
            submitFormData.append('certificate', formData.certificateFile);
            submitFormData.append('activityId', activityId);
            submitFormData.append('category', formData.category);
            submitFormData.append('activityTitle', activityTitle);

            const response = await axios.post(
                `http://localhost:3001/api/certificates/${userId}/submit`,
                submitFormData,
                { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );

            setSuccess('Certificate submitted successfully! It is now pending approval.');
            setFormData({ category: '', certificateFile: null });
            if (onSuccess) onSuccess(response.data.certificate);
            setTimeout(() => { setSuccess(''); }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit certificate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="certificate-submission-form">
            <h2>Submit Certificate for Approval</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="category">Activity Category</label>
                    <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="activityTitle">Activity Title</label>
                    <input type="text" id="activityTitle" value={activityTitle} disabled className="input-disabled" />
                </div>
                <div className="form-group">
                    <label htmlFor="certificateFile">Upload Certificate</label>
                    <div className="file-input-wrapper">
                        <input type="file" id="certificateFile" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" required />
                        <span className="file-name">{formData.certificateFile ? formData.certificateFile.name : 'Choose file'}</span>
                    </div>
                    <small>Supported formats: JPG, PNG, PDF (Max 5MB)</small>
                </div>
                <button type="submit" disabled={loading} className="btn btn-submit">{loading ? 'Submitting...' : 'Submit Certificate'}</button>
            </form>
        </div>
    );
};

export default CertificateSubmissionForm;
