import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MdDownloadDone } from "react-icons/md";

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

        const res = await axios.get('http://localhost:3000/event/app/v1/organiser/events', {
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
      const res = await axios.get(`http://localhost:3000/event/students/enroll/${eventId}`, {
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
    <div className="p-6 bg-black text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Event Participants</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:w-2/3">
            <select
              value={selectedEvent}
              onChange={handleEventChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="md:w-1/3">
              <select
                onChange={(e) => e.target.value && (e.target.value === 'excel' ? exportToExcel() : exportToPDF())}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option disabled value="">Download Option</option>
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : selectedEvent ? (
        participants.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full bg-black">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Branch</th>
                  <th className="px-4 py-3 text-left">College</th>
                  <th className="px-4 py-3 text-left">Year</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {participants.map((student, idx) => (
                  <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-900' : 'bg-black'} hover:bg-gray-800`}>
                    <td className="px-4 py-3">{student.username}</td>
                    <td className="px-4 py-3">{student.department}</td>
                    <td className="px-4 py-3">{student.collegeName}</td>
                    <td className="px-4 py-3">{student.year}</td>
                    <td className="px-4 py-3">{student.phoneNumber}</td>
                    <td className="px-4 py-3">{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-900 rounded-lg">
            <p className="text-xl text-gray-400">No participants have enrolled for this event yet.</p>
          </div>
        )
      ) : (
        <div className="text-center py-10 bg-gray-900 rounded-lg">
          <p className="text-xl text-gray-400">Please select an event to view participants.</p>
        </div>
      )}
    </div>
  );
}

export default EventParticipants;
