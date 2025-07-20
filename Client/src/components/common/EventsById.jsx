import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoPricetags } from 'react-icons/io5';
import { BsCalendarDate } from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';
import {useForm} from 'react-hook-form'
import {useRecoilValue} from 'recoil'
import axios from 'axios';
import {userAtom} from '../UserAtom'
import { MdDelete } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { MdModeEditOutline } from "react-icons/md";

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
  const navigate=useNavigate()
const { register, handleSubmit, formState: { errors },reset} = useForm();
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const user=useRecoilValue(userAtom);
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };
  const [isEnrolled, setIsEnrolled] = useState(false);
async function handleEnroll() {
  try {
    const res = await axios.put(`http://localhost:3000/event/app/v1/event/update/student/${eventById}`, {
      enroll: true,
      name: user.username, 
      rewardPoints:rewardPoints 
    }, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    });



    if (res.status === 200) {
      alert("Enrolled successfully");
      setCurrentArticle(res.data.payload);  
      setIsEnrolled(c=>!c);
    }
  } catch (err) {
     console.log(isEnrolled)
    alert(err.response?.data?.message || "Failed to enroll");
  }
}


  async function handleUpdateSubmit(data) {
  console.log('Updating Event:', data);
  console.log('FAQs:', faqs);

  const formData = new FormData();
  formData.append('eventName', data.eventName);
  formData.append('description', data.description);
  formData.append('maxLimit', data.maxLimit);
  formData.append('category', data.category);
  formData.append('startDate', data.startDate);
  formData.append('endDate', data.endDate);
  formData.append('registrationFee', data.registrationFee);
  formData.append('venue', data.venue);
  formData.append('keyTakeAways', data.keyTakeAways);
  formData.append('rewardPoints', data.rewardPoints);
  formData.append('registrationForm', data.registrationForm);
  formData.append('registrationEndDate', data.registrationEndDate);
  formData.append('endTime', data.endTime);
  formData.append('venueAddress', data.venueAddress);

  if (data.sampleCertificate?.[0]) {
    formData.append('sampleCertificate', data.sampleCertificate[0]);
  }
  if (data.eventImage?.[0]) {
    formData.append('eventImage', data.eventImage[0]);
  }

  formData.append('faqs', JSON.stringify(faqs));

  try {
    const res = await axios.post(`http://localhost:3000/event/app/v1/event/update/${eventById}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') },
    });

    if (res.status === 200) {
      alert('Event updated successfully');

      setCurrentArticle(res.data.payload); 
      setEdit(false); 
    } else {
      alert('Failed to update event');
    }
  } catch (err) {
    console.error(err);
    alert('Error updating event');
  }
}




  async function handleFormSubmit(data) {
    console.log('Form submitted:', data);
    console.log('FAQs:', faqs);

    const formData = new FormData();

    formData.append('eventName', data.eventName);
    formData.append('description', data.description);
    formData.append('maxLimit', data.maxLimit);
    formData.append('enrolled', 0);
    formData.append('category', data.category);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('sampleCertificate', data.sampleCertificate[0]);
    formData.append('registrationFee', data.registrationFee);
    formData.append('venue', data.venue);
    formData.append('keyTakeAways', data.keyTakeAways);
    formData.append('isApproved', false);
    formData.append('rewardPoints', data.rewardPoints);
    formData.append('registrationForm', data.registrationForm);
    formData.append('registrationEndDate', data.registrationEndDate);
    formData.append('endTime', data.endTime);
    formData.append('eventImage', data.eventImage[0]);
    formData.append('faqs', JSON.stringify(faqs));
    formData.append('venueAddress',data.venueAddress);
    
    try {
      const res = await axios.post('http://localhost:3000/event/app/v1/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' ,'Authorization':localStorage.getItem("token")},
      });
      if (res.status === 200) {
        alert(res.data.message);
      } else {
        alert('Invalid Data');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  }

    
    const {eventById}=useParams();
    const [edit,setEdit]=useState(false);
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
     const enrolled = eventData.enrolledStudents?.some(
          (student) => student.studentId === user._id
        );
        setIsEnrolled(enrolled);
        console.log(isEnrolled)
    }
   }
   fetchEvent();
},[eventById]);
  const toggleExpand = (id) => {
    setExpandedID(expandedID === id ? null : id);
  };
    

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

        useEffect(() => {
          if (edit && currentArticle) {
            reset({
              eventName: currentArticle.eventName,
              description: currentArticle.description,
              maxLimit: currentArticle.maxLimit,
              category: currentArticle.category,
              startDate: new Date(currentArticle.startDate).toISOString().split('T')[0],
              endDate: new Date(currentArticle.endDate).toISOString().split('T')[0],
              registrationFee: currentArticle.registrationFee,
              venue: currentArticle.venue,
              venueAddress: currentArticle.venueAddress,
              keyTakeAways: currentArticle.keyTakeAways,
              rewardPoints: currentArticle.rewardPoints,
              registrationForm: currentArticle.registrationForm,
              registrationEndDate: new Date(currentArticle.registrationEndDate).toISOString().split('T')[0],
              endTime: currentArticle.endTime,
            });

        
            setFaqs(currentArticle.faqs || []);
          }
        }, [edit, currentArticle, reset]);



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
        async function deleteArticle(){
        const res=await axios.delete(`http://localhost:3000/event/app/v1/event/delete/${eventById}`,{
          headers:{
            Authorization:localStorage.getItem('token')
          }
        });
        if(res.status===200){
          alert('article deleted successfully');
        navigate('../events');
        }
        }
  return (
   <div> 
    {!edit?
    <div className="p-4  w-full ">
      {currentArticle.organiser===user._id&& <div className='flex justify-end'>
         <button onClick={() => setEdit(true)}  className='rounded-md  px-3 flex items-center gap-2 py-1 text-md bg-gray-500 text-white m-1'>Edit <MdModeEditOutline className='text-lg'/></button>
    <button className='rounded-md py-1 px-1 ml-2 mr-2 m-1 flex items-center gap-1 bg-red-600 text-white' onClick={()=>deleteArticle()}>Delete <MdDelete className='text-white'/></button>
       </div>}
      <div className="mb-6">
        <img
          src={currentArticle.eventImage}
          alt="Event"
          className="rounded-xl w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
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
          <div>
            <h2 className="text-xl font-semibold mb-2 break-words">Venue</h2>
            <p className="text-gray-700 max-w-96 break-words">{currentArticle.venue|| 'N/A'}</p>
            <div className="mt-3">
              {currentArticle.venueAddress ? (
                <iframe src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d25418.28499136932!2d78.56582081300171!3d17.421640627684678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1svnr%20map!5e1!3m2!1sen!2sin!4v1752216320713!5m2!1sen!2sin" width="600" height="450" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              ) : (
                <p className="text-gray-500">Venue location not available.</p>
              )}
            </div>
          </div>
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
{user._id !== currentArticle.organiser && (
  <button
    onClick={handleEnroll}
    className={`w-full py-2 rounded transition ${isEnrolled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
    disabled={isEnrolled}
  >
    {isEnrolled ? "Enrolled" : "Register Now"}
  </button>
)}


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
        {comments.length > 0 ? (
          <div className="space-y-3">
                  {comments.map((comment, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded">
                                    
                    <div key={index} className="p-2 bg-gray-100 rounded flex gap-3 items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg uppercase">
                            {comment.name?.charAt(0)}
                          </div>

                          <div className="flex-1">
                            <p className="font-semibold">{comment.name}</p>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>

                          {user._id === comment.owner && (
                            <button onClick={() => deleteComment(comment._id)}>
                              <MdDelete className="text-red-600 mr-4 text-bold" />
                            </button>
                          )}
                    </div>
               </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No Comments Yet</p>
        )}

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




    </div>:<div className='p-6 w-full'>
      <h1 className="text-xl mb-4">Update Event</h1>

      <form onSubmit={handleSubmit(handleUpdateSubmit)} className="space-y-4 w-full">

        <div>
          <label>Event Name:</label>
          <input type="text" {...register('eventName', { required: true, minLength: 3, maxLength: 30 })} className="w-full border px-3 py-2 rounded" />
          {errors.eventName && <p className="text-red-600">* Event Name is required (3-30 characters)</p>}
        </div>

        <div>
          <label>Description:</label>
          <textarea placeholder="Describe your event" {...register('description', { required: true })} className="w-full border px-3 py-2 rounded" rows="4"></textarea>
          {errors.description && <p className="text-red-600">* Description is required</p>}
        </div>

        <div>
          <label>Max Limit:</label>
          <input type="number" {...register('maxLimit', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.maxLimit && <p className="text-red-600">* Max Limit is required</p>}
        </div>

        <div>
          <label>Category:</label>
          <select {...register('category', { required: true })} className="w-full border px-3 py-2 rounded">
            <option value="">-- Select --</option>
            <option value="hackathon">Hackathon</option>
            <option value="codingcontest">Coding Contest</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="bootcamp">Bootcamp</option>
          </select>
          {errors.category && <p className="text-red-600">* Category is required</p>}
        </div>

        <div>
          <label>Start Date:</label>
          <input type="date" {...register('startDate', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.startDate && <p className="text-red-600">* Start Date is required</p>}
        </div>

        <div>
          <label>End Date:</label>
          <input type="date" {...register('endDate', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.endDate && <p className="text-red-600">* End Date is required</p>}
        </div>

        <div>
  <label>Event Image:</label>
  <div className="flex items-center gap-4">
    <input type="file" {...register('eventImage')} accept=".pdf,.jpg,.jpeg,.png" />
    {currentArticle?.eventImage && (
      <img src={currentArticle.eventImage} alt="Event" className="h-20 w-20 object-cover rounded" />
    )}
  </div>
</div>


        <div>
  <label>Sample Certificate:</label>
  <div className="flex items-center gap-4">
    <input type="file" {...register('sampleCertificate')} accept=".pdf,.jpg,.jpeg,.png" />
    {currentArticle?.sampleCertificate && (
      <img src={currentArticle.sampleCertificate} alt="Certificate" className="h-20 w-20 object-cover rounded" />
    )}
  </div>
</div>

        <div>
          <label>Venue:</label>
          <input type="text" {...register('venue', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.venue && <p className="text-red-600">* Venue is required</p>}
        </div>
        <div>
          <label>Venue Address (Link) :</label>
          <input type="text" {...register('venueAddress', { required: true })} className="w-full border px-3 py-2 rounded" placeholder='paste google maps address of your college'/>
          {errors.venueAddress && <p className="text-red-600">* Venue Address is required</p>}
        </div>

        <div>
          <label>Registration Fee:</label>
          <input type="number" {...register('registrationFee', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.registrationFee && <p className="text-red-600">* Registration Fee is required</p>}
        </div>

        <div>
          <label>Key Takeaways:</label>
          <textarea placeholder="Describe Key takeways" {...register('keyTakeAways', { required: true })} className="w-full border px-3 py-2 rounded" rows="10"></textarea>
          {errors.keyTakeAways && <p className="text-red-600">* Key Takeaways is required</p>}
        </div>

        <div>
          <label>Reward Points:</label>
          <input type="number" {...register('rewardPoints', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.rewardPoints && <p className="text-red-600">* Reward Points is required</p>}
        </div>

        <div>
          <label>Registration Form (Link):</label>
          <input type="text" {...register('registrationForm', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.registrationForm && <p className="text-red-600">* Registration Form link is required</p>}
        </div>

        <div>
          <label>Registration End Date:</label>
          <input type="date" {...register('registrationEndDate', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.registrationEndDate && <p className="text-red-600">* Registration End Date is required</p>}
        </div>

        <div>
          <label>End Time:</label>
          <input type="time" {...register('endTime', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.endTime && <p className="text-red-600">* End Time is required</p>}
        </div>

        <div>
          <h3 className="text-lg font-semibold">FAQs</h3>
          {faqs.map((faq, index) => (
            <div key={index} className="flex flex-col md:flex-col gap-4 items-center">
              <input type="text" placeholder="Question" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="Answer" value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} className="w-full border px-3 py-2 rounded" />
              <button type="button" onClick={() => removeFaq(index)} className="text-red-500 font-semibold">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addFaq} className="text-white font-medium bg-black rounded-lg p-2 mt-1">+ Add FAQ</button>
        </div>

      <button type='submit' className='rounded-md px-3 flex items-center gap-2 py-1 text-md bg-gray-500 text-white m-1'>Update <MdModeEditOutline className='text-lg'/></button>

      </form>
      </div>}
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
