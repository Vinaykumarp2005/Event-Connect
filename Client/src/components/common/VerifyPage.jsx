import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
function VerifyPage() {
  const navigate=useNavigate();
  const param=useParams();
  useEffect(()=>{
    console.log(param);
    async function verifyUser(){
try{      
   if(param.role==='student'){
    const res=await axios.get(`http://localhost:3000/auth/student/${param.id}/verifyStudent/${param.token}`);
    if(res.status===200){
      alert(res.data.message);
              setTimeout(() => navigate('/signin'), 2000); // Auto-redirect after 2s

    }else{
      alert('invalid url')
    }
  }else if(param.role==='organizer'){
    const res=await axios.get(`http://localhost:3000/auth/organizer/${param.id}/verifyOrganizer/${param.token}`);
    if(res.status===200){
      alert(res.data.message);
              setTimeout(() => navigate('/signin'), 2000); // Auto-redirect after 2s
    }else{
      alert('invalid url')
    }
  }
    }catch(error){
      console.error('Verification failed:', error);
        alert('Invalid or expired verification link.');
    }}
    verifyUser()
  },[param,navigate])
  
  return (
    <div>
Veifying....
    </div>
  )
}

export default VerifyPage