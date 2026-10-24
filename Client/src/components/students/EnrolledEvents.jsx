import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../UserAtom';
import { Page, PageHeader, EmptyState, Spinner, listVariants } from '../ui/Page';
import EventCard from '../ui/EventCard';
import { motion } from 'motion/react';

function EnrolledEvents() {
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    async function getEvents() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/student/enrolledEvents`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (res.status === 200) {
          setEnrolledEvents(res.data.payload);
        }
      } catch (e) {
        console.error("Unable to fetch events", e);
        alert("Unable to fetch events");
      } finally {
        setLoading(false);
      }
    }

    getEvents();
  }, []);

  function viewdetails(eventId) {
    if (user?.email) {
  navigate(`/student-profile/${user.email}/viewevent/${eventId}`);
} else {
  alert("User not logged in.");
}

  }

  return (
    <Page>
      <PageHeader title="Enrolled Events" subtitle="Events you've signed up for" />
      {loading ? (
        <Spinner label="Loading your events…" />
      ) : enrolledEvents.length === 0 ? (
        <EmptyState title="No enrolled events found." text="Browse events and enroll to see them here." />
      ) : (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {enrolledEvents.map((event, idx) => (
            <EventCard key={event._id || idx} event={event} onOpen={() => viewdetails(event._id)} ctaLabel="View details" showDescription showStatus={false} />
          ))}
        </motion.div>
      )}
    </Page>
  );
}

export default EnrolledEvents;
