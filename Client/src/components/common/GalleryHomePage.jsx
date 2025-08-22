import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BsArrowUpRightCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../UserAtom';

function GalleryHomePage() {
  const [clubs,setClubs]=useState([]);
  const navigate=useNavigate();
  const user = useRecoilValue(userAtom);

  useEffect(()=>{
    async function getClubs(){
      try{
      const res=await axios.get('http://localhost:3000/organiser/get/organiserDetails',{
        headers:{
          Authorization:localStorage.getItem('token')
        }
      });
      if(res.status===200){
        setClubs(res.data.organiserDetails);
      }
    }catch(e){
      alert('unable to fetch the organizer details',e);
    }
    }
    getClubs()
  },[])
  
  function ClubEventsNavigate(clubId) {
    if (user?.email) {
      navigate(`/student-profile/${user.email}/club/${clubId}`);
    } else {
      alert("User not logged in");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className='text-white text-2xl font-semibold text-center mb-6 mt-4'>Clubs Gallery Page</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {clubs.map((club,idx)=>
          <div key={idx} className='h-64 w-full max-w-xs bg-gray-1000 rounded-md flex flex-col border-2 border-[rgba(8,112,184,0.7)] overflow-hidden'>
            <h1 className='text-white text-center font-bold mt-2 px-2 truncate'>{club.clubName}</h1>
            <img src='https://turinghut.org/static/9384c958bbd95db9f010ee70a3bdaee1/078c3/turinghut_logo.webp' 
                alt={club.clubName} 
                className='h-28 w-28 mx-auto mt-2 object-contain'/>
            <h2 className='text-white text-center text-sm px-2'><strong>Department:</strong> {club.department}</h2>
            <h2 className='text-white text-center text-sm px-2 truncate'><strong>College:</strong> {club.collegeName}</h2>
            <button 
              className='m-2 text-white rounded-md bg-black px-3 py-1.5 mx-auto flex items-center border-2 border-[rgba(8,112,184,0.7)] hover:bg-neutral-800 transition-colors' 
              onClick={()=>ClubEventsNavigate(club._id)}
            >
              View Events <BsArrowUpRightCircle className='ml-2' />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GalleryHomePage