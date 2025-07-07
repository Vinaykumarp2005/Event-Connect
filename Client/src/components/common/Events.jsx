import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsArrowUpRightCircle } from "react-icons/bs";
import { IoPricetags } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import  './Event.css'
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../UserAtom';
function Events() {
  const [events, setEvents] = useState([]);
   const navigate=useNavigate();
   const user=useRecoilValue(userAtom)
  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/event/app/v1/events', {
          headers: {
            'Authorization': localStorage.getItem("token")
          }
        });
        setEvents(res.data.payload);
      } catch (e) {
        alert('Error fetching events');
      }
    };
    getEvents()
//setInterval(getEvents(),getEvents);
  }, []);
  function callEventByid(eventObj){
      navigate(`../${eventObj._id}`,{state:eventObj})
  }
const isActive = (registrationEndDate, enrolled, maxLimit) => {
  const today = new Date();
  const regEndDate = new Date(registrationEndDate);
  return regEndDate >= today && enrolled < maxLimit;
};
  return (
    <div className="flex flex-wrap flex-row gap-4 p-4">
      {
        events.map((obj, idx) => (
          <div key={idx} className='min-h-52 bg-gray-500 w-60 flex flex-col rounded-lg border border-white'>
            <div className='p-2'>
              <img src={obj.eventImage} alt="" width="100%" style={{ borderRadius: "10px" }} />
            </div>
            <div className='px-4 pb-4 text-white'>
              <div className='flex justify-between items-center mb-2'>
                <h1 className='text-lg font-bold'>{obj.eventName}</h1>
                <span className='text-xs bg-gray-500 text-center rounded-md px-2 py-1 flex '>
<IoPricetags className='m-1'/>{obj.category}
                </span>
              </div>
      <div className='flex flex-row'>
        <div className='text-xs mb-2'>
                <p>Start Date : {new Date(obj.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                <p>End Date : {new Date(obj.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
              <div className='mt-2 ml-2 '>
                <div className='bg-black py-1 px-2 rounded-md'>
                  <p className='text-xs text-center ml-1'> Seats Left: <span className='font-semibold text-xs '>{obj.maxLimit - obj.enrolled}</span></p>
                </div>
  

              </div>
      </div>
              

              <p className='text-xs mb-2'>{obj.description.substring(0, 80) + "..."}</p>

              <div className="flex items-center justify-between">
<span className={`bg-black p-2 rounded-md text-xs font-semibold ${isActive(obj.registrationEndDate, obj.enrolled, obj.maxLimit) ? 'text-green-400' : 'text-red-400'}`}>
  {isActive(obj.registrationEndDate, obj.enrolled, obj.maxLimit) ? (
    <span className="flex items-center gap-1"><GoDotFill className='text-white animate-blink' /> Active</span>
  ) : (
    <span className="flex items-center gap-1"><GoDotFill className='text-white' />Closed</span>
  )}
</span>

                <button className='text-sm hover:text-white hover:bg-gray-800 bg-black px-4 py-1 rounded-md flex' onClick={()=>callEventByid(obj)}>
                  Go to event
                  <BsArrowUpRightCircle className='m-1 ml-2'/>
                </button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default Events;
