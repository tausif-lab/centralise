// src/components/sections/ActivityTracker.jsx
import React, { useState , useEffect} from 'react';
import { Plus, Calendar, MapPin, Award, Trash2, Edit2 } from 'lucide-react';
import '../../styles/sections/activity.css';
import { useSearchParams } from 'react-router-dom';
const ActivityTracker = ({ userData }) => {
  const [searchParams] = useSearchParams();
  const userId = userData?.user1Id || searchParams.get('userId');
  const [activeTab, setActiveTab] = useState('workshops');
  const [showModal, setShowModal] = useState(false);
  const [activities, setActivities] = useState({
    workshops: [],
    internships: [],
    achievements: [],
    hackathons: [],
    sports: []
  });
  const [loading, setLoading] = useState(true);

  const [newActivity, setNewActivity] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    category:  activeTab,
    certificateFile: null
  });

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities();
  }, [userId]);

  
  
const fetchActivities = async () => {
    if (!userId) {
      console.error('No userId found');
      setLoading(false);
      return;
    }

    try {
      // userId is now user1Id
      const response = await fetch(`http://localhost:3001/api/activities/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      
      if (response.ok) {
        const data = await response.json();
        
        // Group activities by category
        const grouped = {
          workshops: [],
          internships: [],
          achievements: [],
          hackathons: [],
          sports: []
        };
        
        data.forEach(activity => {
          if (grouped[activity.category]) {
            grouped[activity.category].push(activity);
          }
        });
        
        setActivities(grouped);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddActivity = async () => {
    const category = newActivity.category || activeTab;

    console.log('Form data before validation:', {
    title: newActivity.title,
    date: newActivity.date,
    category: category
  });


    if (!newActivity.title || !newActivity.date || !newActivity.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newActivity.title);
      formData.append('date', newActivity.date);
      //formData.append('category', newActivity.category);
      formData.append('category', category);
      formData.append('location', newActivity.location);
      formData.append('description', newActivity.description);
      
      if (newActivity.company) formData.append('company', newActivity.company);
      if (newActivity.endDate) formData.append('endDate', newActivity.endDate);
      if (newActivity.event) formData.append('event', newActivity.event);
      if (newActivity.certificateFile) formData.append('certificate', newActivity.certificateFile);

      // Use user1Id (already stored in userId variable)
      const response = await fetch(`http://localhost:3001/api/activities/${userId}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
  const savedActivity = await response.json();
  
  setActivities(prev => ({
    ...prev,
    [savedActivity.category]: [...prev[savedActivity.category], savedActivity]
  }));

  setNewActivity({ 
    title: '', 
    date: '', 
    location: '', 
    description: '', 
    category: '',
    certificateFile: null 
  });
  setShowModal(false);
  alert('Activity added successfully!');
} else {
  // ADD THIS BLOCK
  const errorData = await response.json();
  console.error('Server error:', errorData);
  alert(`Failed to add activity: ${errorData.message || 'Unknown error'}`);
}
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity');
    }
  };




  const handleDeleteActivity = async (id, category) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/activities/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setActivities(prev => ({
          ...prev,
          [category]: prev[category].filter(activity => activity._id !== id)
        }));
        alert('Activity deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity');
    }
  };
  return (
    <div className="activity-tracker">
      <div className="section-header">
        <h2>Activity Tracker</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Activity
        </button>
      </div>

      <div className="activity-tabs">
      <button
          className={`tab ${activeTab === 'workshops' ? 'active' : ''}`}
         onClick={() => setActiveTab('workshops')}
       >
     Workshops ({activities.workshops?.length || 0})
     </button>
      <button
    className={`tab ${activeTab === 'internships' ? 'active' : ''}`}
    onClick={() => setActiveTab('internships')}
     >
    Internships ({activities.internships?.length || 0})
  </button>
  <button
    className={`tab ${activeTab === 'hackathons' ? 'active' : ''}`}
    onClick={() => setActiveTab('hackathons')}
  >
    Hackathons ({activities.hackathons?.length || 0})
  </button>
  <button
    className={`tab ${activeTab === 'sports' ? 'active' : ''}`}
    onClick={() => setActiveTab('sports')}
  >
    Sports ({activities.sports?.length || 0})
  </button>
  <button
    className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
    onClick={() => setActiveTab('achievements')}
  >
    Achievements ({activities.achievements?.length || 0})
  </button>
</div>

      <div className="activities-list">
        {activeTab === 'workshops' && (
          <div className="tab-activities">
            {activities.workshops.map(activity => (
              <div key={activity.id} className="activity-card workshop-card">
                <div className="activity-header">
                  {activity.certificateUrl && (
                    <span className={`verification-badge ${activity.verificationStatus}`}>
                       {activity.verificationStatus === 'pending' && '⏳ Pending Verification'}
                       {activity.verificationStatus === 'approved' && '✓ Verified'}
                        {activity.verificationStatus === 'rejected' && '✗ Rejected'}
                     </span>
                  )}
                  
                  
                  
                  <h3>{activity.title}</h3>
                  {activity.status && (
                    <span className={`status-badge ${activity.status.toLowerCase()}`}>
                      {activity.status}
                    </span>
                  )}
                </div>
                <div className="activity-details">
                  <div className="detail">
                    <Calendar size={16} />
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail">
                    <MapPin size={16} />
                    <span>{activity.location}</span>
                  </div>
                </div>
                <div className="activity-footer">
                  <span className="certificate-badge">{activity.certificate}</span>
                  <div className="action-buttons">
                    <button className="icon-btn">
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="icon-btn delete-btn"
                      onClick={() => handleDeleteActivity(activity.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'internships' && (
          <div className="tab-activities">
            {activities.internships.map(activity => (
              <div key={activity.id} className="activity-card internship-card">
                <div className="activity-header">
                  <div>
                    <h3>{activity.title}</h3>
                    <p className="company">{activity.company}</p>
                  </div>
                  {activity.certificateUrl && (
                   <span className={`verification-badge ${activity.verificationStatus}`}>
                    {activity.verificationStatus === 'pending' && '⏳ Pending Verification'}
                    {activity.verificationStatus === 'approved' && '✓ Verified'}
                    {activity.verificationStatus === 'rejected' && '✗ Rejected'}
                  </span>
                  )}
                  {activity.status && (
                    <span className={`status-badge ${activity.status.toLowerCase()}`}>
                      {activity.status}
                    </span>
                  )}
                </div>
                <div className="activity-details">
                  <div className="detail">
                    <Calendar size={16} />
                    <span>{new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail">
                    <span className="duration-badge">{activity.duration}</span>
                  </div>
                </div>
                <div className="activity-footer">
                  <div className="action-buttons">
                    <button className="icon-btn">
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="icon-btn delete-btn"
                      onClick={() => handleDeleteActivity(activity.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="tab-activities">
            {activities.achievements.map(activity => (
              <div key={activity.id} className="activity-card achievement-card">
                <div className="achievement-badge">{activity.badge}</div>
                {activity.certificateUrl && (
                  <span className={`verification-badge ${activity.verificationStatus}`}>
                    {activity.verificationStatus === 'pending' && '⏳ Pending Verification'}
                    {activity.verificationStatus === 'approved' && '✓ Verified'}
                     {activity.verificationStatus === 'rejected' && '✗ Rejected'}
                   </span>
                )}




                <div className="achievement-content">
                  <h3>{activity.title}</h3>
                  <p>{activity.event}</p>
                  <span className="achievement-date">
                    <Calendar size={14} />
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="action-buttons">
                  <button className="icon-btn">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="icon-btn delete-btn"
                    onClick={() => handleDeleteActivity(activity.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'hackathons' && (
  <div className="tab-activities">
    {activities.hackathons.map(activity => (
      <div key={activity._id} className="activity-card hackathon-card">
        <div className="activity-header">
          <h3>{activity.title}</h3>
        </div>
        {activity.certificateUrl && (
          <span className={`verification-badge ${activity.verificationStatus}`}>
            {activity.verificationStatus === 'pending' && '⏳ Pending Verification'}
            {activity.verificationStatus === 'approved' && '✓ Verified'}
          </span>
        )}
        <div className="activity-details">
          <div className="detail">
            <Calendar size={16} />
            <span>{new Date(activity.date).toLocaleDateString()}</span>
          </div>
          <div className="detail">
            <MapPin size={16} />
            <span>{activity.location}</span>
          </div>
        </div>
        <div className="activity-footer">
          <div className="action-buttons">
            <button 
              className="icon-btn delete-btn"
              onClick={() => handleDeleteActivity(activity._id, 'hackathons')}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

{activeTab === 'sports' && (
  <div className="tab-activities">
    {activities.sports.map(activity => (
      <div key={activity._id} className="activity-card sports-card">
        <div className="activity-header">
          <h3>{activity.title}</h3>
          <p className="event-name">{activity.event}</p>
        </div>
        {activity.certificateUrl && (
          <span className={`verification-badge ${activity.verificationStatus}`}>
            {activity.verificationStatus === 'pending' && '⏳ Pending Verification'}
            {activity.verificationStatus === 'approved' && '✓ Verified'}
          </span>
        )}
        <div className="activity-details">
          <div className="detail">
            <Calendar size={16} />
            <span>{new Date(activity.date).toLocaleDateString()}</span>
          </div>
          <div className="detail">
            <MapPin size={16} />
            <span>{activity.location}</span>
          </div>
        </div>
        <div className="activity-footer">
          <div className="action-buttons">
            <button 
              className="icon-btn delete-btn"
              onClick={() => handleDeleteActivity(activity._id, 'sports')}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}



      </div>

      {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Add New Activity</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleAddActivity(); }}>
       <select
         value={newActivity.category || ''}
          onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
         required
   >
          <option value="">Select Category</option>
          <option value="workshops">Workshop</option>
          <option value="internships">Internship</option>
          <option value="achievements">Achievement</option>
          <option value="hackathons">Hackathon</option>
          <option value="sports">Sports</option>
        </select>

        <input
          type="text"
          placeholder="Title"
          value={newActivity.title}
          onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
          required
        />

        <input
          type="date"
          placeholder="Date"
          value={newActivity.date}
          onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
          required
        />

        {newActivity.category === 'internships' && (
          <>
            <input
              type="text"
              placeholder="Company Name"
              value={newActivity.company || ''}
              onChange={(e) => setNewActivity({...newActivity, company: e.target.value})}
            />
            <input
              type="date"
              placeholder="End Date"
              value={newActivity.endDate || ''}
              onChange={(e) => setNewActivity({...newActivity, endDate: e.target.value})}
            />
          </>
        )}

        {(newActivity.category === 'achievements' || newActivity.category === 'sports') && (
          <input
            type="text"
            placeholder="Event Name"
            value={newActivity.event || ''}
            onChange={(e) => setNewActivity({...newActivity, event: e.target.value})}
          />
        )}

        <input
          type="text"
          placeholder="Location"
          value={newActivity.location}
          onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
        />

        <textarea
          placeholder="Description"
          value={newActivity.description}
          onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
        ></textarea>

        <div className="file-upload-section">
          <label htmlFor="certificate" className="file-upload-label">
            <Award size={18} />
            Upload Certificate (Optional)
          </label>
          <input
            id="certificate"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setNewActivity({...newActivity, certificateFile: e.target.files[0]})}
            className="file-input"
          />
          {newActivity.certificateFile && (
            <span className="file-name">{newActivity.certificateFile.name}</span>
          )}
        </div>

        <div className="modal-buttons">
          <button type="submit" className="submit-btn">Add Activity</button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => {
              setShowModal(false);
              setNewActivity({ title: '', date: '', location: '', description: '', category: '' });
            }}
          >
            Cancel
             </button>
            </div>
        </form>
      </div>
    </div>
   )}
    </div>
  );
};

export default ActivityTracker;