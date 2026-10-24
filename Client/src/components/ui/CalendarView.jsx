import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { AnimatePresence, motion } from 'motion/react';
import { IconArrowUpRight, IconCalendarEvent, IconChevronLeft, IconChevronRight, IconMapPin, IconX } from '@tabler/icons-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Page, PageHeader } from './Page';

const localizer = momentLocalizer(moment);

// Monochrome tones for event statuses
const TONES = {
  // Event colours use the theme variables so they flip with dark/light mode
  solid: { pill: 'bg-white text-black', event: { backgroundColor: 'rgb(var(--c-white))', color: 'rgb(var(--c-black))', border: '1px solid rgb(var(--c-white))' } },
  outline: { pill: 'border border-white text-white', event: { backgroundColor: 'rgb(var(--c-white) / 0.08)', color: 'rgb(var(--c-white))', border: '1px solid rgb(var(--c-white) / 0.9)' } },
  muted: { pill: 'bg-neutral-700 text-neutral-300', event: { backgroundColor: 'rgb(var(--c-n700))', color: 'rgb(var(--c-n300))', border: '1px solid rgb(var(--c-n600))' } },
};

const navBtn =
  'flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white';

// Replaces react-big-calendar's default toolbar (which ships its own fixed colours)
function Toolbar({ label, onNavigate }) {
  return (
    <div className='mb-4 flex items-center justify-between gap-3'>
      <AnimatePresence mode='wait' initial={false}>
        <motion.h2
          key={label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className='text-lg font-semibold tracking-tight text-white sm:text-xl'
        >
          {label}
        </motion.h2>
      </AnimatePresence>
      <div className='flex items-center gap-1.5'>
        <button type='button' onClick={() => onNavigate('TODAY')} className='btn-ghost px-4 py-1.5 text-xs'>
          Today
        </button>
        <button type='button' onClick={() => onNavigate('PREV')} aria-label='Previous month' className={navBtn}>
          <IconChevronLeft size={18} stroke={1.8} />
        </button>
        <button type='button' onClick={() => onNavigate('NEXT')} aria-label='Next month' className={navBtn}>
          <IconChevronRight size={18} stroke={1.8} />
        </button>
      </div>
    </div>
  );
}

/**
 * Shared calendar page: month grid, list for the selected day and a details modal.
 * `statusMeta` maps each event.status to { label, tone }.
 */
function CalendarView({ title, subtitle, events, statusMeta, onViewEvent }) {
  // Open on today so the side panel is useful straight away
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Events running on the selected day (multi-day events included)
  const dayEvents = useMemo(
    () => events.filter((event) => moment(selectedDate).isBetween(event.start, event.end, 'day', '[]')),
    [selectedDate, events]
  );

  const meta = (status) => statusMeta[status] || { label: status, tone: 'muted' };

  const eventStyleGetter = (event) => ({
    style: {
      ...TONES[meta(event.status).tone].event,
      borderRadius: '8px',
      padding: '1px 6px',
    },
  });

  const dayPropGetter = (date) =>
    moment(date).isSame(selectedDate, 'day') ? { className: 'ec-selected-day' } : {};

  return (
    <Page>
      <PageHeader title={title} subtitle={subtitle} />

      <div className='flex flex-col gap-5 lg:flex-row'>
        {/* Calendar */}
        <div className='w-full min-w-0 lg:w-2/3'>
          <div className='ec-calendar glass rounded-3xl p-3 sm:p-5'>
            <div className='overflow-x-auto'>
              <div className='min-w-[320px]'>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor='start'
                  endAccessor='end'
                  views={['month']}
                  selectable
                  popup
                  components={{ toolbar: Toolbar }}
                  onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
                  onSelectEvent={(event) => {
                    setSelectedDate(event.start);
                    setSelectedEvent(event);
                  }}
                  eventPropGetter={eventStyleGetter}
                  dayPropGetter={dayPropGetter}
                  style={{ height: 'max(460px, 62vh)' }}
                />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className='mt-4 flex flex-wrap items-center gap-4 px-1 text-xs text-neutral-400'>
            {Object.entries(statusMeta).map(([key, { label, tone }]) => (
              <span key={key} className='flex items-center gap-2'>
                <span className={`h-3 w-3 rounded-full ${TONES[tone].pill}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Day panel */}
        <div className='w-full lg:w-1/3'>
          <div className='glass h-full rounded-3xl p-5 sm:p-6'>
            <div className='mb-5 flex items-start justify-between gap-3'>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-wider text-neutral-500'>
                  {moment(selectedDate).format('dddd')}
                </p>
                <h3 className='text-lg font-semibold text-white'>{moment(selectedDate).format('MMMM D, YYYY')}</h3>
              </div>
              <span className='chip shrink-0'>
                {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
              </span>
            </div>

            {dayEvents.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-10 text-center text-neutral-500'>
                <IconCalendarEvent size={40} stroke={1.2} className='mb-3' />
                <p className='text-sm'>No events on this date</p>
                <p className='mt-1 text-xs text-neutral-600'>Pick another day in the calendar</p>
              </div>
            ) : (
              <ul className='no-scrollbar max-h-[55vh] space-y-3 overflow-y-auto'>
                <AnimatePresence initial={false}>
                  {dayEvents.map((event, i) => (
                    <motion.li
                      key={event._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedEvent(event)}
                      className='cursor-pointer rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-white/25 hover:bg-white/[0.07]'
                    >
                      <div className='flex items-start justify-between gap-2'>
                        <h4 className='font-medium text-white'>{event.eventName}</h4>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${TONES[meta(event.status).tone].pill}`}>
                          {meta(event.status).label}
                        </span>
                      </div>
                      <p className='mt-1 text-xs text-neutral-400'>
                        {moment(event.start).format('MMM D')} – {moment(event.end).format('MMM D')}
                      </p>
                      {event.venue && (
                        <p className='mt-1 flex items-center gap-1 truncate text-xs text-neutral-500'>
                          <IconMapPin size={12} /> {event.venue}
                        </p>
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal (portaled so glass/backdrop-filter ancestors can't trap position:fixed) */}
      {createPortal(
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md'
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className='glass-strong w-full max-w-md rounded-[28px] p-6 text-white'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='mb-4 flex items-start justify-between gap-3'>
                <div>
                  <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TONES[meta(selectedEvent.status).tone].pill}`}>
                    {meta(selectedEvent.status).label}
                  </span>
                  <h2 className='text-xl font-bold'>{selectedEvent.eventName}</h2>
                </div>
                <button onClick={() => setSelectedEvent(null)} aria-label='Close' className='rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white'>
                  <IconX size={18} />
                </button>
              </div>

              <div className='space-y-3 text-sm text-neutral-300'>
                <p className='flex items-start gap-2'>
                  <IconCalendarEvent size={16} className='mt-0.5 shrink-0 text-neutral-500' />
                  {moment(selectedEvent.start).format('MMMM D, YYYY')} – {moment(selectedEvent.end).format('MMMM D, YYYY')}
                </p>
                {selectedEvent.venue && (
                  <p className='flex items-start gap-2'>
                    <IconMapPin size={16} className='mt-0.5 shrink-0 text-neutral-500' />
                    {selectedEvent.venue}
                  </p>
                )}
                <p className='line-clamp-4 text-neutral-400'>{selectedEvent.description || 'No description'}</p>
              </div>

              <div className='mt-6 flex justify-end gap-2'>
                <button className='btn-ghost' onClick={() => setSelectedEvent(null)}>
                  Close
                </button>
                <button className='btn-primary' onClick={() => onViewEvent(selectedEvent)}>
                  View Event <IconArrowUpRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </Page>
  );
}

export default CalendarView;
