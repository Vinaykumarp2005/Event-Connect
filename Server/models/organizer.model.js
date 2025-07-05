const {mongoose,Schema}=require("mongoose");
const { type } = require("os");


const organizerSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    clubName:[{
        type:String,
        required:true,
        trim:true,
        index:true,
        unique:true
    }],
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
    },
    eventsCreated:[{
        type:Schema.Types.ObjectId,
        ref:"Event"
    }],
    position:{
        type:String,
        required:true    
    },
    logo:{
        type:String,
        required:true
    }
,   role:{
         type:String,
         required:true
    },verified:{
        type:Boolean,
        default:false
    }

},{timestamps:true,strict:true})
const Organizer=mongoose.model("Organizer",organizerSchema)
module.exports={
    Organizer:Organizer
}
