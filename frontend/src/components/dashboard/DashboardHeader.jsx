/*import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const DashboardHeader = ({ teacherName = 'Prof. John Doe' }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Beyond Records</h1>
            <p className="text-sm text-gray-600">Teacher Dashboard</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-primary transition-colors">
              <FaBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-2">
              <FaUserCircle size={32} className="text-gray-600" />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{teacherName}</p>
                <p className="text-xs text-gray-500">Faculty</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;*/

import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const DashboardHeader = ({ teacherName = 'Prof. John Doe' }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-5">
        <div className="flex justify-between items-center">
          {/* Left - Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">BR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Beyond Records</h1>
              <p className="text-xs text-gray-500 mt-0.5">Teacher Dashboard</p>
            </div>
          </div>
          
          {/* Right - Actions */}
          <div className="flex items-center gap-5">
            {/* Notification */}
            <button className="relative p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <FaBell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
              <FaUserCircle size={32} className="text-gray-600" />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">{teacherName}</p>
                <p className="text-xs text-gray-500">Faculty Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;