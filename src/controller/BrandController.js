import Brand from  '../models/brand';
import  asyncHandler from 'express-async-handler';

let createBrand = asyncHandler(async(req,res) => {
    if(!req.body) throw new Error("Cannot find value");
    const Create = await Brand.create(req.body);
    return res.status(200).json({
        errCode : Create ? 0 : -1,
        message :Create ? "Success to create category" : "Error creating category",
        Create
    })
})

let getBrand = asyncHandler(async(req,res) => {
   const brandAll =await Brand.find().select('title _id');
   return res.status(200).json({
    errCode : brandAll ? 0 : -1,
    message : brandAll ? "Success get all brand" : "Fail to get",
    brandAll
   })
})

let EditBrand = asyncHandler(async (req,res) => {
  console.log(req.params)
  const { brid } = req.params;
  if(!brid) throw new Error("Missing input");
  const EditCategory = await Brand.findByIdAndUpdate(brid ,req.body,{new : true});
  return res.status(200).json({
    errCode : EditCategory ? 0 : -1,
    message : EditCategory ? "Success to edit" : "Error updating category",
    EditCategory
  })
})

let DeleteBrand = asyncHandler(async(req,res) => {
    console.log(req.params)
    const {brid} = req.params;
    if(!brid) throw new Error("Missing input");
    const Delete = await Brand.findByIdAndDelete(brid);
    return res.status(200).json({
      errCode : Delete ? 0 : -1,
      message : Delete ? "Success to delete" : "Error delete category",
      Delete
    })
})


module.exports = {
    createBrand,
    EditBrand,
    getBrand,
    DeleteBrand
}