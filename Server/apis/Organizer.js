const mongoose=require('mongoose');
const express=require('express');
const organizerApp=express.Router();
const {Organizer}=require('../models/organizer.model');
const {verifyUser}=require('../middlewares/verifyUser');
const {Events}=require('../models/event.model');
const upload = require('../middlewares/multer.middleware'); 
const uploadOnCloudinary = require('../utils/cloudinary');

organizerApp.put('/update/profiledetails', verifyUser, upload.single('logo'), async (req, res) => {
  try {
    const userId = req.userId;
    let updatedData = { ...req.body };

    
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult) {
        updatedData.logo = uploadResult.url;
      }
    }

    const updatedOrganiser = await Organizer.findByIdAndUpdate(
      userId,
      { $set: updatedData },
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
});


module.exports={
  organizerApp:organizerApp
}