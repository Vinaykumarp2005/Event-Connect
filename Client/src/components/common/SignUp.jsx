// import React, { useState } from 'react'
// import { useForm } from 'react-hook-form'

// export default function SignUp() {
//   const { register, handleSubmit ,formState:{errors}} = useForm();
//   const [role, setRole] = useState('student'); // Default role

//   function handleFormSubmit(data) {
//     console.log({ role, ...data });
//   }
//   console.log("errors object",errors)

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-3 m-3 rounded-2xl shadow-lg w-full max-w-lg">
//         <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Sign Up</h1>

//         {/* Role Selection */}
//         <div className="flex justify-center mb-6">
//           <button
//             type="button"
//             onClick={() => setRole('student')}
//             className={`px-4 py-2 rounded-l-full border ${role === 'student' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//           >
//             Student
//           </button>
//           <button
//             type="button"
//             onClick={() => setRole('organizer')}
//             className={`px-4 py-2 rounded-r-full border ${role === 'organizer' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//           >
//             Organizer
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit(handleFormSubmit)}>

//           <div className="mb-3">
//             <label className="block mb-1">Username</label>
//             <input type="text" {...register('username',{required:true,minLength:3,maxLength:30})} className="w-full px-4 py-2 border rounded-md" />
//             {errors.username?.type==='required' && <p className='text-red-600' >Username is required</p> }
//             {errors.username?.type==='minLength' && <p className='text-red-600' >MinLength is 3</p> }
//             {errors.username?.type==='maxLength' && <p className='text-red-600' >MaxLength is 30</p> }
//           </div>

//           <div className="mb-3">
//             <label className="block mb-1">Email</label>
//             <input type="email" {...register('email',{required:true})} className="w-full px-4 py-2 border rounded-md" />
//             {errors.email?.type==='required' && <p className='text-red-600' >Email is required</p> }
      
      
//           </div>

//           <div className="mb-3">
//             <label className="block mb-1">Phone Number</label>
//             <input type="number" {...register('phoneNumber',{required:true,minLength:10,maxLength:10})} className="w-full px-4 py-2 border rounded-md" />
//       {errors.phoneNumber?.type==='required' && <p className='text-red-600' >Phone Number is required</p> }
//        {errors.username?.type==='minLength' && <p className='text-red-600' >MinLength is 10</p> }
//             {errors.username?.type==='maxLength' && <p className='text-red-600' >MaxLength is 10</p> }
        
//           </div>

//           <div className="mb-3">
//             <label className="block mb-1">Password</label>
//             <input type="password" {...register('password',{
//                     required: 'Password is required',
//                     pattern: {
//                       value: /^(?=.*[a-zA-Z])(?=.*[1-9]).*[^@]|[^@].*@/, // this is not perfect!
//                       message: "Password must include alphabets, digits (1-9), and '@'",
//                     },
//                     minLength: {
//                       value: 8,
//                       message: "Password must be at least 8 characters",
//                     },
//                   })} className="w-full px-4 py-2 border rounded-md" />
//               {errors.password && <p className='text-red-600' > *{errors.password.message}</p> }
//           </div>

//           <div className="mb-3">
//             <label className="block mb-1">College Name</label>
//            <select {...register('collegeName',{required:true})} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" id="collegeName">
//               <option value="vnrvjiet">VNRVJIET</option>
//               <option value="cbit">CBIT</option>
//               <option value="vasavi">VASAVI</option>
//               <option value="jntuh">JNTUH</option>
              
//               <option value="griet">GRIET</option>
//             </select>
//             {errors.collegeName?.type==='required' && <p className='text-warning' >College Name is required</p> }
//           </div>

