import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { BarChartComponent, PieChartComponent } from '../components/dashboard/Chart';
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaCode, FaLinkedin, FaGithub } from 'react-icons/fa';
import axios from 'axios';

const ProfileReview = () => {
  const [searchId, setSearchId] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collegeReport, setCollegeReport] = useState(null);
  // College-wide report dummy data
  const collegeReportData = {
    eventsByType: [
      { name: 'Sports', count: 15 },
      { name: 'Hackathon', count: 8 },
      { name: 'Workshop', count: 12 },
      { name: 'Cultural', count: 10 },
      { name: 'Seminar', count: 6 }
    ],
    eventsByNAAC: [
      { name: '5.3.1', value: 20 },
      { name: '5.3.3', value: 15 },
      { name: '5.1.1', value: 10 },
      { name: '3.3.2', value: 8 },
      { name: 'Others', value: 12 }
    ],
    monthlyData: [
      { month: 'Jan', count: 12 },
      { month: 'Feb', count: 15 },
      { month: 'Mar', count: 18 },
      { month: 'Apr', count: 10 },
      { month: 'May', count: 14 },
      { month: 'Jun', count: 16 }
    ],
    summary: {
      totalEvents: 51,
      totalParticipants: 1247,
      eventCategories: 8,
      departments: 12
    }
  };
// Add this after collegeReportData
const dummyUsersData = {
  '301602223057': {
    type: 'student',
    profile: {
      fullName: "Tausif Khan",
      email: "tautumhare@gmail.com",
      collegeId: "GEC001",
      user1Id: "301602223057",
      branch: "CSE",
      role: "student",
      isActive: true,
      bio: "",
      cgpa: "6 CGPA",
      github: "https://github.com/tausif-lab",
      linkedin: "https://www.linkedin.com/in/tausif-khan-bb1a10352/",
      location: "",
      phone: "9244281486",
      semester: "3 year",
      skills: ["react", "Mongodb", "node.js", "Express.js", "Tailwind.css", "Next.js"]
    },
    activities: [{
      _id: "dummy_activity_1",
      userId: "301602223057",
      user1Id: "301602223057",
      category: "hackathons",
      title: "Amity Hackthon (Algostrome 1.0)",
      description: "Won first prize on the amity University",
      date: "2025-08-22T00:00:00.000+00:00",
      location: "Amity University",
      certificateUrl: "/uploads/certificates/cert-1762080384676-348937824.jpeg",
      verificationStatus: "approved",
      activityStatus: "completed",
      approvalDate: "2025-11-02T11:26:34.645+00:00",
      approvedByFaculty: "Jalil Khan",
      approvedByFacultyId: "301602223056",
      facultyRole: "Hackathons"
    }]
  },
  '301602223056': {
    type: 'faculty',
    profile: {
      fullName: "Jalil Khan",
      email: "jalilkhan@gmail.com",
      collegeId: "GEC001",
      user1Id: "301602223056",
      branch: "CSE",
      role: "FacultyIncharge",
      facultyInchargeType: "Hackathons",
      isActive: true,
      phone: "",
      location: "",
      bio: "",
      skills: [],
      linkedin: "",
      github: ""
    }
  },
  'GEC001': {
    type: 'college',
    report: {
      collegeId: 'GEC001',
      academicYear: '2024-25',
      eventsByType: [
        { name: 'Sports', count: 15 },
        { name: 'Hackathon', count: 8 },
        { name: 'Workshop', count: 12 },
        { name: 'Cultural', count: 10 },
        { name: 'Seminar', count: 6 }
      ],
      eventsByNAAC: [
        { name: '5.3.1', value: 20 },
        { name: '5.3.3', value: 15 },
        { name: '5.1.1', value: 10 },
        { name: '3.3.2', value: 8 },
        { name: 'Others', value: 12 }
      ],
      monthlyData: [
        { month: 'Jan', count: 12 },
        { month: 'Feb', count: 15 },
        { month: 'Mar', count: 18 },
        { month: 'Apr', count: 10 },
        { month: 'May', count: 14 },
        { month: 'Jun', count: 16 }
      ],
      summary: {
        totalEvents: 51,
        totalParticipants: 1247,
        eventCategories: 8,
        departments: 12
      }
    }
  }
};
 /* const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Please enter a User ID (e.g., STU001, FAC001)');
      return;
    }

    setLoading(true);
    setError('');
    setProfileData(null);
    setActivities([]);

    try {
      // Search for user by user1Id
      console.log('Searching for user with ID:', searchId.trim());
      const userResponse = await axios.get(`http://localhost:3001/api/user/profile/${searchId.trim()}`);
      
      console.log('API Response:', userResponse.data);
      
      if (!userResponse.data) {
        setError('User not found');
        setLoading(false);
        return;
      }

      const userData = userResponse.data;
      console.log('Setting profile data:', userData);
      setProfileData(userData);

      // Fetch activities only for students
      if (userData.role === 'student') {
        try {
          const activitiesResponse = await axios.get(`http://localhost:3001/api/activities/user/${userData.user1Id}`);
          
          // Filter only approved activities
          const approvedActivities = Array.isArray(activitiesResponse.data) 
            ? activitiesResponse.data.filter(activity => activity.verificationStatus === 'approved')
            : [];
          
          setActivities(approvedActivities);
        } catch (actErr) {
          console.log('No activities found for student');
          setActivities([]);
        }
      }

    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'User not found. Please check the User ID.');
    } finally {
      setLoading(false);
    }
  };*/

  /*const handleSearch = async () => {
    if (!searchId.trim()) {
        setError('Please enter a User ID (e.g., STU001, FAC001) or GEC001 for college report');
        return;
    }

    setLoading(true);
    setError('');
    setProfileData(null);
    setActivities([]);
    setCollegeReport(null); // Add this state

    try {
        console.log('Searching for:', searchId.trim());
        const response = await axios.get(`http://localhost:3001/api/profile-review/${searchId.trim()}`);
        
        console.log('API Response:', response.data);
        
        if (response.data.type === 'college') {
            // College report
            setCollegeReport(response.data.report);
        } else if (response.data.type === 'student') {
            // Student profile with activities
            setProfileData(response.data.profile);
            setActivities(response.data.activities || []);
        } else if (response.data.type === 'faculty') {
            // Faculty profile
            setProfileData(response.data.profile);
        } else {
            // Generic user profile
            setProfileData(response.data.profile);
        }

    } catch (err) {
        console.error('Search error:', err);
        setError(err.response?.data?.message || 'User not found. Please check the User ID.');
    } finally {
        setLoading(false);
    }
};*/

