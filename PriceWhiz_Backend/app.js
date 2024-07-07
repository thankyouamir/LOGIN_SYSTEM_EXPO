import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dbConnection from './database/dbConnection.js';
import{errorMiddleware} from './middlewares/error.js';


import userRouter from './routes/userRoutes.js';

//instance of express created
const app = express();
// const cors = require('cors');

dotenv.config({path :"./config/config.env"});
console.log(process.env.PORT);
//frontend with backend connection
app.use(cors({
    origin : [process.env.DASHBOARD_URL],
    methods : ["GET","POST" ,"DELETE" ,"PUT"],
    credentials : true,
}))
//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/",

}));


app.use("/api/v1/user",userRouter);



dbConnection();
app.use(errorMiddleware);

export default app;