const validator = require("validator");

 const userFound =(user)=>{

  if(!user){
    const error = new Error("User Not Found");
    error.code = 401;
    throw error;

  }
  return true;
}


exports.userFound = userFound;
