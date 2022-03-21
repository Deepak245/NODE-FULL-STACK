const User = require("../Modals/userModal");
const Post = require("../Modals/postModalMongo");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../MiddleWare/passport");

const {userFound} = require("../Util/userNotFound.js")


module.exports={
  createUser:async ({userInput},req)=>{
    const errors = [];
    if(!validator.isEmail(userInput.email)){
      errors.push({message:"Email is InValid"});
    }
    if(validator.isEmpty(userInput.password)|| !validator.isLength(userInput.password,{min:5})){
      errors.push({message:"Password Might be Empty or less than 5 characters"})
    }

    if(errors.length>0){
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({email:userInput.email});
    if(existingUser){
      const error = new Error("User Already Exists");
      throw error;
    }
    const hashedpwd = await bcrypt.hash(userInput.password,12);
    const user = new User({
      email : userInput.email,
      name:userInput.name,
      password:hashedpwd
    });
    createdUser = await user.save();
    return {...createdUser._doc,_id:createdUser._id.toString()}
  },
  login:async ({email,password},req,context)=>{
    // console.log(context);
    const user = await User.findOne({email:email});
    // console.log(password);
    if(!user){
      const error = new Error("User Not Found");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password,user.password);
    // console.log(isEqual)
    if(!isEqual){
      const error = new Error("Password is InCorrect");
      error.code = 401;
      throw error;
    }

    const payload = {
     userId : user._id.toString(),email : user.email
   }
    const token = jwt.sign(payload,"sruthi",{expiresIn:"1d"})
    return {token:token,userId:user._id.toString()}
  },
  createPost:async ({postInput},req,res,next)=>{

    passport.authenticate('jwt', { session: false },(err,user,info)=>{
      if (user) {
             req.user = user;
             console.log(user);
           }

           // next();
    })(req, res);
    const errors = [];
    if(validator.isEmpty(postInput.title)|| !validator.isLength(postInput.title,{min:5})){
      errors.push({message:"Title is Invalid"});
    }
    if(validator.isEmpty(postInput.content)|| !validator.isLength(postInput.content,{min:5})){
      errors.push({message:"Content is Invalid"});
    }
    if(validator.isEmpty(postInput.imageUrl)){
      errors.push({message:"Image URL should not be Empty"});
    }
    if(errors.lenght>0){
      const error = new Error("InValid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const post = new Post({
      title:postInput.title,
      content:postInput.content,
      imageUrl:postInput.imageUrl
    });
    const createdPost = await post.save();
    return {...createdPost._doc,_id:createdPost._id.toString(),createdAt:createdPost.createdAt.toISOString(),updatedAt:createdPost.updatedAt.toISOString()};
  }
}
