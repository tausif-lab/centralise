import React, { useState } from 'react';
import Card from '../common/Card';
import Table from '../common/Table';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const VerificationRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      studentName: 'John Smith',
      studentId: 'CS2021001',
      eventTitle: 'National Hackathon 2024',
      eventType: 'Hackathon',
      submissionDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: 2,
      studentName: 'Sarah Johnson',
      studentId: 'CS2021002',
      eventTitle: 'Inter-College Basketball',
      eventType: 'Sports',
      submissionDate: '2024-01-14',
      status: 'pending'
    },
    {
      id: 3,
      studentName: 'Mike Davis',
      studentId: 'EC2021015',
      eventTitle: 'Tech Workshop on AI',
      eventType: 'Workshop',
      submissionDate: '2024-01-13',
      status: 'pending'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleApprove = (id) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
  };

  const handleReject = (id) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const columns = [
    {
      header: 'Student Name',
      accessor: 'studentName',
    },
    {
      header: 'Student ID',
      accessor: 'studentId',
    },
    {
      header: 'Event Title',
      accessor: 'eventTitle',
    },
    {
      header: 'Event Type',
      accessor: 'eventType',
      render: (row) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {row.eventType}
        </span>
      )
    },
    {
      header: 'Submission Date',
      accessor: 'submissionDate',
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleApprove(row.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded"
            title="Approve"
          >
            <FaCheck />
          </button>
          <button
            onClick={() => handleReject(row.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Reject"
          >
            <FaTimes />
          </button>
        </div>
      )
    }
  ];

  const pendingRequests = requests.filter(req => req.status === 'pending');

  return (
    <>
      <Card 
        title="Student Verification Requests" 
        subtitle={`${pendingRequests.length} pending requests`}
      >
        <Table 
          columns={columns} 
          data={pendingRequests}
        />
      </Card>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Request Details"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Student Name</p>
                <p className="text-base font-semibold">{selectedRequest.studentName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Student ID</p>
                <p className="text-base font-semibold">{selectedRequest.studentId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Event Title</p>
                <p className="text-base font-semibold">{selectedRequest.eventTitle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Event Type</p>
                <p className="text-base font-semibold">{selectedRequest.eventType}</p>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                variant="success" 
                className="flex-1"
                onClick={() => {
                  handleApprove(selectedRequest.id);
                  setShowDetailsModal(false);
                }}
              >
                Approve
              </Button>
              <Button 
                variant="danger" 
                className="flex-1"
                onClick={() => {
                  handleReject(selectedRequest.id);
                  setShowDetailsModal(false);
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default VerificationRequests;