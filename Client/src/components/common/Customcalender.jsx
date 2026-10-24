import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../UserAtom';
import CalendarView from '../ui/CalendarView';

const statusMeta = {
  upcoming: { label: 'Upcoming', tone: 'solid' },
  completed: { label: 'Completed', tone: 'muted' },
};

function OrganizerCalendar() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const res = await axios.get('http://localhost:4000/event/app/v1/events', {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
        });

        if (res.status === 200) {
          const now = new Date();
          const formatted = res.data.payload.map((event) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const status = end < now ? 'completed' : 'upcoming';
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
        console.error("Calendar error:", err);
        alert('Failed to fetch events for calendar');
      }
    };

    fetchEvents();
  }, []);

  const handleViewEvent = (selectedEvent) => {
    if (selectedEvent && user?.email) {
      if (user.role === 'student') {
        navigate(`/student-profile/${user.email}/viewevent/${selectedEvent._id}`);
      } else if (user.role === 'organizer') {
        navigate(`/organizer-profile/${user.email}/viewevent/${selectedEvent._id}`);
      } else {
        alert("User not logged in or role not recognized.");
      }
    } else {
      alert("No event selected or user not logged in.");
    }
  };

  return (
    <CalendarView
      title="Events Calendar"
      subtitle="Every event on campus at a glance"
      events={events}
      statusMeta={statusMeta}
      onViewEvent={handleViewEvent}
    />
  );
}

export default OrganizerCalendar;
