import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

function CustomCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
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

            let status = '';
            if (end < now) status = 'completed';
            else if (start <= now && end >= now) status = 'yettodo';
            else status = 'upcoming';

            const enrolled = event.enrolled === true;

            return {
              title: event.eventName,
              start,
              end,
              allDay: true,
              status,
              enrolled,
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

  useEffect(() => {
    if (selectedDate) {
      const filtered = events.filter(event =>
        moment(event.start).isSame(selectedDate, 'day')
      );
      setDayEvents(filtered);
    }
  }, [selectedDate, events]);

  const getStatusColor = (event) => {
    if (event.enrolled) return 'bg-green-500';
    switch (event.status) {
      case 'completed': return 'bg-yellow-400';
      case 'yettodo': return 'bg-red-500';
      case 'upcoming': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-white">
      {/* Calendar Section */}
      <div className="w-full lg:w-2/3 p-4">
        <h2 className="text-2xl font-semibold mb-4">Event Calendar</h2>
        <div className="h-[70vh]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={['month']}
            selectable
            onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
            onSelectEvent={(event) => {
              setSelectedDate(event.start);
              setSelectedEvent(event);
            }}
            eventPropGetter={(event) => {
              let bg = '';
              if (event.status === 'completed') bg = '#FBBF24';
              else if (event.status === 'yettodo') bg = '#EF4444';
              else if (event.status === 'upcoming') bg = '#3B82F6';
              if (event.enrolled) bg = '#34D399';

              return {
                style: {
                  backgroundColor: bg,
                  color: 'white',
                  borderRadius: '6px',
                  paddingLeft: '4px',
                },
              };
            }}
          />
        </div>
      </div>

      {/* Event List Sidebar */}
      <div className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l px-6 py-4 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {selectedDate
            ? `Events on ${moment(selectedDate).format('MMMM D, YYYY')}`
            : 'Click a date to view events'}
        </h3>

        {dayEvents.length === 0 ? (
          <p className="text-gray-500">No events on this date.</p>
        ) : (
          <ul className="space-y-4">
            {dayEvents.map((event) => (
              <li
                key={event._id}
                onClick={() => setSelectedEvent(event)}
                className="p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">{event.eventName}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(event)}`}>
                    {event.enrolled ? 'enrolled' : event.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {moment(event.start).format('hh:mm A')} - {moment(event.end).format('hh:mm A')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-2">{selectedEvent.eventName}</h2>
            <p className="mb-1">
              <strong>Start:</strong> {moment(selectedEvent.start).format('MMMM D, YYYY hh:mm A')}
            </p>
            <p className="mb-1">
              <strong>End:</strong> {moment(selectedEvent.end).format('MMMM D, YYYY hh:mm A')}
            </p>
            <p className="mb-1">
              <strong>Description:</strong> {selectedEvent.description || 'No description'}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => navigate(`../viewevent/${selectedEvent._id}`)}
              >
                View Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomCalendar;
