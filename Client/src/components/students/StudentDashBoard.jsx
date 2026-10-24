import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'motion/react';
import { IconAperture, IconCircleCheck, IconPencil, IconTrophy } from '@tabler/icons-react';
import { Page, Spinner, listVariants } from '../ui/Page';
import { Avatar, InfoRow, StatTile } from '../ui/Stat';

function StudentDashBoard() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await axios.get('http://localhost:4000/student/getdetails', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        if (res.status === 200) {
          const profile = res.data.payload;
          setStudentProfile(profile);

          // Initialize form fields with profile data
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

  const updateProfile = async (data) => {
    try {
      const res = await axios.put(
        'http://localhost:4000/student/update/profiledetails',
        data,
        {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        }
      );

      if (res.status === 200) {
        alert("Profile updated successfully!");
        setStudentProfile(res.data.payload);
        setIsEditing(false);

        // Reset form with updated data
        reset(res.data.payload);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong.");
    }
  };

  if (!studentProfile) {
    return <Spinner label="Loading your profile…" />;
  }

  return (
    <Page className="max-w-5xl">
      {/* Profile header */}
      <div className="glass-strong mb-5 flex flex-col gap-5 rounded-[28px] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar name={studentProfile.username} />
          <div className="min-w-0">
            <h1 className="text-gradient truncate text-2xl font-bold capitalize tracking-tight sm:text-3xl">
              {studentProfile.username}
            </h1>
            <p className="truncate text-sm text-neutral-400">{studentProfile.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="chip capitalize">{studentProfile.role}</span>
              {studentProfile.verified && <span className="chip"><IconCircleCheck size={12} /> Verified</span>}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? 'btn-ghost' : 'btn-primary'}
        >
          {isEditing ? 'Cancel' : <><IconPencil size={16} /> Edit Profile</>}
        </button>
      </div>

      {/* Stats */}
      <motion.div variants={listVariants} initial="hidden" animate="show" className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatTile label="Reward Points" value={studentProfile.rewardsEarned} icon={IconTrophy} />
        <StatTile label="Events Enrolled" value={studentProfile.eventsEnrolled.length} icon={IconAperture} />
      </motion.div>

      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-[28px] p-6 sm:p-8"
          >
            <h2 className="mb-5 text-lg font-semibold text-white">Profile Overview</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Username" value={studentProfile.username} />
              <InfoRow label="Email" value={studentProfile.email} />
              <InfoRow label="Phone Number" value={studentProfile.phoneNumber} />
              <InfoRow label="College" value={studentProfile.collegeName} />
              <InfoRow label="Department" value={studentProfile.department} />
              <InfoRow label="Year" value={studentProfile.year} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-[28px] p-6 sm:p-8"
          >
            <h2 className="mb-5 text-lg font-semibold text-white">Edit Profile</h2>
            <form onSubmit={handleSubmit(updateProfile)} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Username</label>
                <input
                  {...register('username')}
                  placeholder="Enter username"
                  className="field"
                />
              </div>

              <div>
                <label className="field-label">Phone Number</label>
                <input
                  type="number"
                  {...register('phoneNumber')}
                  placeholder="Enter phone number"
                  className="field"
                />
              </div>

              <div>
                <label className="field-label">Department</label>
                <input
                  {...register('department')}
                  placeholder="Enter department"
                  className="field"
                />
              </div>

              <div>
                <label className="field-label">Year</label>
                <input
                  type="number"
                  {...register('year')}
                  placeholder="Enter year"
                  className="field"
                />
              </div>

              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary w-full py-3">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}

export default StudentDashBoard;
