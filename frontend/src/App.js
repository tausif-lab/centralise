/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
/*import ProfileCard from './components/ProfileCard';
import ActivityTimeline from './components/ActivityTimeline';
import CertificateManager from './components/CertificateManager';
import Chatbot from './components/Chatbot';
import PortfolioGenerator from './components/PortfolioGenerator';*/
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Register from './pages/Register';
import './App.css';
import './styles/global.css';
import Login from './pages/Login';
import Admindashboard from './pages/AdminDashboard';  
import ProfileReview  from './pages/ProfileReview';
import '../src/App.css'
/*import Landing from './pages/Landing'*/

// Login Component
function LoginPage() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: '#1a202c' }}>Login to Beyond Records</h2>
        <form>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Email</label>
            <input 
              type="email" 
              placeholder="your.email@example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'transparent',
              color: '#667eea',
              border: '2px solid #667eea',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
}





// Landing Page Wrapper
function LandingPage() {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(`/${route}`);
  };

  return <Landing onNavigate={handleNavigation} />;
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         <Route path="/ProfileReview" element={<ProfileReview />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard" element={<Admindashboard />} />
        <Route path="/dashboard/:userId" element={<StudentDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;