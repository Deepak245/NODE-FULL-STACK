const {validationResult} =require("express-validator");
const Post = require("../Modals/postModalMongo");

exports.getPost=(req,res,next)=>{
    res.status(200).json({
        posts:[{
            title:"first Post",
            content:"This is First Post",
            imageUrl:"images/Smiley_Face.jpg",
            creator:{name:"DEEPAK"},
            createdAt:new Date(),
            _id:"1"
        
        }]
    })
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
        
       
        title = req.body.title;
        content = req.body.content;
    
        result = await new Post({
            title:title,
            content:content,
            imageUrl:"images/Smiley_Face.jpg",
            creator:{
                name:"DEEPAK"
            }
        })
        .save();
        
        res.status(201).json({
            message:"Post Created Successfully",
            // post:{id:new Date().toISOString(),title :title,content:content} before adding to data base
            post: result
        })
    }catch(error){
        // console.log("Iam in Catch block");
        // // console.log(Error);
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