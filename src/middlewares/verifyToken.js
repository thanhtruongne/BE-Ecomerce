import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
require('dotenv').config();


const verifyAccessToken = asyncHandler(async(req,res,next) => {
    if(req?.headers?.authorization.startsWith('Bearer')) {
       const token =  req.headers.authorization.split(' ')[1]; 
       const decode =  jwt.verify(token,process.env.JWT_SERECT)
          if(!decode)  throw new Error("Invalid authorization");    
           // decode là phần token id
          req.user = decode;
          next();
    }
    else {
        return res.status(400).json({
            errCode : -4,
            message :"Token verification failed"
        })
    }
})

const isAdmin = asyncHandler(async(req,res,next) => {
  const { role } = req.user;
  if(!role || role !== "admin") {
    return res.status(401).json({
        errCode : -1,
        message : "Requeried role Admin"
    })
  }
  // chạy sang hàm tiếp theo
  next();
})

module.exports = {
    verifyAccessToken,isAdmin
}