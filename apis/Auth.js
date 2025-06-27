const exp=require('express');
const authRouter=exp.Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const {Student}=require('../models/student.model')
const z=require('zod');
const upload=require("../middlewares/multer.middleware")

const uploadOnCloudinary =require("../utils/cloudinary")
const {Organizer}=require('../models/organizer.model');
const { error } = require('console');
const validStudentDataSignup=(req,res,next)=>{
  const {username,password,email,phoneNumber,collegeName,department,year,eventsEnrolled,rewardsEarned,role}=req.body;
  const userProfileSchema=z.object({
    username:z.string().min(3).max(30),
    password:z.string().min(8).refine((val) => {
  const hasAt = val.includes('@') && !val.startsWith('@');
  const digitCount = (val.match(/[1-9]/g) || []).length;
  const hasAlpha = /[a-zA-Z]/.test(val);

  return hasAt && digitCount >= 1 && hasAlpha;
}, {
  message: "Password must be at least 8 characters, include at least two digits (1-9), alphabets, and '@' (not at the start)",
}),
email:z.string().email(),
phoneNumber:z.number(),
collegeName:z.string(),
department:z.string(),
year:z.number(),
rewardsEarned:z.number(),
role:z.string()
  });
  const {success}=userProfileSchema.safeParse(req.body);
  if(!success){
    res.status(411).json({
      message:"Invalid data"
    })
    return;
  }
  next();

}
authRouter.post('/student/signUp',validStudentDataSignup,async(req,res)=>{
const {username,password,email,phoneNumber,collegeName,department,year,rewardsEarned,role}=req.body;
const hashedPassword=await bcrypt.hash(password,5);
const Data=await Student.create({
  username:username,
  password:hashedPassword,
  email:email,
  phoneNumber:phoneNumber,
  collegeName:collegeName,
  department:department,
  year:year,
  rewardsEarned:rewardsEarned,
  role:role
})
if(Data){
  res.status(200).json({
    message:"User Created successfully",
    payload:Data
  })
}else{
  res.status(404).json({
    message:"user not created"
  })
}
})
const validUserData=(req,res,next)=>{
  const {email,password,role}=req.body;
  const userSchema=z.object({
    password:z.string(),
    email:z.string().email(),
    role:z.string()
  })
   const {success}=userSchema.safeParse(req.body);
  if(!success){
    res.status(411).json({
      message:"Invalid data"
    })
    return;
  }
  next();

}
authRouter.post('/student/signin',validUserData,async(req,res)=>{
 const {email,password}=req.body;
 const StudentResponse=await Student.findOne({
  email:email
 })
 if(StudentResponse){
 const validPassword=await bcrypt.compare(password,StudentResponse.password);
 if(validPassword){
  const secret=process.env.JWT_SECRET;
  const token=jwt.sign({userId:StudentResponse._id},secret);
  if(token){
    res.status(200).json({
      message:"sign in successfully",
      token:token,
      payload:StudentResponse
    })
  }else{
    res.status(404).json({
      message:'backend crashed'
    })
  }
 }else{
    res.status(411).json({
      message:'Incorrect Password'
    })
 }
 }else{
    res.status(411).json({
      message:'Invalid Details',
    })
 }
})
const validOrganiserDataSignup=(req,res,next)=>{
const {username,clubName,password,email,phoneNumber,collegeName,department,position,role}=req.body;
  const userProfileSchema=z.object({
    username:z.string().min(3).max(30),
    password:z.string().min(8).refine((val) => {
  const hasAt = val.includes('@') && !val.startsWith('@');
  const digitCount = (val.match(/[1-9]/g) || []).length;
  const hasAlpha = /[a-zA-Z]/.test(val);

  return hasAt && digitCount >= 1 && hasAlpha;
}, {
  message: "Password must be at least 8 characters, include at least two digits (1-9), alphabets, and '@' (not at the start)",
}),
email:z.string().email(),
// phoneNumber:z.number(),
  phoneNumber: z.coerce.number(),
collegeName:z.string(),
department:z.string(),
clubName:z.string(),
position:z.string(),
role:z.string()

  });


 const parsedData = {
    username,
    clubName,
    password,
    email,
    phoneNumber,
    collegeName,
    department,
    position,
    role
  };

  const result = userProfileSchema.safeParse(parsedData);

  if (!result.success) {
    return res.status(411).json({ message: "invalid data", error: result.error.errors });
  }

  // Attach parsed data to req.body for downstream use
  req.body = result.data;


  // const {success}=userProfileSchema.safeParse(req.body);
  // if(!success){
  //   res.status(411).json({
  //     message:"invalid data"
  //   })
  //   return;
  // }
  next();

}

authRouter.post('/organiser/signUp',upload.fields([{name:"logo",maxCount:1}]),validOrganiserDataSignup,async(req,res)=>{
const {username,clubName,password,email,phoneNumber,collegeName,department,position,role}=req.body;
const hashedPassword=await bcrypt.hash(password,5);

const logoLocalPath=req.files?.logo[0]?.path
// console.log("req.body", req.body);
// console.log("req.files", req.files);

if(!logoLocalPath){
  res.status(400).json({
    message:"logo is mandatory required"
  })
}

 const logoPath= await uploadOnCloudinary(logoLocalPath)
// console.log(logoPath);
  if(!logoPath){
    res.status(400).json({
    message:"logo is required"
  })
  }


const Data=await Organizer.create({
  username:username,
  clubName:clubName,
  password:hashedPassword,
  email:email,
  phoneNumber:phoneNumber,
  collegeName:collegeName,
  department:department,
  position:position,
  role:role,logo:logoPath.url
})


if(Data){
  res.status(200).json({
    message:"User Created successfully",
    payload:Data
  })
}else{
  res.status(404).json({
    message:"user not created"
  })
}
})
authRouter.post('/organiser/signin',validUserData,async(req,res)=>{
 const {email,password}=req.body;
 const OrganizerResponse=await Organizer.findOne({
  email:email
 })
 if(OrganizerResponse){
 const validPassword=await bcrypt.compare(password,OrganizerResponse.password);
 if(validPassword){
  const secret=process.env.JWT_SECRET;
  const token=jwt.sign({userId:OrganizerResponse._id},secret);
  if(token){
    res.status(200).json({
      message:"sign in successfully",
      token:token,
      payload:OrganizerResponse
    })
  }else{
    res.status(404).json({
      message:'backend crashed'
    })
  }
 }else{
    res.status(411).json({
      message:'Incorrect Password'
    })
 }
 }else{
    res.status(411).json({
      message:'Invalid Details',
    })
 }
})
module.exports={
  authApp:authRouter
}
