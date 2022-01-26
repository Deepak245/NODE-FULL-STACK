const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const feedRoutes = require("./Router/feedRouter");
const authRoutes = require("./Router/authRouter");




const app = express();
const fileStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'images');
  },
  filename:(req,file,cb)=>{
     // cb(null,new Date().toISOString()+'-'+file.originalname);
        cb(null, uuidv4())
  }
});

const fileFilter = (req,file,cb)=>{
  if(file.mimetype === 'image/png' || file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg'){
    cb(null,true);
  }else{
    cb(null,false);
  }
}
app.use(bodyParser.json());
app.use(multer({storage:fileStorage,filefilter:fileFilter}).single('image'))
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*"); // allows all the websites
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization");
    next();
})


app.use("/images",express.static(path.join(__dirname,"images")));
app.use("/feed",feedRoutes);
app.use("/auth",authRoutes);



app.use((error,req,res,next)=>{

    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({message:message});
});

mongoose.connect("mongodb+srv://amrith:Password123@cluster-onlinefeeds.r54nq.mongodb.net/Cluster-OnlineFeeds?retryWrites=true&w=majority")
.then(result=>app.listen(8080))
.catch(err=>console.log(err));
