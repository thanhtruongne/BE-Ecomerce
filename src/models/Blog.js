import mongoose ,{Schema} from "mongoose";

const Blog = new Schema({
    title : {
        type  :String,
        required : true,
        uniqe : true
    },
    description : {
        type  :String,
        required : true,
      
   },
    category : {
        type  :String,
        required : true,
    },
    numberViews :{
        type  :Number,
        default :0
    },
    isLiked :{
        type  :Boolean,
        default :false
    },
    disLiked : {
        type  :Boolean,
        default :false
    },
    Likes : [
        {
            type : mongoose.Types.ObjectId,
            ref :'User'
        }
    ],  
    DisLikes : [
        {
            type : mongoose.Types.ObjectId,
            ref :'User'
        }
    ],
    image : {
        type: String,
        default :'https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fblog-background&psig=AOvVaw1G8Gk6zeaKwywSa4lkGwhK&ust=1693889104184000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCICr8-SSkIEDFQAAAAAdAAAAABAE'
    },
    author : {
        type : String,
        default : 'Admin'
    }
},{
    timestamps : true,
    // dùng để tạo ảo khi res ra json
    toJSON :{virtuals : true},
    toObject :{virtuals : true},
})


module.exports = mongoose.model('Blog', Blog);