import React, { useState,useEffect} from 'react'
import { useForm } from 'react-hook-form'
import {useNavigate}from 'react-router-dom'
import axios from 'axios'
export default function SignUp() {
  const navigate=useNavigate();
const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [role, setRole] = useState('student'); // Default role



const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, formData);
    return res.data.secure_url;
  };



  async function handleFormSubmit(data) {
    try{
    if(role==='student'){
       data.phoneNumber = Number(data.phoneNumber);
        data.year=Number(data.year);
        const res = await axios.post(
      'http://localhost:3000/auth/student/signUp',
            data
           );
     
       if(res.status===200){
        alert(res.data.message)
       }else{
        alert("Invalid data");
       }
    }else{

const logourl = data.logo?.[0]
        ? await uploadToCloudinary(data.logo[0])
        : '';
console.log(logourl);
      console.log(data.role);
      console.log(data)
      data.phoneNumber = Number(data.phoneNumber);
const payload={
  username:data.username,
  email:data.email,
  phoneNumber:data.phoneNumber,
  password:data.password,
  collegeName:data.collegeName,
  department:data.department,
  position:data.position,
  clubName:data.clubName,
  role:data.role,
  logo:logourl

}
    const res = await axios.post(
      'http://localhost:3000/auth/organizer/signUp',
      payload
      
    );
    

       if(res.status===200){
        alert(res.data.message)
       }else{
        alert("Invalid data");
       }
      }
    }catch(err){
      console.error(err);
      alert('Something went wrong');
    }
    
  }

  // console.log("errors object",errors)
useEffect(() => {
  setValue('role', role);
}, [role, setValue]);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-3 m-3 rounded-2xl shadow-lg w-full max-w-lg">
        

        
        <div className="flex justify-center mb-6">
          <div className="flex rounded-full bg-gray-800 p-1">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${role === "student" ? "bg-white text-black" : "text-gray-400"}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("organizer")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${role === "organizer" ? "bg-white text-black" : "text-gray-400"}`}
            >
              Organizer
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>

          <div className="mb-3">
            <label className="block mb-1">Username</label>
            <input type="text" {...register('username',{required:true,minLength:3,maxLength:30})} className="w-full px-4 py-2 border rounded-md" />
            {errors.username?.type==='required' && <p className='text-red-600' >*Username is required</p> }
            {errors.username?.type==='minLength' && <p className='text-red-600' >*MinLength is 3</p> }
            {errors.username?.type==='maxLength' && <p className='text-red-600' >*MaxLength is 30</p> }
          </div>

          <div className="mb-3">
            <label className="block mb-1">Email</label>
            <input type="email" {...register('email',{required:true})} className="w-full px-4 py-2 border rounded-md" />
            {errors.email?.type==='required' && <p className='text-red-600' >*Email is required</p> }
      
      
          </div>

          <div className="mb-3">
            <label className="block mb-1">Phone Number</label>
            <input
  type="text"
  {...register('phoneNumber', {
    required: true,
    minLength: 10,
    maxLength: 10,
    pattern: {
      value: /^[0-9]+$/,
      message: "Phone number must contain only digits"
    }
  })}
  className="w-full px-4 py-2 border rounded-md"
/>
{errors.phoneNumber?.type === 'required' && <p className='text-red-600'>*Phone Number is required</p>}
{errors.phoneNumber?.type === 'minLength' && <p className='text-red-600'>MinLength is 10</p>}
{errors.phoneNumber?.type === 'maxLength' && <p className='text-red-600'>MaxLength is 10</p>}
{errors.phoneNumber?.type === 'pattern' && <p className='text-red-600'>{errors.phoneNumber.message}</p>}

        
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
            <label className="block mb-1">College Name</label>
           <select {...register('collegeName',{required:true})} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" id="collegeName">
              <option value="vnrvjiet">VNRVJIET</option>
              <option value="cbit">CBIT</option>
              <option value="vasavi">VASAVI</option>
              <option value="jntuh">JNTUH</option>
              
              <option value="griet">GRIET</option>
            </select>
            {errors.collegeName?.type==='required' && <p className='text-warning' >College Name is required</p> }
          </div>

          <div className="mb-3">
            <label className="block mb-1">Department</label>
       <select {...register('department' ,{required:true})} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" id="department">
              <option value="cse">CSE</option>
              <option value="ece">ECE</option>
              <option value="csm">CSM</option>
              <option value="csd">CSD</option>
              <option value="cys">CYS</option>
              <option value="csbs">CSBS</option>
              <option value="it">IT</option>            
              <option value="aids">AIDS</option>
              <option value="mech">ME</option>
            </select>
         {errors.department?.type==='required' && <p className='text-warning' >Department is required</p> }
          
       
          </div>

          {/* Student-Specific Field */}
          {role === 'student' && (
            <div className="mb-3">
              <label className="block mb-1">Year of Studying</label>
             <select {...register('year' ,{required:true})} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" id="year">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              
            </select>
       
            
             {errors.year?.type==='required' && <p className='text-warning' >Year is required</p> }
        
            </div>
          )}

          {/* Organizer-Specific Fields */}
          {role === 'organizer' && (
            <>
              <div className="mb-3">
                <label className="block mb-1">Position</label>
            <select {...register('position')} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" id="collegeName">
              <option value="lead">Lead</option>
              <option value="chairPerson">Chair Person</option>
              <option value="secretary">Secreatry</option>
              <option value="president">President</option>
              <option value="cordinator">Coordinator</option>
              <option value="vlounteer">Volunteer</option>
              
            </select>
           


              </div>

              <div className="mb-3">
                <label className="block mb-1">Club Name</label>
                <input type="text" {...register('clubName',{required:true})} className="w-full px-4 py-2 border rounded-md" />
              {errors.clubName?.type==='required' && <p className='text-red-600' >* Club Name is required</p> }
         
              </div>


              <div className="mb-3">
                <label className="block mb-1">Upload Logo</label>
                <input
                  type="file"
                  {...register('logo',{required:true})}
                  accept="image/*"
                  className="w-full px-4 py-2 border rounded-md"
                />
                 {errors.logo?.type==='required' && <p className='text-red-600' >*Logo is required</p> }
        
              </div>
            </>
          )}

          {/* Hidden role input */}
          <input type="hidden" {...register('role')} value={role} />

          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            SignUp
          </button>
        </form>
      </div>
    </div>
  )
}