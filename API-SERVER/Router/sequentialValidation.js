const express = require('express');
const { body,validationResult, ValidationChain } = require('express-validator');

const validate = validations => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    emmiter = errors.array();
    console.log(emmiter[0].param)
    if(emmiter[0].param === "title"){
      res.status(422).json({ message:"Error is raising from Title as not correct" });
    }
    if(emmiter[0].param === "content"){
      res.status(422).json({ message:"Error is raising from content as not correct" });
    }
    // res.status(400).json({ errors: errors.array() });
    // res.status(statusCode).json({errors:message});
  };
};
  //
  //   return async (req, res, next) => {
  //     try{
  //     for (let validation of validations) {
  //       const result = await validation.run(req);
  //       console.log("Iam from async"+result);
  //       console.log(result.errors[0].value);
  //       if (result.errors.length) break;
  //     }
  //
  //     // const errors = validationResult(req);
  //
  //     // if (errors.isEmpty()) {
  //     //   return next();
  //     // }
  //     const error = validationResult(req);
  //     console.log(error);
  //     if(!error.isEmpty()){
  //       console.log(error)
  //       const error = new Error("Validation Failed Entered Data is in correct");
  //       error. statusCode = 422;
  //       error.message = "Validation Failed Entered Data is in correct"
  //       next(error);
  //     }}catch(exception_var){
  //       console.log("Iam from catch"+exception_var);
  //       // console.log(err);
  //       //  next(err);
  //       return res.status(422).json({ message:"Iam coming valida validation file" });
  //     }
  //
  //     //  res.status(400).json({ errors: errors.array(),message:"Iam coming valida validation file" });
  //
  //   };
  // };




module.exports = {validate};
