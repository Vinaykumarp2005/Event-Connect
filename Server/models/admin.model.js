import mongoose,{Schema} from "mongoose"

const adminSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    }, password:{
        type:String,
        required:true
    },
    isAccepted:{
        type:Schema.Types.ObjectId,
        ref:"Event"
    },
    
},{timestamps:true})

export const Admin=mongoose.model("Admin",adminSchema)

