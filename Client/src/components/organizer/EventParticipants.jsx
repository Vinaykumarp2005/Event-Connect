import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IconFileSpreadsheet, IconFileTypePdf, IconUsers } from '@tabler/icons-react';
import { Page, PageHeader, EmptyState, Spinner } from '../ui/Page';

function EventParticipants() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOrganizerEvents() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:4000/event/app/v1/organiser/events', {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });

        if (res.status === 200) {
          setEvents(res.data.payload);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }

    fetchOrganizerEvents();
  }, []);

  async function fetchParticipants(eventId) {
    if (!eventId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/event/students/enroll/${eventId}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
      });

      if (res.status === 200) {
        setParticipants(res.data.payload);
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    fetchParticipants(eventId);
  };

  const exportToExcel = () => {
    const worksheetData = participants.map(({ username, department, collegeName, year, phoneNumber, email }) => ({
      Username: username,
      Branch: department,
      College: collegeName,
      Year: year,
      Phone: phoneNumber,
      Email: email,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Get event name for the filename
    const eventName = events.find(e => e._id === selectedEvent)?.eventName || 'event';
    XLSX.writeFile(workbook, `${eventName}_participants.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Username', 'Branch', 'College', 'Year', 'Phone', 'Email'];
    const tableRows = participants.map(({ username, department, collegeName, year, phoneNumber, email }) => [
      username,
      department,
      collegeName,
      year,
      phoneNumber,
      email,
    ]);

    // Get event name for the title
    const eventName = events.find(e => e._id === selectedEvent)?.eventName || 'Event';

    doc.text(`${eventName} - Participants List`, 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });
    doc.save(`${eventName}_participants.pdf`);
  };

  return (
    <Page>
      <PageHeader title="Event Participants" subtitle="See who enrolled and export the list" />

      <div className="glass mb-6 flex flex-col gap-4 rounded-3xl p-4 sm:p-5 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="field-label">Event</label>
          <select
            value={selectedEvent}
            onChange={handleEventChange}
            className="field"
          >
            <option value="">Select an event</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>
                {event.eventName}
              </option>
            ))}
          </select>
        </div>

        {participants.length > 0 && (
          <div className="flex gap-2">
            <button onClick={exportToExcel} className="btn-ghost flex-1 md:flex-none">
              <IconFileSpreadsheet size={16} stroke={1.8} /> Excel
            </button>
            <button onClick={exportToPDF} className="btn-primary flex-1 md:flex-none">
              <IconFileTypePdf size={16} stroke={1.8} /> PDF
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <Spinner label="Loading participants…" />
      ) : selectedEvent ? (
        participants.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass overflow-hidden rounded-3xl"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4 text-sm text-neutral-400">
              <IconUsers size={16} stroke={1.8} />
              <span><span className="font-semibold text-white">{participants.length}</span> participants</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-neutral-500">
                    <th className="px-5 py-3 font-medium">Username</th>
                    <th className="px-5 py-3 font-medium">Branch</th>
                    <th className="px-5 py-3 font-medium">College</th>
                    <th className="px-5 py-3 font-medium">Year</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {participants.map((student, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.6) }}
                      className="text-neutral-300 transition-colors hover:bg-white/[0.04]"
                    >
                      <td className="whitespace-nowrap px-5 py-3 font-medium capitalize text-white">{student.username}</td>
                      <td className="whitespace-nowrap px-5 py-3 uppercase">{student.department}</td>
                      <td className="whitespace-nowrap px-5 py-3 uppercase">{student.collegeName}</td>
                      <td className="whitespace-nowrap px-5 py-3">{student.year}</td>
                      <td className="whitespace-nowrap px-5 py-3 tabular-nums">{student.phoneNumber}</td>
                      <td className="whitespace-nowrap px-5 py-3">{student.email}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <EmptyState title="No participants yet" text="No participants have enrolled for this event yet." />
        )
      ) : (
        <EmptyState title="Pick an event" text="Please select an event to view participants." />
      )}
    </Page>
  );
}

export default EventParticipants;
