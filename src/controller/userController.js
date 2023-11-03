import asyncHandler from "express-async-handler";
import User from '../models/users';
import { generateToken, generateRefreshToken } from '../middlewares/jwt';
import {sendMailResetPasswordToken,sendEmailAccuracyEmailRegister} from '../utils/emailServices';
import jwt from "jsonwebtoken";
import AccuracyRegister from '../models/AccuracyEmailRegister';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { response } from "express";
require('dotenv').config();

 let resisgter = asyncHandler(async(req,res) => {
  const {email,firstName,lastName,password} = req.body;
  if(!email || !firstName || !lastName || !password) {
    return res.status(400).json({
      errCode : -1,
      message : "Missing parameter required"
    })
  }

  let userFind = await User.findOne({email : email});

  if(userFind) {
     throw new Error('Email have been existed');
  }
  else{
    let token = uuidv4();
    // Email có thời hạn 15' cho người dùng acessRegister;
    const response = await AccuracyRegister.create({...req.body,timeExpired : moment().add(15, 'minutes').format('h:mm A'),tokenAccuracy : token});
    if(response) {
      await sendEmailAccuracyEmailRegister({
        email : response.email,
        fullname : `${response.firsDeleteRegisterDatabasetName} ${response.lastName}`,
        token : response.tokenAccuracy
      })
      return res.status(200).json({
        success : true
      })
    }
  }
  
 })

 let AccuracyVertifyRegister = asyncHandler(async(req,res) =>{
    const {token} =req.params;
    if(!token) res.redirect(`${process.env.REACT_FRONTEND_SERVER}/access_token_register/${token}/fail`)
    const Dataresponse = await AccuracyRegister.findOne({tokenAccuracy: token,timeExpired : {$gt : Date.now()}});
    if(Dataresponse) {
      await User.create({
        email : Dataresponse?.email,
        firstName : Dataresponse?.firstName,
        lastName: Dataresponse?.lastName,
        password : Dataresponse?.password,
        mobile : Dataresponse?.mobile
      })
      res.redirect(`${process.env.REACT_FRONTEND_SERVER}/access_token_register/${token}/success`)
    }
    else {
       await AccuracyRegister.deleteOne({tokenAccuracy : token});
      res.redirect(`${process.env.REACT_FRONTEND_SERVER}/access_token_register/${token}/fail`)
    }
    
 })

 let DeleteRegisterDatabase = asyncHandler(async(req,res) =>{
    const { token } = req.params;
    if(!token) throw new Error('Missin input token');
    const DeleteData = await AccuracyRegister.deleteOne({tokenAccuracy : token});
    return res.status(200).json({
      success : "Deleted successfully"
    })

 })
 
 let LoginUser = asyncHandler(async(req,res) => {
    const {email ,password} = req.body;
    if(!email || !password) {
      return res.status(400).json({
        errCode : -1,
        message : "Missing email or password,please try again  "
      })
    }
    let response = await User.findOne({email : email});
    if(response && await response.isCorrectPassword(password)) {
      // tránh hiển thị password và role ra client và postman
      const {password ,role,refreshToken,...userData} = response.toObject();

      // Tạo access token cho user khi login (xác thực user,phân quyền)
      let accessToken =  generateToken(response._id,role);
      // Tạo refreshToken lưu vào database;(cấp m ới access token)
      let newrefreshToken =  generateRefreshToken(response._id);
     
      await User.findByIdAndUpdate(response._id,{refreshToken:newrefreshToken},{new : true})
      // lưu vào cookie
      res.cookie('refreshToken',newrefreshToken,{httpOnly : true,maxAge : 7 * 24 * 60 * 60 * 1000});
      return res.status(200).json({
          errCode : 0,
          message :userData ? "Successfully to Login": 'Login Failed' ,
          accessToken,
          userData ,
         })
    }
    else {
      return res.status(200).json({
        errCode : -2,
        message :'Incorrect Password or Email,please try again'
       
       })
       
    }
 })
 let getCurrentUser = asyncHandler(async(req,res) => {
  const {_id} = req.user;
  const user = await User.findById(_id)
  const cart = await User.findById(_id).select('cart').populate({path : 'cart.product',select :'qualnity _id internal'});
  const wishlist = await User.findById(_id).select('wishlist').populate({path : 'wishlist.product',select : 'thumb title price color internal '})
  return res.status(200).json({
    errCode : user ? 0 : -2,
    message : user ? 'Successfully get current user' : "User not found",
    user,cart,wishlist
  })
 })

 //tạo ra accesstoken mới khi hết
 let refreshAccessToKen = asyncHandler(async(req,res) => {
    // Get all cookies;
     const cookie = req.cookies
     if(!cookie || !cookie.refreshToken) throw new Error("Invalid refresh token");
     let jsonwebtoken = await jwt.verify(cookie.refreshToken,process.env.JWT_SERECT);
     let response = await User.findOne({_id: jsonwebtoken._id , refreshToken :cookie.refreshToken});
     return res.status(200).json({
      errCode : response ? 0 : -1,
      message :  response ? "Successfully to create access new token" : "Fail",
      accessToken : response ? generateToken(response._id,response.role) : null
     })
 })

 // khi logout sẽ xóa refresh token trong db và clear cookies
 let logout = asyncHandler(async(req,res) => {
    const cookie = req.cookies;
    if(!cookie && !cookie.refreshToken) throw new Error("Invalid refresh token");
    // set refresh Token về rỗng khi logout;
    await User.findOneAndUpdate({refreshToken : cookie.refreshToken},{refreshToken : ''}, {new : true});
    // clear cookies
    res.clearCookie('refreshToken');

    return res.status(200).json({
      errCode : 0,
      message : "Success to clear cookie"
    })
 })

 // tạo resetpassword;
 //--> vertify email user --> send mail user access token --> redirect change passwordtoken
 let forgotPassword = asyncHandler(async(req,res) => {
      let {email} = {...req.body}; 
      if(!email)  {
        return res.status(200).json({
          errCode : -1,
          message : "Missing email"
        })
      }
      let user = await User.findOne({email});
      if(!user)  {
        return res.status(200).json({
          errCode : -1,
          message : "Email not exists"
        })
      }
      const resetToken = await user.createPaswordChangeToken();
      await user.save();
      //send mail;
       let data ={
        email : user.email,
        fullname : `${user.lastName} ${user.firstName}`,
        token : resetToken
       }
      const mail =  await sendMailResetPasswordToken(data);
      return res.status(200).json({
        errCode : mail ? 0 : -2,
        message : mail ? "Successfully send mail reset password" : "Fail to send email",
        resetToken
        
      })
 })

 let resetPassword = asyncHandler(async(req,res) => {
    const  { token} = req.params;
    const { password } = req.body;
    if(!password || !token) throw new Error("Missing passwordReset or Token");
    // thời gian passwordResetExpires phải ở thời hạn 15'
    const user  = await User.findOne({passwordResetToken : token,passwordResetExpires : {$gt : Date.now()}});
    if(!user) throw new Error("User not found");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangeAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
      errCode : 0,
      message : "Success change password"
    })


 })

 let getUserAll = asyncHandler(async(req,res) => {
    const query = {...req.query};
    const exculdeParamaters =['limit','page','sort','fields'];
    // lọc ra các dữ liêu truyền lên tách các item value ra;
    exculdeParamaters.forEach(el => delete query[el]);
    
    //FILTERING
    let queryStringtify = JSON.stringify(query).toString();
    //thay thế các chuỗi regex nếu có vào trong vvalue thêm $
    queryStringtify = queryStringtify.replace(/\b(gte|gt|lte|lt)\b/g, next => `$${next}`);
    let ConvertQuery = JSON.parse(queryStringtify);
    // tìm kiếm theo title lowercase or Uppercase
    if(req.query.search) {
      delete ConvertQuery.search
      ConvertQuery['$or'] = [
        {email : {$regex : req.query.search , $options : 'i'}},
        {firstName : {$regex : req.query.search , $options : 'i'}},
        {lastName : {$regex : req.query.search , $options : 'i'}},
      ]
    }

    let queryCommand = User.find(ConvertQuery);
    
    //SORT
    if(req.query.sort) {
        //convert ab ns ==> [ab,ns] ==> ab ,ns (string);
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }
    //FIELDS trường chọn các value item để show;
    if(req.query.fields) {
        const fieldsBy = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fieldsBy);
    }

    //PAGINATION; limit : số item hiển thị ra một trang;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 12;
    const skip = (page - 1) * limit ;
    queryCommand = queryCommand.skip(skip).limit(limit);

    //execute the query;
    queryCommand
    .then(async function (response){
        const CountRow = await User.find(ConvertQuery).countDocuments();
        return res.status(200).json({
            status : response ? true : false,
            count : CountRow,
            response,   

        })
    })
    .catch(function (err) { 
       throw new Error(err);
    })
 })

 //Soft Delete
 let deleteUsers = asyncHandler(async(req,res) => {
    const { uuid } = req.params;
    if(!uuid) throw new Error('Missing input');
    let UserDelete = await User.delete({_id : uuid});
    return res.status(200).json({
      errCode : UserDelete ? 0 : -1,
      message : UserDelete ? "Success Delete User" : "Failed Delete User"
    })
 })

 let DeleteForce = asyncHandler(async(req,res) => {
    const { uuid } = req.params;
    if(!uuid) throw new Error('Missing input');
    let UserDelete = await User.deleteOne({_id : uuid});
    return res.status(200).json({
      errCode : UserDelete ? 0 : -1,
      message : UserDelete ? "Success Delete-Force User" : "Failed Delete-Force User"
    })
 })

 //Delete All handle Checkbox
 let HandleDeleteCheckBox = asyncHandler(async(req,res) => {
  if(!req.body) throw new Error('Missing inputs');
  const response = await User.delete({_id : { $in : req.body}});
  return res.status(200).json({
    errCode : response ? 0: -1,
    message :response ? 'Delete Success' : 'Some thing went wrong'
  })

 })

