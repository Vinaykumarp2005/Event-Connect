const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
require('dotenv').config();
function verifyUser(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({
      message: "No authentication token provided"
    });
  }
  
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

module.exports={
  verifyUser
}