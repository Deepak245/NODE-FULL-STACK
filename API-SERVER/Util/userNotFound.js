const validator = require("validator");
const fs = require("fs");
const path = require("path");

 const userFound =(user)=>{

  if(!user){
    const error = new Error("User Not Found");
    error.code = 401;
    throw error;

  }
  return true;
}


const clearimage = (filepath)=>{
  filepath = path.join(__dirname,'..',filepath);
  fs.unlink(filepath,error=>{console.log(error)})
}

exports.userFound = userFound;
exports.clearImage = clearimage;
