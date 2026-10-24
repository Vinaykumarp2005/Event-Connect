import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../UserAtom';
import CalendarView from '../ui/CalendarView';

const statusMeta = {
  enrolled: { label: 'Enrolled', tone: 'solid' },
  completed: { label: 'Completed', tone: 'muted' },
};

function StudentCalendar() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
 const user = useRecoilValue(userAtom);
  useEffect(() => {
    const fetchEnrolledEvents = async () => {
      try {
        const res = await axios.get('http://localhost:4000/student/enrolledEvents', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (res.status === 200) {
          const now = new Date();
          const formatted = res.data.payload.map((event) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const status = end < now ? 'completed' : 'enrolled';

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
        alert('Failed to fetch events');
      }
    };

    fetchEnrolledEvents();
  }, []);

  const handleViewEvent = (selectedEvent) => {
    if (user?.email) {
      navigate(`/student-profile/${user.email}/viewevent/${selectedEvent._id}`);
    } else {
      alert("User not logged in.");
    }
  };

  return (
    <CalendarView
      title="My Calendar"
      subtitle="Your enrolled events"
      events={events}
      statusMeta={statusMeta}
      onViewEvent={handleViewEvent}
    />
  );
}

export default StudentCalendar;
