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
    <div className="rounded-xl bg-gray-800 overflow-hidden border border-gray-700">
      <div className="flex justify-between items-center p-4 cursor-pointer text-white" onClick={onToggle}>
        <div className="font-medium">{question}</div>
        <i className={`bx bx-chevron-right text-white transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}></i>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 text-gray-300 border-t border-gray-700">
          {answer}
        </div>
      )}
    </div>
  );
}

function EventsById() {
  const [edit,setEdit]=useState(false);
  const [commentEdit,setCommentEdit]=useState(false);
   const {eventById}=useParams();
  const navigate=useNavigate()
const { register, handleSubmit, formState: { errors },reset,setValue} = useForm({
  defaultValues: {
    newComment: ''
  }});
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
 const [commentIdstore,setCommentIdstore]=useState();

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, formData);
    return res.data.secure_url;
  };




  async function handleUpdateSubmit(data) {
  console.log('Updating Event:', data);
  console.log('FAQs:', faqs);
   const eventImageUrl = data.eventImage?.[0]
        ? await uploadToCloudinary(data.eventImage[0])
        : currentArticle?.eventImage || '';
      const certificateImageUrl = data.sampleCertificate?.[0]
        ? await uploadToCloudinary(data.sampleCertificate[0])
        : currentArticle?.sampleCertificate || '';
 
const payload = {
        eventName: data.eventName,
        description: data.description,
        maxLimit: data.maxLimit,
        enrolled: 0,
        category: data.category,
        startDate: data.startDate,
        endDate: data.endDate,
        sampleCertificate: certificateImageUrl,
        registrationFee: data.registrationFee,
        venue: data.venue,
        keyTakeAways: data.keyTakeAways,
        isApproved: false,
        rewardPoints: data.rewardPoints,
        registrationForm: data.registrationForm,
        registrationEndDate: data.registrationEndDate,
        endTime: data.endTime,
        eventImage: eventImageUrl,
        faqs: faqs,
        venueAddress: data.venueAddress,
      };

  try {
    const res = await axios.post(`http://localhost:3000/event/app/v1/event/update/${eventById}`, payload, {
      headers: {  'Authorization': localStorage.getItem('token') },
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

    const eventImageUrl = data.eventImage?.[0]
        ? await uploadToCloudinary(data.eventImage[0])
        : '';
      const certificateImageUrl = data.sampleCertificate?.[0]
        ? await uploadToCloudinary(data.sampleCertificate[0])
        : '';
 const payload = {
        eventName: data.eventName,
        description: data.description,
        maxLimit: data.maxLimit,
        enrolled: 0,
        category: data.category,
        startDate: data.startDate,
        endDate: data.endDate,
        sampleCertificate: certificateImageUrl,
        registrationFee: data.registrationFee,
        venue: data.venue,
        keyTakeAways: data.keyTakeAways,
        isApproved: false,
        rewardPoints: data.rewardPoints,
        registrationForm: data.registrationForm,
        registrationEndDate: data.registrationEndDate,
        endTime: data.endTime,
        eventImage: eventImageUrl,
        faqs: faqs,
        venueAddress: data.venueAddress,
      };

     
    
try {
      const res = await axios.post('http://localhost:3000/event/app/v1/create', payload, {
        headers: { 'Authorization':localStorage.getItem("token")},
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
      setComments(res.data.payload.comments);
        setIsEnrolled(res.data.isEnrolled);    }
   }
   fetchEvent();
},[eventById,commentIdstore]);
  const toggleExpand = (id) => {
    setExpandedID(expandedID === id ? null : id);
  };
    

  console.log(user.username);
  const handleAddComment = async (data) => {
    const res=await axios.put(`http://localhost:3000/event/app/v1/update/student/${eventById}`,{
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

async function handleEnroll() {
  try {
    const res = await axios.put(
      `http://localhost:3000/event/app/v1/update/student/${eventById}`,
      {
        enroll: true,
        name: user.username,
        rewardPoints: currentArticle.rewardPoints
      },
      {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }
    );

    if (res.status === 200) {
      alert("🎉 Enrolled successfully!");
      setCurrentArticle(res.data.payload);
    }
  } catch (err) {
    console.error("Enrollment error:", err);
    alert(err.response?.data?.message || " Failed to enroll in the event.");
  }
}
const [commentEditText, setCommentEditText] = useState("");
useEffect(() => {
  if (commentIdstore && commentEditText) {
    setValue('newComment', commentEditText);
  }
}, [commentIdstore, commentEditText, setValue]);

function handleCommenteditState(commentId,content){
setCommentIdstore(commentId);
setCommentEditText(content);
//setValue('newComment', content); 
}
async function handleEditComment(data){
  //setValue('newComment',data.newComment);
  console.log(data.newComment);
  alert(data.newComment)
try{
const res=await axios.put(`http://localhost:3000/event/app/v1/comment/update/${eventById}/${commentIdstore}`,{
  text:data.newComment
},{
  headers:{
    Authorization:localStorage.getItem('token')
  }
});
if(res.status==200){
    setComments(res.data.payload); 
  setCommentEdit(false);
  setCommentEditText(null)
  setCommentIdstore(null);
  alert(res.data.message);
}
}catch(e){
  alert('error in updating the comment');
}
}
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
     
        async function deleteArticle(){
      const confirmDelete = window.confirm("Are you sure you want to delete this article?");
  if (!confirmDelete) return;
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
        if (!currentArticle) {
          return (
            <div className="flex justify-center items-center min-h-screen bg-black">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-48 bg-gray-800 rounded mb-4"></div>
                <div className="h-64 w-full max-w-3xl bg-gray-800 rounded"></div>
              </div>
            </div>
          );
        }


  return (
   <div className="bg-black text-white"> 
    {!edit ? (
      <div className="p-4 max-w-6xl mx-auto mt-6 lg:mt-12">
          {currentArticle.organiser===user._id&& <div className='flex justify-end gap-2 mb-4'>
         <button 
                onClick={() => setEdit(true)} 
                className='rounded-md px-3 py-1.5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition'
              >
                Edit <MdModeEditOutline className='text-lg'/>
              </button>
              <button 
                className='rounded-md py-1.5 px-3 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white transition' 
                onClick={deleteArticle}
              >
                Delete <MdDelete />
              </button>
       </div>}
      
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-gray-800">
            <img
              src={currentArticle.eventImage}
              alt={currentArticle.eventName}
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-900 text-blue-200 rounded-full px-3 py-1 flex items-center">
                  <IoPricetags className="mr-1" /> {currentArticle.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white">{currentArticle.eventName}</h1>

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h2 className="text-xl font-semibold mb-2 text-white">About</h2>
                <p className="text-gray-300">{currentArticle.description}</p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 space-y-2 border border-gray-800">
                <p className="flex items-center gap-2 text-gray-300">
                  <BsCalendarDate className="text-blue-400" /> 
                  <b className="text-white">Registration End Date:</b> {new Date(currentArticle.registrationEndDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="flex items-center gap-2 text-gray-300">
                  <IoMdTime className="text-blue-400" /> 
                  <b className="text-white">End Time:</b> {currentArticle.endTime}
                </p>
              </div>
              

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h2 className="text-xl font-semibold mb-2 break-words text-white">Venue</h2>
                <p className="text-gray-300 max-w-96 break-words">{currentArticle.venue || 'N/A'}</p>
                <div className="mt-3 rounded-lg overflow-hidden">
                  {currentArticle.venueAddress ? (
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d25418.28499136932!2d78.56582081300171!3d17.421640627684678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1svnr%20map!5e1!3m2!1sen!2sin!4v1752216320713!5m2!1sen!2sin" 
                      width="100%" 
                      height="300" 
                      style={{border:0}} 
                      loading="lazy"
                      className="rounded-lg"
                    ></iframe>
                  ) : (
                    <p className="text-gray-500">Venue location not available.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3 space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800">
                <h3 className="font-semibold text-lg mb-3 text-white border-b border-gray-700 pb-2">Date & Time</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-300">
                    <BsCalendarDate className="text-blue-400" /> 
                    <b className="text-white">Start:</b> {new Date(currentArticle.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="flex items-center gap-2 text-gray-300">
                    <IoMdTime className="text-blue-400" /> 
                    <b className="text-white">End:</b> {new Date(currentArticle.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800">
                <h3 className="font-semibold text-lg mb-3 text-white border-b border-gray-700 pb-2">Cost</h3>
                <p className="text-2xl font-bold text-white">₹{currentArticle.registrationFee || 0}</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800">
                <h3 className="font-semibold text-lg mb-3 text-white border-b border-gray-700 pb-2">Availability</h3>
                <div className="w-full bg-gray-700 h-3 rounded-full mt-2">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${(currentArticle.enrolled / currentArticle.maxLimit) * 100}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-300">{currentArticle.enrolled}/{currentArticle.maxLimit} spots filled</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-800">
                <h3 className="font-semibold text-lg mb-3 text-white border-b border-gray-700 pb-2">Reward Points</h3>
                <p className="text-2xl font-bold text-blue-400">{currentArticle.rewardPoints || 0} points</p>
              </div>

              {user._id !== currentArticle.organiser && (user.role !== 'admin' && user.role !== 'organizer') && (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolled}
                  className={`w-full px-4 py-3 rounded-lg text-white font-medium transition ${
                    isEnrolled 
                      ? "bg-gray-700 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isEnrolled ? "Already Enrolled" : "Enroll Now"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-lg p-6 ">
            <h2 className="text-xl font-semibold mb-4  text-white">Frequently Asked Questions </h2>
            <div className=" space-y-4">
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
                <p className="text-gray-400 text-center py-4">No FAQs available.</p>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-lg p-6 ">
            <h2 className="text-xl font-semibold mb-4 text-white">Comments</h2>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="rounded-lg bg-gray-800 border border-gray-700">
                    {commentIdstore !== comment._id ? (
                      <div className="p-4">
                        <div className="flex gap-3 items-start">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg uppercase">
                            {comment.name?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white">{comment.name}</p>
                            <p className="text-gray-300 break-words">{comment.content}</p>
                          </div>
                          {user._id === comment.owner && (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => deleteComment(comment._id)} 
                                className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-full transition"
                              >
                                <MdDelete className="text-red-500 text-xl" />
                              </button>
                              <button 
                                onClick={() => handleCommenteditState(comment._id, comment.content)} 
                                className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-full transition"
                              >
                                <MdModeEditOutline className="text-blue-400 text-xl" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <form
                        key={commentIdstore}
                        onSubmit={handleSubmit(handleEditComment)}
                        className="p-4 space-y-3"
                      >
                        <input
                          type="text"
                          placeholder="Edit your comment..."
                          {...register('newComment', { required: true })}
                          className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg text-white"
                          onChange={(e) => setValue("newComment", e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                          >
                            Save Comment
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCommentIdstore(null);
                              setCommentEdit(false);
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 py-4">No comments yet. Be the first to comment!</p>
            )}

            {user._id !== currentArticle.organiser && (
              <form
                onSubmit={handleSubmit(handleAddComment)} 
                className="mt-6 space-y-3"
              >
                <input
                  type="text"
                  placeholder="Write a comment..."
                  {...register('newComment', { required: true })}
                  className="w-full bg-gray-800 border border-gray-700 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Add Comment
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        // Update form styling
        <div className='p-6 bg-black text-white max-w-4xl mx-auto'>
          <h1 className="text-2xl font-bold mb-6 text-white">Update Event</h1>

          <form onSubmit={handleSubmit(handleUpdateSubmit)} className="space-y-5">
            {/* Form fields with improved styling */}
            <div>
              <label className="block text-gray-300 mb-2">Event Name:</label>
              <input 
                type="text" 
                {...register('eventName', { required: true, minLength: 3, maxLength: 30 })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
              />
              {errors.eventName && <p className="text-red-500 mt-1">* Event Name is required (3-30 characters)</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Description:</label>
              <textarea 
                placeholder="Describe your event" 
                {...register('description', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
                rows="4"
              ></textarea>
              {errors.description && <p className="text-red-500 mt-1">* Description is required</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Max Limit:</label>
              <input 
                type="number" 
                {...register('maxLimit', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
              />
              {errors.maxLimit && <p className="text-red-500 mt-1">* Max Limit is required</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Category:</label>
              <select 
                {...register('category', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white"
              >
                <option value="">-- Select --</option>
                <option value="hackathon">Hackathon</option>
                <option value="codingcontest">Coding Contest</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="bootcamp">Bootcamp</option>
              </select>
              {errors.category && <p className="text-red-500 mt-1">* Category is required</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Start Date:</label>
              <input 
                type="date" 
                {...register('startDate', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
              />
              {errors.startDate && <p className="text-red-500 mt-1">* Start Date is required</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">End Date:</label>
              <input 
                type="date" 
                {...register('endDate', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
              />
              {errors.endDate && <p className="text-red-500 mt-1">* End Date is required</p>}
            </div>

            <div>
  <label className="block text-gray-300 mb-2">Event Image:</label>
  <div className="flex items-center gap-4">
    <input type="file" {...register('eventImage')} accept=".pdf,.jpg,.jpeg,.png" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
    {currentArticle?.eventImage && (
      <img src={currentArticle.eventImage} alt="Event" className="h-20 w-20 object-cover rounded" />
    )}
  </div>
</div>


            <div>
  <label className="block text-gray-300 mb-2">Sample Certificate:</label>
  <div className="flex items-center gap-4">
    <input type="file" {...register('sampleCertificate')} accept=".pdf,.jpg,.jpeg,.png" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
    {currentArticle?.sampleCertificate && (
      <img src={currentArticle.sampleCertificate} alt="Certificate" className="h-20 w-20 object-cover rounded" />
    )}
  </div>
</div>

            <div>
              <label className="block text-gray-300 mb-2">Venue:</label>
              <input 
                type="text" 
                {...register('venue', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
              />
              {errors.venue && <p className="text-red-500 mt-1">* Venue is required</p>}
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Venue Address (Link) :</label>
              <input 
                type="text" 
                {...register('venueAddress', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
                placeholder='paste google maps address of your college'
              />
              {errors.venueAddress && <p className="text-red-500 mt-1">* Venue Address is required</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Registration Fee:</label>
              <input 
                type="number" 
                {...register('registrationFee', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
              />
              {errors.registrationFee && <p className="text-red-500 mt-1">* Registration Fee is required</p>}
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Key Takeaways:</label>
              <textarea 
                placeholder="Describe Key takeaways" 
                {...register('keyTakeAways', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
                rows="10"
              ></textarea>
              {errors.keyTakeAways && <p className="text-red-500 mt-1">* Key Takeaways is required</p>}
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Reward Points:</label>
              <input 
                type="number" 
                {...register('rewardPoints', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
              />
              {errors.rewardPoints && <p className="text-red-500 mt-1">* Reward Points is required</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Registration Form (Link):</label>
              <input 
                type="text" 
                {...register('registrationForm', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
              />
              {errors.registrationForm && <p className="text-red-500 mt-1">* Registration Form link is required</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Registration End Date:</label>
              <input 
                type="date" 
                {...register('registrationEndDate', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
              />
              {errors.registrationEndDate && <p className="text-red-500 mt-1">* Registration End Date is required</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">End Time:</label>
              <input 
                type="time" 
                {...register('endTime', { required: true })} 
                className="w-full bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-white" 
              />
              {errors.endTime && <p className="text-red-500 mt-1">* End Time is required</p>}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">FAQs</h3>
              {faqs.map((faq, index) => (
                <div key={index} className="flex flex-col gap-3 mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <input 
                    type="text" 
                    placeholder="Question" 
                    value={faq.question} 
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)} 
                    className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg text-white" 
                  />
                  <input 
                    type="text" 
                    placeholder="Answer" 
                    value={faq.answer} 
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} 
                    className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg text-white" 
                  />
                  <button 
                    type="button" 
                    onClick={() => removeFaq(index)} 
                    className="self-end px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addFaq} 
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center"
              >
                <span className="mr-1">+</span> Add FAQ
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type='submit' 
                className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2'
              >
                Update Event <MdModeEditOutline className='text-lg'/>
              </button>
              <button 
                type='button' 
                onClick={() => setEdit(false)} 
                className='px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default EventsById;

