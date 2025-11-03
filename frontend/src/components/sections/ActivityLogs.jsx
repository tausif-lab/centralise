import React, { useState } from 'react';
import Card from '../common/Card';
import Table from '../common/Table';
import { formatDate } from '../../utils/helpers';

const ActivityLogs = () => {
  const [filter, setFilter] = useState('all');
  
  const [logs] = useState([
    {
      id: 1,
      studentName: 'Emily Chen',
      studentId: 'CS2020045',
      eventTitle: 'Smart India Hackathon',
      eventType: 'Hackathon',
      status: 'approved',
      actionDate: '2024-01-10',
      verifiedBy: 'Prof. John Doe'
    },
    {
      id: 2,
      studentName: 'David Park',
      studentId: 'ME2020032',
      eventTitle: 'Annual Sports Meet',
      eventType: 'Sports',
      status: 'approved',
      actionDate: '2024-01-09',
      verifiedBy: 'Prof. John Doe'
    },
    {
      id: 3,
      studentName: 'Lisa Anderson',
      studentId: 'EC2021018',
      eventTitle: 'Robotics Workshop',
      eventType: 'Workshop',
      status: 'rejected',
      actionDate: '2024-01-08',
      verifiedBy: 'Prof. John Doe',
      reason: 'Insufficient documentation'
    },
    {
      id: 4,
      studentName: 'Tom Wilson',
      studentId: 'CS2021025',
      eventTitle: 'Cultural Fest Performance',
      eventType: 'Cultural Event',
      status: 'approved',
      actionDate: '2024-01-07',
      verifiedBy: 'Prof. John Doe'
    }
  ]);

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.status === filter);

  const columns = [
    {
      header: 'Student',
      render: (row) => (
        <div>
          <p className="font-medium">{row.studentName}</p>
          <p className="text-xs text-gray-500">{row.studentId}</p>
        </div>
      )
    },
    {
      header: 'Event',
      render: (row) => (
        <div>
          <p className="font-medium">{row.eventTitle}</p>
          <p className="text-xs text-gray-500">{row.eventType}</p>
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          row.status === 'approved' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      )
    },
    {
      header: 'Action Date',
      render: (row) => formatDate(row.actionDate)
    },
    {
      header: 'Verified By',
      accessor: 'verifiedBy'
    }
  ];

  return (
    <Card 
      title="Activity Logs"
      action={
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              filter === 'approved' 
                ? 'bg-success text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              filter === 'rejected' 
                ? 'bg-danger text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rejected
          </button>
        </div>
      }
    >
      <Table columns={columns} data={filteredLogs} />
    </Card>
  );
};

export default ActivityLogs;