const express = require("express");
const {body}= require("express-validator");
const router = express.Router();

const feedController = require("../Controller/feedController");



router.get("/posts",feedController.getPost);

router.post("/post",[
    body("title").trim().isLength({min:5}),
    body("content").trim().isLength({min:5})
],feedController.createPost);


module.exports = router;