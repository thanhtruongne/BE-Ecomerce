import Category from  '../models/categories';
import  asyncHandler from 'express-async-handler';

let createCategory = asyncHandler(async(req,res) => {
    if(!req.body) throw new Error("Cannot find value");
    const Create = await Category.create(req.body);
    return res.status(200).json({
        errCode : Create ? 0 : -1,
        message :Create ? "Success to create category" : "Error creating category",
        Create
    })
})

let getCategory = asyncHandler(async(req,res) => {
   const Allcategories =await Category.find().select('title _id brand img ');
   return res.status(200).json({
    errCode : Allcategories ? 0 : -1,
    message : Allcategories ? "Success get all categories" : "Fail to get",
    Allcategories
   })
})

let EditCategory = asyncHandler(async (req,res) => {
  console.log(req.params)
  const { ctgid } = req.params;
  if(!ctgid) throw new Error("Missing input");
  const EditCategory = await Category.findByIdAndUpdate(ctgid ,req.body,{new : true});
  return res.status(200).json({
    errCode : EditCategory ? 0 : -1,
    message : EditCategory ? "Success to edit" : "Error updating category",
    EditCategory
  })
})

let DeleteCategory = asyncHandler(async(req,res) => {
    console.log(req.params)
    const {ctgid} = req.params;
    if(!ctgid) throw new Error("Missing input");
    const Delete = await Category.findByIdAndDelete(ctgid);
    return res.status(200).json({
      errCode : Delete ? 0 : -1,
      message : Delete ? "Success to delete" : "Error delete category",
      Delete
    })
})

module.exports = {
    createCategory,
    getCategory,
    DeleteCategory,
    EditCategory
}