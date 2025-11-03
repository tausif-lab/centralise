import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Camera, Mail, Phone, MapPin, Linkedin, Github, Plus, Trash2 } from 'lucide-react';
import '../../styles/sections/profile.css';
import { useSearchParams } from 'react-router-dom';

const ProfileSection = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    university: '',
    branch: '',
    semester: '',
    cgpa: '',
    linkedin: '',
    github: '',
    skills: [],
  });

  // Update profileData when userData changes
  useEffect(() => {
    if (userData) {
      const [first, ...lastParts] = userData.fullName?.split(' ') || ['', ''];
      const last = lastParts.join(' ');
      
      setProfileData({
        firstName: first,
        lastName: last,
        email: userData.email || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        location: userData.location || '',
        university: userData.collegeId || '',
        branch: userData.branch || '',
        semester: userData.semester || '',
        cgpa: userData.cgpa || '',
        linkedin: userData.linkedin || '',
        github: userData.github || '',
        skills: userData.skills || [],
      });
    }
  }, [userData]);

  const [editData, setEditData] = useState(profileData);

  // Update editData when profileData changes
  useEffect(() => {
    setEditData(profileData);
  }, [profileData]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: editData.firstName,
          lastName: editData.lastName,
          email: editData.email,
          phone: editData.phone,
          bio: editData.bio,
          location: editData.location,
          branch: editData.branch,
          semester: editData.semester,
          cgpa: editData.cgpa,
          linkedin: editData.linkedin,
          github: editData.github,
          skills: editData.skills,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update local state with new data
      const [first, ...lastParts] = updatedUser.fullName?.split(' ') || ['', ''];
      const last = lastParts.join(' ');
      
      setProfileData({
        firstName: first,
        lastName: last,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        location: updatedUser.location,
        university: updatedUser.collegeId,
        branch: updatedUser.branch,
        semester: updatedUser.semester,
        cgpa: updatedUser.cgpa,
        linkedin: updatedUser.linkedin,
        github: updatedUser.github,
        skills: updatedUser.skills,
      });

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add skill function
  const handleAddSkill = () => {
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim())) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  // Remove skill function
  const handleRemoveSkill = (skillToRemove) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Handle Enter key for adding skills
  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>My Profile</h2>
        {!isEditing && (
          <button className="edit-btn" onClick={handleEdit}>
            <Edit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'academic' ? 'active' : ''}`}
          onClick={() => setActiveTab('academic')}
        >
          Academic Info
        </button>
        <button 
          className={`tab ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          Social Links
        </button>
      </div>

      <div className="profile-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="profile-header-card">
              <div className="profile-cover"></div>
              <div className="profile-pic-section">
                <div className="profile-pic">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.firstName}`} 
                    alt="Profile" 
                  />
                  <button className="camera-btn">
                    <Camera size={18} />
                  </button>
                </div>
                <div className="profile-basic">
                  {isEditing ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={editData.firstName}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={editData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <>
                      <h3>{profileData.firstName} {profileData.lastName}</h3>
                      <p>{profileData.semester}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-info-grid">
              <div className="info-card">
                <Mail size={20} />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <>
                    <label>Email</label>
                    <p>{profileData.email}</p>
                  </>
                )}
              </div>

              <div className="info-card">
                <Phone size={20} />
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <>
                    <label>Phone</label>
                    <p>{profileData.phone || 'Not provided'}</p>
                  </>
                )}
              </div>

              <div className="info-card">
                <MapPin size={20} />
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={editData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                  />
                ) : (
                  <>
                    <label>Location</label>
                    <p>{profileData.location || 'Not provided'}</p>
                  </>
                )}
              </div>

              <div className="info-card">
                <span className="label-text">Bio</span>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                  />
                ) : (
                  <p>{profileData.bio || 'No bio added yet'}</p>
                )}
              </div>
            </div>

            <div className="skills-section">
              <h4>Skills</h4>
              {isEditing && (
                <div className="skill-input-group">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    placeholder="Add a skill (press Enter)"
                    className="skill-input"
                  />
                  <button 
                    className="add-skill-btn" 
                    onClick={handleAddSkill}
                    type="button"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
              )}
              <div className="skills-list">
                {editData.skills && editData.skills.length > 0 ? (
                  editData.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill}
                      {isEditing && (
                        <button
                          className="remove-skill-btn"
                          onClick={() => handleRemoveSkill(skill)}
                          type="button"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">No skills added yet</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="action-buttons">
                <button className="save-btn" onClick={handleSave} disabled={loading}>
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="cancel-btn" onClick={handleCancel} disabled={loading}>
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Academic Info Tab - KEEP EXISTING CODE BUT UPDATE SAVE BUTTON */}
        {activeTab === 'academic' && (
          <div className="tab-content">
            <div className="academic-grid">
              <div className="info-card large">
                <label>University</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="university"
                    value={editData.university}
                    onChange={handleInputChange}
                    placeholder="Enter university name"
                  />
                ) : (
                  <p>{profileData.university || 'Not provided'}</p>
                )}
              </div>

              <div className="info-card large">
                <label>Branch</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="branch"
                    value={editData.branch}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{profileData.branch}</p>
                )}
              </div>

              <div className="info-card large">
                <label>Current Semester</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="semester"
                    value={editData.semester}
                    onChange={handleInputChange}
                    placeholder="e.g., 3rd Year"
                  />
                ) : (
                  <p>{profileData.semester || 'Not provided'}</p>
                )}
              </div>

              <div className="info-card large">
                <label>CGPA</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="cgpa"
                    value={editData.cgpa}
                    onChange={handleInputChange}
                    placeholder="e.g., 8.5"
                  />
                ) : (
                  <p>{profileData.cgpa || 'Not provided'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="action-buttons">
                <button className="save-btn" onClick={handleSave} disabled={loading}>
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="cancel-btn" onClick={handleCancel} disabled={loading}>
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Social Links Tab - UPDATE SAVE BUTTON */}
        {activeTab === 'social' && (
          <div className="tab-content">
            <div className="social-links-grid">
              <div className="info-card large">
                <Linkedin size={24} />
                <label>LinkedIn</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="linkedin"
                    value={editData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/..."
                  />
                ) : (
                  <p>{profileData.linkedin || 'Not provided'}</p>
                )}
              </div>

              <div className="info-card large">
                <Github size={24} />
                <label>GitHub</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="github"
                    value={editData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/..."
                  />
                ) : (
                  <p>{profileData.github || 'Not provided'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="action-buttons">
                <button className="save-btn" onClick={handleSave} disabled={loading}>
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="cancel-btn" onClick={handleCancel} disabled={loading}>
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;