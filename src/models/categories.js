import mongoose, {Schema} from "mongoose";

const Category = new Schema({
    title : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    brand: {
        type : Array,
        required : true,
    }
},{
    timestamps : true
})


module.exports = mongoose.model('Category',Category);