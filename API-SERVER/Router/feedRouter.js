const express = require("express");
const {body,validationResult}= require("express-validator");

const router = express.Router();

const feedController = require("../Controller/feedController");
const validations = require("./sequentialValidation");
const passport = require("passport");
require("../MiddleWare/passport");

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

router.get("/posts",passport.authenticate('jwt',{session:false}),feedController.getPosts);


router.put('/post/:postId',validations.validate([
        body("title").trim().isLength({min:5}),
        body("content").trim().isLength({min:5})
    ]),feedController.updatePost);

router.post("/post",passport.authenticate('jwt',{session:false}),
validations.validate([
        body("title").trim().isLength({min:5}),
        body("content").trim().isLength({min:5})
    ])
,feedController.createPost);



router.get('/post/:postId',passport.authenticate('jwt',{session:false}),feedController.getPost);


router.delete('/post/:postId',passport.authenticate('jwt',{session:false}),feedController.deletePost);



module.exports = router;
