import mongoose, { connect } from 'mongoose';
require('dotenv').config();
let connectDB = async() => {
  try {
    let connect = await mongoose.connect(process.env.MONGOOSE_URL);
    if(connect.connection.readyState === 1) {
        console.log('Successfully connected MongoDB')
    }
  } catch (error) {
    console.log('DB connection error');
    throw new Error(error);
  }
}

export default connectDB;