const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoutes = require("./Router/feedRouter");




const app = express();

app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*"); // allows all the websites
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization");
    next();
})


app.use("/images",express.static(path.join(__dirname,"images")));
app.use("/feed",feedRoutes);



app.use((error,req,res,next)=>{

    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({message:message});
});

mongoose.connect("mongodb+srv://amrith:Password123@cluster-onlinefeeds.r54nq.mongodb.net/Cluster-OnlineFeeds?retryWrites=true&w=majority")
.then(result=>app.listen(8080))
.catch(err=>console.log(err));
