import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoPricetags } from 'react-icons/io5';
import { BsCalendarDate } from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';
import {useForm} from 'react-hook-form'
import {useRecoilValue} from 'recoil'
import axios from 'axios';
import {userAtom} from '../UserAtom'
import { MdDelete } from "react-icons/md";
import { useParams } from 'react-router-dom';
function AccordionItem({ question, answer, isExpanded, onToggle }) {

  return (
    <div className="rounded-xl bg-gray-100 overflow-hidden">
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={onToggle}>
        <div className="font-medium">{question}</div>
       <i className={`bx bx-chevron-right ${isExpanded ? "rotate-90":""}`}></i>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 text-gray-700">
          {answer}
        </div>
      )}
    </div>
  );
}
function EventsById() {
    const user=useRecoilValue(userAtom);
    const {eventById}=useParams();
 // const { state } = useLocation();
 const [expandedID, setExpandedID] = useState(null);
  const [comments, setComments] = useState([]);

  const [currentArticle,setCurrentArticle]=useState();
useEffect(()=>{
   const fetchEvent=async ()=>{
    const res=await axios.get(`http://localhost:3000/event/app/v1/events/${eventById}`,{
      headers:{
        Authorization:localStorage.getItem('token')
      }
    });
    if(res.status===200){
      setCurrentArticle(res.data.payload);
      setComments(res.data.payload.comments)
    }
   }
   fetchEvent();
},[eventById]);
  const toggleExpand = (id) => {
    setExpandedID(expandedID === id ? null : id);
  };

const { register, handleSubmit, reset } = useForm();

  console.log(user.username);
  const handleAddComment = async (data) => {
    const res=await axios.put(`http://localhost:3000/event/app/v1/event/update/student/${eventById}`,{
       content: data.newComment,
        owner: user._id,
        name: user.username,
    },{
      headers:{
        Authorization:localStorage.getItem("token")
      }
    })
   setComments(res.data.payload.comments || []);
    reset(); 
  };
 async function deleteComment(commentId){
      try{
       const res=await axios.delete(`http://localhost:3000/event/app/v1/comment/delete/${eventById}/${commentId}`,{
        headers:{
          Authorization:localStorage.getItem('token')
        }
       })

       if(res.status===200){
        setComments(res.data.payload);
       }

      }catch(e){
        
       alert('error deeleting comment',e.message);
      }
  }
if (!currentArticle) {
  return <div className="text-center mt-10 text-gray-500">Loading event details...</div>;
}


  return (
    <div className="p-4  w-full ">
      
     
      <div className="mb-6">
        <img
          src={currentArticle.eventImage}
          alt="Event"
          className="rounded-xl w-full h-full object-cover"
        />
      </div>

      {/* 2-Column Layout */}
      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Section */}
        <div className="flex-1 space-y-6">

          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-red-200 rounded px-2 py-1 flex items-center">
              <IoPricetags className="mr-1" /> {currentArticle.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold">{currentArticle.eventName}</h1>

          <div>
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{currentArticle.description}</p>
          </div>

          {/* Start & End Dates */}
          <div className="space-y-2">
           <p className="flex items-center gap-2 text-gray-700">
            <BsCalendarDate /> <b>Registration End Date:</b> {new Date(currentArticle.registrationEndDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
  <IoMdTime /> <b>End Time:</b> {currentArticle.endTime}
</p>


            
          </div>

          {/* Venue */}
          <div>
            <h2 className="text-xl font-semibold mb-2 break-words">Venue</h2>
               <p className="text-gray-700 max-w-96 break-words">{currentArticle.venue|| 'N/A'}</p>
<div className="mt-3">
  {currentArticle.venueAddress ? (
    <iframe
      title="Venue Location"
      src={currentArticle.venueAddress}
      width="100%"
      height="200"
      allowFullScreen
      loading="lazy"
      className="rounded-md border"
    ></iframe>
  ) : (
    <p className="text-gray-500">Venue location not available.</p>
  )}
</div>
          </div>

          {/* FAQs */}
      

        </div>
        <div className="w-full md:w-1/3 space-y-6 bg-gray-50 rounded-xl p-4 shadow-md h-fit">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">Date & Time</h3>
                <p className="flex items-center gap-2 text-gray-700">
                  <BsCalendarDate /> <b>Start:</b> {new Date(currentArticle.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <IoMdTime /> <b>End:</b> {new Date(currentArticle.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Cost</h3>
                  ₹{currentArticle.cost || 0}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Availability</h3>
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${(currentArticle.enrolled / currentArticle.maxLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm">{currentArticle.enrolled}/{currentArticle.maxLimit} spots filled</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Reward Points</h3>
                  {currentArticle.rewardPoints || 0} points
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  Register Now
                </button>
        </div>
        
      </div>

      
                <h2 className="text-xl font-semibold mb-2 text-center"> FAQs</h2>

          <div className="flex justify-center">
  <div className="w-full  space-y-3">
    {currentArticle.faqs && currentArticle.faqs.length > 0 ? (
      currentArticle.faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isExpanded={expandedID === index}
          onToggle={() => toggleExpand(index)}
        />
      ))
    ) : (
      <p className="text-gray-500 text-center">No FAQs available.</p>
    )}
  </div>
</div>

        <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>

        {/* Display Comments */}
        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">
               <p className="text-gray-700">{comment.name}</p>
               <div className='flex justify-between'>
                <p className="text-gray-700">{comment.content}</p>{user._id===comment.owner&&<button onClick={()=>deleteComment(comment._id)}><MdDelete className='text-red-600 mr-4 text-bold' /></button>}
               </div>
                

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No Comments Yet</p>
        )}

        {/* Add Comment */}
      {user._id!==currentArticle.organiser&&<form onSubmit={handleSubmit(handleAddComment)} className="mt-4 space-y-2">
        <input
            type="text"
            placeholder="Write a comment..."
            {...register('newComment', { required: true })}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Comment
          </button>
        </form>}
      </div>




    </div>
  );
}

export default EventsById;











































































  
  
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { IoPricetags } from 'react-icons/io5';
// import { BsCalendarDate } from 'react-icons/bs';
// import { IoMdTime } from 'react-icons/io';
// import { MdDelete } from "react-icons/md";
// import { useForm } from 'react-hook-form';
// import { useRecoilValue } from 'recoil';
// import axios from 'axios';
// import { userAtom } from '../UserAtom';

// function AccordionItem({ question, answer, isExpanded, onToggle }) {
//   return (
//     <div className="rounded-xl bg-gray-100 overflow-hidden">
//       <div className="flex justify-between items-center p-4 cursor-pointer" onClick={onToggle}>
//         <div className="font-medium">{question}</div>
//         <i className={`bx bx-chevron-right ${isExpanded ? "rotate-90" : ""}`}></i>
//       </div>
//       {isExpanded && (
//         <div className="px-4 pb-4 text-gray-700">
//           {answer}
//         </div>
//       )}
//     </div>
//   );
// }

// function EventsById() {
//   const user = useRecoilValue(userAtom);
//   const { state: locationState } = useLocation();
//   const [eventDetails, setEventDetails] = useState(locationState ?? {});
//   const [comments, setComments] = useState([]);
//   const [expandedID, setExpandedID] = useState(null);
//   const { register, handleSubmit, reset } = useForm();

//   // Fetch the latest event details (including comments)
//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const eventId = locationState?._id || eventDetails._id;
//         const res = await axios.get(`http://localhost:3000/event/app/v1/events/${eventId}`, {
//           headers: { Authorization: localStorage.getItem("token") },
//         });
//         setEventDetails(res.data.payload);
//         setComments(res.data.payload.comments || []);
//       } catch (error) {
//         console.error("Error fetching event:", error);
//       }
//     };

//     fetchEvent();
//   }, []);

//   const toggleExpand = (id) => {
//     setExpandedID(expandedID === id ? null : id);
//   };

//   const handleAddComment = async (data) => {
//     try {
//       const res = await axios.put(
//         `http://localhost:3000/event/app/v1/event/update/student/${eventDetails._id}`,
//         {
//           newComment: {
//             content: data.newComment,
//             ownerId: user._id,
//             name:user.username,
//           },
//         },
//         {
//           headers: {
//             Authorization: localStorage.getItem("token"),
//           },
//         }
//       );
//       setComments(res.data.payload.comments || []);
//       reset();
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     }
//   };

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       {/* Event Image */}
//       <div className="mb-6">
//         <img
//           src={eventDetails.eventImage}
//           alt="Event"
//           className="rounded-xl w-full h-full object-cover"
//         />
//       </div>

//       {/* 2-Column Layout */}
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Left Section */}
//         <div className="flex-1 space-y-6">
//           <div className="flex flex-wrap gap-2">
//             <span className="text-xs bg-red-200 rounded px-2 py-1 flex items-center">
//               <IoPricetags className="mr-1" /> {eventDetails.category}
//             </span>
//           </div>

//           <h1 className="text-3xl font-bold">{eventDetails.eventName}</h1>

//           <div>
//             <h2 className="text-xl font-semibold mb-2">About</h2>
//             <p className="text-gray-700">{eventDetails.description}</p>
//           </div>

//           {/* Start & End Dates */}
//           <div className="space-y-2">
//             <p className="flex items-center gap-2 text-gray-700">
//               <BsCalendarDate /> <b>Registration End Date:</b> {new Date(eventDetails.registrationEndDate).toLocaleDateString('en-US')}
//             </p>
//             <p className="flex items-center gap-2 text-gray-700">
//               <IoMdTime /> <b>End Time:</b> {eventDetails.endTime}
//             </p>
//           </div>

//           {/* Venue */}
//           <div>
//             <h2 className="text-xl font-semibold mb-2 break-words">Venue</h2>
//             <p className="text-gray-700 max-w-96 break-words">{eventDetails.venue || 'N/A'}</p>
//             <div className="mt-3">
//               {eventDetails.venueAddress ? (
//                 <iframe
//                   title="Venue Location"
//                   src={eventDetails.venueAddress}
//                   width="100%"
//                   height="200"
//                   allowFullScreen
//                   loading="lazy"
//                   className="rounded-md border"
//                 ></iframe>
//               ) : (
//                 <p className="text-gray-500">Venue location not available.</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="w-full md:w-1/3 space-y-6 bg-gray-50 rounded-xl p-4 shadow-md h-fit">
//           <div className="space-y-2">
//             <h3 className="font-semibold text-lg mb-2">Date & Time</h3>
//             <p className="flex items-center gap-2 text-gray-700">
//               <BsCalendarDate /> <b>Start:</b> {new Date(eventDetails.startDate).toLocaleDateString('en-US')}
//             </p>
//             <p className="flex items-center gap-2 text-gray-700">
//               <IoMdTime /> <b>End:</b> {new Date(eventDetails.endDate).toLocaleDateString('en-US')}
//             </p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg mb-2">Cost</h3>
//             ₹{eventDetails.cost || 0}
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg mb-2">Availability</h3>
//             <div className="w-full bg-gray-200 h-2 rounded">
//               <div
//                 className="bg-blue-600 h-2 rounded"
//                 style={{
//                   width: `${(eventDetails.enrolled / eventDetails.maxLimit) * 100}%`,
//                 }}
//               ></div>
//             </div>
//             <p className="mt-1 text-sm">
//               {eventDetails.enrolled}/{eventDetails.maxLimit} spots filled
//             </p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg mb-2">Reward Points</h3>
//             {eventDetails.rewardPoints || 0} points
//           </div>

//           <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
//             Register Now
//           </button>
//         </div>
//       </div>

//       {/* FAQs */}
//       <h2 className="text-xl font-semibold mb-2 text-center mt-8">FAQs</h2>
//       <div className="flex justify-center">
//         <div className="w-full space-y-3">
//           {eventDetails.faqs && eventDetails.faqs.length > 0 ? (
//             eventDetails.faqs.map((faq, index) => (
//               <AccordionItem
//                 key={index}
//                 question={faq.question}
//                 answer={faq.answer}
//                 isExpanded={expandedID === index}
//                 onToggle={() => toggleExpand(index)}
//               />
//             ))
//           ) : (
//             <p className="text-gray-500 text-center">No FAQs available.</p>
//           )}
//         </div>
//       </div>

//       {/* Comments */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-2">Comments</h2>

//        <div className="space-y-3">
//         {comments.map((comment) => (
//           <div key={comment._id} className="p-2 bg-gray-100 rounded flex items-start gap-3">
            
//             {/* Left Circle */}
//             <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg uppercase">
//               {comment.name?.charAt(0) || "?"}
//             </div>

//             {/* Right Side: Name and Content */}
//             <div>
//               <p className="font-semibold">{comment.name || "Anonymous"}</p>
//               <p className="text-gray-700">{comment.content}</p>
//             </div>

//           </div>
//         ))}
//         </div>


//         {user._id !== eventDetails.organiser && (
//           <form onSubmit={handleSubmit(handleAddComment)} className="mt-4 space-y-2">
//             <input
//               type="text"
//               placeholder="Write a comment..."
//               {...register('newComment', { required: true })}
//               className="w-full border px-3 py-2 rounded"
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Add Comment
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// export default EventsById;
