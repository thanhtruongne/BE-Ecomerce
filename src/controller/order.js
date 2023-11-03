import asyncHandler from "express-async-handler";
import Order from '../models/Order';
import User from '../models/users'

let createOrder = asyncHandler(async(req,res) => {
  const { _id} = req.user;
  const {products,status ,total} = req.body;
  if(!_id || !products || !status || !total) throw new Error("Missing required");
  const newOrder = await Order.create({products,total,status,orderBy : _id});
  if(newOrder) {
    await User.findByIdAndUpdate(_id,{cart : []},{new : true});
  }
  return res.status(200).json({
    errCode  : newOrder ? 0 : -1,
    message : newOrder ? 'Success create order' : "Fail to order"
  })
})


let getOrdersUser = asyncHandler(async(req,res) => {
  const {_id} = req.user;
  // filtering,paganation,sort item;
  //Create a query to filter products
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
  const convertQueries = {...ConvertQuery,orderBy : _id};
  let queryCommand = Order.find(convertQueries);
  
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
  const limit = +req.query.limit || process.env.LIMIT_PAGINATION;
  const skip = (page - 1) * limit ;
  queryCommand = queryCommand.skip(skip).limit(limit);

  //execute the query;
  queryCommand
  .then(async function (response){
      const CountRow = await Order.find({orderBy : _id}).countDocuments();
      return res.status(200).json({
          status : response ? true : false,
          count : CountRow,
          response,   
      })
  })
  .catch(function (err) { 
     throw new Error(err);
  })
  
});


let updateOrder = asyncHandler(async(req,res) => {
    const {orid} = req.params;
    const {status} = req.body;
    if(!orid || !status) throw new Error('Missing paramter');
    const updateStatus = await Order.findByIdAndUpdate(orid,{status},{new : true});
    return res.status(200).json({
        errCode : updateStatus ? 0  : -1,
        message : updateStatus ? "Success  updaten status" : "Fail",
        updateStatus
    })
})

let deleteOrder = asyncHandler(async(req,res) => {
    const {orid} = req.params;
    if(!orid) throw new Error('Missing paramter');
    const deleteStatus = await Order.findByIdAndDelete(orid);
    return res.status(200).json({
        errCode : deleteStatus ? 0  : -1,
        message : deleteStatus ? "Success  delete order" : "Fail",
    })
})

module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,getOrdersUser

}