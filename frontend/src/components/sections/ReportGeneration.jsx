import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { BarChartComponent, PieChartComponent } from '../dashboard/Chart';
import { FaFileDownload, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { exportToCSV } from '../../utils/helpers';

const ReportGeneration = () => {
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: '2024-01-31'
  });

  const eventsByType = [
    { name: 'Sports', count: 15 },
    { name: 'Hackathon', count: 8 },
    { name: 'Workshop', count: 12 },
    { name: 'Cultural', count: 10 },
    { name: 'Seminar', count: 6 }
  ];

  const eventsByNAAC = [
    { name: '5.3.1', value: 20 },
    { name: '5.3.3', value: 15 },
    { name: '5.1.1', value: 10 },
    { name: '3.3.2', value: 8 },
    { name: 'Others', value: 12 }
  ];

  const monthlyData = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 15 },
    { month: 'Mar', count: 18 },
    { month: 'Apr', count: 10 },
    { month: 'May', count: 14 },
    { month: 'Jun', count: 16 }
  ];

  const reportData = [
    {
      eventId: 'EVT001',
      eventTitle: 'Smart India Hackathon',
      type: 'Hackathon',
      date: '2024-01-15',
      participants: 120,
      naacCategory: '5.3.3',
      status: 'Completed'
    },
    {
      eventId: 'EVT002',
      eventTitle: 'Annual Sports Day',
      type: 'Sports',
      date: '2024-01-20',
      participants: 250,
      naacCategory: '5.3.1',
      status: 'Completed'
    }
  ];

  const handleExportCSV = () => {
    exportToCSV(reportData, `NAAC_Report_${dateRange.from}_to_${dateRange.to}`);
  };

  const handleExportPDF = () => {
    alert('PDF export functionality will be implemented with jsPDF library');
  };

  const handleExportExcel = () => {
    alert('Excel export functionality will be implemented with XLSX library');
  };

  return (
    <div className="space-y-6">
      <Card title="NAAC Report Generation">
        <div className="space-y-6">
          {/* Date Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex items-end">
              <Button variant="primary" className="w-full">
                Generate Report
              </Button>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="success" 
              icon={<FaFileExcel />}
              onClick={handleExportExcel}
            >
              Export Excel
            </Button>
            <Button 
              variant="danger" 
              icon={<FaFilePdf />}
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              icon={<FaFileDownload />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Events by Type">
          <BarChartComponent 
            data={eventsByType} 
            dataKey="count" 
            xKey="name"
          />
        </Card>

        <Card title="NAAC Category Distribution">
          <PieChartComponent data={eventsByNAAC} />
        </Card>

        <Card title="Monthly Event Trends" className="lg:col-span-2">
          <BarChartComponent 
            data={monthlyData} 
            dataKey="count" 
            xKey="month"
          />
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card title="Report Summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-primary">51</p>
            <p className="text-sm text-gray-600 mt-1">Total Events</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-success">1,247</p>
            <p className="text-sm text-gray-600 mt-1">Total Participants</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-warning">8</p>
            <p className="text-sm text-gray-600 mt-1">Event Categories</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-secondary">12</p>
            <p className="text-sm text-gray-600 mt-1">Departments</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportGeneration;