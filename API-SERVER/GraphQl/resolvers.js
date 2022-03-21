const User = require("../Modals/userModal");
const Post = require("../Modals/postModalMongo");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../MiddleWare/passport");

const {userFound} = require("../Util/userNotFound.js")
const {clearImage} = require("../Util/userNotFound");


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
  createPost:async ({postInput},req)=>{

    console.log("In Created Post")
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
    const user = await User.findById(req.userId);
    // console.log("Founded user"+user.name)
    if(!user){
      const error = new Error("InValid User");
      error.code = 401;
      throw error;
    }
    const post = new Post({
      title:postInput.title,
      content:postInput.content,
      imageUrl:postInput.imageUrl,
      creator:user
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    // console.log(...createdPost._doc)
    return {...createdPost._doc,_id:createdPost._id.toString(),createdAt:createdPost.createdAt.toISOString(),updatedAt:createdPost.updatedAt.toISOString()};
  },
  posts:async ({page},req)=>{
    // console.log("inGet post")
    // console.log("From Post Request"+req.user);
    // console.log("From Post Request"+req.isAuth);
    if(!req.isAuth){
      const error = new Error("Not Authenticated");
      error.code = 401;
      throw error;
    }
    if(!page){
      page=1;
    }
    const perpage = 2;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
            .sort({createdAt:-1})
            .skip((page-1)*perpage)
            .limit(perpage)
            .populate("creator");

    // console.log("These are posts");

    // console.log(totalPosts);
    return {posts:posts.map(p=>{

      return {...p._doc,_id:p._id.toString(),createdAt:p.createdAt.toISOString(),updatedAt:p.updatedAt.toISOString()}
    }),totalPosts:totalPosts};


  },
  post:async ({id},req)=>{
    if(!req.isAuth){
      const error = new Error("Not Authenticated");
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id).populate("creator");
    if(!post){
      const error = new Error("Post Not Found");
      error.code = 404;
      throw error;
    }
    return {...post._doc,_id:post.id.toString(),createdAt:post.createdAt.toISOString(),updatedAt:post.updatedAt.toISOString()}
  },
  updatePost:async ({id,postInput},req)=>{
    if(!req.isAuth){
      const error = new Error("Not Authenticated");
      error.code = 401;
      throw error;
    }
    // console.log("In update Post")
    const post = await Post.findById(id).populate("creator");
    if(!post){
        const error = new Error("Post Not Found");
        error.code = 404;
        throw error;
    }
    if(post.creator._id.toString()!==req.userId){
      const error = new Error("Un Authorized Edit");
      error.code = 403;
      throw error;
    }
    post.title = postInput.title;
    post.content = postInput.content;
    console.log(postInput.imageUrl);
    if(postInput.imageUrl !== "undefined"){
      post.imageUrl = postInput.imageUrl;
    }
    const updatedPost = await post.save();
    return {...updatedPost._doc,_id:updatedPost._id.toString(),createdAt:updatedPost.createdAt.toISOString(),updatedAt:updatedPost.updatedAt.toISOString()}

  },
  deletePost:async ({id},req)=>{
    if(!req.isAuth){
      const error = new Error("Not Authenticated");
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id);
    const user = await User.findById(req.userId);
    if(!post){
        const error = new Error("Post Not Found");
        error.code = 404;
        throw error;
    }
    console.log(post.imageUrl);
      clearImage(post.imageUrl);
      await Post.findByIdAndRemove(id);
      user.posts.pull(id);
      await user.save();
      return true;
  },
  user:async (args,req)=>{
    if(!req.isAuth){
      const error = new Error("Not Authenticated");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if(!user){
      const error = new Error("User Not Found");
      error.code = 401;
      throw error;
    }
    return {...user._doc,_id:user._id.toString()}
  },
  updateStatus:async({status},req)=>{
    console.log(status)
    if(!req.isAuth){
      const error = new Error("Not Authenticated");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if(!user){
      const error = new Error("User Not Found");
      error.code = 401;
      throw error;
    }

    user.status = status;
    await user.save();
    return {...user._doc,_id:user._id.toString()};

  }

}
