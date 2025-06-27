// import multer from "multer"


const multer=require("multer")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  return  cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    return  cb(null, file.originalname)
  }
})

// export const upload = multer({ storage})
const upload = multer({ storage:storage });
module.exports =  upload ;





