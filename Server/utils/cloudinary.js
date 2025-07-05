// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"
const {v2 : cloudinary} =require("cloudinary");
const fs =require("fs");
const path = require("path");



 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


const uploadOnCloudinary=async(localFilePath)=>{
    try{
      
        if(!localFilePath)
            return null
//upload file on cluidnary

     const response= await cloudinary.uploader.upload(localFilePath, {
               resource_type: "auto"
           })
        //    console.log(response)
//file has been successfully uploaded
console.log("file uploaded successfully",response.url)
   if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }             
return response

}
    catch(error){
console.error("Error during Cloudinary upload:", error);

        if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    //remove the locally saved temporary file as the  upload operation has failed

        return null;
    }
}




module.exports=uploadOnCloudinary
