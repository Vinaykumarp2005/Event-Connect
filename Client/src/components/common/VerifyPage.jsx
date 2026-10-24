import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'motion/react'
function VerifyPage() {
  const navigate=useNavigate();
  const param=useParams();
  useEffect(()=>{
    console.log(param);
    async function verifyUser(){
try{      
   if(param.role==='student'){
    const res=await axios.get(`http://localhost:4000/auth/student/${param.id}/verifyStudent/${param.token}`);
    if(res.status===200){
      alert(res.data.message);
              setTimeout(() => navigate('/signin'), 2000); // Auto-redirect after 2s

    }else{
      alert('invalid url')
    }
  }else if(param.role==='organizer'){
    const res=await axios.get(`http://localhost:4000/auth/organizer/${param.id}/verifyOrganizer/${param.token}`);
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
    <div className='flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-1 text-white'>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className='glass-strong flex w-full max-w-sm flex-col items-center rounded-[28px] px-8 py-12 text-center'
      >
        <span className='mb-6 h-12 w-12 animate-spin rounded-full border-2 border-white/15 border-t-white' />
        <h1 className='text-gradient text-2xl font-bold tracking-tight'>Verifying your email</h1>
        <p className='mt-2 text-sm text-neutral-400'>Hang tight, we'll take you to sign in once it's done.</p>
      </motion.div>
    </div>
  )
}

export default VerifyPage