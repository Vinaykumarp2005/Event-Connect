const mongoose=require('mongoose');
const express=require('express');
const studentApp=express.Router();
const {Student}=require('../models/student.model');
const {verifyUser}=require('../middlewares/verifyUser');
const {Events}=require('../models/event.model');
studentApp.put('/update/profiledetails',verifyUser,async(req,res)=>{
  try {
     const userId  = req.userId;
     
     const updatedStudent= await Student.findByIdAndUpdate(
       userId,
       { $set: req.body },
       { new: true, runValidators: true }
     );
 
     res.status(200).json({
       message: "Organiser updated successfully",
       payload: updatedStudent
     });
 
   } catch (e) {
     console.error(e);
     res.status(500).json({ message: "Something went wrong" });
   }
});
studentApp.put('/comment/:eventId',verifyUser,async(req,res)=>{
  try {
    const { eventId } = req.params;
    const existingEvent = await Events.findOne({ _id: eventId});
    if (!existingEvent) {
      res.status(403).json({
        message: "You are not authorized to update this event or it doesn't exist."
      });
      return;
    }

    // Update the event with new data
    const updatedEvent = await Events.findByIdAndUpdate(
      eventId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Comment added successfully",
      payload: updatedEvent
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }

})

module.exports={
  studentApp:studentApp
}