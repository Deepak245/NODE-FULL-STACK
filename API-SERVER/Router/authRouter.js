const express = require("express");
const router = express.Router();
const {body,validationResult}= require("express-validator");
const validations = require("./sequentialValidation");
const authController = require("../Controller/authController");
const User = require("../Modals/userModal");

const passport = require("passport");
require("../MiddleWare/passport");



router.put('/signup',[
        body("email").trim().isEmail().withMessage("please enter Valid Email")
        .custom((value,{req})=>{
          return User.findOne({email:value}).then(userDoc=>{
            if(userDoc){
              return Promise.reject("E-mail address already Exist")
            }
          })
        }).normalizeEmail(),
        body("password").trim().isLength({min:5}),
        body("name").trim().not().isEmpty()
    ],authController.signUp);

router.post("/login",authController.login);

router.get('/status', passport.authenticate('jwt',{session:false}), authController.getUserStatus);

module.exports = router;

// router.put(
//   '/signup',
//   [
//     body('email')
//       .isEmail()
//       .withMessage('Please enter a valid email.')
//       .custom((value, { req }) => {
//         return User.findOne({ email: value }).then(userDoc => {
//           if (userDoc) {
//             console.log(userDoc)
//             return Promise.reject('E-Mail address already exists!');
//           }
//         });
//       })
//       .normalizeEmail(),
//     body('password')
//       .trim()
//       .isLength({ min: 5 }),
//     body('name')
//       .trim()
//       .not()
//       .isEmpty()
//   ],
//   authController.signup
// );
//
//
//
// module.exports = router;
