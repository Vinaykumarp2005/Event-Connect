const mongoose=require('mongoose');
const express=require('express');
const adminApp=express.Router();
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const z=require("zod");
const { Admin } = require('../models/admin.model');

require("dotenv").config()
const validateAdminData=(req,res,next)=>{
const {name,password,email}=req.body;
  const AdminSchema=z.object({
    name:z.string().min(3).max(30),
    password:z.string().min(8).refine((val) => {
    const hasAt = val.includes('@') && !val.startsWith('@');
    const digitCount = (val.match(/[1-9]/g) || []).length;
    const hasAlpha = /[a-zA-Z]/.test(val);
    return hasAt && digitCount >= 1 && hasAlpha;
    }, {
    message: "Password must be at least 8 characters, include at least two digits (1-9), alphabets, and '@' (not at the start)",
    }),
    email:z.string().email()
});
 const {success}=AdminSchema.safeParse(req.body);
 if(!success){
    return res.status(401).json({
        message:"Invalid Data"
    })
    
 }
 
 next();
}

adminApp.post("/signUp",validateAdminData,async(req,res)=>{
        const {name,email,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,5)
        const Data=await Admin.create({
            name:name,
            password:hashedPassword,
            email:email
        })
        if(Data){
        res.status(200).json({
            message:"Admin Created successfully",
            payload:Data
        })
        }else{
        res.status(404).json({
            message:"Admin not created"
        })
        }
})
adminApp.post("/signin",async(req,res)=>{
        const {email,password}=req.body;
        const response= await Admin.findOne({
            email:email
        }
        ) 
        if(!response){
            res.status(404).json({
                message:"Invalid User"
            })
            return 
        }
        const isverified=await bcrypt.compare(password,response.password);
        if(!isverified){
            res.status(400).json({
                message:"Invalid User"
            })
        }
        else{
            const secret=process.env.JWT_SECRET;
            const token=jwt.sign({ userId: response._id }, secret);
            if(!token){
                res.status(404).json({
                    message:"Invalid Details"
                })
                return 
            }
            res.status(200).json({
                message:"Signed in Succesfully",
                token:token,
                payload:response
            })
        }

})

module.exports={adminApp:adminApp}