const handleSearch = async () => {
    if (!searchId.trim()) {
        setError('Please enter a User ID (e.g., 301602223057, 301602223056) or GEC001 for college report');
        return;
    }

    setLoading(true);
    setError('');
    setProfileData(null);
    setActivities([]);
    setCollegeReport(null);

    try {
        const trimmedId = searchId.trim();
        console.log('Searching for:', trimmedId);
        
        // Check if it's in dummy data first
        if (dummyUsersData[trimmedId]) {
            console.log('Found in dummy data');
            const dummyData = dummyUsersData[trimmedId];
            
            if (dummyData.type === 'college') {
                setCollegeReport(dummyData.report);
            } else if (dummyData.type === 'student') {
                setProfileData(dummyData.profile);
                setActivities(dummyData.activities || []);
            } else if (dummyData.type === 'faculty') {
                setProfileData(dummyData.profile);
            }
            
            setLoading(false);
            return;
        }

        // If not in dummy data, search in database
        const response = await axios.get(`http://localhost:3001/api/user/profile/${trimmedId}`);
        
        console.log('API Response:', response.data);
        
        const userData = response.data;
        setProfileData(userData);

        // Fetch activities only for students
        if (userData.role === 'student') {
            try {
                const activitiesResponse = await axios.get(`http://localhost:3001/api/activities/user/${userData.user1Id}`);
                
                const approvedActivities = Array.isArray(activitiesResponse.data) 
                    ? activitiesResponse.data.filter(activity => activity.verificationStatus === 'approved')
                    : [];
                
                setActivities(approvedActivities);
            } catch (actErr) {
                console.log('No activities found for student');
                setActivities([]);
            }
        }

    } catch (err) {
        console.error('Search error:', err);
        setError(err.response?.data?.message || 'User not found. Please check the User ID.');
    } finally {
        setLoading(false);
    }
};

  const getCategoryColor = (category) => {
    const colors = {
      workshops: 'bg-blue-100 text-blue-800',
      internships: 'bg-green-100 text-green-800',
      achievements: 'bg-yellow-100 text-yellow-800',
      hackathons: 'bg-purple-100 text-purple-800',
      sports: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card title="Profile Review & Search">
        <div className="flex gap-3">
          <input
    type="text"
    value={searchId}
    onChange={(e) => setSearchId(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
    placeholder="Enter User ID "
    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
/>
          <Button 
            variant="primary" 
            icon={<FaSearch />}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}
      </Card>

      {/* Debug Info */}
      <Card title="Debug Information" style={{ borderColor: '#fbbf24', backgroundColor: '#fef3c7' }}>
        <div className="space-y-2 text-sm">
          <p><strong>Tried Search URL:</strong> <code>GET /api/user/profile/{searchId}</code></p>
          <p><strong>Alternative URL:</strong> <code>GET /api/user/{searchId}</code></p>
          <p>
            <a href={`http://localhost:3001/api/user/debug/${searchId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Check if user exists in database
            </a>
          </p>
        </div>
      </Card>

      {/* Note: College Report features can be added in future updates */}
     {/* College Report View */}
{collegeReport && (
    <>
        <Card title={`College Report - ${collegeReport.collegeId}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-blue-600">{collegeReport.summary.totalEvents}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Participants</p>
                    <p className="text-2xl font-bold text-green-600">{collegeReport.summary.totalParticipants}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Event Categories</p>
                    <p className="text-2xl font-bold text-purple-600">{collegeReport.summary.eventCategories}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-orange-600">{collegeReport.summary.departments}</p>
                </div>
            </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Events by Type">
                <BarChartComponent data={collegeReport.eventsByType} />
            </Card>
            <Card title="Events by NAAC Criterion">
                <PieChartComponent data={collegeReport.eventsByNAAC} />
            </Card>
        </div>

        <Card title="Monthly Activity Trends">
            <BarChartComponent data={collegeReport.monthlyData} />
        </Card>
    </>
)}


      {/* Student Profile View */}
      {profileData?.role === 'student' && (
        <>
          <Card title="Student Profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="text-primary text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold">{profileData.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaGraduationCap className="text-primary text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">College ID</p>
                    <p className="font-semibold">{profileData.collegeId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaUser className="text-primary text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-semibold">{profileData.user1Id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-primary text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{profileData.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-primary text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{profileData.location || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaGraduationCap className="text-primary text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="font-semibold">{profileData.branch || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaGraduationCap className="text-primary text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Semester / CGPA</p>
                    <p className="font-semibold">
                      {profileData.semester || 'N/A'} / {profileData.cgpa || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {profileData.bio && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Bio</p>
                <p className="text-gray-700">{profileData.bio}</p>
              </div>
            )}

            {profileData.skills && profileData.skills.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                  <FaCode /> Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              {profileData.linkedin && (
                <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <FaLinkedin /> LinkedIn
                </a>
              )}
              {profileData.github && (
                <a href={profileData.github} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                  <FaGithub /> GitHub
                </a>
              )}
            </div>
          </Card>

          {/* Student Activities */}
          <Card title="Verified Activities">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No verified activities found
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{activity.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${getCategoryColor(activity.category)}`}>
                          {activity.category.toUpperCase()}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        ✓ Verified
                      </span>
                    </div>
                    
                    {activity.description && (
                      <p className="text-gray-600 mb-3">{activity.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                      {activity.location && (
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium">{activity.location}</p>
                        </div>
                      )}
                      {activity.company && (
                        <div>
                          <p className="text-gray-500">Company</p>
                          <p className="font-medium">{activity.company}</p>
                        </div>
                      )}
                      {activity.approvedByFaculty && (
                        <div>
                          <p className="text-gray-500">Approved By</p>
                          <p className="font-medium">{activity.approvedByFaculty}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {/* Faculty Incharge Profile View */}
      {profileData?.role === 'FacultyIncharge' && (
        <Card title="Faculty Incharge Profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaUser className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold">{profileData.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{profileData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaGraduationCap className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-500">College ID</p>
                  <p className="font-semibold">{profileData.collegeId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUser className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-semibold">{profileData.user1Id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaPhone className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{profileData.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{profileData.location || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaGraduationCap className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold">{profileData.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCode className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Faculty Type</p>
                  <p className="font-semibold">{profileData.facultyInchargeType}</p>
                </div>
              </div>
            </div>
          </div>

          {profileData.bio && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Bio</p>
              <p className="text-gray-700">{profileData.bio}</p>
            </div>
          )}

          {profileData.skills && profileData.skills.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                <FaCode /> Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            {profileData.linkedin && (
              <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <FaLinkedin /> LinkedIn
              </a>
            )}
            {profileData.github && (
              <a href={profileData.github} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <FaGithub /> GitHub
              </a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfileReview;