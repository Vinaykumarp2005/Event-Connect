const {mongoose,Schema}=require("mongoose");

const studentSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    phoneNumber:{
        type:Number,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    password:{
        type:String,
        required:true
    },
    collegeName:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },year:{
        type:Number,
        required:true,
    },eventsenrolled:[{
        type:Schema.Types.ObjectId,
        ref:"Event"
    }],
    rewardsEarned:{
        type:Number,
        default:0,
    },
    role:{
         type:String,
         required:true
    },
    verified:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

const Student=mongoose.model("Student",studentSchema);
module.exports={
    Student:Student
}