import React, { useState } from 'react';
import { EVENT_TYPES, DEPARTMENTS, NAAC_CATEGORIES } from '../../utils/constants';
import { generateEventId } from '../../utils/helpers';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';

const EventForm = ({ onSubmit, initialData = null, selectedDate }) => {
  const [formData, setFormData] = useState({
    eventId: initialData?.eventId || generateEventId(),
    eventTitle: initialData?.eventTitle || '',
    type: initialData?.type || '',
    organizer: initialData?.organizer || '',
    date: initialData?.date || selectedDate?.toISOString().split('T')[0] || '',
    duration: initialData?.duration || '',
    noticeFile: initialData?.noticeFile || [],
    attendanceSheet: initialData?.attendanceSheet || [],
    photos: initialData?.photos || [],
    eventReport: initialData?.eventReport || '',
    facultyApproval: initialData?.facultyApproval || false,
    verificationDate: initialData?.verificationDate || new Date().toISOString().split('T')[0],
    naacCategory: initialData?.naacCategory || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => (
      {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }
    ));
  };

  const handleFileChange = (name, files) => {
    setFormData(prev => (
      {
        ...prev,
        [name]: files
      }
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: null, text: '' });

    try {
      // Create FormData for file uploads
      const formDataObj = new FormData();
      
      // Add form fields
      formDataObj.append('eventId', formData.eventId);
      formDataObj.append('eventTitle', formData.eventTitle);
      formDataObj.append('type', formData.type);
      formDataObj.append('organizer', formData.organizer);
      formDataObj.append('date', formData.date);
      formDataObj.append('duration', formData.duration);
      formDataObj.append('eventReport', formData.eventReport);
      formDataObj.append('facultyApproval', formData.facultyApproval);
      formDataObj.append('verificationDate', formData.verificationDate);
      formDataObj.append('naacCategory', formData.naacCategory);

      // Add files
      if (formData.noticeFile && formData.noticeFile.length > 0 && formData.noticeFile[0] instanceof File) {
        formDataObj.append('noticeFile', formData.noticeFile[0]);
      }

      if (formData.attendanceSheet && formData.attendanceSheet.length > 0 && formData.attendanceSheet[0] instanceof File) {
        formDataObj.append('attendanceSheet', formData.attendanceSheet[0]);
      }

      if (formData.photos && formData.photos.length > 0) {
        formData.photos.forEach((photo) => {
          if (photo instanceof File) {
            formDataObj.append('photos', photo);
          }
        });
      }

      const response = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        body: formDataObj,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: 'Event created successfully!' });
        setTimeout(() => {
          onSubmit(result.event);
        }, 1000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to create event' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage({ type: 'error', text: 'Error: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event ID (Auto) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Event ID</label>
          <input
            type="text"
            value={formData.eventId}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        {/* Event Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="eventTitle"
            value={formData.eventTitle}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Enter event title"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Select Type</option>
            {EVENT_TYPES && EVENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Organizer */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organizer / Department <span className="text-red-500">*</span>
          </label>
          <select
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Select Department</option>
            {DEPARTMENTS && DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            placeholder="e.g., 3 hours, 2 days"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>

        {/* NAAC Category */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            NAAC Category <span className="text-red-500">*</span>
          </label>
          <select
            name="naacCategory"
            value={formData.naacCategory}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Select NAAC Category</option>
            {NAAC_CATEGORIES && NAAC_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* File Uploads */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Event Documents & Images</h3>
        
        <FileUpload
          label="Notice File (PDF, DOC, DOCX)"
          accept=".pdf,.doc,.docx"
          onChange={(files) => handleFileChange('noticeFile', files)}
          required={false}
        />

        <FileUpload
          label="Attendance Sheet (Excel, PDF)"
          accept=".xlsx,.xls,.pdf"
          onChange={(files) => handleFileChange('attendanceSheet', files)}
          required={false}
        />

        <FileUpload
          label="Event Photos (1-3 images)"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          multiple
          maxFiles={3}
          onChange={(files) => handleFileChange('photos', files)}
          required={false}
        />
      </div>

      {/* Event Report */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Event Report (Summary + Outcome) <span className="text-red-500">*</span>
        </label>
        <textarea
          name="eventReport"
          value={formData.eventReport}
          onChange={handleChange}
          required
          rows="6"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Enter detailed event report including summary and outcomes..."
        />
      </div>

      {/* Faculty Approval */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          name="facultyApproval"
          checked={formData.facultyApproval}
          onChange={handleChange}
          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label className="text-sm font-medium text-gray-700">
          I approve this event and verify all the information provided
        </label>
      </div>

      {/* Verification Date (Auto) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Verification Date</label>
        <input
          type="date"
          value={formData.verificationDate}
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Event'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
