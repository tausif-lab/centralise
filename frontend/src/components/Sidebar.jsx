// src/components/Sidebar.jsx
import React from 'react';
import { 
  User, 
  Activity, 
  Award, 
  Zap, 
  FileText,
  X
} from 'lucide-react';
import '../styles/sidebar.css';

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen }) => {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'activity', label: 'Activity Tracker', icon: Activity },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'career', label: 'Career AI Bot', icon: Zap },
    { id: 'portfolio', label: 'Portfolio', icon: FileText },
  ];

  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-card">
            <h3>Need Help?</h3>
            <p>Contact our support team</p>
            <button className="help-btn">Get Support</button>
          </div>
        </div>
      </aside>
      {sidebarOpen && <div className="sidebar-overlay"></div>}
    </>
  );
};

export default Sidebar;