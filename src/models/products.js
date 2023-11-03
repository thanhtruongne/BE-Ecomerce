import mongoose,{Schema} from "mongoose";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
let productSchema = new Schema({
    title : {
        type:String,
        required:true,
        trim: true,
        uniqe : true
    } ,
    slug : {
        type:String,
        required:true,
        uniqe:true,
        lowercase:true
    },
    description : {
        type:Array,
        required:true,
    },
    coupon : {
        type :mongoose.Types.ObjectId,
        ref :'Coupon'
    },
    brand :{
        type:String,
        required:true,
        uniqe : true
    },
    price :{
        type:Number,
        required:true,
    },
    category : {
        type:String,
        
    },
    color :{
        type:String,
      
    },
    qualnity :{
        type:Number,
        default : 0
    },
    sold : {
        type:Number,
        default : 0
    },
    images : {
       type: Array
    },
    thumb : {
        type : String
    },
    internal : {
        type:String
    },
    // Vote products
    ratings :[
        {
            star :{type :Number},
            createAt : {type : String,default: moment().format('MMMM Do YYYY, h:mm:ss a')},
            postedBy :{type :mongoose.Types.ObjectId ,  ref:'User'},
            comment : {type :String}
        },
    ],
    variants : [
        {
            color : {type : String,uniqe : true},
            qualnity : {type : String},
            title : {type: String,uniqe : true},
            price : {type :Number},
            thumb :{type :String},
            images : {type :Array},
            sku : {type : String}
        }
    ],
    totalRatings :{
        type : Number,
        default: 0
    }
},{
    timestamps : true
})


module.exports = mongoose.model('Product', productSchema)