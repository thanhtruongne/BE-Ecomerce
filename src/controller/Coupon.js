import Coupon from '../models/coupon'
import asyncHandler from 'express-async-handler'

let createCoupon = asyncHandler(async(req,res) => {
   if(Object.keys(req.body) === 0) throw new Error("Missing required parameters");
   // count theo ngày
   if(req?.body?.exipry) req.body.exipry = Date.now() + req.body.exipry * 24 * 3600 * 1000;
   const CreateNewCoupon = await Coupon.create(req.body);
   return res.status(200).json({
    errCode : CreateNewCoupon ? 0 : -1,
    message : CreateNewCoupon ? "Success" : 'Fail',
    CreateNewCoupon
   })
})

let getCoupons = asyncHandler(async(req,res) => {
    const getCoupon = await Coupon.find().select('-createdAt -updatedAt');
   return res.status(200).json({
    errCode : getCoupon ? 0 : -1,
    message : getCoupon ? "Success" : 'Fail',
    getCoupon
   })
})

let EditCoupon = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    const {cid} = req.params;
    if(!_id || Object.keys(req.body) === 0) throw new Error("Missing required parameters") 
    if(req?.body?.exipry) req.body.exipry = Date.now() + req.body.exipry * 24 * 3600 * 1000;
    const Update = await Coupon.findByIdAndUpdate(cid,req.body,{new : true});
    return res.status(200).json({
    errCode : Update ? 0 : -1,
    message : Update ? "Coupon updated Success" : 'Fail',
    Update
   })
})

let Deleteoupon = asyncHandler(async(req,res) => {
    const {cid} = req.params;
    if(!cid) throw new Error("Missing required parameters") 
    const deleteCoupon = await Coupon.findByIdAndDelete(cid);
    return res.status(200).json({
    errCode : deleteCoupon ? 0 : -1,
    message : deleteCoupon ? "Coupon delete Success" : 'Fail',

   })   
})

module.exports ={
    getCoupons,
    EditCoupon,
    Deleteoupon,createCoupon
}