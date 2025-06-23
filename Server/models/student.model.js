import {mongoose,Schema} from "mongoose";

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
    }]

},{timestamps:true})

export const Student=mongoose.model("Student",studentSchema);
