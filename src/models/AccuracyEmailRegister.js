import mongoose,{Schema} from "mongoose";

const AccuracyRegister = new Schema({
    email : {
       type: String,
       required : true,
       unique : true
    },
    firstName : {
       type: String,
       required : true,
    },
    lastName  : {
        type: String,
        required : true,
    },
    password : {
        type: String,
        required : true,
    },
    mobile : {
        type: Number,
        required : true,
    },
    timeExpired : {
        type : String,
        required: true
    },
    tokenAccuracy : {
        type : String,
        required: true
    },
    status : {
        type : String,
        default : "Pending",
    }
},{
    timestamps : true
})

module.exports = mongoose.model('AccuracyRegister',AccuracyRegister)