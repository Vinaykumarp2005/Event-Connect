import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function Customcalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/event/app/v1/events', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (res.status === 200) {
          // Convert API data to BigCalendar format
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
        alert('Events not fetched');
      }
    };

    fetchEvents();
  }, []);

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
      />

      {/* Modal Section */}
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
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customcalendar;
