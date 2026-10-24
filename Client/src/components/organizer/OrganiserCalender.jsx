import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CalendarView from '../ui/CalendarView';

const statusMeta = {
  upcoming: { label: 'Upcoming', tone: 'solid' },
  yettodo: { label: 'In Progress', tone: 'outline' },
  completed: { label: 'Completed', tone: 'muted' },
};

function OrganizerCalendar() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:4000/event/app/v1/organiser/events', {
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

  return (
    <CalendarView
      title="My Event Calendar"
      subtitle="Events your club is running"
      events={events}
      statusMeta={statusMeta}
      onViewEvent={(selectedEvent) => navigate(`../viewevent/${selectedEvent._id}`)}
    />
  );
}

export default OrganizerCalendar;
