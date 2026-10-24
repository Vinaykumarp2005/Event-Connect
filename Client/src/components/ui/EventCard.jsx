import React from 'react';
import { motion } from 'motion/react';
import { IconArrowUpRight, IconCalendar, IconTag, IconUsers } from '@tabler/icons-react';
import { itemVariants } from './Page';

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const isRegistrationOpen = (registrationEndDate, enrolled, maxLimit) => {
  const today = new Date();
  const regEndDate = new Date(registrationEndDate);
  return regEndDate >= today && enrolled < maxLimit;
};

// Glass event card shared by every event list
function EventCard({ event, onOpen, ctaLabel = 'View event', showDescription = false, showStatus = true }) {
  const image = Array.isArray(event.eventImage) ? event.eventImage[0] : event.eventImage;
  const open = isRegistrationOpen(event.registrationEndDate, event.enrolled, event.maxLimit);
  const seatsLeft =
    typeof event.maxLimit === 'number' ? Math.max(event.maxLimit - (event.enrolled || 0), 0) : null;

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className='glass group flex h-full flex-col overflow-hidden rounded-3xl'
    >
      <div className='relative h-44 overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-950'>
        {image ? (
          <img
            src={image}
            alt={event.eventName}
            className='h-full w-full object-cover grayscale-[30%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-4xl font-bold text-white/10'>
            {event.eventName?.[0]}
          </div>
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0' />
        {event.category && (
          <span className='absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-black'>
            <IconTag size={12} stroke={2} />
            {event.category}
          </span>
        )}
        {showStatus && event.registrationEndDate && (
          <span className='absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md'>
            <span className={`h-1.5 w-1.5 rounded-full ${open ? 'animate-pulse bg-white' : 'bg-neutral-500'}`} />
            {open ? 'Open' : 'Closed'}
          </span>
        )}
      </div>

      <div className='flex flex-1 flex-col p-5'>
        <h2 className='mb-2 line-clamp-1 text-lg font-semibold text-white'>{event.eventName}</h2>
        {showDescription && (
          <p className='mb-4 line-clamp-2 text-sm text-neutral-400'>
            {event.description || 'No description available.'}
          </p>
        )}

        <div className='mb-5 space-y-1.5 text-xs text-neutral-400'>
          <p className='flex items-center gap-2'>
            <IconCalendar size={14} stroke={1.8} />
            {fmt(event.startDate)} — {fmt(event.endDate)}
          </p>
          {seatsLeft !== null && (
            <p className='flex items-center gap-2'>
              <IconUsers size={14} stroke={1.8} />
              {seatsLeft} seats left
            </p>
          )}
        </div>

        <button onClick={onOpen} className='btn-ghost mt-auto w-full group-hover:border-white group-hover:bg-white group-hover:text-black'>
          {ctaLabel}
          <IconArrowUpRight size={16} stroke={2} />
        </button>
      </div>
    </motion.article>
  );
}

export default EventCard;
