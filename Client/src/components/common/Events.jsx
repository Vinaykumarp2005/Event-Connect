import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsArrowUpRightCircle } from "react-icons/bs";
import { IoPricetags } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import './Event.css';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../UserAtom';

function Events() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        const res = await axios.get('http://localhost:3000/event/app/v1/events', {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.data && res.data.payload) {
          setEvents(res.data.payload);
        } else {
          console.error("Invalid response format:", res.data);
        }
      } catch (e) {
        console.error("Error fetching events:", e);
        alert('Error fetching events');
      }
    };
    
    getEvents();
  }, []);

  function callEventByid(eventObj) {
    if (user?.role === 'student' && user?.email) {
      navigate(`/student-profile/${user.email}/viewevent/${eventObj._id}`);
    } else if (user?.role === 'organizer' && user?.email) {
      navigate(`/organizer-profile/${user.email}/viewevent/${eventObj._id}`);
    } else if (user?.role === 'admin' && user?.email) {
      navigate(`/admin-profile/${user.email}/viewevent/${eventObj._id}`);
    } else {
      // Fallback if user info is missing
      console.error("Navigation error: User info is incomplete");
    }
  }
const isActive = (registrationEndDate, enrolled, maxLimit) => {
  const today = new Date();
  const regEndDate = new Date(registrationEndDate);
  return regEndDate >= today && enrolled < maxLimit;
};
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-black overflow-visible">
      {events.length === 0 ? (
        <div className="w-full text-center py-10">
          <p className="text-gray-400">Loading events...</p>
        </div>
      ) : (
        events.map((obj, idx) => (
          <div key={idx} className='min-h-52 bg-black min-w-60 max-w-60 flex flex-col rounded-lg border border-[rgba(8,112,184,0.7)] my-4'>
            <div className=''>
              <img src={obj.eventImage} alt="" className="w-full h-40 mb-3 rounded-t" />
            </div>
            <div className='px-4 pb-4 text-white'>
              <div className='flex justify-between items-center mb-2'>
                <h1 className='text-lg font-bold'>{obj.eventName}</h1>
                <span className='text-xs bg-gray-500 text-center rounded-md px-2 py-1 flex'>
<IoPricetags className='m-1'/>{obj.category}
                </span>
              </div>
      <div className='flex flex-row'>
        <div className='text-xs mb-2'>
                <p>Start Date : {new Date(obj.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                <p>End Date : {new Date(obj.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
              <div className='mt-2 ml-2 '>
                <div className='bg-white text-black py-1 px-2 rounded-md'>
                  <p className='text-xs text-center text-black ml-1'> Seats Left: <span className='font-semibold text-xs '>{obj.maxLimit - obj.enrolled}</span></p>
                </div>
  
              </div>
      </div>
              


              <div className="flex items-center justify-between">
<span className={`bg-white p-2 rounded-md text-xs font-semibold ${isActive(obj.registrationEndDate, obj.enrolled, obj.maxLimit) ? 'text-green-400' : 'text-red-400'}`}>
  {isActive(obj.registrationEndDate, obj.enrolled, obj.maxLimit) ? (
    <span className="flex items-center gap-1"><GoDotFill className='text-black animate-blink' /> Active</span>
  ) : (
    <span className="flex items-center gap-1"><GoDotFill className='text-black' />Closed</span>
  )}
</span>

                <button className='text-sm hover:text-white hover:bg-gray-800 bg-white text-black fs-bold px-4 py-1 rounded-md flex' onClick={()=>callEventByid(obj)}>
                  Go to event
                  <BsArrowUpRightCircle className='m-1 ml-2'/>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Events;
