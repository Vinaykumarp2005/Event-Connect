import React, { useState } from 'react';
import axios from 'axios';

export default function PostEvent() {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    maxLimit: '',
    enrolled: '',
    category: '',
    startDate: '',
    endDate: '',
    registrationFee: '',
    venue: '',
    venueAddress: '',
    keyTakeAways: '',
    rewardPoints: '',
    registrationForm: '',
    registrationEndDate: '',
    endTime: '',
    faqs: [],
  });

  const [eventImage, setEventImage] = useState(null);
  const [sampleCertificate, setSampleCertificate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][field] = value;
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };

  const removeFaq = (index) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs.splice(index, 1);
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, key === 'faqs' ? JSON.stringify(value) : value);
    });

    if (eventImage) data.append('eventImage', eventImage);
    if (sampleCertificate) data.append('sampleCertificate', sampleCertificate);

    try {
      const res = await axios.post('http://localhost:5000/app/v1/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer YOUR_TOKEN_HERE'
        },
      });
      alert('Event created!');
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-xl space-y-6">
      <div>
        <label className="font-semibold">Event Name</label>
        <input type="text" name="eventName" required onChange={handleChange}
          className="w-full border px-3 py-2 mt-1 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
      </div>

      <div>
        <label className="font-semibold">Description</label>
        <textarea name="description" required onChange={handleChange}
          className="w-full border px-3 py-2 mt-1 rounded-md focus:outline-none focus:ring focus:ring-blue-300"></textarea>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <input type="number" name="maxLimit" placeholder="Max Limit" required onChange={handleChange}
          className="border px-3 py-2 rounded-md" />
        <input type="number" name="enrolled" placeholder="Enrolled" required onChange={handleChange}
          className="border px-3 py-2 rounded-md" />
        <select name="category" required value={formData.category} onChange={handleChange}
          className="border px-3 py-2 rounded-md">
          <option value="">Select category</option>
          <option value="technical">Technical</option>
          <option value="coding">Coding</option>
          <option value="softskills">Soft Skills</option>
        </select>
      </div>

      <div>
        <label className="font-semibold text-lg">FAQs</label>
        {formData.faqs.map((faq, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <input type="text" placeholder="Question" value={faq.question}
              onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
              className="border px-3 py-2 rounded-md" />
            <input type="text" placeholder="Answer" value={faq.answer}
              onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
              className="border px-3 py-2 rounded-md" />
            <button type="button" onClick={() => removeFaq(index)} className="text-red-500 font-semibold">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addFaq}
          className="mt-2 text-blue-600 font-medium hover:underline">+ Add FAQ</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <input type="date" name="startDate" required onChange={handleChange} className="border px-3 py-2 rounded-md" />
        <input type="date" name="endDate" required onChange={handleChange} className="border px-3 py-2 rounded-md" />
        <input type="number" name="registrationFee" placeholder="Registration Fee" required onChange={handleChange} className="border px-3 py-2 rounded-md" />
        <input name="venue" placeholder="Venue Name" required onChange={handleChange} className="border px-3 py-2 rounded-md" />
        <input name="venueAddress" placeholder="Google Maps Address" required onChange={handleChange} className="border px-3 py-2 rounded-md" />
        <input name="keyTakeAways" placeholder="Key Takeaways" required onChange={handleChange} className="border px-3 py-2 rounded-md" />
        <input name="rewardPoints" placeholder="Reward Points" required type="number" onChange={handleChange} className="border px-3 py-2 rounded-md" />
        <input name="registrationForm" placeholder="Form URL" required onChange={handleChange} className="border px-3 py-2 rounded-md" />
        <input name="registrationEndDate" type="date" required onChange={handleChange} className="border px-3 py-2 rounded-md" />
        <input name="endTime" type="time" required onChange={handleChange} className="border px-3 py-2 rounded-md" />
      </div>

      {formData.venue && (
        <iframe
          title="Map"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.venue)}&output=embed`}
          width="100%"
          height="300"
          className="rounded border"
          loading="lazy"
        ></iframe>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold">Event Image</label>
          <input type="file" accept="image/*" onChange={(e) => setEventImage(e.target.files[0])} className="block mt-1" />
        </div>
        <div>
          <label className="font-semibold">Sample Certificate (PDF)</label>
          <input type="file" accept="application/pdf" onChange={(e) => setSampleCertificate(e.target.files[0])} className="block mt-1" />
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all">
        Create Event
      </button>
    </form>
  );
}



