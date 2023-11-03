import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt';  
import { v4 as uuidv4 } from 'uuid';
import MongooseDelete from "mongoose-delete";
let userSchema = new Schema({
    firstName : {
        type:String,
        required : true
    },
    lastName : {
        type:String,
        required : true
    },
    email : {
        type:String,
        required : true,
        unique : true
    },
    mobile : {
        type:String,
        required : true,
        unique : true
    },
    password : {
        type:String,
        required : true
    },
    role : {
        type: String,
        default:'user',
    },
    avatar : {
        type: String,
        default : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtHyDaHTTfWT6Qt11R7CwXjOZ2enpx08qS8wsiG_MrfYR-pgZLvVtYKTDAHfhprmNp1Vk&usqp=CAU'
    },
    cart : [
        {
            product :{type :mongoose.Types.ObjectId ,ref:'Product'},
            qualnity : Number,
            color : String,
            title : String,
            thumb : String,
            price : Number,
        }
    ],
    address : {
        type:String,default : 'Thành Phố Hò Chí Minh'
    },
    // Phần danh sách các sản phẩm yêu thích
    wishlist : [
        {product : {type:mongoose.Types.ObjectId , ref:'Product'}}
    ],
    isBlocked : {
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String,
    },
    // Phần reset password
    passwordChangeAt : {
        type:String
    },
    //Token dùng để gủi qua email của user reset password
    passwordResetToken : {
        type:String
    },
    //Đặt thời gian mặc định cho reset password qua email
    passwordResetExpires : {
        type:String
    }
},{
    timestamps:true
})

// băm password pre hook khi save 
userSchema.pre("save",async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt =  bcrypt.genSaltSync(12);
    this.password = await bcrypt.hash(this.password,salt); 
})
// tạo thêm method xử lý login password
userSchema.methods = {
    isCorrectPassword :async function(password) {
        return await bcrypt.compare(password ,this.password);
    },
    createPaswordChangeToken :async function() {
       let token =  uuidv4();
       // token reset password send mail user;
       this.passwordResetToken = token;
       // token reset password có thời hạn 15';
       this.passwordResetExpires =  Date.now() + 15 * 60 * 1000;
       return token;
    }
}


userSchema.plugin(MongooseDelete, {deletedAt : true, overrideMethods: 'all'});

module.exports = mongoose.model('User', userSchema);