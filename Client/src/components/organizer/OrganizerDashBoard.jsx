import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { IconCalendarEvent, IconCircleCheck, IconFlame, IconHourglass } from '@tabler/icons-react';
import { Page, Spinner, listVariants } from '../ui/Page';
import { Avatar, InfoRow, StatTile } from '../ui/Stat';
import EventCard from '../ui/EventCard';

function OrganizerDashBoard() {
  const [details, setDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const [detailsRes, eventsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/organiser/getdetails`, {
            headers: { 
              'Authorization': token,
              'Content-Type': 'application/json'
            }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/event/app/v1/organiser/events`, {
            headers: { 
              'Authorization': token,
              'Content-Type': 'application/json'
            }
          }),
        ]);

        if (detailsRes.status === 200) setDetails(detailsRes.data.payload);
        if (eventsRes.status === 200) setEvents(eventsRes.data.payload);
      } catch (err) {
        console.error("Dashboard error:", err);
        alert('Error fetching dashboard data');
      }
    }

    fetchData();
  }, []);

  const now = new Date();
  const ongoingEvents = events.filter(event => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return start <= now && end >= now;
  });
  const upcomingCount = events.filter(event => new Date(event.startDate) > now).length;
  const completedCount = events.filter(event => new Date(event.endDate) < now).length;

  const gotoEvent = (id) => {
    navigate(`../viewevent/${id}`);
  };

  if (!details) {
    return <Spinner label="Loading organizer details…" />;
  }

  return (
    <Page className="max-w-6xl">
      {/* Profile header */}
      <div className="glass-strong mb-5 flex flex-col gap-5 rounded-[28px] p-6 sm:flex-row sm:items-center sm:p-8">
        <Avatar name={details.clubName?.[0] || details.username} />
        <div className="min-w-0">
          <h1 className="text-gradient truncate text-2xl font-bold tracking-tight sm:text-3xl">
            {details.clubName?.join(', ') || details.username}
          </h1>
          <p className="truncate text-sm text-neutral-400">
            <span className="capitalize">{details.username}</span> · <span className="capitalize">{details.position}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="chip capitalize">{details.role}</span>
            {details.verified && <span className="chip"><IconCircleCheck size={12} /> Verified</span>}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div variants={listVariants} initial="hidden" animate="show" className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Total Events" value={events.length} icon={IconCalendarEvent} />
        <StatTile label="Ongoing" value={ongoingEvents.length} icon={IconFlame} />
        <StatTile label="Upcoming" value={upcomingCount} icon={IconHourglass} />
        <StatTile label="Completed" value={completedCount} icon={IconCircleCheck} />
      </motion.div>

      <div className="glass mb-8 rounded-[28px] p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold text-white">Profile Overview</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoRow label="Username" value={details.username} />
          <InfoRow label="Email" value={details.email} />
          <InfoRow label="Phone Number" value={details.phoneNumber} />
          <InfoRow label="Club Name" value={details.clubName?.join(', ')} />
          <InfoRow label="College Name" value={details.collegeName} />
          <InfoRow label="Department" value={details.department} />
          <InfoRow label="Position" value={details.position} />
          <InfoRow label="Role" value={details.role} />
        </div>
      </div>

      {/* Ongoing Events Section */}
      {ongoingEvents.length > 0 && (
        <>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Ongoing Events
          </h2>
          <motion.div variants={listVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ongoingEvents.map((event) => (
              <EventCard key={event._id} event={event} onOpen={() => gotoEvent(event._id)} ctaLabel="Get details" showStatus={false} />
            ))}
          </motion.div>
        </>
      )}
    </Page>
  );
}

export default OrganizerDashBoard;
