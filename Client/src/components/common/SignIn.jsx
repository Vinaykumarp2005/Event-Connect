import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {useNavigate}from 'react-router-dom'
import axios from 'axios'
import { userAtom } from '../UserAtom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
export default function SignIn() {
  const navigate=useNavigate();
  const setUser=useSetRecoilState(userAtom);

  const { register, handleSubmit ,formState:{errors}} = useForm();

  async function handleFormSubmit(data) {
    if(data.role==='student'){
       const res = await axios.post(
      'http://localhost:3000/auth/student/signin',
            data
           );
       if(res.status===200){
       // console.log(res)
            const payload={
              username:res.data.payload.username,
              role:res.data.payload.role,
              _id:res.data.payload._id,
              email:res.data.payload.email
            }
            setUser(payload);
            localStorage.setItem('token',res.data.token);
        navigate(`/student-profile/${res.data.payload.username}`)
       }else{
        alert("Invalid data");
       }
    }else if(data.role==='admin'){
           const res=await axios.post('http://localhost:3000/admin/signin',data);
           if(res.status===200){
            const payload={
              username:res.data.payload.username,
              role:res.data.payload.role,
              _id:res.data.payload._id,
              email:res.data.payload.email
            }
            setUser(payload);
            localStorage.setItem('token',res.data.token);
            //alert('signin signed i
            // n');
              navigate(`/admin-profile/${res.data.payload.username}`)
           }else{
            alert('invalid data')
           }
    }else{
      const res=await axios.post('http://localhost:3000/auth/organizer/signin',data);
            const payload={
              username:res.data.payload.username,
              role:res.data.payload.role,
              _id:res.data.payload._id,
              email:res.data.payload.email
            }
            setUser(payload);
           if(res.status===200){
            localStorage.setItem('token',res.data.token);
            navigate(`/organizer-profile/${res.data.payload.username}`)
            }else{
            alert('invalid data')
           }

    }
  }
  console.log("errors object",errors)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-3 m-3 rounded-2xl shadow-lg w-full max-w-lg">
        

        
        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>


          <div className="mb-3">
            <label className="block mb-1">Email</label>
            <input type="email" {...register('email',{required:true})} className="w-full px-4 py-2 border rounded-md" />
            {errors.email?.type==='required' && <p className='text-red-600' >*Email is required</p> }
      
      
          </div>


          <div className="mb-3">
            <label className="block mb-1">Password</label>
            <input type="password" {...register('password',{
                    required: 'Password is required',
                   pattern: {
  value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*@).{8,}$/,
  message: "Password must include letters, digits, and '@'",
}
,
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })} className="w-full px-4 py-2 border rounded-md" />
              {errors.password && <p className='text-red-600' > *{errors.password.message}</p> }
          </div>

          <div className="mb-3">
            <label className="block mb-1">Select Role</label>
           <select {...register('role',{required:true})} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" id="role">
              <option value="student">student</option>
              <option value="organizer">organizer</option>
              <option value="admin">admin</option>
            </select>
            {errors.role?.type==='required' && <p className='text-warning' >*role is required</p> }
          </div>



          {/* Hidden role input */}

          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            SignIn
          </button>
        </form>
      </div>
    </div>
  )
}
