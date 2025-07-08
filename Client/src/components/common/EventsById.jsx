import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoIosArrowDropup } from "react-icons/io";




function EventsById() {
  const { state } = useLocation();
  function AccordionItem({question,answer,isExpanded,onToggle}){
    return (
      <div className={`rounded-3xl overflow-hidden transition-all duration-300 ${isExpanded ?"max-h-36":"max-h-20"}`}>  
      <div className="flex justify-between items-start p-6 cursor-pointer" onClick={onToggle}> 
        <div className="text-m  font-bold">{question}</div>
        <i class={`bx bx-chevron-right ${isExpanded ? "rotate-90":""}`}></i>
      </div>
      <div className={`px-5 pb-5 overflow-hidden transition-all duration-300 ${isExpanded?"opacity-100" : "opacity-0"}`}>
        <div>{answer}</div>
      </div>

      </div>
    )
  }

const [expandedID,setExpandedId]=useState(null);
const toggleExpand=(id)=>{
  setExpandedId(expandedID==id ? null:id)
}



  return (
    <div className="m-4">
      <h1 className="text-center text-2xl font-bold mb-6">{state.eventName}</h1>

      <div className="flex flex-col md:flex-row flex-wrap md:items-start gap-6">
        {/* Event Image */}
            <div className="flex justify-center md:justify-start">
              <img
                src={state.eventImage}
                className="rounded-2xl object-cover w-full max-w-xs md:max-w-md"
                alt="Event"
              />
            </div>

            {/* Event Details */}
            <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-700 mb-4">{state.description}</p>

                  <p className="mb-2">
                    <strong>Start Date:</strong> {new Date(state.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="mb-4">
                    <strong>End Date:</strong> {new Date(state.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>

                  <div className="mb-4">
                    <strong>Location:</strong> {state.venueAddress || 'N/A'}
                  </div>

                  <div className="mb-4">
                    <strong>Seats Left:</strong> {state.maxLimit- state.enrolled}
                  </div>

                  <div className="mb-6">
                    <strong>Category:</strong> {state.category}
                  </div>
                   <div className="mb-6">
                    <strong>Enrolled:</strong> {state.enrolled}
                  </div>
        </div>
        </div>
                  <div>
  
        <div className="flex flex-col gap-3 max-w-md mb-2 justify-center items-center mx-auto">
          <h2 className="text-lg font-semibold mx-auto ">FAQs</h2>
          {state.faqs && state.faqs.length > 0 ? (
            <div className="space-y-4 ">
              {state.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  className="bg-[#1f1f23] text-white rounded-md border border-gray-500 transition-all duration-300"
                  {...faq}
                  isExpanded={expandedID===index}
                  onToggle={()=>toggleExpand(index)}              
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No FAQs available.</p>
          )}
          </div>

          <div className="flex justify-center md:justify-center">
            <h1>Sample Certificate</h1>
              <img
                src={state.sampleCertificate}
                className="rounded-2xl object-cover w-full max-w-xs md:max-w-md"
                alt="Event"
              />
            </div>

</div>

           
      
    </div>
  );
}

export default EventsById;