// trashCourse
 let trashCourseUser = asyncHandler(async(req,res) => {
   const trash = await User.findDeleted({});
   return res.status(200).json({
    errCode : trash ? 0 : -1,
    status : trash ? true : false,
    count :trash ? trash.length : 0,
    data : trash ? trash : [],
   })
 })



 let RestoreUser = asyncHandler(async(req,res) => {
    const { uuid } = req.params;
    if(!uuid) throw new Error('Missing inputs');
    const ResponseRestore = await User.restore({_id: uuid});
    return res.status(200).json({
      errCode : ResponseRestore ? 0 : -1,
      message : ResponseRestore ? 'Restore successfully' : 'Some thing went wrong',
    })
 })

 let getUserById = asyncHandler(async(req,res) => {
    const { uuid } = req.params;
    if(!uuid) throw new Error('Missing input');
    const findUser = await User.findById({_id : uuid});
    return res.status(200).json({
      errCode : findUser ? 0 : -1,
      message : findUser ? 'Success get infomation user' : 'fail',
      data : findUser
    })
 })
 
 let CreateNewUserAdmin = asyncHandler(async(req,res) => {
   const {data} = req.body;
   if(!data) throw new Error('Missing inputs');
   const reponse = await User.create(data);
   if(!User) {
    return res.status(200).json({
      errCode : -2,
      message : 'Something went wrong'
     })
   }
   return res.status(200).json({
    errCode : response ? 0: -1,
    message : response ? "Create success" : 'Fail'
   })
 })

 //check update User;
 let updateUser = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    const { email ,firstName,lastName,mobile} = req.body;
    const data = {email ,firstName,lastName,mobile};
    if(req.file) data.avatar = req.file.path;
    if(!_id || Object.keys(req.body)=== 0) throw new Error("Missing parameter required for updateUser");
    let EditUser = await User.findByIdAndUpdate(_id,data,{new : true}).select("-refresToken -password -role")
   return res.status(200).json({
    errCode : EditUser  ? 0 : -1,
    message : EditUser ? "Success to Edit" : "Fail to Edit",
   })
 })

 let updateUserByAdmin = asyncHandler(async(req,res) => {
   const {uuid} =req.params; 
   if(!uuid || Object.keys(req.body)=== 0) throw new Error("Missing parameter required for updateUser");
   let EditUser = await User.findByIdAndUpdate(uuid,req.body,{new : true}).select("-refresToken -password -role")
  return res.status(200).json({
   errCode : EditUser  ? 0 : -1,
   message : EditUser ? "Success to Edit" : "Fail to Edit",
  })
 })

 let updateAddress = asyncHandler(async(req,res) => {
  const {_id} = req.user;
  if(!_id || !req.body.address) throw new Error("Missing parameter");
  const address = await User.findByIdAndUpdate(_id,{$push : {address :req.body.address }},{new : true});
  return res.status(200).json({
    errCode :address ? 0 : -1,
    message : address ? address : "Fail to get update address"
  })
 })

 let updateCart = asyncHandler(async(req,res) => {
   const {_id} = req.user;
   const {product, qualnity , color, price ,title , thumb  } =req.body;
   if(!product || !qualnity || !color || !price || !title || !thumb  ) throw new Error("Misssing parameter");
   const updateCart = await User.findById(_id);
   const alreadyUpdated = updateCart?.cart?.filter(el => el.product.toString() === product);
   if(alreadyUpdated && alreadyUpdated.find(el => el.color === color)) { 
        const matchcolor = await alreadyUpdated.find(el => el.color === color);
        console.log(matchcolor);
         const UpdateQualnity = await User.updateOne({cart : {$elemMatch : matchcolor}},{
          $set :{
            "cart.$.qualnity": qualnity,
            "cart.$.price" : price,
            "cart.$.title" : title,
            "cart.$.thumb" : thumb,
          
          }},{new: true})
          return res.status(200).json({
            errCode : UpdateQualnity ? 0 :-1,
            message :UpdateQualnity ? 'Success to update cart' :'Failed to update cart',
            updateCart
          })
   }
   else {
    const createNewCart = await User.findByIdAndUpdate(_id, {$push : {cart : {product , qualnity , color,title,price ,thumb}}},{new: true}).select('cart');
    return res.status(200).json({
      errCode : createNewCart ? 0 :-1,
      message :createNewCart ? 'Success to update cart' :'Failed to update cart',
      createNewCart
    })
   }
 })

 let ChangeQualnityCart = asyncHandler(async(req,res) => {
     const { _id }= req.user ; 
     const {product , color , qualnity} = req.body;
     if(!product || !color || !qualnity) throw new Error("Missing inputs");
     const current = await User.findById(_id);  
     const alreadyCart = current?.cart.find(item => item.product.toString() === product && item.color === color);
       console.log(alreadyCart)
        const update = await User.updateOne({cart : {$elemMatch : alreadyCart}},{$set : {"cart.$.qualnity": +qualnity}},{new : true});
        return res.status(200).json({
          status : update ? true : false,
          current
        })
 })
 

 let removeCart = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    const {id} = req.params;
    console.log(id);
    if(!_id) throw new Error('Missing input');
    const remove = await User.findByIdAndUpdate({_id : _id},{$pull : {cart : {product : id}}},{new : true});
    return res.status(200).json({
      status : remove ? true : false,
    })
 })

 let AddWishlist = asyncHandler(async(req,res) => {
  const {_id} = req.user;
  const {id} = req.params;
  if(!_id) throw new Error('Missing input');
  const Add = await User.findByIdAndUpdate({_id : _id},{$push : {wishlist : {product : id}}},{new : true});
  console.log(Add);
  return res.status(200).json({
    errCode : Add ? 0 : -1,
    message : Add ? 'Success to add wishlist' : "Some thing went wrong"
  })

 })

 let RemoveWishList = asyncHandler(async(req,res) => {
  const {_id} = req.user;
  const {id} = req.params;
   if(!_id) throw new Error('Missing input');
   const remove = await User.findByIdAndUpdate(_id ,{$pull : {wishlist : {product : id}}},{new : true})
   return res.status(200).json({
    errCode : remove ? 0 : -1,
    message : remove ? 'Success to remove wishlist' : "Some thing went wrong"
  })
 })
 


 module.exports = {
    resisgter,
    LoginUser,removeCart,
    getCurrentUser,
    refreshAccessToKen,
    logout,forgotPassword,
    resetPassword,getUserAll,
    deleteUsers,updateUser,
    updateUserByAdmin,updateAddress,
    updateCart,AccuracyVertifyRegister,
    DeleteRegisterDatabase,trashCourseUser,
    DeleteForce,RestoreUser,getUserById,
    HandleDeleteCheckBox,CreateNewUserAdmin,ChangeQualnityCart,
    AddWishlist,RemoveWishList
    
 }
 