//           <div className="mb-3">
//             <label className="block mb-1">Department</label>
//        <select {...register('department' ,{required:true})} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" id="department">
//               <option value="cse">CSE</option>
//               <option value="ece">ECE</option>
//               <option value="csm">CSM</option>
//               <option value="csd">CSD</option>
//               <option value="cys">CYS</option>
//               <option value="csbs">CSBS</option>
//               <option value="it">IT</option>            
//               <option value="aids">AIDS</option>
//               <option value="mech">ME</option>
//             </select>
//          {errors.department?.type==='required' && <p className='text-warning' >Department is required</p> }
          
       
//           </div>

//           {/* Student-Specific Field */}
//           {role === 'student' && (
//             <div className="mb-3">
//               <label className="block mb-1">Year of Studying</label>
//              <select {...register('year' ,{required:true})} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" id="year">
//               <option value="1">1</option>
//               <option value="2">2</option>
//               <option value="3">3</option>
//               <option value="4">4</option>
              
//             </select>
       
            
//              {errors.year?.type==='required' && <p className='text-warning' >Year is required</p> }
        
//             </div>
//           )}

//           {/* Organizer-Specific Fields */}
//           {role === 'organizer' && (
//             <>
//               <div className="mb-3">
//                 <label className="block mb-1">Position</label>
//             <select {...register('position')} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" id="collegeName">
//               <option value="lead">Lead</option>
//               <option value="chairPerson">Chair Person</option>
//               <option value="secretary">Secreatry</option>
//               <option value="president">President</option>
//               <option value="cordinator">Coordinator</option>
//               <option value="vlounteer">Volunteer</option>
              
//             </select>
           


//               </div>

//               <div className="mb-3">
//                 <label className="block mb-1">Club Name</label>
//                 <input type="text" {...register('clubName',{required:true})} className="w-full px-4 py-2 border rounded-md" />
//               {errors.clubName?.type==='required' && <p className='text-red-600' >* Club Name is required</p> }
         
//               </div>


//               <div className="mb-3">
//                 <label className="block mb-1">Upload Logo</label>
//                 <input
//                   type="file"
//                   {...register('logo',{required:true})}
//                   accept="image/*"
//                   className="w-full px-4 py-2 border rounded-md"
//                 />
//                  {errors.logo?.type==='required' && <p className='text-red-600' >*Logo is required</p> }
        
//               </div>
//             </>
//           )}

//           {/* Hidden role input */}
//           <input type="hidden" {...register('role')} value={role} />

//           <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [role, setRole] = useState("student");

  function handleFormSubmit(data) {
    console.log({ role, ...data });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome to Event-Connect</h1>
        {/* <p className="text-gray-400 mb-6">Login to Event if you can because we don&apos;t have a login flow yet</p> */}

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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

          <div>
            <label className="block mb-1">Username</label>
            <input
              type="text"
              {...register("username", { required: true, minLength: 3, maxLength: 30 })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none"
            />
            {errors.username && <p className="text-red-500 text-sm">Username is required (3-30 chars)</p>}
          </div>

          <div>
            <label className="block mb-1">Email Address</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*[1-9]).*[^@]|[^@].*@/,
                  message: "Password must include alphabets, digits, and '@'",
                },
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {role === "student" && (
            <div>
              <label className="block mb-1">Year of Study</label>
              <input
                type="number"
                {...register("year", { required: true })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none"
              />
              {errors.year && <p className="text-red-500 text-sm">Year is required</p>}
            </div>
          )}

          {role === "organizer" && (
            <>
              <div>
                <label className="block mb-1">Position</label>
                <input
                  type="text"
                  {...register("position", { required: true })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none"
                />
                {errors.position && <p className="text-red-500 text-sm">Position is required</p>}
              </div>

              <div>
                <label className="block mb-1">Club Name</label>
                <input
                  type="text"
                  {...register("clubName", { required: true })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none"
                />
                {errors.clubName && <p className="text-red-500 text-sm">Club Name is required</p>}
              </div>
            </>
          )}

          <input type="hidden" {...register("role")} value={role} />

          <button type="submit" className="w-full bg-white text-black py-2 px-4 rounded-md hover:bg-gray-200 transition-all">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
