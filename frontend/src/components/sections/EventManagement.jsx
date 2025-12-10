import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import EventCalendar from '../events/EventCalendar';
import EventModal from '../events/EventModal';
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';
import { FaFileDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const EventManagement = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [generatingReport, setGeneratingReport] = useState(false);
  // Fetch events from API on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/events');
        const data = await response.json();
        if (Array.isArray(data)) {
          // Convert dates to proper format for calendar
          const formattedEvents = data.map(event => ({
            ...event,
            date: new Date(event.date).toISOString().split('T')[0]
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleEventSubmit = (eventData) => {
    // Add new event to the events list
    const formattedEvent = {
      ...eventData,
      date: typeof eventData.date === 'object' ? eventData.date.toISOString().split('T')[0] : eventData.date
    };
    setEvents(prev => [...prev, formattedEvent]);
    setShowEventModal(false);
    console.log('Event submitted:', eventData);
  };
  /*const generateReport = async () => {
  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return;
  }

  try {
    setGeneratingReport(true);
    
    // Filter events between dates
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
    });

    if (filteredEvents.length === 0) {
      alert('No events found in the selected date range');
      setGeneratingReport(false);
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    let yPosition = 20;

    // Add header
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('Event Report', 105, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Period: ${formatDate(startDate)} to ${formatDate(endDate)}`, 105, yPosition, { align: 'center' });
    pdf.text(`Total Events: ${filteredEvents.length}`, 105, yPosition + 6, { align: 'center' });
    
    yPosition += 20;

    // Process each event
    for (let i = 0; i < filteredEvents.length; i++) {
      const event = filteredEvents[i];
      
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Event details
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${i + 1}. ${event.eventTitle}`, 20, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      
      const details = [
        ['Event ID:', event.eventId || 'N/A'],
        ['Type:', event.type],
        ['Organizer:', event.organizer],
        ['Date:', formatDate(event.date)],
        ['Duration:', event.duration],
        ['NAAC Category:', event.naacCategory],
        ['Status:', event.verificationStatus],
        ['Report:', event.eventReport]
      ];

      details.forEach(([label, value]) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setFont(undefined, 'bold');
        pdf.text(label, 20, yPosition);
        pdf.setFont(undefined, 'normal');
        const textLines = pdf.splitTextToSize(value, 150);
        pdf.text(textLines, 60, yPosition);
        yPosition += (textLines.length * 5) + 2;
      });

      // Add file information
      yPosition += 3;
      if (event.noticeFile && event.noticeFile.length > 0) {
        pdf.setFont(undefined, 'bold');
        pdf.text('Notice File:', 20, yPosition);
        pdf.setFont(undefined, 'normal');
        pdf.text(event.noticeFile[0].filename, 60, yPosition);
        yPosition += 6;
      }

      if (event.attendanceSheet && event.attendanceSheet.length > 0) {
        pdf.setFont(undefined, 'bold');
        pdf.text('Attendance:', 20, yPosition);
        pdf.setFont(undefined, 'normal');
        pdf.text(event.attendanceSheet[0].filename, 60, yPosition);
        yPosition += 6;
      }

      // Load and add images if available
      if (event.photos && event.photos.length > 0) {
        pdf.setFont(undefined, 'bold');
        pdf.text('Photos:', 20, yPosition);
        yPosition += 6;

        for (const photo of event.photos) {
          try {
            // Fetch image from server
            const imgResponse = await fetch(`http://localhost:3001${photo.url}`);
            const imgBlob = await imgResponse.blob();
            
            // Convert to base64
            const base64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(imgBlob);
            });

            if (yPosition > 200) {
              pdf.addPage();
              yPosition = 20;
            }

            // Add image to PDF
            pdf.addImage(base64, 'JPEG', 20, yPosition, 80, 60);
            yPosition += 65;
          } catch (imgError) {
            console.error('Error loading image:', imgError);
          }
        }
      }

      yPosition += 10; // Space between events
    }

    // Save the PDF
    pdf.save(`Event_Report_${startDate}_to_${endDate}.pdf`);
    
  } catch (error) {
    console.error('Error generating report:', error);
    alert('Error generating report. Please try again.');
  } finally {
    setGeneratingReport(false);
  }
};  */

const generateReport = async () => {
  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return;
  }

  try {
    setGeneratingReport(true);
    
    // Filter events between dates
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
    });

    if (filteredEvents.length === 0) {
      alert('No events found in the selected date range');
      setGeneratingReport(false);
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = margin;

    // Helper function to check and add new page
    const checkPageBreak = (requiredSpace = 20) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper function to load and convert image
    const loadImage = async (url) => {
      try {
        const imgResponse = await fetch(`http://localhost:3001${url}`);
        const imgBlob = await imgResponse.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imgBlob);
        });
      } catch (error) {
        console.error('Error loading image:', error);
        return null;
      }
    };

    // Add Cover Page
    pdf.setFillColor(41, 128, 185);
    pdf.rect(0, 0, pageWidth, 80, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont(undefined, 'bold');
    pdf.text('EVENT REPORT', pageWidth / 2, 40, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'normal');
    pdf.text(`${formatDate(startDate)} - ${formatDate(endDate)}`, pageWidth / 2, 55, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    yPosition = 100;

    // Summary Box
    pdf.setFillColor(240, 248, 255);
    pdf.roundedRect(margin, yPosition, contentWidth, 40, 3, 3, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('Report Summary', margin + 5, yPosition + 10);
    
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Total Events: ${filteredEvents.length}`, margin + 5, yPosition + 20);
    pdf.text(`Period: ${formatDate(startDate)} to ${formatDate(endDate)}`, margin + 5, yPosition + 28);
    pdf.text(`Generated on: ${formatDate(new Date())}`, margin + 5, yPosition + 36);
    
    yPosition += 50;

    // Process each event
    for (let i = 0; i < filteredEvents.length; i++) {
      const event = filteredEvents[i];
      
      // Start new page for each event
      pdf.addPage();
      yPosition = margin;

      // Event Header with colored background
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, yPosition, pageWidth, 15, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text(`Event ${i + 1}: ${event.eventTitle}`, pageWidth / 2, yPosition + 10, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      yPosition += 25;

      // Event Details Section
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, yPosition, contentWidth, 70, 2, 2, 'F');
      
      yPosition += 8;
      
      const details = [
        ['Event ID:', event.eventId || 'N/A'],
        ['Type:', event.type],
        ['Organizer:', event.organizer],
        ['Date:', formatDate(event.date)],
        ['Duration:', event.duration],
        ['NAAC Category:', event.naacCategory],
        ['Status:', event.verificationStatus]
      ];

      pdf.setFontSize(10);
      details.forEach(([label, value]) => {
        pdf.setFont(undefined, 'bold');
        pdf.text(label, margin + 5, yPosition);
        pdf.setFont(undefined, 'normal');
        pdf.text(String(value), margin + 45, yPosition);
        yPosition += 7;
      });

      yPosition += 10;

      // Event Report Section
      if (event.eventReport) {
        checkPageBreak(30);
        
        pdf.setFillColor(255, 248, 220);
        pdf.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, 'F');
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Event Report:', margin + 5, yPosition + 6);
        yPosition += 12;
        
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'normal');
        const reportLines = pdf.splitTextToSize(event.eventReport, contentWidth - 10);
        
        reportLines.forEach(line => {
          checkPageBreak(7);
          pdf.text(line, margin + 5, yPosition);
          yPosition += 5;
        });
        
        yPosition += 8;
      }

      // Notice File Section
      if (event.noticeFile && event.noticeFile.length > 0) {
        checkPageBreak(50);
        
        pdf.setFillColor(220, 237, 200);
        pdf.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, 'F');
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Notice File:', margin + 5, yPosition + 6);
        yPosition += 12;

        const noticeFile = event.noticeFile[0];
        const isImage = noticeFile.fileType && noticeFile.fileType.startsWith('image/');
        
        if (isImage) {
          const base64 = await loadImage(noticeFile.url);
          if (base64) {
            checkPageBreak(100);
            pdf.addImage(base64, 'JPEG', margin, yPosition, contentWidth, 80, undefined, 'FAST');
            yPosition += 85;
          }
        } else {
          pdf.setFontSize(9);
          pdf.setFont(undefined, 'normal');
          pdf.text(`File: ${noticeFile.filename}`, margin + 5, yPosition);
          yPosition += 10;
        }
      }

      // Attendance Sheet Section
      if (event.attendanceSheet && event.attendanceSheet.length > 0) {
        checkPageBreak(50);
        
        pdf.setFillColor(255, 229, 204);
        pdf.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, 'F');
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Attendance Sheet:', margin + 5, yPosition + 6);
        yPosition += 12;

        const attendanceFile = event.attendanceSheet[0];
        const isImage = attendanceFile.fileType && attendanceFile.fileType.startsWith('image/');
        
        if (isImage) {
          const base64 = await loadImage(attendanceFile.url);
          if (base64) {
            checkPageBreak(100);
            pdf.addImage(base64, 'JPEG', margin, yPosition, contentWidth, 80, undefined, 'FAST');
            yPosition += 85;
          }
        } else {
          pdf.setFontSize(9);
          pdf.setFont(undefined, 'normal');
          pdf.text(`File: ${attendanceFile.filename}`, margin + 5, yPosition);
          yPosition += 10;
        }
      }

      // Event Photos Section
      if (event.photos && event.photos.length > 0) {
        checkPageBreak(20);
        
        pdf.setFillColor(230, 230, 250);
        pdf.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, 'F');
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text(`Event Photos (${event.photos.length}):`, margin + 5, yPosition + 6);
        yPosition += 15;

        for (let j = 0; j < event.photos.length; j++) {
          const photo = event.photos[j];
          const base64 = await loadImage(photo.url);
          
          if (base64) {
            checkPageBreak(90);
            
            // Add photo with caption
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'italic');
            pdf.text(`Photo ${j + 1}:`, margin, yPosition);
            yPosition += 5;
            
            pdf.addImage(base64, 'JPEG', margin, yPosition, contentWidth, 70, undefined, 'FAST');
            yPosition += 75;
          }
        }
      }

      // Add separator line between events
      if (i < filteredEvents.length - 1) {
        pdf.addPage();
      }
    }

    // Add Footer on last page
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    pdf.save(`Event_Report_${startDate}_to_${endDate}.pdf`);
    
  } catch (error) {
    console.error('Error generating report:', error);
    alert('Error generating report. Please try again.');
  } finally {
    setGeneratingReport(false);
  }
};









  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

{/* Report Generation Section */}
<div className="xl:col-span-3">
  <Card 
    title="Generate Event Report"
    subtitle="Select date range to generate comprehensive event report with all documents and images"
  >
    <div className="p-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <Button
          variant="primary"
          icon={<FaFileDownload />}
          onClick={generateReport}
          disabled={!startDate || !endDate || generatingReport}
          className="shadow-md shadow-green-200"
        >
          {generatingReport ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>
      
      {startDate && endDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Report will include {events.filter(e => {
              const d = new Date(e.date);
              return d >= new Date(startDate) && d <= new Date(endDate);
            }).length} events between {formatDate(startDate)} and {formatDate(endDate)}
          </p>
        </div>
      )}
    </div>
  </Card>
</div>










    {/* Calendar Section - Takes 2 columns on XL screens */}
    <div className="xl:col-span-2">
      <Card 
        title="Event Calendar"
        subtitle="Click on a date to add new event"
        action={
          <Button 
            variant="primary" 
            icon={<FaPlus />}
            onClick={() => setShowEventModal(true)}
            className="shadow-md shadow-blue-200"
          >
            Add Event
          </Button>
        }
      >
        <div className="p-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <p>Loading events...</p>
            </div>
          ) : (
            <EventCalendar 
              events={events} 
              onDateSelect={handleDateSelect}
            />
          )}
        </div>
      </Card>
    </div>

    {/* Upcoming Events - 1 column on XL screens */}
    <div className="xl:col-span-1">
      <Card 
        title="Upcoming Events" 
        subtitle={`${upcomingEvents.length} events scheduled`}
      >
        <div className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div 
                key={event._id || event.eventId}
                className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-gray-50 hover:bg-blue-50"
              >
                <h4 className="font-semibold text-gray-900 mb-3">{event.eventTitle}</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="font-medium min-w-[80px]">Type:</span> 
                    <span className="px-2 py-0.5 bg-white rounded text-xs">{event.type}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="font-medium min-w-[80px]">Date:</span> 
                    <span>{formatDate(event.date)}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="font-medium min-w-[80px]">Organizer:</span> 
                    <span>{event.organizer}</span>
                  </p>
                </div>
                <div className="mt-3">
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {event.naacCategory.split('-')[0].trim()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No upcoming events</p>
            </div>
          )}
        </div>
      </Card>
    </div>

    {/* Event Modal */}
    <EventModal
      isOpen={showEventModal}
      onClose={() => setShowEventModal(false)}
      onSubmit={handleEventSubmit}
      selectedDate={selectedDate}
    />
  </div>
);
};

export default EventManagement;
