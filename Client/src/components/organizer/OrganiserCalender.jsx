import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../common/customcalender.css';

const localizer = momentLocalizer(moment);

function OrganizerCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/event/app/v1/organiser/events', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (res.status === 200) {
          const now = new Date();
          const formatted = res.data.payload.map((event) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const status =
              end < now ? 'completed' : start <= now && end >= now ? 'yettodo' : 'upcoming';

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

  useEffect(() => {
    if (selectedDate) {
      const filtered = events.filter((event) =>
        moment(event.start).isSame(selectedDate, 'day')
      );
      setDayEvents(filtered);
    }
  }, [selectedDate, events]);

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-emerald-500';
    if (status === 'yettodo') return 'bg-rose-500';
    if (status === 'upcoming') return 'bg-blue-600';
    return 'bg-slate-400';
  };

  const eventStyleGetter = (event) => {
    const bg =
      event.status === 'completed'
        ? '#10b981' // emerald-500
        : event.status === 'yettodo'
        ? '#f43f5e' // rose-500
        : '#2563eb'; // blue-600

    return {
      style: {
        backgroundColor: bg,
        color: 'white',
        borderRadius: '8px',
        paddingLeft: '8px',
        fontWeight: '600',
      },
    };
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-black text-white">
      {/* Calendar */}
      <div className="w-full lg:w-[75%] p-4 lg:p-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white">
          Organizer Created Events
        </h2>
        <div className="h-[70vh] lg:h-[80vh] w-full">
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
            eventPropGetter={eventStyleGetter}
            style={{ height: '100%', width: '100%' }}
            className="dark-calendar"
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[25%] px-4 py-4 lg:py-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-700 bg-slate-900">
        <h3 className="text-lg lg:text-xl font-semibold mb-6 text-white">
          {selectedDate
            ? `Events on ${moment(selectedDate).format('MMMM D, YYYY')}`
            : 'Click a date to view events'}
        </h3>

        {dayEvents.length === 0 ? (
          <p className="text-slate-400">No events on this date.</p>
        ) : (
          <ul className="space-y-4 w-full">
            {dayEvents.map((event) => (
              <li
                key={event._id}
                onClick={() => setSelectedEvent(event)}
                className="p-4 bg-slate-800 rounded-xl shadow-lg cursor-pointer hover:bg-slate-700 transition-all duration-200 w-full border border-slate-600 hover:border-slate-500"
              >
                <div className="flex justify-between items-center mb-2 gap-3 flex-wrap">
                  <h4 className="text-sm font-medium text-white break-words flex-1">
                    {event.eventName}
                  </h4>
                  <span
                    className={`text-xs px-3 py-1 rounded-full text-white whitespace-nowrap flex-shrink-0 ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {moment(event.start).format('hh:mm A')}
                  {!moment(event.start).isSame(event.end) &&
                    ` - ${moment(event.end).format('hh:mm A')}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-slate-900 p-6 rounded-xl w-full max-w-md shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-white">{selectedEvent.eventName}</h2>
            <div className="space-y-3 mb-6">
              <p className="text-sm text-slate-300">
                <strong className="text-white">Start:</strong> {moment(selectedEvent.start).format('MMMM D, YYYY hh:mm A')}
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-white">End:</strong> {moment(selectedEvent.end).format('MMMM D, YYYY hh:mm A')}
              </p>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Description:</strong> {selectedEvent.description || 'No description'}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors duration-200 border border-slate-600"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 border border-blue-500"
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

export default OrganizerCalendar;
