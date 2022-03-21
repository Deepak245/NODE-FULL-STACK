const path = require("path");
const passport = require("passport");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const { graphqlHTTP } = require('express-graphql');


const auth= require("./MiddleWare/passport");

const graphqlSchema = require("./GraphQl/schema");
const graphqlResolver = require("./GraphQl/resolvers");







const app = express();

app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());



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


app.use(multer({storage:fileStorage,filefilter:fileFilter}).single('image'))

app.use((req,res,next)=>{
  // console.log(req.method)
    res.setHeader("Access-Control-Allow-Origin","*"); // allows all the websites
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization");
    if(req.method==="OPTIONS"){
      return res.sendStatus(200);
    }
    next();
})


app.use("/images",express.static(path.join(__dirname,"images")));
// passport.authenticate('jwt',{session:false},(err,user)=>{next(user);});

app.use(passport.initialize());
app.use(auth);
app.use("/graphql",graphqlHTTP({
  // passport.auth('jwt',{session:false})
  schema:graphqlSchema,
  rootValue:graphqlResolver,
  graphiql:true,
  context:{user : "test@test"},
  customFormatErrorFn(err){
    if(!err.originalError){
      return err;
    }
    const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
  }
}));

app.use((error,req,res,next)=>{

    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({message:message});
});

mongoose.connect("mongodb+srv://amrith:Password123@cluster-onlinefeeds.r54nq.mongodb.net/Cluster-OnlineFeeds?retryWrites=true&w=majority")

.then(result => {
    app.listen(8080);

  })
  .catch(err => console.log(err));
