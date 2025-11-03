// src/components/Header.jsx
import React from 'react';
import { Menu, Bell, Settings, LogOut } from 'lucide-react';
import '../styles/header.css';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button 
          className="menu-btn" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>
        <div className="logo">
          <h1>Beyond Records</h1>
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <button className="icon-btn">
          <Settings size={20} />
        </button>

        <div className="user-profile">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User" 
            className="user-avatar"
          />
          <div className="user-info">
            <p className="user-name">Sarah Johnson</p>
            <p className="user-role">B.Tech CSE - 3rd Year</p>
          </div>
        </div>

        <button className="icon-btn logout-btn">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;