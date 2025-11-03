import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCard from '../components/dashboard/StatsCard';
import VerificationRequests from '../components/sections/VerificationRequests';
import ActivityLogs from '../components/sections/ActivityLogs';
import ReportGeneration from '../components/sections/ReportGeneration';
import EventManagement from '../components/sections/EventManagement';
import VerificationRequestsTeacher from '../components/sections/VerificationRequestsTeacher';
import { useSearchParams } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaCalendarAlt,
  FaTasks,
  FaChartBar,
  FaCalendarPlus
} from 'react-icons/fa';

function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get parameters from URL
  const collegeId = searchParams.get('collegeId');
  const userId = searchParams.get('userId');
  const facultyInchargeType = searchParams.get('facultyInchargeType');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error('No userId found in URL');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/user/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching user data:', error);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userData) {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser || !storedUser.user1Id) {
      return <div className="error">User not found</div>;
    }
  }

  const displayUserData = userData || JSON.parse(localStorage.getItem('user') || '{}');
  
  // Use these values in your component
  console.log('Teacher Dashboard - College ID:', collegeId);
  console.log('Teacher Dashboard - User ID:', userId);
  console.log('Teacher Dashboard - Faculty Type:', facultyInchargeType);




  const tabs = [
    { id: 'events', label: 'Event Management', icon: <FaCalendarPlus /> },
    { id: 'verify-activities', label: 'Verify Activities', icon: <FaTasks /> },
    { id: 'verification', label: 'Verification Requests', icon: <FaTasks /> },
    { id: 'logs', label: 'Activity Logs', icon: <FaCheckCircle /> },
    { id: 'reports', label: 'NAAC Reports', icon: <FaChartBar /> },
  ];

  const stats = [
    {
      title: 'Pending Requests',
      value: '12',
      icon: <FaClock size={24} />,
      color: 'warning',
      trend: { value: '+3', label: 'from last week', positive: false }
    },
    {
      title: 'Approved',
      value: '48',
      icon: <FaCheckCircle size={24} />,
      color: 'success',
      trend: { value: '+12', label: 'this month', positive: true }
    },
    {
      title: 'Rejected',
      value: '5',
      icon: <FaTimesCircle size={24} />,
      color: 'danger',
      trend: { value: '-2', label: 'from last month', positive: true }
    },
    {
      title: 'Total Events',
      value: '65',
      icon: <FaCalendarAlt size={24} />,
      color: 'primary',
      trend: { value: '+8', label: 'this semester', positive: true }
    },
  ];

  return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <DashboardHeader />
    
    {/* Main Content - Responsive max-width with generous padding */}
    <main className="w-full max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-10">
      
      {/* Page Title - More breathing room */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Section - Larger gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Divider for visual separation */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-12"></div>

      {/* Navigation Tabs - More space around */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-10">
        <div className="flex flex-wrap gap-2 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-3 px-6 py-3.5 font-medium text-sm 
                rounded-lg transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections - Maximum breathing room */}
      <div className="animate-fade-in min-h-[500px]">
        <div className="mb-8">
          {activeTab === 'events' && <EventManagement />}
          {activeTab === 'verify-activities' && <VerificationRequestsTeacher userData={displayUserData} />}
          {activeTab === 'verification' && <VerificationRequests />}
          {activeTab === 'logs' && <ActivityLogs />}
          {activeTab === 'reports' && <ReportGeneration />}
        </div>
      </div>
    </main>

    {/* Footer - More spacing from content */}
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Beyond Records. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
);
}

export default TeacherDashboard;

/*import React from 'react';

function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <h1 className="text-4xl font-bold text-white">Teacher Dashboard Test</h1>
      <p className="text-white mt-4">If you see blue background and white text, Tailwind works!</p>
    </div>
  );
}

export default TeacherDashboard;*/

