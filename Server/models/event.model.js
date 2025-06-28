const {mongoose,Schema}=require("mongoose");
const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    },event:{
        type:Schema.Types.ObjectId,
        ref:"Event"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"Student"
    },
},{timestamps:true})

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
        type:String,
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
    },isApproved:{
        type:Boolean,
        default:false
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
    },
    registrationEndDate:{
        type:Date,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    comments:{
        type:[commentSchema]
    }

},{timestamps:true})


const Events=mongoose.model("Event",eventSchema);
module.exports={
    Events:Events
}