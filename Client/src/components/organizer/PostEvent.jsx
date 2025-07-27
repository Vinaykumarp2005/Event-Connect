
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import React, { useState,useEffect } from 'react';
// import { userAtom } from '../UserAtom';
// import { useRecoilValue } from 'recoil';
// import Confetti from 'react-confetti';
// import { useWindowSize } from 'react-use';
// function PostEvent() {
//   const { register, handleSubmit,reset, formState: { errors } } = useForm();
//   const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
//    const {width,height}=useWindowSize()
//   const user=useRecoilValue(userAtom);
//   const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
//   const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));
//   const handleFaqChange = (index, field, value) => {
//     const updatedFaqs = [...faqs];
//     updatedFaqs[index][field] = value;
//     setFaqs(updatedFaqs);
//   };
//    const [posted,setposted]=useState(false);
//   async function handleFormSubmit(data) {
//     console.log('Form submitted:', data);
//     console.log('FAQs:', faqs);

//     const formData = new FormData();

//     formData.append('eventName', data.eventName);
//     formData.append('description', data.description);
//     formData.append('maxLimit', data.maxLimit);
//     formData.append('enrolled', 0);
//     formData.append('category', data.category);
//     formData.append('startDate', data.startDate);
//     formData.append('endDate', data.endDate);
//     formData.append('sampleCertificate', data.sampleCertificate[0]);
//     formData.append('registrationFee', data.registrationFee);
//     formData.append('venue', data.venue);
//     formData.append('keyTakeAways', data.keyTakeAways);
//     formData.append('isApproved', false);
//     formData.append('rewardPoints', data.rewardPoints);
//     formData.append('registrationForm', data.registrationForm);
//     formData.append('registrationEndDate', data.registrationEndDate);
//     formData.append('endTime', data.endTime);
//     formData.append('eventImage', data.eventImage[0]);
//     formData.append('faqs', JSON.stringify(faqs));
//     formData.append('venueAddress',data.venueAddress);
    
//     try {
//       const res = await axios.post('http://localhost:3000/event/app/v1/create', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' ,'Authorization':localStorage.getItem("token")},
//       });
//       if (res.status === 200) {
//        // alert(res.data.message);
//          setposted(true);
//          reset(); // ← clears the form
//   setFaqs([{ question: '', answer: '' }]); // reset 
//       } else {
//         alert('Invalid Data');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Something went wrong');
//     }
//   }
// useEffect(() => {
//   if (posted) {
//     const timeout = setTimeout(() => setposted(false), 4000);
//     return () => clearTimeout(timeout);
//   }
// }, [posted]);

//   return (
//     <div className="p-6 w-full">
//       <h1 className="text-xl mb-4">Create Event</h1>
//    {posted && (
//   <div className="fixed inset-0 z-50 pointer-events-none">
//     <Confetti width={width} height={height} gravity={0.3} tweenDuration={3000} />
//   </div>
// )}

//       <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-full">

//         <div>
//           <label>Event Name:</label>
//           <input type="text" {...register('eventName', { required: true, minLength: 3, maxLength: 30 })} className="w-full border px-3 py-2 rounded" />
//           {errors.eventName && <p className="text-red-600">* Event Name is required (3-30 characters)</p>}
//         </div>

//         <div>
//           <label>Description:</label>
//           <textarea placeholder="Describe your event" {...register('description', { required: true })} className="w-full border px-3 py-2 rounded" rows="4"></textarea>
//           {errors.description && <p className="text-red-600">* Description is required</p>}
//         </div>

//         <div>
//           <label>Max Limit:</label>
//           <input type="number" {...register('maxLimit', { required: true })} className="w-full border px-3 py-2 rounded" />
//           {errors.maxLimit && <p className="text-red-600">* Max Limit is required</p>}
//         </div>

//         <div>
//           <label>Category:</label>
//           <select {...register('category', { required: true })} className="w-full border px-3 py-2 rounded">
//             <option value="">-- Select --</option>
//             <option value="hackathon">Hackathon</option>
//             <option value="codingcontest">Coding Contest</option>
//             <option value="workshop">Workshop</option>
//             <option value="seminar">Seminar</option>
//             <option value="bootcamp">Bootcamp</option>
//           </select>
//           {errors.category && <p className="text-red-600">* Category is required</p>}
//         </div>

//         <div>
//           <label>Start Date:</label>
//           <input type="date" {...register('startDate', { required: true })} className="w-full border px-3 py-2 rounded" />
//           {errors.startDate && <p className="text-red-600">* Start Date is required</p>}
//         </div>

//         <div>
//           <label>End Date:</label>
//           <input type="date" {...register('endDate', { required: true })} className="w-full border px-3 py-2 rounded" />
//           {errors.endDate && <p className="text-red-600">* End Date is required</p>}
//         </div>

//         <div>
//           <label>Event Image:</label>
//           <input type="file" {...register('eventImage')} className="w-full" accept=".pdf,.jpg,.jpeg,.png" />
//        </div>

//         <div>
//           <label>Sample Certificate:</label>
//           <input type="file" {...register('sampleCertificate')} className="w-full" accept=".pdf,.jpg,.jpeg,.png"  />
          
//          </div>

