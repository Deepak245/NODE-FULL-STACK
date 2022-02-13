const fs = require("fs");
const path = require("path");
const {validationResult} =require("express-validator");
const Post = require("../Modals/postModalMongo");
const User = require("../Modals/userModal");
const io = require("../socket");

// exports.getPosts=(req,res,next)=>{
//     res.status(200).json({
//         posts:[{
//             title:"first Post",
//             content:"This is First Post",
//             imageUrl:"images/Smiley_Face.jpg",
//             creator:{name:"DEEPAK"},
//             createdAt:new Date(),
//             _id:"1"
//
//         }]
//     })
// }
exports.getPosts=async (req,res,next)=>{
   try{
     posts = await Post.find().populate("creator");
     // console.log(posts);
     // console.log(req.user._id.valueOf())
     // userid = req.user._id.valueOf();
     // console.log(userid);
     // console.log(req.user.name);
     // console.log(JSON.Stringfy(req.user.name));
     // User.findOne({id: jwt_payload.sub}
     // const username = await User.findOne({id:userid});
     // console.log(username.name);
     res
        .status(200)
        .json({ message: 'Fetched posts successfully.', posts: posts });
   }
   catch(error){
     if(!error.statusCode){
       error.statusCode=500;

     }
     next(error);
   }
    // res.status(200).json({
    //     posts:[{
    //         title:"first Post",
    //         content:"This is First Post",
    //         imageUrl:"images/Smiley_Face.jpg",
    //         creator:{name:"DEEPAK"},
    //         createdAt:new Date(),
    //         _id:"1"
    //
    //     }]
    // })
}

exports.createPost=async (req,res,next)=>{
    try{
        // const err = validationResult(req);

        // if(!err.isEmpty()){
        //     console.log("I am in If Block")
        //     const error = new Error("Validation Failed Entered Data is Incorrect");
        //     error.statusCode = 422;
        //     throw new Error(next(error));
        //     // next(error);

        // }

        if(!req.file){
          res.status(422).json({ message:"No File in Request" });
          throw new Error("No File in Request")
        }
        // const titlename = JSON.Stringfy(req.user.name);
        // userid = req.user._id.valueOf();
        userid = req.user._id.toString()
        const user = await User.findOne({id:userid});
        console.log(user.name);
        title = req.body.title;
        content = req.body.content;
        // imageUrl = req.file.path;
        // const user = await User.findOne({id:userid});
        // console.log(user.name);
        const imageUrl = req.file.path.replace("\\" ,"/");
        postresult = await new Post({
            title:title,
            content:content,
            imageUrl:imageUrl,
            creator:user.name,
        })
        .save();
        const creator="";
        // result2 =user.posts.push(result);
        const result2 = await User.findOne({id:userid}).then(
          user=>{
            console.log("Iam from await"+user);
            creator:user;
            user.posts.push(postresult);
            user.save();
          }
        );
        // result2 = await new User({
        //   posts:user.posts.push(result)
        // }).save();
         // result2= await User.save();
         io.getIO().emit('posts',{action:'create',post:{...postresult._doc,creator:{_id:user.id,name:user.name}}});
        res.status(201).json({
            message:"Post Created Successfully",
            // post:{id:new Date().toISOString(),title :title,content:content} before adding to data base
            post: postresult,
            creator:{_id:creator._id,name:creator.name}
        })
    }catch(error){
        // console.log("Iam in Catch block");
        console.log(Error);
        // console.log(error);
        // if(error.statusCode===422){
        //     console.log("Iam in 422 if blok of catch")
        //     next(error);
        // }else if(!error.statusCode){
        //     error.statusCode=500;
        //     next(error);
        // }


    }

}


exports.getPost = async (req,res,next)=>{
  const error = validationResult(req);
  const postId = req.params.postId;

  try{
    post = await Post.findById(postId);
    const error = validationResult(res);
    if(post===null){

        res.status(404).json({ message:"Not able to Fetch Post from DB" });
       throw new Error("No Response")


    }
    // console.log(post);
    res.status(200).json({message:"Post Fetched",post:post});
  }
  catch(error){

    if(error ==="No Response"){
      console.log("In catch if block")
      error.statusCode=404;
      next(error);
    }
    // return res.status(404).json({ message:"Not able to Fetch Post from DB" });

  }

}

exports.updatePost=async (req,res,next)=>{
  const postId = req.params.postId;
    // console.log(postId);
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.imageUrl;
  if(req.file){
    imageUrl = req.file.path.replace("\\" ,"/");
  }


  try{
    if(!imageUrl){
      // res.status(404).json({ message:"No File Picked" });
      throw Error("No File Picked")
    }

    post = await Post.findById(postId).populate("creator");

    const error = validationResult(res);
    if(post===null){

        res.status(404).json({ message:"Not able to Fetch Post from DB" });
       throw new Error("No Response")


    }



    if(imageUrl!==post.imageUrl){
      clearimage(post.imageUrl)  // here we are deleting old post image.
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    // console.log(post);
    io.getIO().emit('posts',{action:'update',post:result})
    res.status(200).json({message:"Post Updated",post:result})
    return result;
  }

    catch(error){
      console.log(error);
      if(error ==="No File Picked"){
        console.log("In catch if block")
        error.statusCode=404;
        next(error);
      }


    }
}


exports.deletePost=async (req,res,next)=>{
  const postId = req.params.postId;
  try{
    post = await Post.findById(postId);
    if(!post){
      res.status(404).json({message:"No post Found"});
    }
    clearimage(post.imageUrl);
    result = await Post.findByIdAndRemove(postId);
    result2 = await User.findOne({id:userid}).then(
      user=>{

        user.posts.pull(postId);
        user.save();
      }
    );
    io.getIO().emit('posts',{action:'delete',post:postId})
    res.status(200).json({message:"Deleted postd"});

  }catch(e){

  }
}

const clearimage = (filepath)=>{
  filepath = path.join(__dirname,'..',filepath);
  fs.unlink(filepath,error=>{console.log(error)})
}
