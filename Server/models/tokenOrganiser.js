const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const tokenSchema=new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:"Organizer",
    unique:true
  },
  token:{
    type:String,
    required:true
  },
  createdAt:{type:Date,default:Date.now(),expires:3600}
})
const OrganizerToken=mongoose.model("organizerToken",tokenSchema);
module.exports={
  OrganizerToken:OrganizerToken
}