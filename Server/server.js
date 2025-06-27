const mongoose=require("mongoose");
const exp=require("express");
const app=exp();
require('dotenv').config();
const {authApp}=require('./apis/Auth');

const dbUrl=process.env.DB_URL;
app.use(exp.json());
mongoose.connect(dbUrl).then(()=>{
  console.log('database is successfully connected to the backend')
}).catch((e)=>{
  console.log(e)
})
const port=process.env.port||4000;
// require("dotenv").config(); 
app.use('/auth',authApp);




app.listen(port,()=>{
  console.log("server is running on the backend server on port ",port);
});
