const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new Schema({
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true
  }

});

module.exports = mongoose.model("User",userSchema);
