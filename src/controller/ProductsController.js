
import asyncHandler from "express-async-handler";
import Product from  '../models/products';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();
let createProducts = asyncHandler(async(req,res) => {
    const { title,price,qualnity,color,category,brand,description } = req.body;
    if(!title || !price || !qualnity || !color || !category || !brand || !description) throw new Error('Missing inputs');
    if(req.files.thumb) {
        req.body.thumb = req.files?.thumb[0].path
    }
    if(req.files.images) {
        req.body.images = req?.files?.images.map(item => item.path);
    }

    if(req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const NewProducts = await Product.create(req.body);
    return res.status(200).json({
        errCode : NewProducts ? 0 : -2,
        message :NewProducts ? "Success to create product" : "Failed to create product",
        NewProducts
    })
})

let getSingleProduct = asyncHandler(async(req,res) => {
     const {uuid} = req.params;
     if(!uuid) throw new Error("Missing required _Id");
     const Patch = await Product.findById(uuid);
     return res.status(200).json({
        errCode : Patch ? 0 : -1,
        message : Patch ? "Success get product" : "Fail to find",
        Patch
     })
})

let getListProducts = asyncHandler(async(req,res) => {
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
    let formatQueries = {};
    // tìm kiếm theo title lowercase or Uppercase
    if(req.query?.title) ConvertQuery.title = {$regex: req.query.title ,$options :'i'};
    if(req.query?.search) {
        delete ConvertQuery.search; 
        ConvertQuery['$or']=[
                {title : {$regex : req.query?.search,$options : 'i'}},
                {brand : {$regex : req.query?.search,$options : 'i'}},
                {category : {$regex : req.query?.search,$options : 'i'}},
        ]
    }
    
    if(query?.color) {
        delete ConvertQuery.color;
        const colorQuery = query?.color.split(',').map(item => ({color : {$regex : item,$options : 'i'}}));
        formatQueries = {$or : colorQuery};
    }

    const convertQueries = {...ConvertQuery,...formatQueries};
    let queryCommand = Product.find(convertQueries);
    
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
    console.log(limit);
    const skip = (page - 1) * limit ;
    queryCommand = queryCommand.skip(skip).limit(limit);

    //execute the query;
    queryCommand
    .then(async function (response){
        const CountRow = await Product.find(ConvertQuery).countDocuments();
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

let updateProduct = asyncHandler(async(req,res) => {
    const {uuid} = req.params;
    const files = req?.files;
    if(!uuid) throw new Error('Missing inputs');
    if(files.thumb) req.body.thumb = files.thumb[0].path;
    if(files.images)  {
        req.body.images = files.images.map(value => value.path);
    }
    if(req.body && req.body.title && req.body.images) {
        req.body.slug = slugify(req.body.title);
        req.body.images.shift();
    }
     const response = await Product.findByIdAndUpdate(uuid,req.body,{new : true});
    return res.status(200).json({
        errCode : response ? 0 : -1,
        message :response ? "Success to update product" : "Fail",
        response
    })
})

let CreateVariants = asyncHandler(async(req,res) => {
    const { uuid } = req.params;
    const {title,price,color,qualnity} = req.body;
    const files = req?.files;
    if(!uuid || !title || !price || !color || !qualnity) throw new Error('Missing inputs');
    const thumb = files.thumb[0].path;
    color.toUpperCase()
    const images  = files.images.map(value => value.path);
    const dumb = await Product.findByIdAndUpdate(uuid,{$push : {variants : [{title ,price,color,thumb,images,qualnity,sku : uuidv4()}]}},{new : true});
    return res.status(200).json({
        errCode : dumb ? 0 : -1,
        message : dumb ? `SUCCESS Create Variants ${title}` : 'Fail',
        dumb
    })

    
})

let DeleteProduct = asyncHandler(async(req,res) => {
   const {uuid} = req.params;
   const DeleteState = await Product.findByIdAndDelete(uuid);
   return res.status(200).json({
      errCode : DeleteState ? 0 : -1,
      message : DeleteState ? "Success to delete product" : "Fail"
   })
})

let ratings = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    const {star,comment ,uuid} = req.body;
    if(!uuid) throw new Error("Missing parameter inputs");
    const ProductRatings  = await Product.findById(uuid);
    //check product này đã dc rating chưa trong hàm ratings;
    const alreadyRatings = ProductRatings?.ratings?.find(el => el.postedBy.toString() === _id);
    if(alreadyRatings) {
        await Product.updateOne({
            ratings :{$elemMatch :alreadyRatings}
        },{$set :{"ratings.$.star" : star,"ratings.$.comment" :comment}},
        {new : true});
    }
    else {
        await Product.findByIdAndUpdate(uuid ,{$push :{ratings :{star,comment,postedBy :_id}}},{new :true});
    }
    //operator totalratings averagez 
    let findRatings= await Product.findById(uuid);
    let lengthRatings = findRatings.ratings.length;
    let countStar = await findRatings.ratings.reduce((sum,init) => {return sum + init.star},0)
    findRatings.totalRatings= Math.round(countStar * 10/lengthRatings) / 10;
    await findRatings.save();

    return res.status(200).json({
        status : true,
    })
})

let uploadImage = asyncHandler(async(req,res) => {
  const { uuid } = req.params;
  if(!uuid) throw new Error("Missing parameter");
  const UploadImage = await Product.findByIdAndUpdate(uuid,{$push : {images : {$each :  req?.files?.map(el => el.path)}}},{new : true});
  return res.status(200).json({
    errCode : UploadImage ? 0: -1,
    message :UploadImage ? "Success upload images" : "Fail to upload images"
  })
})


module.exports = {
    createProducts,
    getSingleProduct,
    getListProducts,
    updateProduct,
    DeleteProduct,ratings,
    uploadImage,CreateVariants
}