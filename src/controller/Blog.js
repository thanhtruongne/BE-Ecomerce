import Blog from '../models/Blog';
import  asyncHandler from 'express-async-handler';

let createBlogs = asyncHandler(async(req,res) => {
    const CreateNewBlog = await Blog.create(req.body);
    return res.status(200).json({
        errCode : CreateNewBlog ? 0  : -1,
        message : CreateNewBlog ? "Success to create new Blog" : "Fail",
        CreateNewBlog
    })
})

let getBlogs = asyncHandler(async(req,res) => {
    const GetBlog = await Blog.find({}).select('title description image category');
    return res.status(200).json({
        errCode : GetBlog ? 0 : -1,
        message :GetBlog ? "Success find blog" : "Failed to find blog",
        GetBlog
    })
})

let getBlog = asyncHandler(async(req,res) => {
    const {blgid} = req.params;
    if(!blgid) throw new Error("Missing inputs");
    const getOne = await Blog.findByIdAndUpdate(blgid,{$inc :{numberViews : 1}},{new : true})
        .populate('Likes','firstName lastName') //  giống với khóa ngoại sql accesiontes
        .populate('DisLikes','firstName lastName');
    return res.status(200).json({
        errCode : getOne  ? 0 : -1,
        message : getOne ? "SUCCESS to get one blog" : "Fail to get one blog",
        getOne
    })    
})

let EditBlogs = asyncHandler(async(req,res) => {
   const { blgid } = req.params;
   if(!blgid) throw new Error("Missing input");
   const EditBlogs = await Blog.findByIdAndUpdate(blgid , req.body ,{new : true});
   return res.status(200).json({
    errCode : EditBlogs ? 0 : -1,
    message :EditBlogs ? "Success update blog" : "Failed to update blog",
    EditBlogs
   })
})

let DeleteBlogs = asyncHandler(async(req,res) => {
    const { blgid } = req.params;
    if(!blgid) throw new Error("Missing input");
    const DeleteBlogs = await Blog.findByIdAndDelete(blgid);
    return res.status(200).json({
     errCode : DeleteBlogs ? 0 : -1,
     message :DeleteBlogs ? "Success delete blog" : "Failed to delete blog",
     DeleteBlogs
    })
})

let likeBlogs = asyncHandler(async(req,res) => {
   const { _id}  = req.user;
   const {blgid} = req.params;
   console.log(blgid)
   if(!_id) throw new Error("Invalid User Found");
   const FindBlog = await Blog.findById(blgid);
   //Find các trường hợp dislike
   const alreadyBlogDisLike = FindBlog.DisLikes.find(uil => uil.toString() === _id);
   if(alreadyBlogDisLike) {
        const Undislike = await Blog.findByIdAndUpdate(blgid ,{$pull :{DisLikes : _id},disLiked : false},{new : true});
        return res.status(200).json({
            errCode : Undislike ? 0 : -1,
            message :Undislike ? "Successfully updated like" : "Failed to update like"
        })
    }
    const isLiked = FindBlog.isLiked;
    console.log(isLiked)
    if(isLiked) {
        const Unlike = await Blog.findByIdAndUpdate(blgid,{$pull :{Likes : _id},isLiked : false},{new : true})
        return res.status(200).json({
            errCode : Unlike ? 0 : -1,
            message :Unlike ? "Successfully updated like" : "Failed to update like"
        })
    }
    else {
        const Like = await Blog.findByIdAndUpdate(blgid,{$push :{Likes : _id},isLiked : true},{new : true});
        return res.status(200).json({
            errCode : Like ? 0 : -1,
            message :Like ? "Successfully  like" : "Failed to  like"
        })
    }     
})

let dislikeBlog = asyncHandler(async(req,res) => {
    const { _id}  = req.user;
    const {blgid} = req.params;
    if(!_id) throw new Error("Invalid User Found");
    const FindBlog = await Blog.findById(blgid);
     const DisLiked = FindBlog.disLiked;
     if(DisLiked) {
         const UnDislike = await Blog.findByIdAndUpdate(blgid,{$pull :{DisLikes : _id},disLiked : false},{new : true})
         return res.status(200).json({
             errCode : UnDislike ? 0 : -1,
             message :UnDislike ? "Successfully updated dlike" : "Failed to update dlike"
         })
     }
     else {
         const DisLike = await Blog.findByIdAndUpdate(blgid,{$push :{DisLikes : _id},disLiked : true},{new : true});
         return res.status(200).json({
             errCode : DisLike ? 0 : -1,
             message :DisLike ? "Successfully dlike" : "Failed to  dlike"
         })
     }     
})

module.exports = {
    createBlogs,EditBlogs,
    likeBlogs,DeleteBlogs,
    getBlogs,dislikeBlog,
    getBlog
}