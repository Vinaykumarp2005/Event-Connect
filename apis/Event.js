const mongoose=require('mongoose');
require('dotenv').config();
const z =require('zod');
const express=require('express');
const eventApp=express.Router();
const {verifyUser}=require('../middlewares/verifyUser');
const {Organizer}=require('../models/organizer.model');
const {Events}=require('../models/event.model');
const validEventData=(req,res,next)=>{
  const {eventName,description,maxLimit,enrolled,category,faqs,startDate,endDate,eventImage,eventVideo,sampleCertificate,registrationFee,venue,keyTakeAways,isApproved,rewardPoints,organizer,registrationForm,registrationEndDate,endTime}=req.body;
  const eventSchema=z.object({
    eventName:z.string(),
    description:z.string(),
    maxLimit:z.number(),
    enrolled:z.number(),
    category:z.string(),
    faqs:z.array(z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required")
}))
,
   startDate:z.coerce.date(),
   endDate:z.coerce.date(),
   eventImage:z.string(),
   eventVideo:z.string(),
   sampleCertificate:z.string(),
   registrationFee:z.number(),
   venue:z.string(),
   keyTakeAways:z.string(),
   rewardPoints:z.number(),
   registrationForm:z.string(),
   registrationEndDate:z.coerce.date(),
   endTime:z.string()
  });
  const {success}=eventSchema.safeParse(req.body);
  if(success){
    next();
  }else{
    res.status(411).json({
      meassage:"invalid data or all field required manadatory"
    })
  }
}
const validPerson=async(req,res,next)=>{
  try{
  const response=await Organizer.findById(req.userId
  )
  if(response.role){
  next();
  }
  }catch(e){
    res.status(411).json({
      message:"unauthorized access"
    })
  }
}
eventApp.post('/app/v1/create',verifyUser,validPerson,async(req,res)=>{
 const {eventName,description,maxLimit,enrolled,category,faqs,startDate,endDate,eventImage,eventVideo,sampleCertificate,registrationFee,venue,keyTakeAways,rewardPoints,registrationForm,registrationEndDate,endTime}=req.body;
 const response=await Events.create({
  eventName:eventName,
  description:description,
  maxLimit:maxLimit,
  enrolled:enrolled,
  category:category,
  faqs:faqs,
  startDate:new Date(startDate),
  endDate:new Date(endDate),
  eventImage:eventImage,
  eventVideo:eventVideo,
  sampleCertificate:sampleCertificate,
  registrationFee:registrationFee,
  venue:venue,
  keyTakeAways:keyTakeAways,
  rewardPoints:rewardPoints,
  registrationForm:registrationForm,
  registrationEndDate:new Date(registrationEndDate),
  endTime:endTime,
  organiser:req.userId
 })
if(response){
  res.status(200).json({
    message:"event is created succesfully",
    payload:response
  })
}else{
  res.status(411).json({
    message:"evenet is not created"
  })
}
})
eventApp.get('/app/v1/events/:eventId',verifyUser,async(req,res)=>{
  try{
    const eventId=req.params.eventId;
    const response=await Events.findOne({
      _id:eventId,
    })
    if(response){
      const response=await Events.findById(eventId);
      res.status(200).json({
        message:"Event details fetched succesfully",
        payload:response
      })
    }else{
      return res.status(403).json({
        message: "You are not authorized to view this event or it doesn't exist."
      });
    }

  }catch(e){
     console.error(e);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
})
eventApp.get('/app/v1/events/',verifyUser,async(req,res)=>{
  try{

    const response=await Events.find({
    })
    if(response){
      const response=await Events.find();
      res.status(200).json({
        message:"Events details fetched succesfully",
        payload:response
      })
    }else{
      return res.status(403).json({
        message: "You are not authorized to view this event or it doesn't exist."
      });
    }

  }catch(e){
     console.error(e);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
})

eventApp.get('/app/v1/organiser/events', verifyUser,validPerson, async (req, res) => {
  try {
     const events = await Events.find({ organiser: req.userId });
     res.status(200).json({
      message: "Fetched organiser's events successfully",
      payload: events
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});
eventApp.put('/app/v1/event/update/:eventId', verifyUser, validPerson, async (req, res) => {
  try {
    const { eventId } = req.params;
    const existingEvent = await Events.findOne({ _id: eventId, organiser: req.userId });
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
      message: "Event updated successfully",
      payload: updatedEvent
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});




eventApp.delete('/app/v1/event/delete/:eventId',verifyUser,validPerson,async(req,res)=>{
  try{
    const eventId=req.params.eventId;
    const response=await Events.findOne({
      _id:eventId,
      organiser:req.userId
    })
    if(response){
      await Events.findByIdAndDelete(eventId);
    

      res.status(200).json({
        message:"Event deleted succesfully"
      })
    }else{
      return res.status(403).json({
        message: "You are not authorized to delete this event or it doesn't exist."
      });
    }

  }catch(e){
     console.error(e);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
})
module.exports={
  eventApp:eventApp
}