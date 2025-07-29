import React, { useEffect ,useState} from 'react'
import axios from 'axios'; 
import { BsArrowUpRightCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
function FetchEvents() {
  const [events,setEvents]=useState([]);
  const navigate=useNavigate()
  useEffect(()=>{
    async function getevents(){
      try{
        const res=await axios.get(`http://localhost:3000/event/app/v1/organiser/events`,{
          headers:{
            Authorization:localStorage.getItem('token')
          }
        });
        if(res.status==200){
          setEvents(res.data.payload);
        }
      }catch(e){
       alert("unable to fetch the events");
      }
    }
    getevents();
  },[]);
 function gotoevent(eventById){
  navigate(`../event/${eventById}`)
 }
  return (
    <div className='flex flex-wrap'>
      {
        events.map((event,idx)=><div >
          <div className='h-64 w-48 bg-gray-500 m-2 rounded-lg'>
           <h1 className='text-white text-center mt-2'>{event.eventName}</h1>
           <img src={event.eventImage} className='w-44 h-34 mx-auto rounded-md'></img>
   <p className="text-center mt-2 mb-3 text-sm text-gray-300">
      <strong>Start Date :</strong> {new Date(event.startDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
<p className="text-center mt-2 mb-3 text-sm text-gray-300">
         <strong>End Date :</strong>  {new Date(event.startDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          <button className=' bg-black text-white py-1 px-2 rounded-md ml-2 flex' onClick={()=>gotoevent(event._id)}>Get Details<BsArrowUpRightCircle className='mt-1 ml-2'/></button>
          </div>
        </div>)
      }
    </div>
  )
}

export default FetchEvents