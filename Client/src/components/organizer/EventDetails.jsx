import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { MdDownloadDone } from "react-icons/md";
function EventDetails() {
  const [eventDetails, setEventDetails] = useState([]);
  const { eventById } = useParams();

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const res = await axios.get(`http://localhost:3000/event/students/enroll/${eventById}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        if (res.status === 200) {
          setEventDetails(res.data.payload);
        }
      } catch (e) {
        alert('Unable to fetch event details');
      }
    }
    fetchEventDetails();
  }, []);

  const exportToExcel = () => {
    const worksheetData = eventDetails.map(({ username, department, collegeName, year, phoneNumber, email }) => ({
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
    XLSX.writeFile(workbook, `event_${eventById}_students.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Username', 'Branch', 'College', 'Year', 'Phone', 'Email'];
    const tableRows = eventDetails.map(({ username, department, collegeName, year, phoneNumber, email }) => [
      username,
      department,
      collegeName,
      year,
      phoneNumber,
      email,
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });
    doc.save(`event_${eventById}_students.pdf`);
  };

  const handleDownload = (type) => {
    if (type === 'excel') exportToExcel();
    else if (type === 'pdf') exportToPDF();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Enrolled Students List</h2>
        <select
          onChange={(e) => handleDownload(e.target.value)}
          className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
        >
          <option disabled value="">Download Option</option>
          <option value="excel">Excel <MdDownloadDone/></option>
          <option value="pdf"> PDF <MdDownloadDone/></option>
        </select>
      </div>

      <div className="overflow-x-auto rounded shadow-lg">
        <table className="min-w-full text-sm text-left border border-gray-300">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 border">Username</th>
              <th className="px-4 py-3 border">Branch</th>
              <th className="px-4 py-3 border">College</th>
              <th className="px-4 py-3 border">Year</th>
              <th className="px-4 py-3 border">Phone</th>
              <th className="px-4 py-3 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {eventDetails.map((student, idx) => (
              <tr
                key={idx}
                className={`text-center ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
              >
                <td className="px-4 py-2 border">{student.username}</td>
                <td className="px-4 py-2 border">{student.department}</td>
                <td className="px-4 py-2 border">{student.collegeName}</td>
                <td className="px-4 py-2 border">{student.year}</td>
                <td className="px-4 py-2 border">{student.phoneNumber}</td>
                <td className="px-4 py-2 border">{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EventDetails;
