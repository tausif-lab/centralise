import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/calendar.css';
import { FaPlus } from 'react-icons/fa';

const EventCalendar = ({ events, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const getDateEvents = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateEvents = getDateEvents(date);
      const isHovered = hoveredDate && hoveredDate.toDateString() === date.toDateString();

      if (dateEvents.length > 0 || isHovered) {
        return (
          <div className="flex flex-col items-center mt-1 gap-1 w-full">
            {dateEvents.length > 0 && (
              <div className="flex gap-1">
                {dateEvents.length <= 3 ? (
                  dateEvents.map((_, idx) => (
                    <div key={idx} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  ))
                ) : (
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    {dateEvents.length}
                  </div>
                )}
              </div>
            )}
            {isHovered && dateEvents.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDateClick(date);
                }}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition flex items-center gap-1"
              >
                <FaPlus size={10} /> Add
              </button>
            )}
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateEvents = getDateEvents(date);
      if (dateEvents.length > 0) {
        return 'has-events';
      }
    }
    return '';
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        onClickDay={handleDateClick}
        className="custom-calendar"
        onMouseEnter={({ date }) => setHoveredDate(date)}
        onMouseLeave={() => setHoveredDate(null)}
      />
    </div>
  );
};

export default EventCalendar;
