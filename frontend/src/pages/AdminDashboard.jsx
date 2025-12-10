import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUsers, FaFileAlt, FaCalendarAlt, FaCog } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalActivities: 0,
    pendingVerifications: 0
  });

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    
    // Check if user is admin
    if (parsedUser.role !== 'admin') {
      navigate(`/dashboard/${parsedUser.user1Id}`);
      return;
    }
    
    setUser(parsedUser);
    
    // Fetch dashboard stats
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-blue-100">Welcome, {user.fullName}</p>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* Total Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEvents}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCalendarAlt className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* Total Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalActivities}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaFileAlt className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Verifications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingVerifications}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaCog className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Manage Users */}
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-lg shadow-md transition transform hover:scale-105"
            >
              <FaUsers className="text-3xl mb-3" />
              <h3 className="text-lg font-semibold">Manage Users</h3>
              <p className="text-sm text-blue-100 mt-2">View and manage all registered users</p>
            </button>

            {/* Manage Events */}
            <button
              onClick={() => navigate('/admin/events')}
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-lg shadow-md transition transform hover:scale-105"
            >
              <FaCalendarAlt className="text-3xl mb-3" />
              <h3 className="text-lg font-semibold">Manage Events</h3>
              <p className="text-sm text-green-100 mt-2">View and manage all events</p>
            </button>

            {/* Verify Activities */}
            <button
              onClick={() => navigate('/admin/activities')}
              className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-lg shadow-md transition transform hover:scale-105"
            >
              <FaFileAlt className="text-3xl mb-3" />
              <h3 className="text-lg font-semibold">Verify Activities</h3>
              <p className="text-sm text-purple-100 mt-2">Review pending activity verifications</p>
            </button>

            {/* System Settings */}
            <button
              onClick={() => navigate('/admin/settings')}
              className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-lg shadow-md transition transform hover:scale-105"
            >
              <FaCog className="text-3xl mb-3" />
              <h3 className="text-lg font-semibold">System Settings</h3>
              <p className="text-sm text-orange-100 mt-2">Configure system parameters</p>
            </button>

            {/* View Reports */}
            <button
              onClick={() => navigate('/admin/reports')}
              className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-6 rounded-lg shadow-md transition transform hover:scale-105"
            >
              <FaFileAlt className="text-3xl mb-3" />
              <h3 className="text-lg font-semibold">View Reports</h3>
              <p className="text-sm text-red-100 mt-2">Generate and view system reports</p>
            </button>

            {/* Audit Logs */}
            <button
              onClick={() => navigate('/admin/logs')}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-6 rounded-lg shadow-md transition transform hover:scale-105"
            >
              <FaFileAlt className="text-3xl mb-3" />
              <h3 className="text-lg font-semibold">Audit Logs</h3>
              <p className="text-sm text-indigo-100 mt-2">View system activity logs</p>
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Admin Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">User ID</p>
              <p className="font-medium text-gray-900">{user.user1Id}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
