import mongoose,{Schema} from "mongoose";


let Coupon = new Schema({
    name : {
        type:String,
        required:true,
        uniqe:true
    } ,
    discount : {
        type:Number,
        required:true,
    },
    exipry : {
        type:Date,
        required:true
    }
},{
    timestamps : true
})


module.exports = mongoose.model('Coupon', Coupon)