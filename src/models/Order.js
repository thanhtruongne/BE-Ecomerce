import mongoose ,{Schema} from "mongoose";

const Order = new Schema({
    products : [
        {
            product : {type : mongoose.Types.ObjectId,ref:'Product'},
            color : String,
            title : String,
            qualnity : Number,
            thumb : String,
            price : Number
        },
    ],
    status : {
        type  :String,
       default:'Proccess',
       enum :['Cancelled','Proccess','Success']
    },
    total :{
        type : String,
    },
    orderBy :{
      type :mongoose.Types.ObjectId,ref:'User'
    },
},{
    timestamps : true,
    // dùng để tạo ảo khi res ra json
    toJSON :{virtuals : true},
    toObject :{virtuals : true},
})


module.exports = mongoose.model('Order', Order);