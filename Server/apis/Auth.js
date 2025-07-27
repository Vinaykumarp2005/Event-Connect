const exp=require('express');
const authRouter=exp.Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const {Student}=require('../models/student.model')
const z=require('zod');
const {StudentToken}=require('../models/tokenStudent')
const {sendEmail}=require('../utils/sendUserEmail');
const crypto=require('crypto')
const {Organizer}=require('../models/organizer.model');
const {OrganizerToken}=require('../models/tokenOrganiser');
const {sendOrganiserEmail}=require('../utils/sendOrganiserEmail')
const User = require('./User');
const validStudentDataSignup=(req,res,next)=>{
  const {username,password,email,phoneNumber,collegeName,department,year,role}=req.body;
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
  console.log(req.body);
const {username,password,email,phoneNumber,collegeName,department,year,role}=req.body;
const hashedPassword=await bcrypt.hash(password,5);
const Data=await new Student({
  username:username,
  password:hashedPassword,
  email:email,
  phoneNumber:phoneNumber,
  collegeName:collegeName,
  department:department,
  year:year,
  role:role
}).save();
const token=await new StudentToken({
  userId:Data._id,
  token:crypto.randomBytes(32).toString("hex"),
}).save();
const url=`${process.env.BASE_URL}/verifyPage/${Data.role}/${Data._id}/${token.token}`;
await sendEmail(Data.email,"Verify Email",url);
if(Data){
  res.status(200).json({
    message:"An Email sent to your please verify email",
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
authRouter.get('/student/:id/verifyStudent/:token',async(req,res)=>{
  console.log("reached");
  try{
      const student=await Student.findOne({_id:req.params.id});
      if(!student){
        return res.status(400).json({
          message:"Invalid link"
        })
      }
      const token=await StudentToken.findOne({
        userId:student._id,
        token:req.params.token
      })
      if(!token){
        return res.status(400).send({
               message:"invalid link"
        })
      }
      await Student.updateOne(
  { _id: student._id },
  { verified: true }
)

      await token.deleteOne()
      res.status(200).send({
        message:'user verified successfully'
      })
  }catch(e){
      console.error("Verification error:", e);  // helpful for debugging
  res.status(500).json({ message: "Internal Server Error" });
  }
})
authRouter.post('/student/signin',validUserData,async(req,res)=>{
 const {email,password}=req.body;
 const StudentResponse=await Student.findOne({
  email:email
 })
 if(StudentResponse){
 const validPassword=await bcrypt.compare(password,StudentResponse.password);
 
 if(validPassword){
  if(!StudentResponse.verified){
  let emailtoken=await StudentToken.findOne({userId:StudentResponse._id});
  if(!emailtoken){
   const token=await new StudentToken({
  userId:StudentResponse._id,
  token:crypto.randomBytes(32).toString("hex"),
}).save();
const url=`${process.env.BASE_URL}/verifyPage/${StudentResponse.role}/${StudentResponse._id}/${token.token}`;
await sendEmail(StudentResponse.email,"Verify Email",url);

  }
  return res.status(400).send({
    messages:'An email sent to your account please'
  })
 }
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
const {username,clubName,password,email,phoneNumber,collegeName,department,position,role,logo}=req.body;
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
role:z.string(),
logo:z.string()

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
    role,logo
  };

  const result = userProfileSchema.safeParse(parsedData);

  if (!result.success) {
    return res.status(411).json({ message: "invalid data", error: result.error.errors });
  }

  // Attach parsed data to req.body for downstream use
  req.body = result.data;


  next();

}
authRouter.get('/organizer/:id/verifyOrganizer/:token',async(req,res)=>{
  console.log('reached')
  try{
      const organizer=await Organizer.findOne({_id:req.params.id});
      if(!organizer){
        return res.status(400).json({
          message:"Invalid link"
        })
      }
      const token=await OrganizerToken.findOne({
        userId:organizer._id,
        token:req.params.token
      })
      if(!token){
        return res.status(400).send({
               message:"invalid link"
        })
      }
      await Organizer.updateOne(
  { _id: organizer._id },
  { verified: true }
)

      await token.deleteOne()
      res.status(200).send({
        message:'user verified successfully'
      })
  }catch(e){
  console.error("Verification error:", e); 
  res.status(500).json({ message: "Internal Server Error" });
  }
})

authRouter.post('/organizer/signUp',validOrganiserDataSignup,async(req,res)=>{
const {username,clubName,password,email,phoneNumber,collegeName,department,position,role,logo}=req.body;
const hashedPassword=await bcrypt.hash(password,5);


const Data=await new Organizer({
  username:username,
  clubName:clubName,
  password:hashedPassword,
  email:email,
  phoneNumber:phoneNumber,
  collegeName:collegeName,
  department:department,
  position:position,
  role:role,
  logo:logo
}).save();
const token=await new OrganizerToken({
  userId:Data._id,
  token:crypto.randomBytes(32).toString("hex"),
}).save();
const url=`${process.env.BASE_URL}/verifyPage/${Data.role}/${Data._id}/${token.token}`;
await sendOrganiserEmail(Data.email,"Verify Email",url);


if(Data){
  res.status(200).json({
    message:"Email sent to your email id please verify forn 2 step authentication",
    payload:Data
  })
}else{
  res.status(404).json({
    message:"user not created"
  })
}
})


authRouter.post('/organizer/signin',validUserData,async(req,res)=>{
 const {email,password}=req.body;
 const OrganizerResponse=await Organizer.findOne({
  email:email
 })
 if(OrganizerResponse){
 const validPassword=await bcrypt.compare(password,OrganizerResponse.password);
 if(validPassword){
  if(!OrganizerResponse.verified){
  let emailtoken=await OrganizerToken.findOne({userId:OrganizerResponse._id});
  if(!emailtoken){
   const token=await new OrganizerToken({
  userId:OrganizerResponse._id,
  token:crypto.randomBytes(32).toString("hex"),
}).save();
const url=`${process.env.BASE_URL}/verifyPage/${OrganizerResponse.role}/${OrganizerResponse._id}/${token.token}`;
await sendOrganiserEmail(OrganizerResponse.email,"Verify Email",url);

  }
  return res.status(400).send({
    messages:'An email sent to your account please'
  })
 }
  const secret=process.env.JWT_SECRET;
  const token=jwt.sign({userId:OrganizerResponse._id},secret,{expiresIn:"1h"});
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
