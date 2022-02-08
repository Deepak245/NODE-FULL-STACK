const User = require("../Modals/userModal");

const {body,validationResult}= require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp=async (req,res,next)=>{

  try{
    const errors = validationResult(req) ;




  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  dopedpwd = await bcrypt.hash(password,12).catch(err=>{
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  });
  // const user = new User({
  //   email : email,
  //   password:dopedpwd,
  //   name:name,
  //   status:status
  // });
  const user = new User({
    email :email,
    name:name,
    password:dopedpwd
  });
  result = await user.save();
  res.status(201).json({message:"User Created Successfully",userId:result._id});
}
catch(e){

  console.log(e);
  res.status(400).json({message:"User Created unSuccessfully"});
}
}

exports.login =  (req,res,next)=>{
    const errors = validationResult(req) ;
    // console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email})
  .then(user=>{
    if(!user){
      const error = new Error("A person with this user not found");
     error.statusCode = 401;
     throw error;
    }

    // console.log(user)
    bcrypt.compare(password,user.password).then(isEqual=>{
      if(!isEqual){
     const errors = new Error("Wrong Password Entered");
     errors.statusCode = 401;
     throw errors;
          }
    })
    const payload = {
      username:user.name,
      id:user._id
    }
    const token = jwt.sign(payload,"sruthi",{expiresIn:"1d"})
    return res.status(200).send({
      success:true,
      message:"token generated Successfully",
      token:token,
      userId:user._id
    });

  })
.catch(err => {
     if (!err.statusCode) {
       err.statusCode = 500;
     }
     next(err);
   });





}

//
// exports.signup = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()){
//   console.log("i am in auth controller")
//   console.log(errors)
//     const error = new Error('Validation failed.');
//     error.statusCode = 422;
//     error.data = errors.array();
//     throw error;
//   }
//   const email = req.body.email;
//   const name = req.body.name;
//   const password = req.body.password;
//   bcrypt
//     .hash(password, 12)
//     .then(hashedPw => {
//       const user = new User({
//         email: email,
//         password: hashedPw,
//         name: name
//       });
//       return user.save();
//     })
//     .then(result => {
//       res.status(201).json({ message: 'User created!', userId: result._id });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };








//
// console.log("This is User Password"+user);
// isEqual =  bcrypt.compare(password,user.password).catch(isequal=>{
//   if(!isequal){
//     const error = new Error("Wrong Password Entered");
//     error.statusCode = 401;
//     throw error;
//   }
//   const payload = {
//     username : user.name,
//     id:user._id
//   }
//   const token = jwt.sign(payload,"sruthi",{expiresIn:"1d"});
//   return res.status(200).json({
//     success:true,
//     message:"Token Generated",
//     token:"Bearer "+token
//   });
// })
