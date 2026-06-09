const mongoose = require("mongoose");
const User = require("./User");

const userdetail=mongoose.Schema({
    Fullname:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    avatarKey: {
  type: String,
  enum: ["male", "female", "other", "custom"],
  default: "other",
},
    mobile:{
        type:Number,
        required:true,
        length:10
    },

user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},

},{ timestamps: true })

module.exports = mongoose.model("Userdetail", userdetail);