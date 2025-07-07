// import React from 'react';
// import { useLocation } from 'react-router-dom';

// function EventsById() {
//   const { state } = useLocation();

//   return (
//     <div className="m-4">
//       <h1 className="text-center text-2xl font-bold mb-6">{state.eventName}</h1>

//       <div className="flex flex-col md:flex-row flex-wrap md:items-start gap-6">
//         {/* Image */}
//         <div className="flex justify-center md:justify-start">
//           <img
//             src={state.eventImage}
//             className="rounded-2xl object-cover w-full max-w-xs md:max-w-md"
//             alt="Event"
//           />
//         </div>

//         {/* Description */}
//         <div className="flex-1">
//           <h2 className="text-lg font-semibold mb-2">Description</h2>
//           <p className="text-gray-700">{state.description}</p>
//          <p>Start Date : {new Date(state.startDate).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//           })}</p>

//           <p>End Date : {new Date(state.endDate).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//           })}</p>
//           <div>
//             <p>{state.s}</p>

//           </div>


//         </div>
//       </div>


//     </div>
//   );
// }

// export default EventsById;


import React from 'react';
import { useLocation } from 'react-router-dom';

function EventsById() {
  const { state } = useLocation();

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

          {/* FAQs Accordion */}
          <div>
            <h2 className="text-lg font-semibold mb-2">FAQs</h2>

            {state.faqs && state.faqs.length > 0 ? (
              <div className="space-y-3">
                {state.faqs.map((faq, index) => (
                  <details key={index} className="bg-gray-100 p-4 rounded-md">
                    <summary className="cursor-pointer font-medium">{faq.question}</summary>
                    <p className="mt-2 text-gray-700">{faq.answer}</p>
                  </details>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No FAQs available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsById;

