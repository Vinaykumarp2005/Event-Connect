const mongoose=require('mongoose');
const express=require('express');
const organizerApp=express.Router();
const {Organizer}=require('../models/organizer.model');
const {verifyUser}=require('../middlewares/verifyUser');
const {Events}=require('../models/event.model');
organizerApp.put('/update/profiledetails',verifyUser,async(req,res)=>{
  try {
     const userId  = req.userId;
     
     const updatedOrganiser = await Organizer.findByIdAndUpdate(
       userId,
       { $set: req.body },
       { new: true, runValidators: true }
     );
 
     res.status(200).json({
       message: "Organiser updated successfully",
       payload: updatedOrganiser
     });
 
   } catch (e) {
     console.error(e);
     res.status(500).json({ message: "Something went wrong" });
   }
})

module.exports={
  organizerApp:organizerApp
}