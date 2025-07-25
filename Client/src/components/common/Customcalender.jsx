import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

function Customcalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/event/app/v1/events', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (res.status === 200) {
          const now = new Date();
          const formatted = res.data.payload.map((event) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);

            let status = 'upcoming'; // default

            if (event.enrolled) {
              status = 'enrolled';
            } else if (end < now) {
              status = 'completed';
            } else if (start > now) {
              status = 'upcoming';
            } else {
              status = 'yettodo';
            }

            return {
              title: event.eventName,
              start,
              end,
              allDay: true,
              status,
              ...event,
            };
          });
          setEvents(formatted);
        }
      } catch (err) {
        console.error(err);
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
        style={{ height: '65vh', width: '60vw' }}
        views={['month', 'week', 'day']}
        onSelectEvent={(event) => setSelectedEvent(event)}
        eventPropGetter={(event) => {
          let backgroundColor = '';
          switch (event.status) {
            case 'enrolled':
              backgroundColor = '#34D399'; // green
              break;
            case 'upcoming':
              backgroundColor = '#3B82F6'; // blue
              break;
            case 'completed':
              backgroundColor = '#FBBF24'; // yellow
              break;
            case 'yettodo':
              backgroundColor = '#EF4444'; // red
              break;
            default:
              backgroundColor = '#9CA3AF'; // gray fallback
          }

          return {
            style: {
              backgroundColor,
              color: 'white',
              borderRadius: '6px',
              paddingLeft: '4px',
            },
          };
        }}
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
      <p className="mb-1"><strong>Start Date:</strong> {new Date(selectedEvent.start).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
<p className="mb-1"><strong>End Date:</strong> {new Date(selectedEvent.end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p className="mb-1"><strong>Description:</strong> {selectedEvent.description || 'No description'}</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => navigate(`../${selectedEvent._id}`)}
              >
                View Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-400 rounded-sm"></span> Enrolled
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-500 rounded-sm"></span> Upcoming
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-400 rounded-sm"></span> Completed
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-500 rounded-sm"></span> Not Participated
        </span>
      </div>
    </div>
  );
}

export default Customcalendar;
