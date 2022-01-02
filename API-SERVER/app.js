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
app.use("/feed",feedRoutes);

mongoose.connect("mongodb+srv://amrith:Password123@cluster-onlinefeeds.r54nq.mongodb.net/Cluster-OnlineFeeds?retryWrites=true&w=majority")
.then(result=>app.listen(8080))
.catch(err=>console.log(err));