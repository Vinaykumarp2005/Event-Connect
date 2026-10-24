import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../UserAtom';
import { Page, PageHeader, EmptyState, Spinner, listVariants } from '../ui/Page';
import EventCard from '../ui/EventCard';
import { motion } from 'motion/react';

function CreatedEvents() {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await axios.get('http://localhost:4000/event/app/v1/organiser/events', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (res.status === 200) {
          setCreatedEvents(res.data.payload);
        }
      } catch (e) {
        console.error("Unable to fetch the details", e);
        alert("Unable to fetch the details");
      } finally {
        setLoading(false);
      }
    }

    getDetails();
  }, []);

  function viewdetails(eventId) {
    // Fix the navigation by using absolute path with the user's email
    if (user?.email) {
      navigate(`/organizer-profile/${user.email}/viewevent/${eventId}`);
    } else {
      console.error("User email not available for navigation");
      // Fallback to relative path if user email isn't available
      navigate(`../viewevent/${eventId}`);
    }
  }

  return (
    <Page>
      <PageHeader title="Created Events" subtitle="Events you've published" />
      {loading ? (
        <Spinner label="Loading your events…" />
      ) : createdEvents.length === 0 ? (
        <EmptyState title="No created events found." text="Post your first event to see it here." />
      ) : (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {createdEvents.map((event, idx) => (
            <EventCard key={event._id || idx} event={event} onOpen={() => viewdetails(event._id)} ctaLabel="View details" showDescription />
          ))}
        </motion.div>
      )}
    </Page>
  );
}

export default CreatedEvents;
