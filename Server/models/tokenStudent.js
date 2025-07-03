const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const tokenSchema=new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:"Student",
    unique:true
  },
  token:{
    type:String,
    required:true
  },
  createdAt:{type:Date,default:Date.now(),expires:3600}
})
const StudentToken=mongoose.model("studentToken",tokenSchema);
module.exports={
  StudentToken:StudentToken
}