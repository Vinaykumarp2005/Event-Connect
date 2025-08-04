import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

function StudentDashBoard() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      username: '',
      phoneNumber: '',
      department: '',
      year: ''
    }
  });

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await axios.get('http://localhost:3000/student/getdetails', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (res.status === 200) {
          const profile = res.data.payload;
          setStudentProfile(profile);

          setValue('username', profile.username || '');
          setValue('phoneNumber', profile.phoneNumber || '');
          setValue('department', String(profile.department || ''));
          setValue('year', String(profile.year || ''));
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
          Authorization: localStorage.getItem('token'),
        },
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

  if (!studentProfile)
    return <div className="text-center py-10 text-gray-300 bg-black h-screen">Loading...</div>;

  return (
    <div className="bg-black min-h-screen px-4 py-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">{studentProfile.username}'s Dashboard</h1>

        {!isEditing ? (
          <div className="bg-white text-black rounded-lg shadow-lg p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Profile Overview</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><b>Username:</b> {studentProfile.username}</p>
              <p><b>Email:</b> {studentProfile.email}</p>
              <p><b>Phone:</b> {studentProfile.phoneNumber}</p>
              <p><b>College:</b> {studentProfile.collegeName}</p>
              <p><b>Department:</b> {studentProfile.department}</p>
              <p><b>Year:</b> {studentProfile.year}</p>
              <p><b>Rewards:</b> {studentProfile.rewardsEarned}</p>
              <p><b>Events Enrolled:</b> {studentProfile.eventsEnrolled?.length || 0}</p>
              <p><b>Verified:</b> {studentProfile.verified ? "Yes" : "No"}</p>
              <p><b>Role:</b> {studentProfile.role}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white text-black rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Edit Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit(updateProfile)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Username</label>
                <input
                  {...register('username')}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <input
                  type="number"
                  {...register('phoneNumber')}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Department</label>
                <select
                  {...register('department')}
                  className="w-full border border-gray-300 px-3 py-2 rounded bg-white"
                >
                  <option value="">Select Department</option>
                  <option value="cse">CSE</option>
                  <option value="ece">ECE</option>
                  <option value="it">IT</option>
                  <option value="csd">CSD</option>
                  <option value="csm">CSM</option>
                  <option value="cys">CYS</option>
                  <option value="csbs">CSBS</option>
                  <option value="aids">AIDS</option>
                  <option value="mech">ME</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Year</label>
                <select
                  {...register('year')}
                  className="w-full border border-gray-300 px-3 py-2 rounded bg-white"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashBoard;