//         <div>
//           <label>Venue:</label>
//           <input type="text" {...register('venue', { required: true })} className="w-full border px-3 py-2 rounded" />
//           {errors.venue && <p className="text-red-600">* Venue is required</p>}
//         </div>
//         <div>
//           <label>Venue Address (Link) :</label>
//           <input type="text" {...register('venueAddress', { required: true })} className="w-full border px-3 py-2 rounded" placeholder='paste google maps address of your college'/>
//           {errors.venueAddress && <p className="text-red-600">* Venue Address is required</p>}
//         </div>

//         <div>
//           <label>Registration Fee:</label>
//           <input type="number" {...register('registrationFee', { required: true })} className="w-full border px-3 py-2 rounded" />
//           {errors.registrationFee && <p className="text-red-600">* Registration Fee is required</p>}
//         </div>

//         <div>
//           <label>Key Takeaways:</label>
//           <textarea placeholder="Describe Key takeways" {...register('keyTakeAways', { required: true })} className="w-full border px-3 py-2 rounded" rows="10"></textarea>
//           {errors.keyTakeAways && <p className="text-red-600">* Key Takeaways is required</p>}
//         </div>

//         <div>
//           <label>Reward Points:</label>
//           <input type="number" {...register('rewardPoints', { required: true })} className="w-full border px-3 py-2 rounded" />
//           {errors.rewardPoints && <p className="text-red-600">* Reward Points is required</p>}
//         </div>

//         <div>
//           <label>Registration Form (Link):</label>
//           <input type="text" {...register('registrationForm', { required: true })} className="w-full border px-3 py-2 rounded" />
//           {errors.registrationForm && <p className="text-red-600">* Registration Form link is required</p>}
//         </div>

//         <div>
//           <label>Registration End Date:</label>
//           <input type="date" {...register('registrationEndDate', { required: true })} className="w-full border px-3 py-2 rounded" />
//           {errors.registrationEndDate && <p className="text-red-600">* Registration End Date is required</p>}
//         </div>

//         <div>
//           <label>End Time:</label>
//           <input type="time" {...register('endTime', { required: true })} className="w-full border px-3 py-2 rounded" />
//           {errors.endTime && <p className="text-red-600">* End Time is required</p>}
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold">FAQs</h3>
//           {faqs.map((faq, index) => (
//             <div key={index} className="flex flex-col md:flex-col gap-4 items-center">
//               <input type="text" placeholder="Question" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} className="w-full border px-3 py-2 rounded" />
//               <input type="text" placeholder="Answer" value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} className="w-full border px-3 py-2 rounded" />
//               <button type="button" onClick={() => removeFaq(index)} className="text-red-500 font-semibold">Remove</button>
//             </div>
//           ))}
//           <button type="button" onClick={addFaq} className="text-white font-medium bg-black rounded-lg p-2 mt-1">+ Add FAQ</button>
//         </div>

//         <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded w-full">Create Event</button>

//       </form>
//     </div>
//   );
// }

// export default PostEvent;

import { useForm } from 'react-hook-form';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { userAtom } from '../UserAtom';
import { useRecoilValue } from 'recoil';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

function PostEvent() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const { width, height } = useWindowSize();
  const user = useRecoilValue(userAtom);
  const [posted, setPosted] = useState(false);

  const CLOUDINARY_UPLOAD_PRESET = 'Event-Connect';
  const CLOUDINARY_CLOUD_NAME = 'dmioqln7q';

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, formData);
    return res.data.secure_url;
  };

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  async function handleFormSubmit(data) {
    try {
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

      const res = await axios.post('http://localhost:3000/event/app/v1/create', payload, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if (res.status === 200) {
        setPosted(true);
        reset();
        setFaqs([{ question: '', answer: '' }]);
      } else {
        alert('Invalid Data');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  }

  useEffect(() => {
    if (posted) {
      const timeout = setTimeout(() => setPosted(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [posted]);

  return (
    <div className="p-6 w-full">
      <h1 className="text-xl mb-4">Create Event</h1>
      {posted && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={width} height={height} gravity={0.3} tweenDuration={3000} />
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-full">
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
          <input type="file" {...register('eventImage')} className="w-full" accept=".jpg,.jpeg,.png" />
        </div>

        <div>
          <label>Sample Certificate:</label>
          <input type="file" {...register('sampleCertificate')} className="w-full" accept=".jpg,.jpeg,.png" />
        </div>

        <div>
          <label>Venue:</label>
          <input type="text" {...register('venue', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.venue && <p className="text-red-600">* Venue is required</p>}
        </div>

        <div>
          <label>Venue Address (Link):</label>
          <input type="text" {...register('venueAddress', { required: true })} className="w-full border px-3 py-2 rounded" placeholder='Paste Google Maps link' />
          {errors.venueAddress && <p className="text-red-600">* Venue Address is required</p>}
        </div>

        <div>
          <label>Registration Fee:</label>
          <input type="number" {...register('registrationFee', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.registrationFee && <p className="text-red-600">* Registration Fee is required</p>}
        </div>

        <div>
          <label>Key Takeaways:</label>
          <textarea placeholder="Describe Key Takeaways" {...register('keyTakeAways', { required: true })} className="w-full border px-3 py-2 rounded" rows="5"></textarea>
          {errors.keyTakeAways && <p className="text-red-600">* Key Takeaways are required</p>}
        </div>

        <div>
          <label>Reward Points:</label>
          <input type="number" {...register('rewardPoints', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.rewardPoints && <p className="text-red-600">* Reward Points are required</p>}
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

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded w-full">Create Event</button>
      </form>
    </div>
  );
}

export default PostEvent;

