import mongoose ,{Schema} from "mongoose";
const brand = new Schema({
    title : {
        type : String,
        required : true,
        unique : true,
        index : true
    }
},{
    timestamps : true
})

module.exports = mongoose.model('Brand',brand);