import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function StudentCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/event/app/v1/events/', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (res.status === 200) {
          const formatted = res.data.payload.map((event) => ({
            title: event.eventName,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            allDay: true,
            ...event,
          }));
          setEvents(formatted);
        }
      } catch (err) {
        alert('Failed to fetch student events');
      }
    };

    fetchStudentEvents();
  }, []);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.isRegistered ? '#38a169' : '#e53e3e'; // green or red
    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '5px',
        border: 'none',
      },
    };
  };

  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh' }}
        views={['month', 'week', 'day', 'agenda']}
        onSelectEvent={(event) => setSelectedEvent(event)}
        eventPropGetter={eventStyleGetter}
      />

      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white p-6 rounded-lg w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-2">{selectedEvent.eventName}</h2>
            <p className="mb-1"><strong>Start:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
            <p className="mb-1"><strong>End:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
            <p className="mb-1"><strong>Description:</strong> {selectedEvent.description || 'No description'}</p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => navigate(`/event/${selectedEvent._id}`)}
              >
                Know More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentCalendar;
