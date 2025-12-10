import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaBook, FaTrophy, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';

const UserDashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    
    // Check if userId matches current user
    if (parsedUser.user1Id !== userId) {
      navigate(`/dashboard/${parsedUser.user1Id}`);
      return;
    }

    // Check if user is admin (redirect to admin dashboard)
    if (parsedUser.role === 'admin') {
      navigate('/admin-dashboard');
      return;
    }
    
    setUser(parsedUser);
    
    // Fetch user activities and events
    fetchUserData();
  }, [userId, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user activities
      const activitiesResponse = await fetch(`http://localhost:3001/api/activities/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData || []);
      }

      // Fetch user events
      const eventsResponse = await fetch('http://localhost:3001/api/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const verifiedActivities = activities.filter(a => a.verificationStatus === 'approved').length;
  const pendingActivities = activities.filter(a => a.verificationStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-blue-100">Welcome back, {user.fullName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <FaUser className="text-blue-600 text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex gap-6 mt-3 text-sm">
                  <span className="text-gray-600">
                    <strong>User ID:</strong> {user.user1Id}
                  </span>
                  <span className="text-gray-600">
                    <strong>Branch:</strong> {user.branch || 'N/A'}
                  </span>
                  <span className="text-gray-600">
                    <strong>Role:</strong> {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activities.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaClipboardList className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* Verified Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Verified</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{verifiedActivities}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaTrophy className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* Pending Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{pendingActivities}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaCalendarAlt className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* Total Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Events</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{events.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaBook className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h3>
            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity._id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <p className="font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.category}</p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                      activity.verificationStatus === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : activity.verificationStatus === 'pending'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activity.verificationStatus}
                    </span>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-gray-500 text-sm">No activities yet</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No activities recorded</p>
            )}
            <button
              onClick={() => navigate('/activities')}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              View All Activities
            </button>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h3>
            {events.length > 0 ? (
              <div className="space-y-3">
                {events.slice(0, 5).map((event) => (
                  <div key={event._id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                    <p className="font-semibold text-gray-900">{event.eventTitle}</p>
                    <p className="text-sm text-gray-600">{event.type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-gray-500 text-sm">No events available</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No events recorded</p>
            )}
            <button
              onClick={() => navigate('/events')}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
            >
              View All Events
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
