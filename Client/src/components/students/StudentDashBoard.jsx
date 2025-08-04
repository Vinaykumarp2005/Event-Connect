import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

function StudentDashBoard() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await axios.get('http://localhost:3000/student/getdetails', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        if (res.status === 200) {
          const profile = res.data.payload;
          setStudentProfile(profile);

          setValue('username', profile.username);
          setValue('phoneNumber', profile.phoneNumber);
          setValue('department', profile.department);
          setValue('year', profile.year);
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    }
    getDetails();
  }, [setValue]);

  async function updateProfile(data) {
    try {
      const res = await axios.put('http://localhost:3000/student/update/profiledetails', data, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      if (res.status === 200) {
        alert("Profile updated successfully!");
        setStudentProfile(res.data.payload);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong.");
    }
  }

  if (!studentProfile) return <div className="text-center py-10 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center flex align-center justify-center gap-2">{studentProfile.username}  Dashboard</h1>

      {!isEditing ? (
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700">Profile Overview</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded transition"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
            <p><span className="font-medium">Username:</span> {studentProfile.username}</p>
            <p><span className="font-medium">Email:</span> {studentProfile.email}</p>
            <p><span className="font-medium">Phone Number:</span> {studentProfile.phoneNumber}</p>
            <p><span className="font-medium">College:</span> {studentProfile.collegeName}</p>
            <p><span className="font-medium">Department:</span> {studentProfile.department}</p>
            <p><span className="font-medium">Year:</span> {studentProfile.year}</p>
            <p><span className="font-medium">Rewards:</span> {studentProfile.rewardsEarned}</p>
            <p><span className="font-medium">Events Enrolled:</span> {studentProfile.eventsEnrolled.length}</p>
            <p><span className="font-medium">Verified:</span> {studentProfile.verified ? "Yes" : "No"}</p>
            <p><span className="font-medium">Role:</span> {studentProfile.role}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Edit Profile</h2>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded transition"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit(updateProfile)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                {...register('username')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="number"
                {...register('phoneNumber')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                {...register('department')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                {...register('year')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default StudentDashBoard;
