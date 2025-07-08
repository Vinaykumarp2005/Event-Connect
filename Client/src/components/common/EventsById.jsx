import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoPricetags } from 'react-icons/io5';
import { BsCalendarDate } from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';
import {useForm} from 'react-hook-form'

// Accordion Item Component
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
  const { state } = useLocation();
  const [expandedID, setExpandedID] = useState(null);

  const toggleExpand = (id) => {
    setExpandedID(expandedID === id ? null : id);
  };

 const [comments, setComments] = useState(state.comments || []); 
  const { register, handleSubmit, reset } = useForm();

  const handleAddComment = (data) => {
    setComments([...comments, data.newComment]);
    reset(); 
  };


  return (
    <div className="p-4 max-w-7xl mx-auto">
      
     
      <div className="mb-6">
        <img
          src={state.eventImage}
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
              <IoPricetags className="mr-1" /> {state.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold">{state.eventName}</h1>

          <div>
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{state.description}</p>
          </div>

          {/* Start & End Dates */}
          <div className="space-y-2">
           <p className="flex items-center gap-2 text-gray-700">
            <BsCalendarDate /> <b>Registration End Date:</b> {new Date(state.registrationEndDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
  <IoMdTime /> <b>End Time:</b> {state.endTime}
</p>


            
          </div>

          {/* Venue */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Venue</h2>
            <p className="text-gray-700">{state.venueAddress || 'N/A'}</p>
            <div className="mt-3">
              <iframe
                title="Venue Location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(state.venueAddress)}&output=embed`}
                width="100%"
                height="200"
                className="rounded-md"
              ></iframe>
            </div>
          </div>

          {/* FAQs */}
          <div className='justify-center mx-auto items-center'>
            <h2 className="text-xl font-semibold mb-2 "> FAQs</h2>
            {state.faqs && state.faqs.length > 0 ? (
              <div className="space-y-3">
                {state.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isExpanded={expandedID === index}
                    onToggle={() => toggleExpand(index)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No FAQs available.</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 space-y-6 bg-gray-50 rounded-xl p-4 shadow-md h-fit">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">Date & Time</h3>
                <p className="flex items-center gap-2 text-gray-700">
                  <BsCalendarDate /> <b>Start:</b> {new Date(state.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <IoMdTime /> <b>End:</b> {new Date(state.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Cost</h3>
                  ₹{state.cost || 0}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Availability</h3>
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${(state.enrolled / state.maxLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm">{state.enrolled}/{state.maxLimit} spots filled</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Reward Points</h3>
                  {state.rewardPoints || 0} points
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  Register Now
                </button>
        </div>
        
      </div>

      


        <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>

        {/* Display Comments */}
        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">
                <p className="text-gray-700">{comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No Comments Yet</p>
        )}

        {/* Add Comment */}
        <form onSubmit={handleSubmit(handleAddComment)} className="mt-4 space-y-2">
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
        </form>
      </div>




    </div>
  );
}

export default EventsById;


