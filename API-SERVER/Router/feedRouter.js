const express = require("express");
const {body,validationResult}= require("express-validator");

const router = express.Router();

const feedController = require("../Controller/feedController");
const validations = require("./sequentialValidation");

// const validate = validations => {
//     return async (req, res, next) => {
//       for (let validation of validations) {
//         const result = await validation.run(req);
//         if (result.errors.length) break;
//       }
  
//       const errors = validationResult(req);
//       if (errors.isEmpty()) {
//         return next();
//       }
  
//       res.status(400).json({ errors: errors.array() });
//     };
//   };

router.get("/posts",feedController.getPost);

router.post("/post",
validations.validate([
        body("title").trim().isLength({min:7}),
        body("content").trim().isLength({min:7})
    ])
,feedController.createPost);






module.exports = router;