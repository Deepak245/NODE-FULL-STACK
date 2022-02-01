const User = require("../Modals/userModal");

const {body,validationResult}= require("express-validator");
const bcrypt = require("bcryptjs");

exports.signUp=async (req,res,next)=>{
  console.log(req.body.name);
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
