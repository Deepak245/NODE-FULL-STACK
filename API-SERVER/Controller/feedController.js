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
        const error = validationResult(req);
        if(!error.isEmpty){
            return res.status(422).json({
                message:"Validation Error got Failed Entered Data is in Correct",
                error:error.array()
            })
        }
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
    }catch(e){

    }
    
}