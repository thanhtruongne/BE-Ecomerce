import express from 'express';
import morgan from 'morgan';
import connectDB from './configs/connectDB'
import initRoutes from './routes/index'
import cookieParser from 'cookie-parser'
import cors from 'cors';
require('dotenv').config();

let app = express();
let port = process.env.PORT || 8000;
console.log(process.env.PORT);
app.use(cors({
    origin : process.env.REACT_FRONTEND_SERVER,
    methods:['GET','POST','DELETE','PUT']
}));

app.use(express.json());
app.use(express.urlencoded({ extended:true}));


app.use(cookieParser());

app.use(morgan('combined'));

connectDB();

initRoutes(app);

app.listen(port ,() => {
    console.log("SERVER RUNNING ON PORT: ",port);
})
