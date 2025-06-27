const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const verifyUser=async (req,res,next)=>{
  try{
    const token=req.headers["authorization"];
    const jwtsecret=process.env.JWT_SECRET;
    const validtoken=await jwt.verify(token,jwtsecret);
    if(validtoken){
      req.userId=validtoken.userId;
      next();
    }
    else{
  res.status(411).json({
    message:"invalid token!please login"
  }
  )
    }
  }catch(e){
    res.staus(411).json({
      message:"Invalid or expird Token"
    })
  }
}
module.exports={
  verifyUser:verifyUser
}