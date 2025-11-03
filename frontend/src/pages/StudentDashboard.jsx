// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProfileSection from '../components/sections/ProfileSection';
import ActivityTracker from '../components/sections/ActivityTracker';
import CertificateUpload from '../components/sections/CertificateUpload';
import CareerAIBot from '../components/sections/CareerAIBot';
import { useSearchParams } from 'react-router-dom';
import PortfolioGenerator from '../components/sections/PortfolioGenerator';
import VerificationStatusStudent from '../components/sections/VerificationStatusStudent';
import '../styles/dashboard.css';
/*
const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const collegeId = searchParams.get('collegeId');
  const userId = searchParams.get('userId');
  const branch = searchParams.get('branch');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const sections = {
    profile: <ProfileSection />,
    activity: <ActivityTracker />,
    certificates: <CertificateUpload />,
    career: <CareerAIBot />,
    portfolio: <PortfolioGenerator />,
  };

 // Use these values in your component
  console.log('Student Dashboard - College ID:', collegeId);
  console.log('Student Dashboard - User ID:', userId);
  console.log('Student Dashboard - Branch:', branch);


  return (
    <div className="dashboard-container">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="dashboard-main">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} sidebarOpen={sidebarOpen} />
        <main className="dashboard-content">
          <div className="content-wrapper">
            {sections[activeSection]}
          </div>
        </main>
      </div>
    </div>
  );
};
*/


const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const userId = searchParams.get('userId');

  // Fetch user data from backend
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
        
        // Store in localStorage for offline access
        localStorage.setItem('user', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching user data:', error);
        
        // Fallback to localStorage if API fails
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
    return <div className="error">User not found</div>;
  }

  const sections = {
    profile: <ProfileSection userData={userData} />,
    activity: <ActivityTracker userData={userData} />,
    certificates: <CertificateUpload userData={userData} />,
    career: <CareerAIBot userData={userData} />,
    portfolio: <PortfolioGenerator userData={userData} />,
    verification: <VerificationStatusStudent userData={userData} />,
  };

  return (
    <div className="dashboard-container">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />
      <div className="dashboard-main">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} sidebarOpen={sidebarOpen} />
        <main className="dashboard-content">
          <div className="content-wrapper">
            {sections[activeSection]}
          </div>
        </main>
      </div>
    </div>
  );
};


export default StudentDashboard;