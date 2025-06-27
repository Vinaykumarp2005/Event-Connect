import mongoose,{ Schema } from "mongoose";

const faqSchema=new Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
},{timestamps:true})

const eventSchema= new Schema({
    eventName:{
        type:String,
        required:true,
        unique:true
    },description:{
        type:String,
        required:true
    },
    maxLimit:{
        type:Number,
        required:true,
    },
    enrolled:{
        type:Number,
        required:true
    },
    category:{
        type:Number,
        required:true,
    },faqs:{
        type:[faqSchema]
    },startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },eventImage:[{
        type:String,

    }],
    eventVideo:[{
        type:String
    }],
    sampleCertificate:{
        type:String
    },
    registrationFee:{
        type:Number,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    keyTakeAways:{
        type:String,
        required:true
    },isAprooved:{
        type:boolean,
    },rewardPoints:{
        type:Number,
        required:true
    },
    organiser:{
        type:Schema.Types.ObjectId,
        ref:"Organizer"
    },registrationForm:{
        type:String,
        required:true
    }

},{timestamps:true})
export const Events=mongoose.model("Event",eventSchema);