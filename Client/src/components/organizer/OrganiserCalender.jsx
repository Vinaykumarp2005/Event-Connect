import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
    if (status === 'completed') return 'bg-yellow-500';
    if (status === 'yettodo') return 'bg-red-500';
    if (status === 'upcoming') return 'bg-blue-600';
    return 'bg-gray-400';
  };

  const eventStyleGetter = (event) => {
    const bg =
      event.status === 'completed'
        ? '#facc15' // yellow
        : event.status === 'yettodo'
        ? '#ef4444' // red
        : '#3b82f6'; // blue

    return {
      style: {
        backgroundColor: bg,
        color: 'white',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.2)',
        fontSize: '0.85em',
        fontWeight: '500',
        padding: '2px 6px',
      },
    };
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-black">
      {/* Calendar */}
      <div className="w-full lg:w-2/3 p-4 lg:pr-2">
        <h2 className="text-2xl font-bold mb-6 text-white">Your Event Calendar</h2>
        <div className="w-full bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-lg">
          <div className="calendar-container">
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
              style={{ height: '70vh' }}
              className="text-white"
              dayPropGetter={(date) => ({
                style: {
                  backgroundColor:
                    moment(date).isSame(moment(), 'day') ? 'rgba(8,112,184,0.2)' : undefined,
                },
              })}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-300">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 mr-2 rounded-full bg-yellow-500"></span>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 mr-2 rounded-full bg-red-500"></span>
            <span>Ongoing</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 mr-2 rounded-full bg-blue-600"></span>
            <span>Upcoming</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/3 p-4 lg:pl-2">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-full shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-white">
            {selectedDate
              ? `Events on ${moment(selectedDate).format('MMMM D, YYYY')}`
              : 'Select a date to view events'}
          </h3>

          {dayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 mb-4 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
                </svg>
              </div>
              <p className="text-gray-400">No events on this date</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(70vh-4rem)] overflow-y-auto pr-1 no-scrollbar">
              {dayEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() => setSelectedEvent(event)}
                  className="p-4 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">{event.eventName}</h4>
                    <span
                      className={`ml-2 text-xs px-2 py-1 rounded-full text-white flex-shrink-0 ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status === 'completed'
                        ? 'Completed'
                        : event.status === 'yettodo'
                        ? 'In Progress'
                        : 'Upcoming'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    <span className="inline-block mr-2">📅</span>
                    {moment(event.start).format('hh:mm A')}
                    {!moment(event.start).isSame(event.end) &&
                      ` - ${moment(event.end).format('hh:mm A')}`}
                  </p>
                  {event.venue && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      <span className="inline-block mr-2">📍</span>
                      {event.venue}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-gray-900 border-2 border-[rgba(8,112,184,0.7)] p-6 rounded-xl w-full max-w-md shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-white">{selectedEvent.eventName}</h2>

            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">📅</span>
                <div>
                  <p className="font-medium text-white">Date & Time</p>
                  <p>Starts: {moment(selectedEvent.start).format('MMMM D, YYYY h:mm A')}</p>
                  <p>Ends: {moment(selectedEvent.end).format('MMMM D, YYYY h:mm A')}</p>
                </div>
              </div>

              {selectedEvent.venue && (
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">📍</span>
                  <div>
                    <p className="font-medium text-white">Venue</p>
                    <p>{selectedEvent.venue}</p>
                  </div>
                </div>
              )}

              {selectedEvent.description && (
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">📝</span>
                  <div>
                    <p className="font-medium text-white">Description</p>
                    <p>{selectedEvent.description}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <span className="text-blue-400 mr-2">🔄</span>
                <div>
                  <p className="font-medium text-white">Status</p>
                  <p
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      selectedEvent.status === 'completed'
                        ? 'bg-yellow-500'
                        : selectedEvent.status === 'yettodo'
                        ? 'bg-red-500'
                        : 'bg-blue-600'
                    } text-white`}
                  >
                    {selectedEvent.status === 'completed'
                      ? 'Completed'
                      : selectedEvent.status === 'yettodo'
                      ? 'In Progress'
                      : 'Upcoming'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                onClick={() => navigate(`../viewevent/${selectedEvent._id}`)}
              >
                <span>View Details</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizerCalendar;
